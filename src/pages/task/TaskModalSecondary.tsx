import { ReactNode, useImperativeHandle, useState } from 'react'
import { Button, Card, Col, Collapse, Form, Input, Row, Select, Space } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { IAction, IModalProps } from '@/types/modal.ts'
import { Job } from '@/types'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { ExecutorRouteStrategyI18n, glueLangMap, GlueTypeConfig, GlueTypeEnum, ScheduleTypeEnum } from '@/types/enum.ts'
import CronEditor from '@/pages/cron/CronEditor.tsx'
import { FormInstance } from 'rc-field-form/es/interface'
import useZustandStore from '@/stores/useZustandStore.ts'
import Editor from '@monaco-editor/react'
import ShadTabsExample from '@/components/ShadTabsExample.tsx'

function getTitleText(action: IAction) {
  const title = '任务'
  if (action === 'create') {
    return `新建${title}`
  }
  if (action === 'edit') {
    return `编辑${title}`
  }
  if (action === 'view') {
    return `${title}详情`
  }
  return undefined
}

interface ScheduleFormProps {
  scheduleType: ScheduleTypeEnum
}

interface TaskFormProps {
  action: IAction
  form: FormInstance
}

/**
 * TaskModalSecondary
 */
export default function TaskModalSecondary({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [jobInfo, setJobInfo] = useState<Job.JobItem>({} as Job.JobItem)
  const [useTabs, setUseTabs] = useState(true)
  const scheduleType = Form.useWatch('scheduleType', form) as ScheduleTypeEnum
  const [editorCode, setEditorCode] = useState('')
  const { isDarkEnable } = useZustandStore()
  const monacoTheme = isDarkEnable ? 'vs-dark' : 'vs'
  const glueType = Form.useWatch('glueType', form) as GlueTypeEnum
  const showJobHandler = glueType === GlueTypeEnum.BEAN
  const glueTypeOptions = Object.entries(GlueTypeConfig).map(([value, config]) => ({
    label: config.desc,
    value: value as GlueTypeEnum,
  }))

  const openModal = (action: IAction, data?: Job.JobItem) => {
    if (isDebugEnable) log.info('弹窗开启: ', action, data)
    setAction(action)
    setJobInfo(data || ({} as Job.JobItem))
    setOpen(true)
    form.resetFields()
  }
  // 暴露方法给父组件
  useImperativeHandle(parentRef, () => ({
    openModal,
    closeModal: () => setOpen(false),
  }))

  {
    /* —— 基础配置 —— */
  }

  function baseForm() {
    return (
      <Card variant="borderless" style={{ width: '100%', minHeight: 240 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="执行器" name="jobGroup" rules={[{ required: true }]}>
              <Select placeholder="请选择执行器" options={[]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="任务描述" name="jobDesc" rules={[{ required: true }]}>
              <Input placeholder="请输入任务描述" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="负责人" name="author" rules={[{ required: true }]}>
              <Input placeholder="请输入负责人" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="报警邮件" name="alarmEmail" rules={[{ required: true }]}>
              <Input placeholder="请输入报警邮件，多个逗号分隔" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    )
  }

  {
    /* —— 调度配置 —— */
  }

  function scheduleForm({ scheduleType }: ScheduleFormProps) {
    return (
      <Card>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="调度类型" name="scheduleType" rules={[{ required: true, message: '请选择调度类型' }]}>
              <Select
                placeholder="请选择类型"
                options={[
                  { label: '无', value: 'NONE' },
                  { label: 'CRON', value: 'CRON' },
                  { label: '固定速率', value: 'FIX_RATE' },
                ]}
              />
            </Form.Item>
          </Col>

          {/* 条件渲染：根据调度类型展示不同的配置项 */}
          {scheduleType === 'CRON' && (
            <Col span={12}>
              <Form.Item label="Cron" name="scheduleConf" rules={[{ required: true, message: '请输入 Cron 表达式' }]}>
                <CronEditor onChange={() => log.info('cron')} value="" />
              </Form.Item>
            </Col>
          )}

          {scheduleType === 'FIX_RATE' && (
            <Col span={12}>
              <Form.Item label="运行速率" name="scheduleConf" rules={[{ required: true, message: '请输入运行速率' }]}>
                <Input placeholder="请输入 ( Second )" />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Card>
    )
  }

  /* —— 任务配置 —— */
  function taskForm({ action, form }: TaskFormProps) {
    return (
      <Card>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="运行模式" name="glueType" rules={[{ required: true }]}>
              <Select placeholder="请选择运行模式" options={glueTypeOptions} disabled={action === 'edit'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="JobHandler"
              name="executorHandler"
              rules={[{ required: showJobHandler, message: '请输入 JobHandler' }]}
            >
              <Input placeholder="请输入 JobHandler" disabled={!showJobHandler} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="任务参数" name="executorParam" rules={[{ required: true }]}>
              <Input.TextArea allowClear placeholder="请输入任务参数" />
            </Form.Item>
          </Col>

          {/* 代码编辑器，仅当为脚本模式时显示 */}
          {glueType && GlueTypeConfig[glueType]?.isScript && (
            <Col span={24}>
              <Form.Item label="脚本内容" name="glueSource" rules={[{ required: true, message: '请输入脚本内容' }]}>
                <div className="border rounded-md overflow-hidden dark:border-zinc-800">
                  <Editor
                    height="200px"
                    language={glueLangMap[glueType] || 'text'}
                    value={editorCode}
                    onChange={val => {
                      setEditorCode(val || '')
                      form.setFieldValue('glueSource', val || '')
                    }}
                    theme={monacoTheme}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Card>
    )
  }

  {
    /* —— 高级配置 —— */
  }

  function advancedForm() {
    return (
      <Card variant="borderless" style={{ width: '100%', minHeight: 240 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="路由策略" name="executorRouteStrategy">
              <Select
                placeholder="请选择策略"
                options={Object.entries(ExecutorRouteStrategyI18n).map(([value, label]) => ({
                  label,
                  value,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="子任务ID" name="childJobId">
              <Input placeholder="请输入子任务ID, 如存在多个则用逗号分隔" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="调度过期策略" name="misfireStrategy">
              <Select
                placeholder="请选择"
                options={[
                  { label: '忽略', value: 'DO_NOTHING' },
                  { label: '立即执行', value: 'FIRE_ONCE_NOW' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="阻塞处理策略" name="executorBlockStrategy">
              <Select
                placeholder="请选择"
                options={[
                  { label: '串行执行（排队）', value: 'SERIAL_EXECUTION' },
                  { label: '丢弃后续调度（保留当前）', value: 'DISCARD_LATER' },
                  { label: '覆盖之前调度（用新调度替换）', value: 'COVER_EARLY' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="任务超时时间" name="executorTimeout" rules={[{ required: false }]}>
              <Input placeholder="单位秒，大于零时生效" type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="失败重试次数" name="executorFailRetryCount" rules={[{ required: false }]}>
              <Input placeholder="失败重试次数，大于零时生效" type="number" min={0} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    )
  }

  function handleReset() {
    return undefined
  }

  function handleOk() {
    setOpen(false)
    onRefresh()
  }

  function handleCancel() {
    setOpen(false)
  }

  const tabList = [
    { key: '1', label: '基础配置' },
    { key: '2', label: '调度配置' },
    { key: '3', label: '任务配置' },
    { key: '4', label: '高级配置' },
  ]

  const contentMap: Record<string, () => ReactNode> = {
    '1': baseForm,
    '2': () => scheduleForm({ scheduleType }),
    '3': () => taskForm({ action, form }),
    '4': advancedForm,
  }

  function renderFormContent(useTabs = true) {
    const items = tabList.map(tab => ({
      key: tab.key,
      label: tab.label,
      children: contentMap[tab.key](), // 这里加上 ()
    }))

    if (useTabs) {
      // return <Tabs defaultActiveKey="1" centered tabPosition="top" items={items} />
      return <ShadTabsExample />
    }

    return <Collapse defaultActiveKey={['1', '2', '3', '4']} items={items} />
  }

  return (
    <ShadcnAntdModal<Job.JobItem>
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      onReset={action === 'create' ? () => handleReset() : undefined}
      width={900}
      data={jobInfo}
      style={{ top: 30 }}
      styles={{ body: { maxHeight: '70vh', minHeight: 400, overflowY: 'auto' } }}
      action={action}
      destroyOnHidden={true}
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>{getTitleText(action)}</span>
          <Button type="text" className={'mr-4'} icon={<SwapOutlined />} onClick={() => setUseTabs(!useTabs)}>
            {useTabs ? '切换为折叠布局' : '切换为标签页布局'}
          </Button>
        </Space>
      }
    >
      {() => (
        <Form layout="vertical" form={form}>
          {renderFormContent(useTabs)}
        </Form>
      )}
    </ShadcnAntdModal>
  )
}
