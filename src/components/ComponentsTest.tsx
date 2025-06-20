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
