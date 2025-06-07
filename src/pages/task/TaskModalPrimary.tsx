import { IAction, IModalProps } from '@/types/modal.ts'
import { Job } from '@/types'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, Card, Col, Drawer, Form, Input, List, Row, Select, Tooltip } from 'antd'
import CronEditor from '@/pages/cron/CronEditor.tsx'
import { ExecutorRouteStrategyI18n, glueLangMap, GlueTypeConfig, GlueTypeEnum, ScheduleTypeEnum } from '@/types/enum.ts'
import Editor from '@monaco-editor/react'
import { glueTemplates } from '@/constants/glueTemplates.ts'
import useZustandStore from '@/stores/useZustandStore.ts'
import api from '@/api'
import { toast } from '@/utils/toast.ts'
import md5 from 'blueimp-md5'
import { EyeOutlined, HistoryOutlined, RollbackOutlined } from '@ant-design/icons'

// 历史版本类型
export interface GlueHistoryItem {
  jobId: number
  glueType: string
  glueSource: string
  glueRemark: string
  addTime: string
  updateTime: string
}

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

// eslint-disable-next-line react-refresh/only-export-components
export function handleToastMsg(code: number, msg: string) {
  if (code !== 200) {
    toast.error(msg)
  } else {
    toast.success('SUCCESS')
  }
}

/**
 * 任务弹窗
 */
