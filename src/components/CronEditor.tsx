/**
 * This file is part of xxl-job-panel-r3.
 *
 * Copyright (C) 2025 Julian
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
