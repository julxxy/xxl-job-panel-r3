/**
 * 对 axios 的类型扩展
 */
import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** 是否显示加载提示 */
    showLoading?: boolean
    /** 是否显示错误提示 */
    showError?: boolean
  }
}

export type IRequestConfig = AxiosRequestConfig
