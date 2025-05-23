// 高级配置
import { Card, Col, Form, Input, Row, Select } from 'antd'
import { ExecutorRouteStrategyI18n } from '@/types/enum.ts'

export default function AdvancedForm() {
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
