'use client'

import { LabelList, Pie, PieChart } from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format } from 'date-fns'
import useZustandStore from '@/stores/useZustandStore.ts'
import { isFalse } from '@/common/BooleanUtils.ts'
import { ObjectUtils } from '@/common/ObjectUtils.ts'
import { getDiffInDays } from '@/utils'

// 模拟数据
const mockChartData = [
  { status: 'success', tasks: 320, fill: 'var(--color-success)' },
  { status: 'failed', tasks: 180, fill: 'var(--color-failed)' },
  { status: 'retrying', tasks: 95, fill: 'var(--color-retrying)' },
  { status: 'terminated', tasks: 60, fill: 'var(--color-terminated)' },
  { status: 'other', tasks: 30, fill: 'var(--color-other)' },
]

const chartConfig = {
  tasks: {
    label: '任务数',
  },
  success: {
    label: '成功',
    color: 'hsl(var(--chart-1))',
  },
  failed: {
    label: '失败',
    color: 'hsl(var(--chart-2))',
  },
  retrying: {
    label: '进行中',
    color: 'hsl(var(--chart-3))',
  },
  terminated: {
    label: '已终止',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: '其他',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function ExecutionResultPieChart() {
  const { chartData, chartTimeRange } = useZustandStore()
  const { startDate, endDate } = chartTimeRange

  const isMock = isFalse(ObjectUtils.hasData(chartData?.triggerDayList))

  const days = (() => {
    const diff = getDiffInDays(startDate, endDate)
    return diff > 0 ? diff : 30
  })()

  const timeRangeLabel = (() => {
    const end = new Date()
    const start = new Date(end)
    start.setDate(end.getDate() - days)
    return `${format(start, 'yyyy年MM月')} - ${format(end, 'yyyy年MM月')}`
  })()

  function getDataFromApi() {
    return [
      { status: 'success', tasks: chartData.triggerCountSucTotal, fill: 'var(--color-success)' },
      { status: 'failed', tasks: chartData.triggerCountFailTotal, fill: 'var(--color-failed)' },
      { status: 'retrying', tasks: chartData.triggerCountRunningTotal, fill: 'var(--color-retrying)' },
      { status: 'terminated', tasks: 1, fill: 'var(--color-terminated)' },
    ]
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>任务状态分布</CardTitle>
        <CardDescription>{timeRangeLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="tasks" hideLabel />} />
            <Pie data={isMock ? mockChartData : getDataFromApi()} dataKey="tasks">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        {/* 自定义图例区域 */}
        <div className="flex items-center justify-center gap-3">
          {/* 成功 */}
          <div className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-[var(--color-success)]" />
            <span className="text-xs text-muted-foreground">成功</span>
          </div>
          {/* 进行中 */}
          <div className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-[var(--color-retrying)]" />
            <span className="text-xs text-muted-foreground">进行中</span>
          </div>
          {/* 失败 */}
          <div className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-[var(--color-failed)]" />
            <span className="text-xs text-muted-foreground">失败</span>
          </div>
        </div>
        {/* 其他说明 */}
        <div className="leading-none text-muted-foreground">显示最近 {days} 天的任务数量</div>
      </CardFooter>
    </Card>
  )
}
