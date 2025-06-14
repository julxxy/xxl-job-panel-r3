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
