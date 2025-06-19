import { AntdTextInput } from '@/components/common/AntdTextInput.tsx'
import { AntdSelectInput } from '@/components/common/AntdSelectInput.tsx'
import { AntdTreeSelectInput } from '@/components/common/AntdTreeSelectInput.tsx'
import { AntdNumberInput } from '@/components/common/AntdNumberInput.tsx'
import { SearchBar } from '@/components/common/SearchBar.tsx'
import { Form, useForm } from 'react-hook-form'
import { AntdDatePicker } from '@/components/common/AntdDatePicker.tsx'

/**
 * 基础组件测试
 */
export default function ComponentsTest() {
  const form = useForm()
  const treeData: any[] = []

  return (
    <div>
      <SearchBar
        fields={[
          { type: 'input', key: 'username', placeholder: '账号搜索' },
          {
            type: 'select',
            key: 'status',
            placeholder: '请选择状态',
            options: [
              { label: '启用', value: 'active' },
              { label: '禁用', value: 'inactive' },
            ],
          },
          { type: 'rangePicker', key: 'dateRange' },
        ]}
        onSearch={() => {}}
        onReset={() => {}}
        initialValues={{
          keyword: '',
          status: undefined,
          dateRange: [],
        }}
        form={undefined}
      />

      <Form>
        <AntdTextInput name="username" control={form.control} label="用户名" required />
        <AntdDatePicker name="dob" control={form.control} label="出生日期" />
        <AntdSelectInput
          name="gender"
          control={form.control}
          label="性别"
          options={[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ]}
        />
        <AntdTreeSelectInput name="department" control={form.control} label="部门" treeData={treeData} />
        <AntdNumberInput name="age" control={form.control} label="年龄" min={0} max={100} />
      </Form>
    </div>
  )
}
