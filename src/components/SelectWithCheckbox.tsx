import React, { useMemo, useState } from 'react'
import { Checkbox, Col, Radio, Row, Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/button.tsx'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { ResetIcon } from '@radix-ui/react-icons'

export interface OptionType {
  label: string
  value: string | number
}

export interface ISelectWithCheckboxProps<T extends Record<string, any> = OptionType> {
  value?: T['value'][] // 用于 Form.Item 自动绑定
  onChange?: (value: T['value'][]) => void
  options: T[]
  placeholder?: string
  labelKey?: keyof T
  valueKey?: keyof T
  mode?: 'single' | 'multiple'
}

/**
 * 下拉框+复选框组件
 * @example
 * <Form
 *   layout="horizontal"
 *   form={form}
 *   labelCol={{ span: 4 }}
 *   wrapperCol={{ span: 20 }}
 *   initialValues={{ role: 0 }}
 *   className="space-y-5"
 * >
 *   <Form.Item name="id" hidden>
 *     <Input placeholder="用户ID" />
 *   </Form.Item>
 *
 *   <Form.Item name="role" label="角色" rules={[{ required: true }]}>
 *     <Radio.Group block buttonStyle={'outline'}>
 *       <Radio.Button value={1}>管理员</Radio.Button>
 *       <Radio.Button value={0}>普通用户</Radio.Button>
 *     </Radio.Group>
 *   </Form.Item>
 *
 *   {roleValue === 0 && (
 *     <Form.Item name="permission" label="权限（多选）" rules={[{ required: true, message: '请选择至少一项' }]}>
 *       <SelectWithCheckbox<Job.JobGroupInfo>
 *         placeholder="请选择权限/搜索权限"
 *         options={jobGroup}
 *         labelKey="title"
 *         valueKey="id"
 *       />
 *     </Form.Item>
 *   )}
 * </Form>
 */
export default function SelectWithCheckbox<T extends Record<string, any> = OptionType>({
  value = [],
  onChange,
  options,
  placeholder = '请选择',
  labelKey = 'label',
  valueKey = 'value',
  mode = 'multiple',
}: ISelectWithCheckboxProps<T>) {
  if (isDebugEnable) log.info('SelectWithCheckbox: ', JSON.stringify(value))
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      String(opt[labelKey] ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, options, labelKey])

  const updateValue = (newValue: T['value'][]) => {
    if (mode === 'single') {
      onChange?.(newValue.slice(0, 1)) // 单选只保留一个
    } else {
      onChange?.(newValue)
    }
  }

  const handleClearAll = () => {
    updateValue([])
  }

  const handleSelectAll = () => {
    updateValue(filteredOptions.map(opt => opt[valueKey]) as T['value'][])
  }

  // 自定义下拉内容（含复选框）
  const CustomDropdown = () => {
    const allSelected = value.length === filteredOptions.length && filteredOptions.length > 0
    const isIndeterminate = value.length > 0 && value.length < filteredOptions.length

    return (
      <div
        style={{
          padding: 8,
          maxHeight: 350,
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {mode === 'multiple' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 14, color: '#888' }}>
              <Checkbox
                style={{ fontSize: 16, fontWeight: 500, marginRight: 4 }}
                indeterminate={isIndeterminate}
                checked={allSelected}
                onChange={e => {
                  if (e.target.checked) handleSelectAll()
                  else handleClearAll()
                }}
              >
                全选
              </Checkbox>
              已选择 {value.length} 项 / 共 {options.length} 项
            </div>
            <Button size="sm" variant="outline" style={{ marginRight: 4 }} onClick={handleClearAll}>
              <ResetIcon />
              清空选择
            </Button>
          </div>
        )}

        {mode === 'multiple' ? (
          <Checkbox.Group value={value} onChange={updateValue}>
            <Row gutter={[8, 8]}>
              {filteredOptions.map(item => (
                <Col span={6} key={String(item[valueKey])}>
                  <Checkbox value={item[valueKey]}>{item[labelKey] as string}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        ) : (
          <Radio.Group value={value[0] ?? null} onChange={e => updateValue([e.target.value])} style={{ width: '100%' }}>
            <Row gutter={[8, 8]}>
              {filteredOptions.map(item => (
                <Col span={6} key={String(item[valueKey])}>
                  <Radio value={item[valueKey]}>{item[labelKey] as string}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        )}
      </div>
    )
  }

  return (
    <Select
      mode={mode === 'multiple' ? 'multiple' : undefined}
      value={value}
      open={open}
      onOpenChange={setOpen}
      popupRender={CustomDropdown}
      style={{ width: '100%' }}
      placeholder={placeholder}
      onSearch={setSearchTerm}
      filterOption={false}
      tagRender={({ value: tagValue }) => {
        if (mode === 'single') return <></>
        const currentItem = options.find(opt => opt[valueKey] === tagValue)
        if (!currentItem) return <span />

        const handleClose = (e: React.MouseEvent) => {
          e.preventDefault()
          const newVal = value.filter(v => v !== tagValue)
          onChange?.(newVal as T['value'][])
        }

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 6px',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              marginRight: 4,
            }}
          >
            {currentItem[labelKey] as string}
            <CloseOutlined style={{ marginLeft: 4, fontSize: 10, cursor: 'pointer' }} onClick={handleClose} />
          </span>
        )
      }}
      options={filteredOptions.map(opt => ({
        label: opt[labelKey],
        value: opt[valueKey],
      }))}
      maxTagCount={undefined}
    />
  )
}
