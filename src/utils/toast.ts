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

import { toast as sonnerToast } from 'sonner'
import { message as antdMsg } from '@/common/AntdProvider.ts'

const toast = {
  success: (msg: string, useAntd?: boolean) => {
    if (useAntd) {
      antdMsg.success(msg)
    } else {
      sonnerToast.success(msg)
    }
  },
  error: (msg: string, useAntd?: boolean) => {
    if (useAntd) {
      antdMsg.error(msg)
    } else {
      sonnerToast.error(msg)
    }
  },
  warning(msg: string, useAntd?: boolean) {
    if (useAntd) {
      antdMsg.warning(msg)
    } else {
      sonnerToast.error(msg)
    }
  },
}

function handleToastMsg(code: number, msg: string) {
  if (code !== 200) {
    toast.error(msg || 'Error!')
  } else {
    toast.success('SUCCESS')
  }
}

export { toast, handleToastMsg }
