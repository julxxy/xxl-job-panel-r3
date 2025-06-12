import { useForm } from 'antd/es/form/Form'
import { Job, JobLog } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import api from '@/api'
import { useAntdTable } from 'ahooks'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { SearchBar, SearchField } from '@/components/common/SearchBar.tsx'
import { Card, Form, Input, Radio, Space, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Button } from '@/components/ui/button.tsx'
import dayjs from 'dayjs'
import { ClearOutlined } from '@ant-design/icons'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { toast } from '@/utils/toast.ts'
import { ModalAction } from '@/types/modal.ts'
import ViewLogModal from '@/pages/logger/ViewLogModal.tsx'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import { Ban, ViewIcon } from 'lucide-react'

/**
 * 日志管理
 */
export default function LoggerComponent() {
  const [searchForm] = useForm<JobLog.Item>()
  const [clearForm] = useForm<any>()
  const jobGroup = Form.useWatch('jobGroup', searchForm) as number
  const jobId = Form.useWatch('jobId', searchForm) as number
  const [ids, setIds] = useState<number[]>([])
  const [visible, setVisible] = useState(false)
  const defaultOption = [{ value: 0, label: '全部' }]
  const [jobGroupOptions, setJobGroupOptions] = useState<{ label: string; value: number }[]>(defaultOption)
  const [jobInfoOptions, setJobInfoOptions] = useState<{ label: string; value: number }[]>(defaultOption)
  const [jobIdLabel, setJobIdLabel] = useState('')
  const [jobGroupLabel, setJobGroupLabel] = useState('')
  const { confirm, dialog } = useConfirmDialog()

  const modalRef = useRef<ModalAction>({
    openModal: (action, data) => {
      if (isDebugEnable) log.info('打开弹窗:', action, data)
    },
  })

  const CLEAR_OPTIONS = [
    { label: '清理 1 个月之前日志数据', value: '1' },
    { label: '清理 3 个月之前日志数据', value: '2' },
    { label: '清理 6 个月之前日志数据', value: '3' },
    { label: '清理 1 年之前日志数据', value: '4' },
    { label: '清理 1 千条以前日志数据', value: '5' },
    { label: '清理 1 万条以前日志数据', value: '6' },
    { label: '清理 3 万条以前日志数据', value: '7' },
    { label: '清理 10 万条以前日志数据', value: '8' },
    { label: '清理所有日志数据', value: '9' },
  ]

  const searchFields: SearchField[] = [
    {
      type: 'select',
      key: 'jobGroup',
      label: '所属执行器',
      placeholder: '请选择执行器',
      options: jobGroupOptions,
    },
    {
      type: 'select',
      key: 'jobId',
      label: '任务名称',
      options: jobInfoOptions,
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

  const columns: ColumnsType<JobLog.Item> = [
    {
      title: '任务ID',
      dataIndex: 'jobId',
      width: 100,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '调度时间',
      dataIndex: 'triggerTime',
      width: 175,
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
      width: 220,
      render: (msg: string) => renderTriggerMsg(msg),
    },
    {
      title: '执行时间',
      dataIndex: 'handleTime',
      width: 175,
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
      render: (record: JobLog.Item) => <ActionButtons record={record} />,
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

  const getJobGroupOptions = async () => {
    try {
      const { content } = await api.user.getUserGroupPermissions()
      log.info('用户组执行器权限:', content)

      // 过滤掉接口返回的 value 为 0 的项
      const options = (content || [])
        .map(({ id, title }) => ({
          value: id,
          label: title,
        }))
        .filter(opt => opt.value !== 0)

      // 手动将“全部”放在最前面
      const mergedOptions = [{ value: 0, label: '全部' }, ...options]

      setJobGroupOptions(mergedOptions)
    } catch (error) {
      if (isDebugEnable) log.error('获取用户组权限失败:', error)
    }
  }

  const getJobInfoOptions = async (jobGroup: number) => {
    try {
      const { content } = await api.logger.getJobsByGroup(jobGroup)
      log.info('用户组执行器权限:', content)

      const options = (content || [])
        .map(({ id, jobDesc }: Job.JobItem) => ({
          value: id,
          label: jobDesc,
        }))
        .filter(opt => opt.value !== 0)

      const mergedOptions = [{ value: 0, label: '全部' }, ...options]

      setJobInfoOptions(mergedOptions)
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
      const res = await api.logger.getLogList({
        jobGroup: formData.jobGroup || 0,
        jobId: formData.jobId || 0,
        logStatus: formData.logStatus || -1,
        filterTime,
        start: (current - 1) * pageSize,
        length: pageSize,
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
    form: searchForm,
    defaultPageSize: 10,
  })
  tableProps.pagination = {
    ...tableProps.pagination,
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: (total: any) => `共 ${total} 条`,
  }

  const ActionButtons = ({ record }: { record: JobLog.Item }) => {
    const handleViewLog = () => {
      modalRef.current.openModal('view', {
        logId: record.id,
        fromLineNum: 1,
        _jobGroupLabel: jobGroupLabel,
        _jobIdLabel: jobIdLabel,
      })
    }

    const handleTerminate = () => {
      handleTerminateJob(record.id)
    }

    return (
      <Space>
        <Tooltip title="查看日志">
          <Button variant="ghost" size="icon" onClick={handleViewLog}>
            <ViewIcon className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip title="终止任务">
          {/* 使用一个 div 包裹 disabled 的按钮，确保 Tooltip 总是能正常触发 */}
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTerminate}
              disabled={record?.handleCode !== 0}
              className="text-red-500 hover:text-red-600"
            >
              <Ban className="h-4 w-4" />
            </Button>
          </div>
        </Tooltip>
      </Space>
    )
  }

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
    if (isDebugEnable) log.debug('handleReset')
    search.reset()
  }

  async function handleClearLogger() {
    if (isDebugEnable) log.debug('清理日志')
    const { jobGroup, jobId, type } = clearForm.getFieldsValue()
    const { code } = await api.logger.clearLog({ jobGroup, jobId, type })
    if (code === 200) toast.success('清理成功', true)
    else toast.error('清理失败', true)
    setVisible(false)
    search.reset()
  }

  async function handleTerminateJob(id: number) {
    if (isDebugEnable) log.debug('TerminateJob: ' + id)
    if (!id) {
      return
    }
    confirmDelete(id, `将要终断任务 ${id} 的执行，中断后任务将失败，确认继续？`)
  }

  const confirmDelete = useCallback(
    (jobId: number, message: string) => {
      confirm({
        title: '确认终止任务？',
        description: message,
        onConfirm: async () => {
          try {
            const { code, msg } = await api.logger.killLogPage(jobId)
            if (code === 200) {
              toast.success(`终止任务 [${jobId}] 成功`, true)
            } else {
              // 使用模板字符串正确拼接
              toast.error(`终止任务 [${jobId}] 失败: ${msg}`, true)
            }
            search.reset()
          } catch (error) {
            toast.error(`终止任务 [${jobId}] 时发生未知错误`, true)
          }
        },
      })
    },
    [confirm, search]
  )

  useEffect(() => {
    getJobGroupOptions()
  }, [])

  useEffect(() => {
    if (jobGroup) {
      getJobInfoOptions(jobGroup)
    } else {
      setJobInfoOptions(defaultOption)
    }
  }, [jobGroup])

  useEffect(() => {
    if (visible && jobGroupOptions.length && jobInfoOptions.length) {
      const jobGroup = searchForm.getFieldValue('jobGroup') ?? 0
      const jobId = searchForm.getFieldValue('jobId') ?? 0
      const jobGroupLabel = jobGroupOptions.find(opt => opt.value === jobGroup)?.label || '全部'
      const jobIdLabel = jobInfoOptions.find(opt => opt.value === jobId)?.label || '全部'
      setJobIdLabel(jobIdLabel)
      setJobGroupLabel(jobGroupLabel)
      clearForm.setFieldsValue({
        jobGroup,
        jobId,
        type: '1', // 默认选中第一个
        jobGroupLabel,
        jobIdLabel,
      })
    }
  }, [visible, jobGroupOptions, jobInfoOptions, searchForm, clearForm])

  useEffect(() => {
    if (jobGroupOptions.length && jobInfoOptions.length) {
      const jobGroup = searchForm.getFieldValue('jobGroup') ?? 0
      const jobId = searchForm.getFieldValue('jobId') ?? 0
      const jobGroupLabel = jobGroupOptions.find(opt => opt.value === jobGroup)?.label || '全部'
      const jobIdLabel = jobInfoOptions.find(opt => opt.value === jobId)?.label || '全部'
      setJobIdLabel(jobIdLabel)
      setJobGroupLabel(jobGroupLabel)
    }
  }, [jobGroupOptions, jobInfoOptions, searchForm])

  useEffect(() => {
    if (jobId) {
      const jobId = searchForm.getFieldValue('jobId') ?? 0
      const jobIdLabel = jobInfoOptions.find(opt => opt.value === jobId)?.label || '全部'
      setJobIdLabel(jobIdLabel)
    }
  }, [jobId])

  return (
    <div className={'content-area'}>
      <SearchBar
        form={searchForm}
        fields={searchFields}
        initialValues={{
          start: 0,
          length: 10,
          jobGroup: 0,
          jobId: 0,
          logStatus: -1,
          filterTime: getDefaultFilterTimeRange(),
        }}
        onSearch={search.submit}
        onReset={handleReset}
        buttons={[
          {
            key: 'clearLogger',
            label: '日志清理',
            icon: <ClearOutlined />,
            onClick: () => setVisible(true),
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

      {/* 日志清理 */}
      <ShadcnAntdModal<JobLog.ClearLogParams>
        action="edit"
        title="日志清理"
        open={visible}
        onOk={handleClearLogger}
        onCancel={() => setVisible(false)}
        destroyOnHidden={true}
      >
        {() => (
          <Card>
            <Form form={clearForm} layout="horizontal" initialValues={{ type: 1 }}>
              <Form.Item name="jobGroupLabel" label="执行器名称">
                <Input disabled />
              </Form.Item>
              <Form.Item name="jobIdLabel" label="任务名称">
                <Input disabled />
              </Form.Item>
              <Form.Item name="jobGroup" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
              <Form.Item name="jobId" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
              <Form.Item name="type" label="清理方式" rules={[{ required: true, message: '请选择清理方式' }]}>
                <Radio.Group className="grid grid-cols-2 gap-x-4">
                  {CLEAR_OPTIONS.map(opt => (
                    <Radio key={opt.value} value={opt.value} className="mb-2">
                      {opt.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>
        )}
      </ShadcnAntdModal>

      {/*查看日志*/}
      <ViewLogModal parentRef={modalRef} onRefresh={() => search.submit()} />

      {dialog}
    </div>
  )
}
