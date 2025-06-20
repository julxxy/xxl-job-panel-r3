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

import { isTrue } from '@/common/BooleanUtils.ts'

/**
 * Create Logger
 */
function createLogger(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' = 'info') {
  const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const
  const levelIndex = levels.indexOf(level)

  const levelColors: { [key in (typeof levels)[number]]: string } = {
    trace: 'color: gray',
    debug: 'color: blue',
    info: 'color: green',
    warn: 'color: orange',
    error: 'color: red',
    fatal: 'color: magenta',
  }
  const logMethod = (method: (typeof levels)[number], ...args: unknown[]) => {
    if (levels.indexOf(method) >= levelIndex) {
      const color = levelColors[method]
      // eslint-disable-next-line no-console
      console.log(`%c[${method.toUpperCase()}]%c`, color, '', ...args)
    }
  }

  return {
    trace: (...args: any[]) => logMethod('trace', ...args),
    debug: (...args: any[]) => logMethod('debug', ...args),
    info: (...args: any[]) => logMethod('info', ...args),
    warn: (...args: any[]) => logMethod('warn', ...args),
    error: (...args: any[]) => logMethod('error', ...args),
    fatal: (...args: any[]) => logMethod('fatal', ...args),
  }
}

/**
 * This function is used to check if the debug mode is enabled.
 */
function isDebugEnabled(): boolean {
  return isTrue(import.meta.env.VITE_IS_DEBUG_ENABLE)
}

/**
 * Check if debug mode is enabled
 */
export const isDebugEnable = isDebugEnabled()
/**
 * Create logger instance
 */
export const log = createLogger(isDebugEnable ? 'debug' : 'info')
