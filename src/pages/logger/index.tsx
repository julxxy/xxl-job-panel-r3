import { useForm } from 'antd/es/form/Form'
import { JobLog } from '@/types'
import React, { useCallback, useState } from 'react'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import api from '@/api'
import { toast } from '@/utils/toast.ts'
import { useAntdTable } from 'ahooks'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { SearchBar, SearchField } from '@/components/common/SearchBar.tsx'
import { TrashIcon } from '@radix-ui/react-icons'
import { Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Button } from '@/components/ui/button.tsx'
import dayjs from 'dayjs'

/**
 * 日志管理
 */
export default function LoggerComponent() {
  const [form] = useForm<JobLog.Item>()
  const [ids, setIds] = useState<number[]>([])
  // @ts-expect-error
  const [loading, setLoading] = useState(false)
  const { confirm, dialog } = useConfirmDialog()
  // @ts-expect-error
  const [jobGroupOptions, setJobGroupOptions] = useState<{ label: string; value: number }[]>([])

  const searchInitialValues: JobLog.PageListParams = {
    start: 0,
    length: 10,
    jobGroup: '',
    jobId: '',
    logStatus: '',
    filterTime: '',
  }
  const searchFields: SearchField[] = [
    {
      type: 'select',
      key: 'jobGroup',
      label: '所属执行器',
      placeholder: '请选择执行器',
      options: [{ label: '全部', value: '' }, ...jobGroupOptions],
    },
    {
      type: 'select',
      key: 'jobId',
      label: '任务名称',
      options: [
        { label: '全部', value: '' },
        // todo
      ],
    },
    {
      type: 'select',
      key: 'logStatus',
      label: '任务状态',
      options: [
        { label: '全部', value: -1 },
        { label: '运行中', value: 1 },
        { label: '已停止', value: 0 },
      ],
    },
    {
      type: 'rangePicker',
      key: 'filterTime',
      label: '调度时间',
      placeholder: ['开始日期', '结束日期'],
      showTime: true,
      showPresets: true,
      timeFormat: 'YYYY/MM/DD HH:mm:ss',
    },
  ]

  const columns: ColumnsType<JobLog.Item> = [
    {
      title: '任务ID',
      dataIndex: 'jobId',
      width: 80,
      align: 'center',
    },
    {
      title: '调度时间',
      dataIndex: 'triggerTime',
      width: 170,
      align: 'center',
      render: (val: string) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '调度结果',
      dataIndex: 'triggerCode',
      width: 100,
      align: 'center',
      render: (code: number) =>
        code === 200 ? <span className="text-green-600">成功</span> : <span className="text-red-600">失败</span>,
    },
    {
      title: '调度备注',
      dataIndex: 'triggerMsg',
      width: 220,
      render: (msg: string) => (
        <Tooltip title={<span dangerouslySetInnerHTML={{ __html: msg }} />} placement="topLeft">
          <span
            className="truncate block max-w-[200px]"
            dangerouslySetInnerHTML={{ __html: msg.replace(/<br>/g, ' ') }}
          />
        </Tooltip>
      ),
    },
    {
      title: '执行时间',
      dataIndex: 'handleTime',
      width: 170,
      align: 'center',
      render: (val: string) => (val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '执行结果',
      dataIndex: 'handleCode',
      width: 100,
      align: 'center',
      render: (code: number) =>
        code === 200 ? (
          <span className="text-green-600">成功</span>
        ) : code === 0 ? (
          <span className="text-gray-400">-</span>
        ) : (
          <span className="text-red-600">失败</span>
        ),
    },
    {
      title: '执行备注',
      dataIndex: 'handleMsg',
      width: 220,
      render: (msg: string) =>
        msg ? (
          <Tooltip title={msg} placement="topLeft">
            <span className="truncate block max-w-[200px]">{msg}</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (record: JobLog.Item) => (
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            if (isDebugEnable) log.debug('查看日志:', record)
            // todo
          }}
        >
          查看日志
        </Button>
      ),
    },
  ]

  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: JobLog.PageListParams
  ) => {
    try {
      const filterTime = formData.filterTime
      if (Array.isArray(filterTime) && filterTime.length === 2 && filterTime[0] && filterTime[1]) {
        formData.filterTime =
          filterTime[0].format('YYYY-MM-DD HH:mm:ss') + ' - ' + filterTime[1].format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await api.logger.getLogList({
        ...formData,
        length: pageSize,
        start: (current - 1) * pageSize,
      })
      return {
        total: res?.recordsTotal ?? 0,
        list: res?.data ?? [],
      }
    } catch (error) {
      log.error('加载任务列表失败:', error)
      return {
        total: 0,
        list: [],
      }
    }
  }

  const { tableProps, search } = useAntdTable(fetchData, {
    form,
    defaultPageSize: 10,
  })
  tableProps.pagination = {
    ...tableProps.pagination,
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: (total: any) => `共 ${total} 条`,
  }

  // @ts-ignore
  const confirmDelete = useCallback(
    (ids: number[], message: string) => {
      confirm({
        title: '确认删除操作？',
        description: message,
        onConfirm: async () => {
          await api.logger.clearLog({} as JobLog.ClearLogParams)
          toast.success(`${ids.length > 1 ? '批量删除成功' : '删除成功'}`)
          search.reset()
        },
      })
    },
    [confirm, search]
  )

  function handleReset() {
    if (isDebugEnable) log.debug('handle-reset')
    form.resetFields()
    search.reset()
  }

  function clearLogger(): void {
    if (isDebugEnable) log.debug('clear-logger')
    // todo
  }

  return (
    <div className={'content-area'}>
      <SearchBar
        form={form}
        fields={searchFields}
        initialValues={searchInitialValues}
        onSearch={search.submit}
        onReset={handleReset}
        buttons={[
          {
            key: 'clearLogger',
            label: '清理日志',
            icon: <TrashIcon />,
            onClick: clearLogger,
          },
        ]}
      />

      <div className="mt-4">
        <Table<JobLog.Item>
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          rowKey={record => record.id}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: ids,
            onChange: (selectedRowKeys: React.Key[]) => {
              setIds(selectedRowKeys as number[])
              if (isDebugEnable) log.debug('ids: ', selectedRowKeys)
            },
          }}
          {...tableProps}
        />
      </div>

      {dialog}
    </div>
  )
}
