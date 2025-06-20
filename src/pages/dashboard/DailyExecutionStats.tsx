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

import { CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { DailyExecutionLineChart } from '@/pages/dashboard/chart/DailyExecutionLineChart.tsx'
import { ExecutionResultPieChart } from '@/pages/dashboard/chart/ExecutionResultPieChart.tsx'
import api from '@/api'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { ChartInfoParams } from '@/types'
import useZustandStore from '@/stores/useZustandStore.ts'

/**
 * 调度统计卡片
 * @constructor
 */
function DailyExecutionStats() {
  const { setChartData } = useZustandStore()

  // 获取最近30天的起止时间
  const endDate = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
  const startDate = dayjs().subtract(29, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const params = { startDate, endDate }

  // 异步获取图表数据
  const getCartInfo = async (params: ChartInfoParams) => {
    const { content } = await api.dashboard.getCartInfo(params)
    setChartData(content) // 异步获取到数据后设置状态
    return content
  }

  useEffect(() => {
    getCartInfo(params)
  }, [])

  return (
    <div className="rounded-xl w-full">
      <CardHeader className="flex items-center justify-between sm:flex-row py-1">
        <div className="text-center sm:text-left">
          <CardTitle className="text-2xl font-semibold">调度统计</CardTitle>
        </div>
      </CardHeader>
      <div className="flex gap-6 flex-col sm:flex-row mt-4">
        <div className="w-full sm:w-2/3">
          <DailyExecutionLineChart />
        </div>
        <div className="w-full sm:w-1/3">
          <ExecutionResultPieChart />
        </div>
      </div>
    </div>
  )
}

export default DailyExecutionStats
