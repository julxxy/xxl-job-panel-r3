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
import useZustandStore from '@/stores/useZustandStore.ts'
import React, { useEffect, useState } from 'react'
import api from '@/api'
import { TDashboardTaskStats } from '@/types'
import StatCard from '@/pages/dashboard/StatCard.tsx'

function ScheduleReportStats() {
  const { isDarkEnable } = useZustandStore()
  const [data, setData] = useState<TDashboardTaskStats | null>(null)

  const cardStyle = {
    '--bg-color-1': isDarkEnable ? '#03c988' : '#ec53b0',
    '--bg-color-2': isDarkEnable ? '#1c82ad' : '#9044c0',
    '--bg-color-3': isDarkEnable ? '#00327c' : '#4c2cb7',
    '--bg-color-4': isDarkEnable ? '#120059' : '#0e20a0',
  } as React.CSSProperties

  async function getRunningOverview() {
    const { content } = await api.dashboard.getJobRunningOverview()
    setData({ code: 0, data: undefined, msg: '', content })
  }

  useEffect(() => {
    getRunningOverview()
  }, [])

  return (
    <div className="rounded-xl">
      <CardHeader className="flex items-center justify-between sm:flex-row py-1">
        <div className="text-center sm:text-left">
          <CardTitle className="text-2xl font-semibold">运行概览</CardTitle>
        </div>
      </CardHeader>

      <div style={cardStyle} className="grid gap-6 md:grid-cols-4 py-4">
        {/* 使用 StatCard 组件来渲染每个卡片 */}
        <StatCard
          icon="📊"
          title={'任务总数'}
          value={data?.content?.jobInfoCount ?? 0}
          backgroundColor="var(--bg-color-1)"
        />
        <StatCard
          icon="📅"
          title="总调度次数"
          value={data?.content?.jobLogCount ?? 0}
          backgroundColor="var(--bg-color-2)"
        />
        <StatCard
          icon="🖥️"
          title="在线执行器"
          value={data?.content?.executorCount ?? 0}
          backgroundColor="var(--bg-color-3)"
        />
        <StatCard
          icon="✅"
          title="成功调度"
          value={data?.content?.jobLogSuccessCount ?? 0}
          backgroundColor="var(--bg-color-4)"
        />
      </div>
    </div>
  )
}

export default ScheduleReportStats
