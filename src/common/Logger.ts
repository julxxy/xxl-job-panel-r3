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
