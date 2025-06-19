import { IAction, IModalProps } from '@/types/modal.ts'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { useImperativeHandle, useState } from 'react'
import { Form, Input } from 'antd'

const title = '执行器'

/**
 * 编辑|新增执行器弹窗
 */
export default function ExecutorModal({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [jobGroup, setJobGroup] = useState<any>({} as any)

  const openModal = (action: IAction, data?: any) => {
    if (isDebugEnable) log.info('弹窗开启: ', action, data)
    form.resetFields()
    setAction(action)
    if (action === 'edit' && data) {
      form.setFieldsValue(data)
      setJobGroup(data)
    }
    setOpen(true)
  }

  useImperativeHandle(parentRef, () => ({ openModal, closeModal: () => setOpen(false) }))

  function handleCancel() {
    if (isDebugEnable) log.info('取消编辑')
    setOpen(false)
  }

  function handleOk() {
    const fieldsValue = form.getFieldsValue()
    log.info(`操作: ${action} :`, fieldsValue)
    if (action === 'create') {
      handleCreate(fieldsValue)
    } else {
      handleEdit(fieldsValue)
    }
    setOpen(false)
    onRefresh()

    // @ts-ignore
    function handleEdit(fieldsValue: any) {}

    // @ts-ignore
    function handleCreate(fieldsValue: any) {}
  }

  return (
    <ShadcnAntdModal<any>
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title={action === 'edit' ? '编辑' + title : '新建' + title}
      data={jobGroup}
    >
      {() => (
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ role: 0 }}
          className="space-y-5"
        >
          <Form.Item name="id" hidden>
            <Input placeholder="JOB ID" />
          </Form.Item>
          <Form.Item name="author">
            <Input placeholder="请输入负责人" />
          </Form.Item>
        </Form>
      )}
    </ShadcnAntdModal>
  )
}
