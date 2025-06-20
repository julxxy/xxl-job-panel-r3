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

import React from 'react'

/**
 * 弹窗组件 Props
 */
export interface IModalProps {
  /**
   * 当前是否显示弹窗组件的 Ref 引用, 通过 useRef() 获取
   * @apiNote 发起弹窗请求的组件
   */
  parentRef: React.RefObject<ModalAction> | undefined
  /**
   * 数据发生变化时接受父组件传递的回调函数
   */
  onRefresh: () => void
}

/**
 * 弹窗组件的 Ref 引用
 */
export interface ModalAction {
  /**
   * 开启弹窗
   * @param action 操作行为
   * @param data 编辑或新增的数据，用于编辑时传递，显示
   */
  openModal: (action: IAction, data?: any) => void
  /**
   * 关闭弹窗: 子组件里面必须实现该方法
   */
  closeModal?: () => void
}

/**
 * 弹窗组件的操作行为
 */
export type IAction = 'create' | 'clone' | 'edit' | 'view'
