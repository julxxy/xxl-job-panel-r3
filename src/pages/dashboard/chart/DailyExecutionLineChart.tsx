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

'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import useZustandStore from '@/stores/useZustandStore.ts'
import { ObjectUtils } from '@/common/ObjectUtils.ts'
import { isFalse } from '@/common/BooleanUtils.ts'
import { TriggerStats } from '@/types'
import api from '@/api'
import { formatDate } from 'date-fns/format'
import { rawDataOfDailyExecution } from '@/mock'

const chartConfig = {
  success: {
    label: '成功',
    color: 'hsl(var(--chart-1))',
  },
  running: {
    label: '进行中',
    color: 'hsl(var(--chart-2))',
  },
  failure: {
    label: '失败',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig

const rangeMap: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '60d': 60,
  '90d': 90,
  '180d': 180,
  '365d': 365,
}

const mockRangeMap: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '60d': 60,
  '90d': 90,
}

export function DailyExecutionLineChart() {
  const { chartData, setChartData } = useZustandStore()
  const { setChartTimeRange } = useZustandStore()

  const [timeRange, setTimeRange] = React.useState('30d')
  const useMock = isFalse(ObjectUtils.hasData(chartData?.triggerDayList))

  function getFilteredMockData() {
    return rawDataOfDailyExecution.filter(item => {
      const date = new Date(item.date)
      const referenceDate = new Date('2024-06-30')
      const daysToSubtract = mockRangeMap[timeRange] ?? 90
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })
  }

  function getChartDataFromApi(apiData: TriggerStats) {
    const { triggerDayList, triggerDayCountSucList, triggerDayCountRunningList, triggerDayCountFailList } = apiData
    return triggerDayList.map((date: string, index: number) => ({
      date,
      success: triggerDayCountSucList?.[index] ?? 0,
      running: triggerDayCountRunningList?.[index] ?? 0,
      failure: triggerDayCountFailList?.[index] ?? 0,
    }))
  }

  async function handleTimeRangeChange(timeRange: any) {
    setTimeRange(timeRange)
    const referenceDate = new Date()
    const daysToSubtract = rangeMap[timeRange] ?? 90
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    const params = {
      startDate: formatDate(startDate, 'yyyy-MM-dd 00:00:00'),
      endDate: formatDate(referenceDate, 'yyyy-MM-dd 23:59:59'),
    }
    const { content } = await api.dashboard.getCartInfo(params)

    setChartTimeRange(params)
    setChartData(content)
  }

  return (
    <Card className="flex">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>每日任务执行趋势</CardTitle>
          <CardDescription>展示最近 1 年内每日任务执行情况</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="选择时间范围">
            <SelectValue placeholder="请选择时间范围" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              最近 7 天
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              最近 30 天
            </SelectItem>
            <SelectItem value="60d" className="rounded-lg">
              最近 60 天
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              最近 90 天
            </SelectItem>
            <SelectItem value="180d" className="rounded-lg">
              最近 6 个月
            </SelectItem>
            <SelectItem value="365d" className="rounded-lg">
              最近 1 整年
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={useMock ? getFilteredMockData() : getChartDataFromApi(chartData)}>
            <defs>
              <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRunning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-running)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-running)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillFailure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-failure)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-failure)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value)
                return date.toLocaleDateString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                })
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  }}
                  indicator="dot"
                />
              }
            />

            <Area dataKey="success" type="natural" fill="url(#fillSuccess)" stroke="var(--color-success)" stackId="a" />
            <Area dataKey="running" type="natural" fill="url(#fillRunning)" stroke="var(--color-running)" stackId="a" />
            <Area dataKey="failure" type="natural" fill="url(#fillFailure)" stroke="var(--color-failure)" stackId="a" />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
