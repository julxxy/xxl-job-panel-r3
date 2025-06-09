import { DatePicker, Form, Input, Select, TimeRangePickerProps } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/button'
import React, { FormEventHandler, MouseEventHandler, useState } from 'react'
import { RotateCcw, SearchIcon } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { RangePickerProps } from 'antd/es/date-picker'

const { RangePicker } = DatePicker

export type SearchField =
  | {
      type: 'input'
      key: string
      label?: string
      placeholder?: string
    }
  | {
      type: 'select'
      key: string
      label?: string
      placeholder?: string
      options: { label: string; value: any }[]
    }
  | {
      type: 'rangePicker'
      key: string
      label?: string | '日期范围'
      placeholder?: ['开始日期', '结束日期']
      timeFormat?: string | 'YYYY/MM/DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss'
      showTime?: boolean
      showPresets?: boolean
      rangePresets?: TimeRangePickerProps['presets']
    }

export type ActionButton = {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: () => void | MouseEventHandler<any> | undefined
  variant?: 'default' | 'outline' | 'ghost'
}

export interface SearchBarProps {
  fields: SearchField[]
  form: any
  onSearch: () => void
  onReset?: () => void
  onChange?: FormEventHandler<any> | undefined // onChange 指定时 onSearch 不建议使用
  initialValues?: Record<string, any>
  buttons?: ActionButton[]
}

/**
 * 搜索框高阶组件
 * @param fields 字列表
 * @param form Antd 表单
 * @param initialValues 初始值
 * @param onSearch 搜索回调函数
 * @param onReset 重置回调函数
 * @param onChange 搜索字段改变时回调
 * @param buttons 自定义按钮, 永远处于[搜索]和[重置]按钮的中间
 */
export function SearchBar({ fields, form, initialValues, onSearch, onReset, onChange, buttons = [] }: SearchBarProps) {
  const [expand, setExpand] = useState(false)
  const needExpand = fields.length > 2

  const handleRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      if (isDebugEnable) log.debug('From: ', dates[0], ', to: ', dates[1])
      if (isDebugEnable) log.debug('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      if (isDebugEnable) log.debug('Clear')
    }
  }

  // 预设时间区间
  const rangePresets: RangePickerProps['presets'] = [
    {
      label: <span aria-label="当前~今日结束">当前~今日结束</span>,
      value: () => [dayjs(), dayjs().endOf('day')],
    },
    {
      label: '近1小时',
      value: [dayjs().subtract(1, 'hour'), dayjs()],
    },
    {
      label: '昨天',
      value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    },
    {
      label: '近7天',
      value: [dayjs().subtract(7, 'day').startOf('day'), dayjs()],
    },
    {
      label: '近14天',
      value: [dayjs().subtract(14, 'day').startOf('day'), dayjs()],
    },
    {
      label: '近30天',
      value: [dayjs().subtract(30, 'day').startOf('day'), dayjs()],
    },
    {
      label: '近90天',
      value: [dayjs().subtract(90, 'day').startOf('day'), dayjs()],
    },
    {
      label: '近180天',
      value: [dayjs().subtract(180, 'day').startOf('day'), dayjs()],
    },
    {
      label: '近365天',
      value: [dayjs().subtract(365, 'day').startOf('day'), dayjs()],
    },
  ]

  const renderField = (field: SearchField) => (
    <Form.Item name={field.key} label={field.label} className="w-full" style={{ marginBottom: 0 }}>
      {(() => {
        switch (field.type) {
          case 'input':
            return <Input placeholder={field.placeholder || '请输入'} className="w-full" />
          case 'select':
            return (
              <Select
                className="w-full"
                showSearch={field.options.length > 10}
                allowClear
                options={field.options}
                placeholder={field.placeholder || '请选择'}
                optionFilterProp="label"
                filterOption={(input, option) => {
                  const label = option?.label?.toString()?.toLowerCase() || ''
                  const value = option?.value?.toString()?.toLowerCase() || ''
                  const keyword = input.toLowerCase()
                  return label.includes(keyword) || value.includes(keyword)
                }}
              />
            )
          case 'rangePicker': {
            // 计算是否显示预设
            const shouldShowPresets = !!field.showPresets
            const hasCustomPresets = Array.isArray(field.rangePresets) && field.rangePresets.length > 0

            const presets: RangePickerProps['presets'] | undefined = shouldShowPresets
              ? hasCustomPresets
                ? field.rangePresets
                : rangePresets
              : undefined

            return (
              <RangePicker
                {...(presets ? { presets } : {})}
                className="w-full"
                onChange={handleRangeChange}
                showTime={field.showTime}
                format={field.timeFormat}
                placeholder={field.placeholder || ['开始日期', '结束日期']}
              />
            )
          }
          default:
            return null
        }
      })()}
    </Form.Item>
  )

  const renderButtons = (isExpandButtonAtEnd = false) => {
    const className = `flex flex-col sm:flex-row gap-2 ${isExpandButtonAtEnd ? 'justify-end w-full' : ''}`

    const expandToggle = needExpand && (
      <Button variant="ghost" onClick={() => setExpand(!expand)} className="flex items-center">
        {expand ? <UpOutlined /> : <DownOutlined />}
        <span className="ml-1">{expand ? '收起' : '展开更多'}</span>
      </Button>
    )

    const searchButton = (
      <Button key="search" variant="default" onClick={onSearch} onChange={onChange}>
        <SearchIcon className="mr-1" />
        搜索
      </Button>
    )

    const actionButtons = buttons.map(btn => (
      <Button key={btn.key} variant={btn.variant || 'default'} onClick={btn.onClick}>
        {btn.icon}
        {btn.label}
      </Button>
    ))

    const resetButton = (
      <Button
        key="reset"
        variant="ghost"
        onClick={() => {
          if (onReset) {
            onReset()
          } else {
            form.resetFields()
          }
        }}
      >
        <RotateCcw />
        重置
      </Button>
    )

    return (
      <div className={className}>
        {expandToggle}
        {searchButton}
        {actionButtons}
        {resetButton}
      </div>
    )
  }

  return (
    <div className="bg-background p-4 rounded-md shadow-sm mt-1">
      <Form form={form} layout="horizontal" initialValues={initialValues} className="flex flex-col">
        {/* 折叠状态 */}
        {!expand && (
          <div className="flex flex-wrap gap-y-3 gap-x-4 items-end">
            {fields.slice(0, 2).map(field => (
              <div key={field.key} className="w-full sm:w-[240px]">
                {renderField(field)}
              </div>
            ))}
            <div className="flex-1" />
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end w-full sm:w-auto">{renderButtons()}</div>
          </div>
        )}

        {/* 展开状态 */}
        {expand && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {fields.map(field => (
                <div key={field.key} className="w-full">
                  {renderField(field)}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">{renderButtons(true)}</div>
          </>
        )}
      </Form>
    </div>
  )
}
