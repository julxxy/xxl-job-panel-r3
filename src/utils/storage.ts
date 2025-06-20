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
