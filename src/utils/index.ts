import dayjs, { Dayjs } from 'dayjs'
import { format as formatDate } from 'date-fns'
import { toast } from 'sonner'
import React from 'react'

/**
 * 安全解析数值
 */
const toNumeric = (value: string | number | bigint | undefined | null): number => {
  if (value === null || value === undefined || value === '') return NaN
  return typeof value === 'string' ? parseFloat(value) : Number(value)
}

/**
 * 格式化人民币金额
 */
const formatMoneyCNY = (amount?: string | number | bigint): string => {
  const numericAmount = toNumeric(amount)
  if (!Number.isFinite(numericAmount)) return 'Invalid amount'

  return new Intl.NumberFormat('zh-Hans-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

/**
 * 数字格式化（千分位，支持小数位数）
 */
const formatNumberWithComma = (num?: number | string | bigint, fractionDigits = 0): string => {
  const numericNum = toNumeric(num)
  if (!Number.isFinite(numericNum)) return 'Invalid number'

  return numericNum.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

/**
 * 计算日期差（天）
 */
const getDiffInDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffInMs = end.getTime() - start.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

/**
 * 将日期转为 Dayjs 实例
 */
const formatDateToDayjs = (date?: string | number | Date | Dayjs | null): Dayjs | null => {
  if (!date) return null
  const parsed = dayjs(date)
  return parsed.isValid() ? parsed : null
}

/**
 * 将 Dayjs 实例格式化为字符串
 */
const formatDayjsToDateString = (date?: string | number | Date | Dayjs | null): string => {
  const d = dayjs(date)
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : ''
}

/**
 * 格式化 Date 为指定字符串
 */
const formatDateToLocalString = (
  date?: Date | string,
  pattern: 'yyyy-MM-dd' | 'HH:mm:ss' | 'yyyy-MM-dd HH:mm:ss' | 'yyyyMMddHHmm' | 'yyyyMMddHHmmss' = 'yyyy-MM-dd HH:mm:ss'
): string => {
  const _date = date ? new Date(date) : new Date()
  if (isNaN(_date.getTime())) throw new Error('Invalid date')
  return formatDate(_date, pattern)
}

const handleCopy = (text: string, e?: React.MouseEvent) => {
  if (e) e.stopPropagation()
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success('已复制到剪贴板')
    })
    .catch(() => {
      toast.error('复制失败')
    })
}

export {
  toNumeric,
  formatMoneyCNY,
  formatNumberWithComma,
  getDiffInDays,
  formatDateToDayjs,
  formatDayjsToDateString,
  formatDateToLocalString,
  handleCopy,
}
