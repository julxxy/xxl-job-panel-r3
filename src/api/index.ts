import apiClient from '@/api/apiClient.ts'
import { LoginParams } from '@/types/auth.ts'
import {
  ChartInfoParams,
  ChartInfoResponse,
  Job,
  JobCodeGlue,
  JobCodeSaveRequest,
  JobGroup,
  Logger,
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
    logout() {
      return apiClient.post<Result>('/logout', undefined)
    },
    editPwd(params: User.EditPwdParams) {
      return apiClient.post<Result>('/user/updatePwd', undefined, { params })
    },
    getUserList(params: User.UserPageQuery) {
      return apiClient.get<User.UserPageListResponse>('/user/pageList', undefined, { params })
    },
    getUserGroupPermissions() {
      return apiClient.get<Job.JobGroupInfoPermissions>('/r3/support/v1/user/group/permissions', undefined, {})
    },
    deleteUser(params: { id: number }) {
      return apiClient.post<Result>('/user/remove', undefined, { params })
    },
    editUser(params: User.UserRecord) {
      return apiClient.post<Result>('/user/update', params, { ...apiClient.generateFormHeaders() })
    },
    createUser(params: User.UserRecord) {
      return apiClient.post<Result>('/user/add', params, { ...apiClient.generateFormHeaders() })
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
    getJobInfoList(params: Job.PageListParams) {
      return apiClient.post<Job.PageListResponse>('/jobinfo/pageList', params, { ...apiClient.generateFormHeaders() })
    },
    addJob(params: Job.JobItem) {
      return apiClient.post<Result>('/jobinfo/add', params, { ...apiClient.generateFormHeaders() })
    },
    editJob(params: Job.JobItem) {
      return apiClient.post<Result>('/jobinfo/update', params, { ...apiClient.generateFormHeaders() })
    },
    deleteJob(id: number) {
      return apiClient.post<Result>('/jobinfo/remove', { id }, { ...apiClient.generateFormHeaders() })
    },
    startJob(id: number | string) {
      return apiClient.post<Result>('/jobinfo/start', { id }, { ...apiClient.generateFormHeaders() })
    },
    stopJob(id: number | string) {
      return apiClient.post<Result>('/jobinfo/stop', { id }, { ...apiClient.generateFormHeaders() })
    },
    triggerJob(params: { id: number | string; executorParam: string; addressList: string }) {
      return apiClient.post<Result>('/jobinfo/trigger', params, { ...apiClient.generateFormHeaders() })
    },
    nextTriggerTime(params: { scheduleType: string; scheduleConf: string }) {
      return apiClient.post<Result<string[]>>('/jobinfo/nextTriggerTime', params, {
        ...apiClient.generateFormHeaders(),
      })
    },
  },

  jobCode: {
    addGlue(params: JobCodeSaveRequest) {
      return apiClient.post<Result>('/jobcode/save', params, { ...apiClient.generateFormHeaders() })
    },
    getGlueHistory(jobId: number) {
      return apiClient.get<Result<JobCodeGlue[]>>('/r3/support/v1/job/glue/history', { jobId }, { ...apiClient.generateFormHeaders() })
    },
  },

  jobGroup: {
    getRegistryNode(id: number | string) {
      return apiClient.post<Result<JobGroup.Item>>(
        '/jobgroup/loadById',
        { id },
        {
          ...apiClient.generateFormHeaders(),
        },
      )
    },
  },

  logger: {
    getJobsByGroup(jobGroup: number | string) {
      return apiClient.get<Result<JobGroup.Item>>(
        '/joblog/getJobsByGroup',
        { jobGroup },
        { ...apiClient.generateFormHeaders() },
      )
    },
    getLogDetails(params: Logger.LogDetailCatParams) {
      return apiClient.post<Result<Logger.LogDetailCatResponse>>('/joblog/logDetailCat', params, {
        ...apiClient.generateFormHeaders(),
      })
    },
  },
}
