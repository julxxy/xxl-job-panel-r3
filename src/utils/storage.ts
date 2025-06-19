import { log } from '@/common/Logger.ts'

/**
 * localStorage 工具类
 */
export default {
  /**
   * 设置 localStorage 值
   * @param key 键
   * @param value 值
   */
  set: <T>(key: string, value: T): void => {
    if (null === value || undefined === value || '' === value) {
      log.warn(`Cannot set localStorage value for key ${key} with falsy value ${value}`)
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * 获取 localStorage 值
   * @param key 键
   * @returns 值或 null
   */
  get: <T>(key: string): T | null => {
    try {
      const jsonValue: string | null = localStorage.getItem(key)
      return jsonValue ? JSON.parse(jsonValue) : null
    } catch (error) {
      log.error(`Error getting value from localStorage: ${error}`)
      return localStorage.getItem(key) as T
    }
  },

  /**
   * 移除 localStorage 值
   * @param key 键
   */
  remove: (key: string): void => {
    localStorage.removeItem(key)
  },

  /**
   * 清空 localStorage 值
   */
  clear: (): void => {
    localStorage.clear()
  },
}
