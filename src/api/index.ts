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

import apiClient from '@/api/apiClient.ts'
import { LoginParams } from '@/types/auth.ts'
import {
  ChartInfoParams,
  ChartInfoResponse,
  Job,
  JobCodeGlue,
  JobCodeSaveRequest,
  JobGroup,
  JobLog,
  Result,
  TDashboardTaskStats,
  User,
} from '@/types'

/**
 * API Request Management
 */
export default {
  user: {
    login(params: LoginParams) {
      return apiClient.post<Result>('/login', undefined, { params })
    },
    loginByLdap(params: LoginParams) {
      return apiClient.post<Result>('/r3/support/v1/login/ldap', undefined, { params })
    },
    logout() {
      return apiClient.post<Result>('/logout', undefined)
    },
    editPwd(params: User.EditPwdParams) {
      return apiClient.post<Result>('/user/updatePwd', undefined, { params })
    },
    getUserRole(userName: string) {
      return apiClient.post<Result>(`/r3/support/v1/user/role/${userName}`, undefined, apiClient.generateFormHeaders())
    },
    getUserList(params: User.UserPageQuery) {
      return apiClient.get<User.UserPageListResponse>('/user/pageList', undefined, { params })
    },
    getUserGroupPermissions() {
      return apiClient.get<Job.JobGroupPermissions>('/r3/support/v1/user/group/permissions', undefined, {})
    },
    deleteUser(params: { id: number }) {
      return apiClient.post<Result>('/user/remove', undefined, { params })
    },
    editUser(params: User.UserRecord) {
      return apiClient.post<Result>('/user/update', params, apiClient.generateFormHeaders())
    },
    createUser(params: User.UserRecord) {
      return apiClient.post<Result>('/user/add', params, apiClient.generateFormHeaders())
    },
  },

  dashboard: {
    getCartInfo(params: ChartInfoParams) {
      return apiClient.post<ChartInfoResponse>('/chartInfo', undefined, { params })
    },
    getJobRunningOverview() {
      return apiClient.get<TDashboardTaskStats>('/r3/support/v1/job/report/overview')
    },
  },

  job: {
    getJobInfoList(params: Job.JobGroupRequestParams) {
      return apiClient.post<Job.JobPageListResponse>('/jobinfo/pageList', params, apiClient.generateFormHeaders())
    },
    addJob(params: Job.JobItem) {
      return apiClient.post<Result>('/jobinfo/add', params, apiClient.generateFormHeaders())
    },
    editJob(params: Job.JobItem) {
      return apiClient.post<Result>('/jobinfo/update', params, apiClient.generateFormHeaders())
    },
    deleteJob(id: number) {
      return apiClient.post<Result>('/jobinfo/remove', { id }, apiClient.generateFormHeaders())
    },
    startJob(id: number | string) {
      return apiClient.post<Result>('/jobinfo/start', { id }, apiClient.generateFormHeaders())
    },
    stopJob(id: number | string) {
      return apiClient.post<Result>('/jobinfo/stop', { id }, apiClient.generateFormHeaders())
    },
    triggerJob(params: { id: number | string; executorParam: string; addressList: string }) {
      return apiClient.post<Result>('/jobinfo/trigger', params, apiClient.generateFormHeaders())
    },
    nextTriggerTime(params: { scheduleType: string; scheduleConf: string }) {
      return apiClient.post<Result<string[]>>('/jobinfo/nextTriggerTime', params, {
        ...apiClient.generateFormHeaders(),
      })
    },
  },

  jobCode: {
    addGlue(params: JobCodeSaveRequest) {
      return apiClient.post<Result>('/jobcode/save', params, apiClient.generateFormHeaders())
    },
    getGlueHistory(jobId: number) {
      return apiClient.get<Result<JobCodeGlue[]>>(
        '/r3/support/v1/job/glue/history',
        { jobId },
        apiClient.generateFormHeaders()
      )
    },
  },

  jobGroup: {
    getRegistryNode(id: number | string) {
      return apiClient.post<Result<JobGroup.Item>>('/jobgroup/loadById', { id }, apiClient.generateFormHeaders())
    },
    getJobGroups(params: JobGroup.PageParams) {
      return apiClient.post<JobGroup.PageResponse>('/jobgroup/pageList', params, apiClient.generateFormHeaders())
    },
    deleteGroup(id: number) {
      return apiClient.post<Result>('/jobgroup/remove', { id }, apiClient.generateFormHeaders())
    },
    editJobGroup(params: JobGroup.EditJobGroup) {
      return apiClient.post<Result>('/jobgroup/update', params, apiClient.generateFormHeaders())
    },
    addJobGroup(params: JobGroup.Item) {
      return apiClient.post<Result>('/jobgroup/save', params, apiClient.generateFormHeaders())
    },
  },

  logger: {
    getJobsByGroup(jobGroup: number | string) {
      return apiClient.post<Result<Job.JobItem[]>>(
        '/joblog/getJobsByGroup',
        { jobGroup },
        apiClient.generateFormHeaders()
      )
    },
    getLogList(params: JobLog.PageListParams) {
      return apiClient.post<JobLog.PageListResponse>('/joblog/pageList', params, apiClient.generateFormHeaders())
    },
    getLogDetailPage(id: number) {
      return apiClient.post('/joblog/logDetailPage', { id }, apiClient.generateFormHeaders())
    },
    getLogDetailCat(params: JobLog.LogDetailCatParams) {
      return apiClient.post<Result<JobLog.LogDetailCatResponse>>(
        '/joblog/logDetailCat',
        params,
        apiClient.generateFormHeaders()
      )
    },
    killLogPage(id: number) {
      return apiClient.post<Result<string>>('/joblog/logKill', { id }, apiClient.generateFormHeaders())
    },
    clearLog(params: JobLog.ClearLogParams) {
      return apiClient.post<Result>('/joblog/clearLog', params, apiClient.generateFormHeaders())
    },
  },
}
