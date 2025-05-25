import { ExecutorBlockStrategy, ScheduleTypeEnum } from '@/types/enum.ts'

// 返回包装
export interface Result<T = any> {
  code: number
  msg: string
  data?: T
  content?: T
}

// 分页
export interface PageResult<T = any> {
  recordsTotal: number
  recordsFiltered: number
  data: T[]
}

// 用户
export namespace User {
  export interface Info {
    id?: string
    username: string
  }

  export interface UserPageQuery {
    start?: number // 分页起始位置，默认 0
    length?: number // 分页长度，默认 10
    username?: string | '' // 用户名，必填
    role?: number | '-1' // 用户角色，可选：0 = 普通用户，1 = 管理员
  }

  export type UserPageListResponse = PageResult<UserRecord>

  export interface UserRecord {
    id: number
    username: string
    password?: string | null
    role: number // 0: 普通用户, 1: 管理员
    permission?: string | number[] | string[] | null
  }

  export interface EditPwdParams {
    password: string
    oldPassword: string
  }

  export interface UserCreateParams {
    username: string
    password: string
    role: number
    permission?: string
  }

  export interface UserUpdateParams {
    password: string
    role: number
    permission: string
    id: number
    username: string
  }

  export interface UserDeleteParams {
    id: number
  }
}

// 任务
export namespace Job {
  export interface JobItem {
    addTime: string // 格式如 "2025-05-04 20:49:26"
    alarmEmail: string
    author: string
    childJobId: string
    executorBlockStrategy: string
    executorFailRetryCount: number
    executorHandler: string
    executorParam: string
    executorRouteStrategy: ExecutorBlockStrategy
    executorTimeout: number
    glueRemark: string
    glueSource: string
    glueType: string
    glueUpdatetime: string
    id: number
    jobDesc: string
    jobGroup: number
    misfireStrategy: string
    scheduleConf: string
    scheduleType: ScheduleTypeEnum
    triggerLastTime: number
    triggerStatus: number
    updateTime: string
    triggerNextTime: number
    _jobGroupOptions: any[]
  }

  export interface JobGroupInfo {
    id: number
    appname: string
    title: string
    addressType: 0 | 1 // 0=自动注册、1=手动录入
    addressList: string // 多地址用逗号分隔
    updateTime: string // Date 通常以字符串格式传输（如 ISO 字符串）
    registryList?: string[] // 可由 addressList 派生
  }

  export interface PageListParams {
    author: string | ''
    executorHandler: string | ''
    jobDesc: string
    jobGroup: number
    start?: number | 0 // 默认 0
    length?: number | 10 // 默认 10
    triggerStatus: number
  }

  export interface JobGroupInfoPermissions extends Result {
    content: JobGroupInfo[]
  }

  export function getRegistryList(info: JobGroupInfo): string[] {
    return info.addressList?.trim() ? info.addressList.split(',') : []
  }

  export interface HomePageParams {
    jobGroup?: number // 可选，可以为 -1 或其他 number
  }

  export interface HomePageResponse {
    JobGroupList: JobGroupInfo[]
    jobGroup: string
  }

  export type PageListResponse = PageResult<JobItem>

  export interface RemoveJobParams {
    id: number
  }

  export interface PauseJobParams {
    id: number
  }

  export interface StartJobParams {
    id: number
  }

  export interface StopJobParams {
    id: number
  }
}

export namespace Trigger {
  export interface TriggerJobParams {
    id: number
    executorParam: string
    addressList: string
  }

  export interface NextTriggerTimeParams {
    scheduleType: string
    scheduleConf: string
  }

  export type NextTriggerTimeResponse = Result<string[]>
}

export namespace JobGroup {
  export interface Item {
    id?: number // 可选，新增时可能没有
    appname: string // 应用名，长度 4~64，不能含有 <>，必填
    title: string // 标题，不能含有 <>，必填
    addressType: number // 0=自动注册，1=手动录入
    addressList?: string // 多地址逗号分隔，仅当 addressType != 0 时必填
    updateTime?: string // 可选，由后端赋值
  }

  export interface AddJobGroup extends Item {
    addressType: 0 | 1 // 0=自动注册，1=手动录入
    registryList?: string[] // 前端可解析字段
  }

  export interface JobGroupPageParams {
    start?: number // 默认 0
    length?: number // 默认 10
    appname: string
    title: string
  }

  export type JobGroupPageResponse = PageResult<Item>
  export type EditJobGroup = Item
  export type LoadJobGroupResponse = Result<Item>
}

export namespace JobLog {
  export interface JobHome {
    jobId?: number
  }

  export interface JobGroup {
    jobGroup?: number
  }

  export interface JobGroupResponse {
    jobList?: Job.JobItem[]
  }
}

// 任务日志
export namespace Logger {
  export interface LogItem {
    alarmStatus: number
    executorAddress: string
    executorFailRetryCount: number
    executorHandler: string
    executorParam: string
    executorShardingParam: string
    handleCode: number
    handleMsg: string
    handleTime: string
    id: number
    jobGroup: number
    jobId: number
    triggerCode: number
    triggerMsg: string
    triggerTime: string
  }

  export interface PageListParams {
    start?: number // 默认值是 0，可选
    length?: number // 默认值是 10，可选
    jobGroup: number
    jobId: number
    logStatus: number
    filterTime: string
  }

  export type PageListResponse = PageResult<LogItem>

  export interface LogDetailPageParams {
    id: number
  }

  export interface LogDetailPageResponse {
    triggerCode: number
    handleCode: number
    logId: number
  }

  export interface LogDetailCatParams {
    logId: number
    fromLineNum: number
  }

  export interface LogDetailCatResponse {
    logContent: string
    fromLineNum: number
    isEnd: boolean
    toLineNum: number
  }

  export interface LogKillParams {
    id: boolean
  }

  export interface ClearLogParams {
    jobGroup: number
    jobId: number
    type: number
  }
}

export interface JobCodeSaveRequest {
  id: number // 任务ID
  glueSource: string // 源代码内容
  glueRemark: string // 本次更新备注，4~100 字符
}

export interface XxlJobLogGlue {
  id: number
  jobId: number
  glueType: string
  glueSource: string
  glueRemark: string
  addTime: string // 建议用 string（ISO 时间格式）
  updateTime: string
}

export interface JobCodeHomeResponse {
  GlueTypeEnum: string
  jobInfo: Job.JobItem
  jobLogGlues: XxlJobLogGlue[]
}

export interface ChartInfoParams {
  // startDate: 2025-04-05 00:00:00
  startDate: string //  格式：yyyy-MM-dd HH:mm:ss
  // endDate: 2025-05-05 23:59:59
  endDate: string
}

export type DateString = `${number}-${number}-${number}`

export interface TriggerStats {
  triggerCountFailTotal: number
  triggerCountRunningTotal: number
  triggerCountSucTotal: number
  triggerDayCountFailList: number[]
  triggerDayCountRunningList: number[]
  triggerDayCountSucList: number[]
  triggerDayList: DateString[]
}

export interface ChartInfoResponse extends Result {
  content: TriggerStats
}

export interface TDashboardTaskStats extends Result {
  content: {
    jobInfoCount: number | 0
    jobLogCount: number | 0
    executorCount: number | 0
    jobLogSuccessCount: number | 0
  }
}
