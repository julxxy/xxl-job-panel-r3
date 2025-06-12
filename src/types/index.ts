import { ExecutorBlockStrategy, ScheduleTypeEnum } from '@/types/enum.ts'

// 返回包装
export interface Result<T = any> {
  code: number
  msg: string
  data?: T
  content?: T
}

// 分页包装
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

  export interface JobGroup {
    id: number
    appname: string
    title: string
    addressType: 0 | 1 // 0=自动注册、1=手动录入
    addressList: string // 多地址用逗号分隔
    updateTime: string // Date 通常以字符串格式传输（如 ISO 字符串）
    registryList?: string[] // 可由 addressList 派生
  }

  export interface JobGroupRequestParams {
    author: string | ''
    executorHandler: string | ''
    jobDesc: string
    jobGroup: number
    start?: number | 0 // 默认 0
    length?: number | 10 // 默认 10
    triggerStatus: number
  }

  export interface JobGroupPermissions extends Result {
    content: JobGroup[]
  }

  export type JobPageListResponse = PageResult<JobItem>
}

// 执行器
export namespace JobGroup {
  export interface Item {
    id: number // 可选，新增时可能没有
    appname: string // 应用名，长度 4~64，不能含有 <>，必填
    title: string // 标题，不能含有 <>，必填
    addressType: 0 | 1 // 0=自动注册，1=手动录入
    addressList?: string // 多地址逗号分隔，仅当 addressType != 0 时必填
    updateTime?: string // 可选，由后端赋值
    registryList?: string[] // 前端可解析字段
  }

  export interface PageParams {
    start?: number // 默认 0
    length?: number // 默认 10
    appname: string
    title: string
  }

  export interface EditJobGroup {
    id: number | undefined // 可选，新增时可能没有
    appname: string // 应用名，长度 4~64，不能含有 <>，必填
    title: string // 标题，不能含有 <>，必填
    addressType: 0 | 1 // 0=自动注册，1=手动录入
    addressList?: string // 多地址逗号分隔，仅当 addressType != 0 时必填
  }

  export type PageResponse = PageResult<Item>
}

// 任务日志
export namespace JobLog {
  export interface Item {
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
    jobGroup: number | string
    jobId: number | string
    logStatus: number | string
    filterTime: string
  }

  export type PageListResponse = PageResult<Item>

  export interface LogDetailCatParams {
    logId: number
    fromLineNum: number
    _jobGroupLabel: string
    _jobIdLabel?: string
  }

  export interface LogDetailCatResponse {
    logContent: string
    fromLineNum: number
    end: boolean
    toLineNum: number
  }

  export interface ClearLogParams {
    jobGroup: number | string
    jobId: number | string
    type: number
  }
}

export interface JobCodeSaveRequest {
  id: number // 任务ID
  glueSource: string // 源代码内容
  glueRemark: string // 本次更新备注，4~100 字符
}

export interface JobCodeGlue {
  id: number
  jobId: number
  glueType: string
  glueSource: string
  glueRemark: string
  addTime: string // 建议用 string（ISO 时间格式）
  updateTime: string
}

export interface ChartInfoParams {
  startDate: string //  格式：yyyy-MM-dd HH:mm:ss
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
