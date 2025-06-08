import { IAction, IModalProps } from '@/types/modal.ts'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { useImperativeHandle, useState } from 'react'
import { Form, Input, Radio } from 'antd'
import { JobGroup } from '@/types'
import { AddressType } from '@/types/enum.ts'
import { Card } from '@/components/ui/card.tsx'
import api from '@/api'
import { toast } from '@/utils/toast.ts'

const title = '执行器'

/**
 * 编辑|新增执行器弹窗
 */
export default function ExecutorModal({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [jobGroup, setJobGroup] = useState<JobGroup.Item>({} as JobGroup.Item)
  const [loading, setLoading] = useState(false)

  const openModal = (action: IAction, data?: JobGroup.Item) => {
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

  // 在表单字段定义前添加验证规则
  const VALIDATION_RULES = {
    appname: [
      { required: true, message: '执行器标识不能为空' },
      { min: 4, message: '标识长度不能少于4个字符' },
      { max: 64, message: '标识长度不能超过64个字符' },
      { pattern: /^[^<>]*$/, message: '不能包含<或>字符' },
    ],
    title: [
      { required: true, message: '执行器名称不能为空' },
      { pattern: /^[^<>]*$/, message: '不能包含<或>字符' },
    ],
    addressList: [
      {
        required: true,
        message: '手动模式必须填写节点地址',
      },
    ],
  }

  function handleCancel() {
    if (isDebugEnable) log.info('取消编辑')
    setOpen(false)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const fieldsValue = form.getFieldsValue() as JobGroup.Item
      if (isDebugEnable) log.info(`操作: ${action} :`, fieldsValue)

      async function handleEdit(fieldsValue: JobGroup.Item) {
        if (isDebugEnable) log.info(`编辑: ${fieldsValue}`)
        if (fieldsValue.addressType === AddressType.Auto) {
          fieldsValue.addressList = ''
        }
        const { code } = await api.jobGroup.editJobGroup({ ...fieldsValue })
        toast.success(code === 200 ? '编辑成功' : '编辑失败')
      }

      async function handleCreate(fieldsValue: JobGroup.Item) {
        if (isDebugEnable) log.info(`创建: ${fieldsValue}`)
        const { code } = await api.jobGroup.addJobGroup({ ...fieldsValue })
        toast.success(code === 200 ? '创建成功' : '创建失败')
      }

      if (action === 'create') {
        await handleCreate(fieldsValue)
      } else {
        await handleEdit(fieldsValue)
      }

      setOpen(false)
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <ShadcnAntdModal<JobGroup.Item>
      title={action === 'edit' ? '编辑' + title : '新建' + title}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      data={jobGroup}
      destroyOnHidden={true}
      action={action}
      confirmLoading={loading}
    >
      {() => (
        <Form
          form={form}
          layout="horizontal"
          initialValues={{
            addressType: AddressType.Auto,
            addressList: '',
          }}
          validateTrigger="onBlur"
        >
          <Card className="justify-center min-h-[350px] p-8">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="appname"
              label="执行器标识"
              rules={VALIDATION_RULES.appname}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Input placeholder="执行器 AppName 格式：4-16字符，不含<>" allowClear />
            </Form.Item>

            <Form.Item
              name="title"
              label="执行器名称"
              rules={VALIDATION_RULES.title}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Input placeholder="示例：订单服务" allowClear />
            </Form.Item>

            <Form.Item
              name="addressType"
              label="注册方式"
              className="!mb-4"
              required
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Radio.Group>
                <Radio value={AddressType.Auto}>
                  <span className="font-medium">自动注册</span>
                  <div className="text-xs text-gray-500">由系统自动发现节点</div>
                </Radio>
                <Radio value={AddressType.Manual} className="!mt-4">
                  <span className="font-medium">手动注册</span>
                  <div className="text-xs text-gray-500">需指定节点地址</div>
                </Radio>
              </Radio.Group>
            </Form.Item>

            {/* 动态显示注册节点地址 */}
            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const currType = getFieldValue('addressType')
                // 新建时仅手动注册显示，编辑时始终显示
                if ((action === 'create' && currType === AddressType.Manual) || action === 'edit') {
                  return (
                    <Form.Item
                      name="addressList"
                      label="注册节点地址"
                      rules={VALIDATION_RULES.addressList}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 16 }}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="格式：IP:Port，多个地址用英文逗号分隔"
                        allowClear
                        disabled={action === 'edit' && currType !== AddressType.Manual}
                      />
                    </Form.Item>
                  )
                }
                return null
              }}
            </Form.Item>
          </Card>
        </Form>
      )}
    </ShadcnAntdModal>
  )
}
