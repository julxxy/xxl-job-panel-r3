import { ScheduleOutlined } from '@ant-design/icons'
import { Dropdown, Input } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import Cron from '@/components/cron'

/**
 * Cron 编辑组件
 */
export default function CronEditor(props: { value: string; onChange: (newValue: string) => void }) {
  const { value, onChange } = props

  return (
    <Dropdown
      trigger={['click']}
      popupRender={() => (
        <Cron
          value={value}
          onOk={(newValue: string) => {
            if (isDebugEnable) log.info('用户选择的新 Cron 值：', newValue)
            onChange(newValue)
          }}
        />
      )}
    >
      <Input value={value} placeholder="请选择一个 Cron 表达式来配置定时任务" addonAfter={<ScheduleOutlined />} />
    </Dropdown>
  )
}
