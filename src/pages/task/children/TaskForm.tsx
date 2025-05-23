import { Col, Form, Input, Row, Select } from 'antd'
import { glueLangMap, GlueTypeConfig, GlueTypeEnum } from '@/types/enum.ts'
import Editor from '@monaco-editor/react'
import { useState } from 'react'
import useZustandStore from '@/stores/useZustandStore.ts'
import { IAction } from '@/types/modal.ts'
import { FormInstance } from 'rc-field-form/es/interface'

interface TaskFormProps {
  action: IAction
  form: FormInstance
}

// 任务配置
export default function TaskForm({ action, form }: TaskFormProps) {
  const [editorCode, setEditorCode] = useState('')
  const { isDarkEnable } = useZustandStore()
  const monacoTheme = isDarkEnable ? 'vs-dark' : 'vs'
  const glueType = Form.useWatch('glueType', form) as GlueTypeEnum
  const showJobHandler = glueType === GlueTypeEnum.BEAN
  const glueTypeOptions = Object.entries(GlueTypeConfig).map(([value, config]) => ({
    label: config.desc,
    value: value as GlueTypeEnum,
  }))

  return (
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
  )
}
