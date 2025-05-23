import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { useAntdTable } from 'ahooks'
import { SearchBar, SearchField } from '@/components/common/SearchBar.tsx'
import api from '@/api'
import { IAction, ModalAction } from '@/types/modal.ts'
import { Job } from '@/types'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { ColumnsType } from 'antd/es/table'
import { Space, Table } from 'antd'
import { toast } from '@/utils/toast.ts'
import { Badge } from '@/components/ui/badge.tsx'
import {
  ClipboardCopyIcon,
  ClockIcon,
  EyeOpenIcon,
  GearIcon,
  PlusIcon,
  RocketIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { DeleteIcon, EditIcon, MoreHorizontal, PauseIcon, PlayIcon, ViewIcon } from 'lucide-react'
import { IconTooltipButton } from '@/components/IconTooltipButton.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import TaskModal, { handleToastMsg } from '@/pages/task/TaskModal.tsx'

/**
 * 任务管理
 */
export default function TaskManageComponent() {
  const [form] = useForm<Job.PageListParams>()
  const [ids, setIds] = useState<number[]>([])
  const [action, setAction] = useState<IAction>('create')
  const { confirm, dialog } = useConfirmDialog()
  const [jobGroupOptions, setJobGroupOptions] = useState<{ label: string; value: number }[]>([
    {
      label: '全部',
      value: -1,
    },
  ])

  // 搜索康框默认值
  const initialValues = {
    jobGroup: -1,
    triggerStatus: -1,
    jobDesc: '',
    executorHandler: '',
    author: '',
  }

  const fetchJobGroupOptions = async () => {
    try {
      const { content } = await api.user.getUserGroupPermissions()
      log.info('用户组执行器权限:', content)

      // 使用 map 返回新的数组
      const options = (content || []).map(({ id, title }) => ({
        label: `${title}`,
        value: id,
      }))

      // 更新状态
      setJobGroupOptions(options)
    } catch (error) {
      if (isDebugEnable) log.error('获取用户组权限失败:', error)
    }
  }

  const modalRef = useRef<ModalAction>({
    openModal: (action, data) => {
      if (isDebugEnable) log.info(`打开弹窗: ${action}, ${data}`)
      setAction(action)
    },
  })

  const searchFields: SearchField[] = [
    {
      type: 'select',
      key: 'jobGroup',
      label: '执行器分组',
      placeholder: '请选择执行器',
      options: [{ label: '全部', value: -1 }, ...jobGroupOptions],
    },
    {
      type: 'select',
      key: 'triggerStatus',
      label: '任务状态',
      options: [
        { label: '全部', value: -1 },
        { label: '运行中', value: 1 },
        { label: '已停止', value: 0 },
      ],
    },
    {
      type: 'input',
      key: 'jobDesc',
      label: '任务描述',
      placeholder: '请输入任务描述',
    },
    {
      type: 'input',
      key: 'executorHandler',
      label: 'JobHandler 名称',
      placeholder: '请输入 JobHandler',
    },
    {
      type: 'input',
      key: 'author',
      label: '负责人',
      placeholder: '请输入负责人',
    },
  ]

  const columns: ColumnsType<Job.JobItem> = [
    { title: '任务ID', dataIndex: 'id', fixed: 'left' },
    { title: '任务描述', dataIndex: 'jobDesc' },
    {
      title: '调度类型',
      render: (record: Job.JobItem) => {
        switch (record.scheduleType) {
          case 'NONE':
            return '无'
          case 'CRON':
            return `CRON: ${record.scheduleConf}`
          case 'FIX_RATE':
            return record.scheduleConf
          default:
            return '未知'
        }
      },
    },
    {
      title: '运行模式',
      dataIndex: 'glueType',
      render: (glueType: string) => {
        switch (glueType) {
          case 'BEAN':
            return 'BEAN'
          default:
            return '未知'
        }
      },
    },
    { title: '负责人', dataIndex: 'author' },
    {
      title: '状态',
      render: (record: Job.JobItem) => {
        const statusMap: Record<number, { className: string; text: string }> = {
          1: { className: 'bg-green-200 text-green-700', text: '运行中' }, // RUNNING
          0: { className: 'bg-red-200 text-red-700', text: '已停止' }, // STOP
        }
        const { className, text } = statusMap[record.triggerStatus] || {
          className: 'bg-gray-200 text-gray-700',
          text: '未知',
        }
        return <Badge className={className}>{text}</Badge>
      },
    },
    {
      title: '操作',
      render: (record: Job.JobItem) => (
        <Space>
          {/* 启动 / 停止 */}
          <IconTooltipButton
            tooltip={record.triggerStatus === 1 ? '停止任务' : '启动任务'}
            icon={record.triggerStatus === 1 ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            onClick={() => (record.triggerStatus === 1 ? onStop(record.id) : onStart(record.id))}
          />
          {/* 执行一次 */}
          <IconTooltipButton
            tooltip="执行一次"
            icon={<RocketIcon />}
            onClick={() =>
              handleRunOnce({
                id: record.id,
                executorParam: record.executorParam,
                addressList: '',
              })
            }
          />
          {/* 编辑 */}
          <IconTooltipButton tooltip="编辑任务" icon={<EditIcon size={16} />} onClick={() => handleEdit(record)} />
          {/* 查看 */}
          <IconTooltipButton
            tooltip="查看"
            icon={<ViewIcon size={16} />}
            onClick={() => modalRef?.current.openModal('view', record)}
          />
          {/* 更多操作 */}
          <MoreActionsMenu record={record} />
        </Space>
      ),
    },
  ]

  function handleNextTriggerTime(record: Job.JobItem) {
    if (isDebugEnable) log.info('下次执行时间:', record)
    // todo
    return undefined
  }

  async function onStop(id: number) {
    if (isDebugEnable) log.info('停止任务:', id)
    const { code, msg } = await api.job.stopJob(id)
    handleToastMsg(code, msg)
    search.reset()
  }

  async function onStart(id: number) {
    if (isDebugEnable) log.info('执行任务:', id)
    const { code, msg } = await api.job.startJob(id)
    handleToastMsg(code, msg)
    search.reset()
  }

  async function handleRunOnce({
    id,
    executorParam,
    addressList,
  }: {
    id: number | string
    executorParam: string
    addressList: string
  }) {
    if (isDebugEnable) log.info('执行一次: ', id, executorParam, addressList)
    const { code, msg } = await api.job.triggerJob({ id, executorParam, addressList })
    // todo 弹窗字段补全
    handleToastMsg(code, msg)
    search.reset()
  }

  function handleViewLog(id: number) {
    if (isDebugEnable) log.info('查看日志: ', id)
    // todo
  }

  function handleRegisterNode(id: number) {
    if (isDebugEnable) log.info('注册节点: ', id)
    // todo
  }

  function handleClone(record: Job.JobItem) {
    if (isDebugEnable) log.info('复制数据:', record)
    const cloned = { ...record, id: undefined, jobDesc: `${record.jobDesc} - 副本` }
    modalRef?.current.openModal('create', cloned)
  }

  /**
   * 更多操作
   */
  function MoreActionsMenu({ record }: { record: Job.JobItem }) {
    const [open, setOpen] = useState(false)
    const [nextTriggerTime, setNextTriggerTime] = useState<string | undefined>('N/A')

    const handleToggleMenu = (newOpen: boolean) => {
      setOpen(newOpen)
      if (newOpen) {
        // 只有在打开菜单时才调用
        const result = handleNextTriggerTime(record)
        setNextTriggerTime(result ?? 'N/A')
      }
    }

    return (
      <DropdownMenu open={open} onOpenChange={handleToggleMenu}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem onClick={() => handleViewLog(record.id)}>
            <EyeOpenIcon className="mr-2 h-4 w-4" />
            查询日志
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRegisterNode(record.id)}>
            <GearIcon className="mr-2 h-4 w-4" />
            注册节点
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            下次执行时间：{nextTriggerTime}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleClone(record)}>
            <ClipboardCopyIcon className="mr-2 h-4 w-4" />
            复制为新任务
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDelete(record.id)}>
            <DeleteIcon className="mr-2 h-4 w-4" />
            删除任务
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: Job.PageListParams
  ) => {
    try {
      const res = await api.job.getJobInfoList({
        jobGroup: formData.jobGroup,
        triggerStatus: formData.triggerStatus,
        start: current - 1,
        length: pageSize,
        jobDesc: formData.jobDesc || '',
        executorHandler: formData.executorHandler || '',
        author: formData.author || '',
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

  const handleReset = () => {
    if (isDebugEnable) log.debug('handle-reset')
    form.resetFields()
    search.reset()
  }

  function handleEdit(record: Job.JobItem) {
    modalRef?.current.openModal('edit', record)
  }

  function handleDelete(id: number) {
    if (isDebugEnable) log.info('delete:', id)
    confirmDelete([id], `删除操作不可撤销，是否继续？ID: ${id}.`)
  }

  const confirmDelete = useCallback(
    (ids: number[], message: string) => {
      confirm({
        title: '确认删除操作？',
        description: message,
        onConfirm: async () => {
          await Promise.all(ids.map(id => api.job.deleteJob(id)))
          toast.success(`${ids.length > 1 ? '批量删除成功' : '删除成功'}`)
          setIds([])
          search.reset()
        },
      })
    },
    [confirm, search]
  )

  const handleBatchDelete = () => {
    if (ids.length === 0) {
      toast.warning('请选择需要删除的任务')
      return
    }
    confirmDelete(ids, `将删除 ${ids.length} 个任务，操作不可恢复。`)
  }

  useEffect(() => {
    fetchJobGroupOptions()
  }, [])

  return (
    <div className="content-area">
      <SearchBar
        form={form}
        fields={searchFields}
        initialValues={initialValues}
        onSearch={search.submit}
        onReset={handleReset}
        buttons={[
          {
            key: 'addJob',
            label: '新建任务',
            icon: <PlusIcon />,
            onClick: () => modalRef?.current.openModal('create', jobGroupOptions),
          },
          {
            key: 'batchDelete',
            label: '批量删除',
            icon: <TrashIcon />,
            onClick: handleBatchDelete,
          },
        ]}
      />

      <div className="mt-4">
        <Table<Job.JobItem>
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          rowKey={record => record.id}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: ids,
            onChange: (selectedRowKeys: React.Key[]) => {
              setIds(selectedRowKeys as number[])
              log.info('ids: ', selectedRowKeys)
            },
          }}
          {...tableProps}
        />
      </div>

      <TaskModal parentRef={modalRef} onRefresh={() => (action === 'create' ? search.reset() : search.submit())} />
      {/*
      <TaskModalPrimary
        parentRef={modalRef}
        onRefresh={() => (action === 'create' ? search.reset() : search.submit())}
      />
      */}

      {dialog}
    </div>
  )
}
