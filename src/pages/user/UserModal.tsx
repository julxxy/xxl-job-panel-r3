import { useImperativeHandle, useState } from 'react'
import { Form, Input, Radio } from 'antd'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal'
import { isDebugEnable, log } from '@/common/Logger'
import { IAction, IModalProps } from '@/types/modal'
import { Job, User } from '@/types'
import api from '@/api'
import { toast } from '@/utils/toast.ts'
import { formatPermissionToList, formatPermissionToString } from '@/services/userService'
import SelectWithCheckbox from '@/components/SelectWithCheckbox.tsx'

/**
 * 编辑|新增用户
 */
export default function UserModal({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User.UserRecord>({} as User.UserRecord)
  const [action, setAction] = useState<IAction>('create')
  const [jobGroup, setJobGroup] = useState<Job.JobGroupInfo[]>([])

  const openModal = (action: IAction, data?: User.UserRecord) => {
    if (isDebugEnable) log.info('弹窗开启: ', action, data)
    form.resetFields()
    if (action === 'edit' && data) {
      data.permission = formatPermissionToList(data?.permission as string)
      form.setFieldsValue(data)
      setUser(data)
      if (isDebugEnable) log.info('permission :', data.permission)
    }
    setAction(action)
    setOpen(true)
    getUserGroupPermissions()
  }

  useImperativeHandle(parentRef, () => ({ openModal, closeModal: () => setOpen(false) }))

  const getUserGroupPermissions = async () => {
    const { content } = await api.user.getUserGroupPermissions()
    log.info('用户组权限:', content)
    setJobGroup([...content])
  }

  const handleOk = () => {
    const fieldsValue = form.getFieldsValue()
    log.info(`操作: ${action} :`, fieldsValue)
    if (action === 'create') {
      handleCreate(fieldsValue)
    } else {
      handleEdit(fieldsValue)
    }
    setOpen(false)
    onRefresh()
  }

  const handleCancel = () => {
    if (isDebugEnable) log.info('取消编辑')
    setOpen(false)
  }

  async function handleEdit(data: User.UserRecord) {
    if (isDebugEnable) log.info('编辑用户： ', data)
    data.permission = formatPermissionToString(data.permission as number[])
    const { code } = await api.user.editUser(data)
    if (code === 200) {
      toast.success('修改成功')
    } else {
      toast.error('修改失败')
    }
  }

  async function handleCreate(data: User.UserRecord) {
    data.permission = formatPermissionToString(data.permission as unknown as number[])
    if (isDebugEnable) log.info('创建用户: ', data)
    const { code, msg } = await api.user.createUser(data)
    if (code === 200) {
      toast.success('已创建')
    } else {
      toast.error('创建失败: ' + msg)
    }
  }

  const roleValue = Form.useWatch('role', form)

  return (
    <ShadcnAntdModal<User.UserRecord>
      centered
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title={action === 'edit' ? '编辑用户' : '新建用户'}
      data={user}
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
            <Input placeholder="用户ID" />
          </Form.Item>

          <Form.Item
            name="username"
            label="账号"
            rules={[
              { required: true, message: '请输入账号' },
              { min: 4, max: 20 },
            ]}
          >
            <Input placeholder="请输入账号" disabled={action === 'edit'} />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[...(action === 'create' ? [{ required: true, message: '请输入密码' }] : []), { min: 5, max: 20 }]}
          >
            <Input.Password placeholder={action === 'create' ? '请输入密码' : '如需修改请填写'} />
          </Form.Item>

          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Radio.Group block buttonStyle={'outline'}>
              <Radio.Button value={1}>管理员</Radio.Button>
              <Radio.Button value={0}>普通用户</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {roleValue === 0 && (
            <Form.Item name="permission" label="权限（多选）" rules={[{ required: true, message: '请选择至少一项' }]}>
              <SelectWithCheckbox<Job.JobGroupInfo>
                placeholder="请选择权限/搜索权限"
                options={jobGroup}
                labelKey="title"
                valueKey="id"
              />
            </Form.Item>
          )}
        </Form>
      )}
    </ShadcnAntdModal>
  )
}
