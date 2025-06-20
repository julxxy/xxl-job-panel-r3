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

// 校验 Cron 表达式（Quartz 7位，简单实现）
export function validateCronRule(_: any, value: string) {
  if (!value) return Promise.reject('请输入 Cron 表达式')
  const fields = value.trim().split(/\s+/)
  if (fields.length !== 7) return Promise.reject('Cron 表达式必须7位')
  // 这里可扩展更复杂语法
  return Promise.resolve()
}

// 校验运行速率为大于0的整数
export function validateFixRate(_: any, value: string) {
  if (!value) return Promise.reject('请输入运行速率')
  if (!/^[1-9]\d*$/.test(value)) return Promise.reject('请输入大于 0 的整数（秒）')
  return Promise.resolve()
}

// 校验任务超时时间为大于0的整数（可为空/0）
export function validateExecutorTimeout(_: any, value: any) {
  if (!value || value === 0) return Promise.resolve()
  if (!/^[1-9]\d*$/.test(value)) return Promise.reject('请输入大于0的整数秒数')
  return Promise.resolve()
}

// 校验失败重试次数为非负整数（可为空，最大10）
export function validateFailRetryCount(_: any, value: string) {
  if (value === undefined || value === '') return Promise.resolve()
  if (!/^\d+$/.test(value)) return Promise.reject('请输入非负整数')
  if (Number(value) > 10) return Promise.reject('失败重试次数建议不超过10次')
  return Promise.resolve()
}

// 校验JobHandler为Java方法名
export function validateJobHandler(_: any, value: string) {
  // 允许为空（未展示或非必填场景）
  if (value === undefined || value === '') return Promise.resolve()
  // 必须以小写字母开头，后续为字母或数字，长度2-64位
  const regex = /^[a-z][a-zA-Z0-9]{1,63}$/
  if (!regex.test(value)) {
    return Promise.reject(new Error('JobHandler 必须为2-64位Java方法名（小写字母开头，仅字母和数字）'))
  }
  return Promise.resolve()
}
