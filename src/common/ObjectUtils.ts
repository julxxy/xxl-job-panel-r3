/**
 * Common utility functions used across the project.
 */
export const ObjectUtils = {
  /**
   * 判断数据是否包含有效内容
   */
  hasData(data: unknown): boolean {
    if (Array.isArray(data)) {
      return data.length > 0
    }
    if (typeof data === 'string') {
      return data.trim().length > 0
    }
    if (data instanceof Map || data instanceof Set) {
      return data.size > 0
    }
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).length > 0
    }
    return Boolean(data)
  },

  /**
   * 判断对象或数组是否包含指定 key
   */
  hasKey(key: string | number, data: unknown): boolean {
    if (data === null || data === undefined) return false

    if (typeof data === 'object') {
      return key in data
    }

    if (Array.isArray(data) && typeof key === 'number') {
      return key >= 0 && key < data.length
    }

    return false
  },

  /**
   * 判断数据中指定 key 的值是否有效（非空、非 falsy）
   */
  hasValue(key: string | number, data: unknown): boolean {
    if (Array.isArray(data) && typeof key === 'number') {
      return key >= 0 && key < data.length && this.hasData(data[key])
    }

    if (typeof data === 'object' && data !== null && key in data) {
      // @ts-ignore
      return this.hasData(data[key])
    }

    return false
  },
}
