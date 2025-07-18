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

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import storage from '@/utils/storage.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'

import { IRequestConfig } from '@/types/axios-conf'
import URIs from '@/assets/URIs.json'
import { toast } from 'sonner'
import { ObjectUtils } from '@/common/ObjectUtils.ts'

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

    if (ObjectUtils.hasKey('code', response)) {
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
  location.href = `${URIs.auth.login}?callback=${encodeURIComponent(location.href)}`
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
