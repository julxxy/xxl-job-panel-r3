import React, { useState } from 'react'
import { ScheduleOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import Cron from '@/components/cron'

interface CronEditorProps {
  value: string
  onChange: (newValue: string) => void
}

/**
 * Cron 编辑组件（Modal 版，受控）
 */
const CronEditor: React.FC<CronEditorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="请选择或输入 Cron 表达式"
        addonAfter={
          <ScheduleOutlined
            onClick={e => {
              e.stopPropagation()
              setOpen(true)
            }}
            style={{ cursor: 'pointer' }}
          />
        }
        onClick={() => setOpen(true)}
        readOnly
      />
      <Modal
        title="Cron 表达式配置"
        open={open}
        onCancel={() => setOpen(false)}
        width="90vw"
        style={{ maxWidth: 550 }}
        centered
        footer={null}
      >
        <Cron
          value={value}
          style={{ width: 500 }}
          onOk={newValue => {
            if (isDebugEnable) log.info('用户选择的新 Cron 值：', newValue)
            onChange(newValue)
            setOpen(false)
          }}
        />
      </Modal>
    </>
  )
}

export default CronEditor
