import { useForm } from 'antd/es/form/Form'
import { JobGroup } from '@/types'
import React, { useCallback, useRef, useState } from 'react'
import { IAction, ModalAction } from '@/types/modal.ts'
import { useConfirmDialog } from '@/hooks/useConfirmDialog.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import ExecutorModal from '@/pages/executor/ExecutorModal.tsx'
import { SearchBar, SearchField } from '@/components/common/SearchBar.tsx'
import { PlusIcon } from '@radix-ui/react-icons'
import { DeleteIcon, EditIcon, TrashIcon } from 'lucide-react'
import api from '@/api'
import { useAntdTable } from 'ahooks'
import { Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { IconTooltipButton } from '@/components/IconTooltipButton.tsx'
import { formatDateToLocalString, handleCopy } from '@/utils'
import { Badge } from '@/components/ui/badge.tsx'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { ExecutorNode } from '@/pages/executor/ExecutorNode.tsx'
import { toast } from '@/utils/toast.ts'
import { AddressType, AddressTypeLabel } from '@/types/enum.ts'

export default function ExecutorComponent() {
  const [form] = useForm<JobGroup.Item>()
  const [action, setAction] = useState<IAction>('create')
  const [ids, setIds] = useState<number[]>([])
  const { confirm, dialog } = useConfirmDialog()
  const [modalVisible, setModalVisible] = useState(false)
  const [nodes, setNodes] = useState<string[]>([])

  const modalRef = useRef<ModalAction>({
    openModal: (action, data) => {
      if (isDebugEnable) log.info('打开弹窗:', action, data)
      setAction(action)
    },
  })

  const AddressTypeClass: Record<AddressType, string> = {
    [AddressType.Auto]: 'bg-green-50 text-green-700',
    [AddressType.Manual]: 'bg-blue-50 text-blue-700',
  }

  const searchFields: SearchField[] = [
    { type: 'input', key: 'appname', label: '执行器标识', placeholder: '请输入执行器标识' },
    { type: 'input', key: 'title', label: '执行器名称', placeholder: '请输入执行器名称' },
  ]

  const columns: ColumnsType<JobGroup.Item> = [
    {
      title: '执行器ID',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: '执行器标识',
      dataIndex: 'appname',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '执行器名称',
      dataIndex: 'title',
      render: (text: string) => text.replace(/[<>]/g, ''),
    },
    {
      title: '注册方式',
      dataIndex: 'addressType',
      render: (type: AddressType) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${AddressTypeClass[type]}`}>
          {AddressTypeLabel[type]}
        </span>
      ),
    },
    {
      title: '在线节点',
      dataIndex: 'addressList',
      render: (text?: string) => {
        const nodes = text?.split(',').filter(Boolean) || []
        return (
          <ExecutorNode
            nodes={nodes}
            showMore={nodes => {
              setNodes(nodes)
              setModalVisible(true)
            }}
          />
        )
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (record: JobGroup.Item) => formatDateToLocalString(record.updateTime),
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (record: JobGroup.Item) => (
        <Space>
          <IconTooltipButton tooltip="编辑" icon={<EditIcon size={16} />} onClick={() => handleEdit(record)} />
          <IconTooltipButton tooltip="删除" icon={<DeleteIcon size={16} />} onClick={() => handleDelete(record.id!)} />
        </Space>
      ),
    },
  ]

  // 拉取数据
  const fetchData = async (
    { current, pageSize }: { current: number; pageSize: number },
    formData: JobGroup.PageParams
  ) => {
    const res = await api.jobGroup.getJobGroups({ ...formData, start: (current - 1) * pageSize, length: pageSize })
    return {
      total: res?.recordsTotal ?? 0,
      list: res?.data ?? [],
    }
  }
  // 配置分页
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

  function handleEdit(record: JobGroup.Item) {
    if (isDebugEnable) log.info('edit:', record)
    modalRef?.current.openModal('edit', record)
  }

  function handleBatchDelete() {
    if (isDebugEnable) log.info('batchDelete:', ids)
    if (ids.length === 0) {
      toast.warning('请选择需要删除的执行器')
      return
    }
    confirmDelete(ids, `将删除 ${ids.length} 个执行器，操作不可恢复。`)
  }

  function handleDelete(id: number) {
    if (isDebugEnable) log.info('delete:', id)
    confirmDelete([id], `删除操作不可撤销，是否继续？`)
  }

  const confirmDelete = useCallback(
    (ids: number[], message: string) => {
      confirm({
        title: '确认删除操作？',
        description: message,
        onConfirm: async () => {
          await Promise.all(ids.map(id => api.jobGroup.deleteGroup(id)))
          toast.success(`${ids.length > 1 ? '批量删除成功' : '删除成功'}`)
          setIds([])
          search.submit()
        },
      })
    },
    [confirm, search]
  )

  return (
    <>
      <div className="content-area">
        <SearchBar
          form={form}
          initialValues={{ appname: '', title: '' }}
          fields={searchFields}
          onSearch={search.submit}
          onReset={search.reset}
          onChange={search.submit}
          buttons={[
            {
              key: 'addExecutor',
              label: '新建执行器',
              icon: <PlusIcon />,
              onClick: () => modalRef?.current.openModal('create'),
            },
            {
              key: 'batchDelete',
              label: ' 批量删除',
              icon: <TrashIcon />,
              onClick: handleBatchDelete,
            },
          ]}
        />
        <div className="mt-4">
          <Table<JobGroup.Item>
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
        <ExecutorModal
          parentRef={modalRef}
          onRefresh={() => (action === 'create' ? search.reset() : search.submit())}
        />
      </div>

      {/* 在线节点 */}
      <ShadcnAntdModal<any>
        title={`全部节点（${nodes.length}）`}
        open={modalVisible}
        style={{ top: '20%' }}
        footer={null}
        onCancel={() => setModalVisible(false)}
        className="text-center"
      >
        {() => (
          <div className="flex flex-wrap gap-4 p-4 rounded-lg">
            {nodes.map((node, idx) => (
              <Badge
                key={idx}
                className="bg-green-300 text-green-700 hover:bg-green-400 rounded-full cursor-pointer"
                onClick={() => handleCopy(node)}
              >
                {node}
              </Badge>
            ))}
          </div>
        )}
      </ShadcnAntdModal>

      {dialog}
    </>
  )
}
