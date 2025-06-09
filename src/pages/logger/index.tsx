import { useForm } from 'antd/es/form/Form'
import { Job, JobLog } from '@/types'
import React, { useCallback, useEffect, useState } from 'react'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import api from '@/api'
import { toast } from '@/utils/toast.ts'
import { useAntdTable } from 'ahooks'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { SearchBar, SearchField } from '@/components/common/SearchBar.tsx'
import { TrashIcon } from '@radix-ui/react-icons'
import { Form, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Button } from '@/components/ui/button.tsx'
import dayjs from 'dayjs'

/**
 * 日志管理
 */
export default function LoggerComponent() {
  const [form] = useForm<JobLog.Item>()
  const jobGroup = Form.useWatch('jobGroup', form) as number
  const [ids, setIds] = useState<number[]>([])
  const { confirm, dialog } = useConfirmDialog()
  const [jobGroupOptions, setJobGroupOptions] = useState<{ label: string; value: number }[]>([])
  const [jobInfoOptions, setJobInfoOptions] = useState<{ label: string; value: number }[]>([])

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
      options: [{ label: '全部', value: 0 }, ...jobInfoOptions],
    },
    {
      type: 'select',
      key: 'logStatus',
      label: '任务状态',
      options: [
        { label: '全部', value: -1 },
        { label: '运行中', value: 3 },
        { label: '执行成功', value: 1 },
        { label: '执行失败', value: 2 },
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

  function renderTriggerMsg(msg: string) {
    return (
      <Tooltip
        title={
          <div
            className="max-w-[400px] whitespace-pre-line break-all text-[13px] leading-[1.6] p-2.5"
            dangerouslySetInnerHTML={{ __html: msg || '-' }}
          />
        }
        placement="topLeft"
        styles={{ root: { maxWidth: 400 } }}
      >
        <span
          className="truncate block max-w-[220px] text-gray-700 dark:text-gray-300"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          dangerouslySetInnerHTML={{ __html: (msg || '-').replace(/<br\s*\/?>/gi, ' ') }}
        />
      </Tooltip>
    )
  }

  function renderHandleMsg(msg: string) {
    return msg ? (
      <Tooltip
        title={
          <div
            className="max-w-[400px] whitespace-pre-line break-all text-[13px] leading-[1.6] p-2.5"
            dangerouslySetInnerHTML={{ __html: msg || '-' }}
          />
        }
        placement="topLeft"
        styles={{ root: { maxWidth: 400 } }}
      >
        <span
          className="truncate block max-w-[220px] text-gray-700 dark:text-gray-300"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
          dangerouslySetInnerHTML={{ __html: (msg || '-').replace(/<br\s*\/?>/gi, ' ') }}
        />
      </Tooltip>
    ) : (
      <span className="text-gray-400">-</span>
    )
  }

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
      render: (val: string) => (val ? dayjs(val).format('YYYY/MM/DD HH:mm:ss') : '-'),
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
      width: 240,
      render: (msg: string) => renderTriggerMsg(msg),
    },
    {
      title: '执行时间',
      dataIndex: 'handleTime',
      width: 170,
      align: 'center',
      render: (val: string) => (val ? dayjs(val).format('YYYY/MM/DD HH:mm:ss') : '-'),
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
      width: 200,
      render: (msg: string) => renderHandleMsg(msg),
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

  const getJobGroupOptions = async () => {
    try {
      const { content } = await api.user.getUserGroupPermissions()
      log.info('用户组执行器权限:', content)

      // 使用 map 返回新的数组
      const options = (content || []).map(({ id, title }) => ({
        label: `${title}`,
        value: id,
      }))

      const sortedOptions = [...options].sort((a, b) => a.value - b.value)
      setJobGroupOptions(sortedOptions)
    } catch (error) {
      if (isDebugEnable) log.error('获取用户组权限失败:', error)
    }
  }

  const getJobInfoOptions = async () => {
    try {
      const { content } = await api.logger.getJobsByGroup(jobGroup)
      log.info('用户组执行器权限:', content)
      // 使用 map 返回新的数组
      const options = (content || []).map(({ id, jobDesc }: Job.JobItem) => ({
        label: `${jobDesc}`,
        value: id,
      }))
      const sortedOptions = [...options].sort((a, b) => a.value - b.value)
      setJobInfoOptions(sortedOptions)
    } catch (error) {
      if (isDebugEnable) log.error('获取用户组权限失败:', error)
    }
  }

  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: JobLog.PageListParams
  ) => {
    try {
      let filterTime = formData.filterTime || getDefaultFilterTimeRange()
      if (Array.isArray(filterTime) && filterTime.length === 2 && filterTime[0] && filterTime[1]) {
        filterTime = filterTime[0].format('YYYY-MM-DD HH:mm:ss') + ' - ' + filterTime[1].format('YYYY-MM-DD HH:mm:ss')
      } else {
        filterTime = getDefaultFilterTime()
      }
      const params: JobLog.PageListParams = {
        jobGroup: formData.jobGroup || 0,
        jobId: formData.jobId || 0,
        logStatus: formData.logStatus || -1,
        filterTime,
        start: (current - 1) * pageSize,
        length: pageSize,
      }
      const res = await api.logger.getLogList(params)
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
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

  // 获取默认时间范围
  function getDefaultFilterTime() {
    const now = dayjs()
    const startOfDay = now.startOf('day')
    return startOfDay.format('YYYY-MM-DD HH:mm:ss') + ' - ' + now.format('YYYY-MM-DD HH:mm:ss')
  }

  function getDefaultFilterTimeRange() {
    const now = dayjs()
    const startOfDay = now.startOf('day')
    return [startOfDay, now]
  }

  function handleReset() {
    if (isDebugEnable) log.debug('handle-reset')
    form.resetFields()
    search.reset()
  }

  function clearLogger(): void {
    if (isDebugEnable) log.debug('clear-logger')
    // todo
  }

  useEffect(() => {
    getJobGroupOptions()
  }, [])

  // 每次所属执行器变更，都将任务名称重置为“全部”
  useEffect(() => {
    form.setFieldValue('jobId', 0)
    if (jobGroup) {
      getJobInfoOptions()
    } else {
      setJobInfoOptions([])
    }
  }, [jobGroup])

  return (
    <div className={'content-area'}>
      <SearchBar
        form={form}
        fields={searchFields}
        initialValues={{
          start: 0,
          length: 10,
          jobGroup: '',
          jobId: '',
          logStatus: -1,
          filterTime: getDefaultFilterTimeRange(),
        }}
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
