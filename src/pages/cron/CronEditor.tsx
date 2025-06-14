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
          style={{ width: 520 }}
          onOk={newValue => {
            if (isDebugEnable) log.info('用户选择的新 Cron 值：', newValue)
            if (onChange) onChange(newValue)
          }}
        />
      )}
    >
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="请选择或输入 Cron 表达式"
        addonAfter={<ScheduleOutlined />}
      />
    </Dropdown>
  )
}
