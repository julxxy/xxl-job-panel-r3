import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import storage from '@/utils/storage.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'

import { IRequestConfig } from '@/types/axios-conf'
import { URIs } from '@/routes'
import { toast } from 'sonner'
import { objectUtils } from '@/common/objectUtils.ts'

/**
 * Instantiate an axios instance.
 * Basic config
 */
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor
 */
axiosClient.interceptors.request.use(
  config => {
    const token = storage.get<string>('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config

    if (
      config.responseType === 'blob' ||
      response.headers['content-type'] === 'blob' ||
      response.headers['content-type'] === 'application/octet-stream'
    ) {
      return response
    }

    const { data }: { data: any } = response
    const { code, msg } = data

    if (isDebugEnable) log.debug('原始返回：', data)

    if (objectUtils.hasKey('code', response)) {
      if (code === 500001) return handleSessionExpired(msg, data)
      if (code !== 200) return handleError(msg, data)
    }

    return data // 返回原始数据
  },
  error => {
    const { response } = error
    if (!response) {
      toast.error('网络异常，请检查网络连接')
      return Promise.reject(error)
    }
    return handleError(error.message, error)
  }
)

function handleError(_msg: string, data: any) {
  // toast.error(_msg || '请求出错')
  toast('出错了', {
    description: _msg || '未知错误',
    action: {
      label: '关闭',
      onClick: () => {},
    },
  })
  return Promise.reject(data)
}

// Logic for handling session expiration
function handleSessionExpired(_msg: string, data: any) {
  toast.error(_msg || '请求出错')
  storage.remove('token')
  location.href = `${URIs.login}?callback=${encodeURIComponent(location.href)}`
  return Promise.reject(data)
}

/**
 * Axios Configuration and Basic Encapsulation
 */
const apiClient = {
  get: function <T>(url: string, params?: any, options?: IRequestConfig): Promise<T> {
    return axiosClient.get(url, { params, ...options })
  },
  post: function <T>(url: string, data?: object, options?: IRequestConfig): Promise<T> {
    return axiosClient.post(url, data, options)
  },
  delete: function <T>(url: string, data?: any): Promise<T> {
    return axiosClient.delete(url, { data })
  },
  put: function <T>(url: string, data?: any): Promise<T> {
    return axiosClient.put(url, data)
  },
  generateAuthHeaders: function () {
    return {
      Authorization: `Bearer ${storage.get<string>('token')}`,
    }
  },
  generateFormHeaders: function () {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  },
}

export default apiClient
