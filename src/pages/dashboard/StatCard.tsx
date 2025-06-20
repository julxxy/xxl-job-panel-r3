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
import { formatNumberWithComma } from '@/utils'

type StatCardProps = {
  icon: string
  title: string
  value: number
  backgroundColor: string
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, backgroundColor }) => {
  return (
    <div style={{ backgroundColor }} className="aspect-video rounded-xl text-white px-6 py-2 border flex items-center">
      <div className="flex w-full">
        <div className="w-1/4 text-5xl flex items-center justify-center mr-2">{icon}</div>
        <div className="w-3/4 flex flex-col justify-center items-start text-left">
          <span className="text-base font-semibold">{title}</span>
          <span className="text-xl sm:text-2xl font-bold mt-1 truncate max-w-full block">
            {formatNumberWithComma(value ?? 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatCard
