// import { Col, Form, Input, Row, Select } from 'antd'
// import CronEditor from '@/pages/cron/CronEditor.tsx'
// import { log } from '@/common/Logger.ts'
// import { ScheduleTypeEnum } from '@/types/enum.ts'
//
// interface ScheduleFormProps {
//   scheduleType: ScheduleTypeEnum
// }
//
// // 调度配置
// export default function ScheduleForm({ scheduleType }: ScheduleFormProps) {
//   return (
//     <Row gutter={16}>
//       <Col span={12}>
//         <Form.Item label="调度类型" name="scheduleType" rules={[{ required: true, message: '请选择调度类型' }]}>
//           <Select
//             placeholder="请选择类型"
//             options={[
//               { label: '无', value: 'NONE' },
//               { label: 'CRON', value: 'CRON' },
//               { label: '固定速率', value: 'FIX_RATE' },
//             ]}
//           />
//         </Form.Item>
//       </Col>
//
//       {/* 条件渲染：根据调度类型展示不同的配置项 */}
//       {scheduleType === 'CRON' && (
//         <Col span={12}>
//           <Form.Item label="Cron" name="scheduleConf" rules={[{ required: true, message: '请输入 Cron 表达式' }]}>
//             <CronEditor onChange={() => log.info('cron')} value="" />
//           </Form.Item>
//         </Col>
//       )}
//
//       {scheduleType === 'FIX_RATE' && (
//         <Col span={12}>
//           <Form.Item label="运行速率" name="scheduleConf" rules={[{ required: true, message: '请输入运行速率' }]}>
//             <Input placeholder="请输入 ( Second )" />
//           </Form.Item>
//         </Col>
//       )}
//     </Row>
//   )
// }
