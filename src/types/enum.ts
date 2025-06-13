import { isTrue } from '@/common/booleanUtils.ts'

/**
 * App environment
 */
export const Environment = {
  prod: 'production',
  dev: 'development',
  local: 'developer_local',
  current: import.meta.env.MODE,
  isProduction: (): boolean => Environment.current === Environment.prod,
  isNotProduction: (): boolean => Environment.current !== Environment.prod,
  isLocal: (): boolean => Environment.current === Environment.local,
  /**
   * 是否使用静态导航栏
   */
  isStaticMenuEnable: (): boolean => isTrue(import.meta.env.VITE_IS_STATIC_MENU_ENABLE),
  isLocaleCN: (): boolean => {
    const language = navigator.language || (navigator as any).userLanguage
    const isZhCN = language.toString().toLowerCase().includes('cn')
    return isTrue(isZhCN)
  },
} as const

/**
 * 调度类型
 */
export type ScheduleTypeEnum = 'NONE' | 'CRON' | 'FIX_RATE'
/**
 * 阻塞处理策略
 */
export type ExecutorBlockStrategy = 'SERIAL_EXECUTION' | 'DISCARD_LATER' | 'COVER_EARLY'

/**
 * Glue运行模式及示例
 */
export enum GlueTypeEnum {
  // 使用 Spring Bean 模式，调用已经注册的 JobHandler
  BEAN = 'BEAN', // 示例：handler = "demoJobHandler"
  // 使用 Groovy 脚本直接在调度中心编写逻辑
  GLUE_GROOVY = 'GLUE_GROOVY', // 示例：编写 Groovy 脚本并在调度中心保存执行
  // 执行 Shell 脚本
  GLUE_SHELL = 'GLUE_SHELL', // 示例：#!/bin/bash\necho "Hello from Shell script"
  // 执行 Python 脚本
  GLUE_PYTHON = 'GLUE_PYTHON', // 示例：print("Hello from Python")
  // 执行 PHP 脚本
  GLUE_PHP = 'GLUE_PHP', // 示例：<?php\necho "Hello from PHP";\n?>
  // 执行 Node.js 脚本
  GLUE_NODEJS = 'GLUE_NODEJS', // 示例：console.log("Hello from Node.js");
  // 执行 PowerShell 脚本（Windows 环境）
  GLUE_POWERSHELL = 'GLUE_POWERSHELL', // 示例：Write-Host "Hello from PowerShell"
}

// 配置映射：存储对应的字段信息
export const GlueTypeConfig: Record<
  GlueTypeEnum,
  {
    desc: string
    isScript: boolean
    cmd: string | null
    suffix: string | null
  }
> = {
  [GlueTypeEnum.BEAN]: {
    desc: 'Bean',
    isScript: false,
    cmd: null,
    suffix: null,
  },
  [GlueTypeEnum.GLUE_GROOVY]: {
    desc: 'GLUE(Java)',
    isScript: true,
    cmd: 'groovy',
    suffix: '.groovy',
  },
  [GlueTypeEnum.GLUE_SHELL]: {
    desc: 'GLUE(Shell)',
    isScript: true,
    cmd: 'bash',
    suffix: '.sh',
  },
  [GlueTypeEnum.GLUE_PYTHON]: {
    desc: 'GLUE(Python)',
    isScript: true,
    cmd: 'python',
    suffix: '.py',
  },
  [GlueTypeEnum.GLUE_PHP]: {
    desc: 'GLUE(PHP)',
    isScript: true,
    cmd: 'php',
    suffix: '.php',
  },
  [GlueTypeEnum.GLUE_NODEJS]: {
    desc: 'GLUE(Nodejs)',
    isScript: true,
    cmd: 'node',
    suffix: '.js',
  },
  [GlueTypeEnum.GLUE_POWERSHELL]: {
    desc: 'GLUE(PowerShell)',
    isScript: true,
    cmd: 'powershell',
    suffix: '.ps1',
  },
}

// glueType 映射语言
export const glueLangMap: Record<GlueTypeEnum, string> = {
  [GlueTypeEnum.BEAN]: 'text',
  [GlueTypeEnum.GLUE_GROOVY]: 'java',
  [GlueTypeEnum.GLUE_NODEJS]: 'javascript',
  [GlueTypeEnum.GLUE_PHP]: 'php',
  [GlueTypeEnum.GLUE_POWERSHELL]: 'powershell',
  [GlueTypeEnum.GLUE_PYTHON]: 'python',
  [GlueTypeEnum.GLUE_SHELL]: 'shell',
}

// 根据 value 返回 desc
export function getGlueTypeDesc(value: GlueTypeEnum): string | undefined {
  return GlueTypeConfig[value]?.desc ?? '未知'
}

/**
 * 路由策略（按使用频次排序）
 */
export enum ExecutorRouteStrategyEnum {
  ROUND = 'ROUND', // 轮询：最常用
  RANDOM = 'RANDOM', // 随机：常用于简单分发
  FIRST = 'FIRST', // 第一个：适合只有一个执行器或测试环境
  FAILOVER = 'FAILOVER', // 故障转移：较常用于高可用
  SHARDING_BROADCAST = 'SHARDING_BROADCAST', // 分片广播：分布式并行任务
  LEAST_FREQUENTLY_USED = 'LEAST_FREQUENTLY_USED', // 最不经常使用：动态调度
  LEAST_RECENTLY_USED = 'LEAST_RECENTLY_USED', // 最近最久未使用：资源平均
  CONSISTENT_HASH = 'CONSISTENT_HASH', // 一致性HASH：精细分发，适合幂等业务
  BUSYOVER = 'BUSYOVER', // 忙碌转移：负载均衡类场景
  LAST = 'LAST', // 最后一个：使用较少
}

export const ExecutorRouteStrategyI18n: Record<ExecutorRouteStrategyEnum, string> = {
  [ExecutorRouteStrategyEnum.ROUND]: '轮询',
  [ExecutorRouteStrategyEnum.RANDOM]: '随机',
  [ExecutorRouteStrategyEnum.FIRST]: '第一个',
  [ExecutorRouteStrategyEnum.FAILOVER]: '故障转移',
  [ExecutorRouteStrategyEnum.SHARDING_BROADCAST]: '分片广播',
  [ExecutorRouteStrategyEnum.LEAST_FREQUENTLY_USED]: '最不经常使用',
  [ExecutorRouteStrategyEnum.LEAST_RECENTLY_USED]: '最近最久未使用',
  [ExecutorRouteStrategyEnum.CONSISTENT_HASH]: '一致性HASH',
  [ExecutorRouteStrategyEnum.BUSYOVER]: '忙碌转移',
  [ExecutorRouteStrategyEnum.LAST]: '最后一个',
}

// 注册方式
export enum AddressType {
  Auto = 0, // 自动注册
  Manual = 1, // 手动录入
}

export const AddressTypeLabel: Record<AddressType, string> = {
  [AddressType.Auto]: '自动注册',
  [AddressType.Manual]: '手动录入',
}
