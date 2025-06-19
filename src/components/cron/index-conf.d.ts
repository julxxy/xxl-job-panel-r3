import React from 'react'

/**
 * Cron 组件的 Props 类型定义
 */
export interface ICronProps {
  /**
   * Cron 表达式，用于初始化组件的值
   */
  value?: string

  /**
   * 自定义组件的外层样式（容器样式）
   */
  style?: React.CSSProperties

  /**
   * 自定义底部按钮区域的样式
   */
  footerStyle?: React.CSSProperties

  /**
   * 自定义底部栏渲染函数（用于替换默认按钮）
   * @param onReset 重置按钮触发的函数
   * @param onGenerate 生成按钮触发的函数
   */
  footerRenderer?: (onReset: () => void, onGenerate: () => void) => React.ReactNode

  /**
   * 用户点击“生成”按钮时的回调
   * @param value 当前生成的 cron 表达式
   */
  onOk?: (value: string) => void
}

/**
 * Cron 表达式选择组件
 */
declare const Cron: React.FC<ICronProps>

export default Cron