export default function TaskModalPrimary({ parentRef, onRefresh }: IModalProps) {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [disabled, setDisabled] = useState(false)
  const [jobInfo, setJobInfo] = useState<Job.JobItem>({} as Job.JobItem)
  const [jobGroupOptions, setJobGroupOptions] = useState<{ label: string; value: number }[]>([])
  const initialGlueSourceMd5Ref = useRef<string>('')
  const [isGlueSourceChanged, setIsGlueSourceChanged] = useState(false)
  const [editorCode, setEditorCode] = useState('')
  const [glueHistory, setGlueHistory] = useState<GlueHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyVisible, setHistoryVisible] = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const formRef = useRef(form)
  const { isDarkEnable } = useZustandStore()
  const monacoTheme = isDarkEnable ? 'vs-dark' : 'vs'
  const scheduleType = Form.useWatch('scheduleType', form) as ScheduleTypeEnum
  const glueType = Form.useWatch('glueType', form) as GlueTypeEnum
  const showJobHandler = glueType === GlueTypeEnum.BEAN
  const glueTypeOptions = Object.entries(GlueTypeConfig).map(([value, config]) => ({
    label: config.desc,
    value: value as GlueTypeEnum,
  }))

  // 暴露方法给父组件
  useImperativeHandle(parentRef, () => ({
    openModal,
    closeModal: () => setOpen(false),
  }))

  // 打开弹窗
  const openModal = (action: IAction, data?: Job.JobItem) => {
    if (isDebugEnable) log.info('弹窗开启: ', action, data)
    // 重置表单并设置基础状态
    form.resetFields()
    setOpen(true)
    setAction(action)
    setDisabled(action === 'view')

    // 处理权限组选项
    const actualJobGroupOptions = Array.isArray(data) ? data : (data?._jobGroupOptions ?? [])
    setJobGroupOptions(actualJobGroupOptions)

    // 智能设置表单数据
    const initialData = data || ({} as Job.JobItem)
    setJobInfo(initialData)
    // 立即填充表单数据
    form.setFieldsValue(initialData)

    // 记录初始脚本内容
    let initialGlueSource = ''
    if (action === 'edit') {
      initialGlueSource = data?.glueSource || ''
    } else {
      initialGlueSource = glueTemplates[data?.glueType as GlueTypeEnum] || ''
    }
    initialGlueSourceMd5Ref.current = md5(initialGlueSource)

    // 获取历史版本
    if (action !== 'create' && data?.id) {
      fetchGlueHistory(data.id)
    } else {
      setGlueHistory([])
    }
  }

  // 获取历史版本
  const fetchGlueHistory = async (jobId: number) => {
    setHistoryLoading(true)
    try {
      const { code, content } = await api.jobCode.getGlueHistory(jobId)
      if (code === 200) {
        setGlueHistory(content || [])
      }
    } finally {
      setHistoryLoading(false)
    }
  }

  async function handleSubmit() {
    const fieldsValue = form.getFieldsValue()
    log.info(`操作: ${action} :`, fieldsValue)

    async function saveGlue(values: Job.JobItem) {
      if (isGlueSourceChanged && values.glueType !== GlueTypeEnum.BEAN) {
        const params = {
          id: values.id,
          glueSource: values.glueSource,
          glueRemark: action === 'create' ? '初始化脚本' : '编辑脚本',
        }
        await api.jobCode.addGlue(params)
      }
    }

    async function handleCreate(values: Job.JobItem) {
      if (isDebugEnable) log.info(`handle-create: ${values} :`, fieldsValue)
      const { code, msg, content } = await api.job.addJob(values)
      handleToastMsg(code, msg)
      if (code === 200) {
        values.id = content
        await saveGlue(values)
      }
    }

    async function handleEdit(values: Job.JobItem) {
      if (isDebugEnable) log.info(`handle-edit: ${values} :`, fieldsValue)
      const { code, msg } = await api.job.editJob(values)
      handleToastMsg(code, msg)
      await saveGlue(values)
    }

    if (action === 'create') {
      await handleCreate(fieldsValue)
    } else {
      await handleEdit(fieldsValue)
    }

    setOpen(false)
    onRefresh()

    // 通过表单当前值更新初始 MD5（确保数据已提交）
    const latestGlueSource = fieldsValue.glueSource || ''
    initialGlueSourceMd5Ref.current = md5(latestGlueSource)
    setIsGlueSourceChanged(false)
  }

  function handleCancel() {
    if (isDebugEnable) log.info('取消编辑')
    setOpen(false)
    setIsGlueSourceChanged(false)
  }

  function handleReset() {
    setJobInfo({} as Job.JobItem)
    form.resetFields()
    setIsGlueSourceChanged(false)
    if (action === 'create') {
      const template = glueTemplates[glueType] || ''
      initialGlueSourceMd5Ref.current = md5(template)
    } else {
      initialGlueSourceMd5Ref.current = md5(jobInfo.glueSource || '')
    }
  }

  // 延迟设置字段，确保 Form 已挂载
  useEffect(() => {
    if ((action === 'edit' || action === 'view') && open && jobInfo && Object.keys(jobInfo).length > 0) {
      setTimeout(() => {
        form.setFieldsValue(jobInfo)
      }, 10)
    }
  }, [open, action, jobInfo, form])

  // 动态渲染
  useEffect(() => {
    if (!showJobHandler) {
      formRef.current.setFieldValue('executorHandler', '')
    }
  }, [showJobHandler])

  useEffect(() => {
    if (glueType && GlueTypeConfig[glueType]?.isScript) {
      const template = glueTemplates[glueType] || ''
      const existing = form.getFieldValue('glueSource')
      const shouldUseTemplate = action === 'create' || !existing
      const code = shouldUseTemplate ? template : existing
      setEditorCode(code)
      form.setFieldValue('glueSource', code)
      initialGlueSourceMd5Ref.current = md5(code)
      setIsGlueSourceChanged(action === 'create')
    }
  }, [form, glueType, action])

  return (
    <>
      <ShadcnAntdModal<Job.JobItem>
        title={getTitleText(action)}
        width={900}
        data={jobInfo}
        open={open}
        onCancel={handleCancel}
        onOk={handleSubmit}
        onReset={action === 'create' ? () => handleReset() : undefined}
        action={action}
        style={{ top: 30 }}
        styles={{ body: { maxHeight: '70vh', minHeight: 400, overflowY: 'auto' } }}
        destroyOnHidden={true}
      >
        {() => (
          <Form form={form} layout="horizontal" initialValues={{}}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            {/* —— 基础配置 —— */}
            <Card title="基础配置" variant="outlined" style={{ marginBottom: 12 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="执行器" name="jobGroup" rules={[{ required: true, message: '请选择至少一项' }]}>
                    <Select
                      allowClear
                      showSearch={jobGroupOptions.length > 10}
                      options={jobGroupOptions ?? []}
                      placeholder="请选择执行器/搜索执行器"
                      optionFilterProp="label"
                      filterOption={(input, option) => {
                        const label = option?.label?.toString()?.toLowerCase() || ''
                        const value = option?.value?.toString()?.toLowerCase() || ''
                        const keyword = input.toLowerCase()
                        return label.includes(keyword) || value.includes(keyword)
                      }}
                    />
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

            {/* —— 调度配置 —— */}
            <Card title="调度配置" variant="outlined" style={{ marginBottom: 12 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="调度类型"
                    name="scheduleType"
                    rules={[{ required: true, message: '请选择调度类型' }]}
                  >
                    <Select
                      placeholder="请选择类型"
                      disabled={disabled}
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
                    <Form.Item
                      label="Cron"
                      name="scheduleConf"
                      rules={[{ required: true, message: '请输入 Cron 表达式' }]}
                    >
                      <CronEditor onChange={() => log.info('cron:')} value="" />
                    </Form.Item>
                  </Col>
                )}

                {scheduleType === 'FIX_RATE' && (
                  <Col span={12}>
                    <Form.Item
                      label="运行速率"
                      name="scheduleConf"
                      rules={[{ required: true, message: '请输入运行速率' }]}
                    >
                      <Input placeholder="请输入 ( Second )" />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Card>

            {/* —— 任务配置 —— */}
            <Card title="任务配置" variant="outlined" style={{ marginBottom: 12 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="运行模式" name="glueType" rules={[{ required: true }]}>
                    <Select
                      placeholder="请选择运行模式"
                      options={glueTypeOptions}
                      disabled={['edit', 'view'].includes(action)}
                    />
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
                    <Form.Item
                      label="脚本内容"
                      name="glueSource"
                      rules={[{ required: true, message: '请输入脚本内容' }]}
                    >
                      <div className="border rounded-md overflow-hidden dark:border-zinc-800">
                        {/* 历史按钮 */}
                        {action !== 'create' && (
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <Button
                              icon={<HistoryOutlined />}
                              size="small"
                              onClick={() => setHistoryVisible(true)}
                              style={{ marginRight: 8 }}
                            >
                              脚本历史版本
                            </Button>
                            {isGlueSourceChanged && <span style={{ color: '#faad14' }}>脚本已修改</span>}
                          </div>
                        )}
                        <Editor
                          height={240}
                          language={glueLangMap[glueType] || 'text'}
                          value={editorCode}
                          onChange={val => {
                            const newCode = val || ''
                            setEditorCode(newCode)
                            form.setFieldValue('glueSource', newCode)
                            const newMd5 = md5(newCode)
                            setIsGlueSourceChanged(newMd5 !== initialGlueSourceMd5Ref.current)
                            if (isDebugEnable) {
                              log.debug(
                                '脚本内容MD5变更追踪',
                                '\n初始MD5:',
                                initialGlueSourceMd5Ref.current,
                                '\n当前MD5:',
                                newMd5,
                                '\n是否变更:',
                                newMd5 !== initialGlueSourceMd5Ref.current
                              )
                            }
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

            {/* —— 高级配置 —— */}
            <Card title="高级配置" variant="outlined" style={{ marginBottom: 12 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="路由策略" name="executorRouteStrategy">
                    <Select
                      disabled={disabled}
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
                      disabled={disabled}
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
                      disabled={disabled}
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
          </Form>
        )}
      </ShadcnAntdModal>

      {/* 历史版本抽屉 */}
      <Drawer
        title="脚本历史版本"
        placement="right"
        width={420}
        open={historyVisible}
        onClose={() => {
          setHistoryVisible(false)
          setPreviewContent(null)
        }}
        extra={
          previewContent && (
            <Button
              icon={<RollbackOutlined />}
              type="primary"
              size="small"
              onClick={() => {
                setEditorCode(previewContent)
                form.setFieldValue('glueSource', previewContent)
                initialGlueSourceMd5Ref.current = md5(previewContent)
                setIsGlueSourceChanged(false)
                setHistoryVisible(false)
                setPreviewContent(null)
              }}
            >
              回填到编辑器
            </Button>
          )
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={glueHistory}
          loading={historyLoading}
          renderItem={item => (
            <List.Item
              actions={[
                <Tooltip title="预览内容" key="preview">
                  <Button icon={<EyeOutlined />} size="small" onClick={() => setPreviewContent(item.glueSource)} />
                </Tooltip>,
                <Tooltip title="回填到编辑器" key="fill">
                  <Button
                    icon={<RollbackOutlined />}
                    size="small"
                    onClick={() => {
                      setEditorCode(item.glueSource)
                      form.setFieldValue('glueSource', item.glueSource)
                      initialGlueSourceMd5Ref.current = md5(item.glueSource)
                      setIsGlueSourceChanged(false)
                      setHistoryVisible(false)
                      setPreviewContent(null)
                    }}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span>
                    {item.glueRemark}
                    <span style={{ color: '#888', marginLeft: 8, fontSize: 12 }}>{item.updateTime}</span>
                  </span>
                }
                description={<span style={{ color: '#aaa', fontSize: 12 }}>{item.glueType}</span>}
              />
            </List.Item>
          )}
        />
        {previewContent && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>内容预览：</div>
            <pre
              style={{
                background: '#f6f6f6',
                padding: 12,
                borderRadius: 4,
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              {previewContent}
            </pre>
          </div>
        )}
      </Drawer>
    </>
  )
}
