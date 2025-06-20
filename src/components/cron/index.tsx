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

import { Button, Card, message, Space, Tabs } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { JSXElementConstructor, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'
import { dayRegex, hourRegex, minuteRegex, monthRegex, secondRegex, weekRegex, yearRegex } from './utils/cronRegex.ts'
import DayPane from './DayPane'
import HourPane from './HourPane'
import MinutePane from './MinutePane'
import MonthPane from './MonthPane'
import SecondPane from './SecondPane'
import WeekPane from './WeekPane'
import YearPane from './YearPane'
import { ICronProps } from './index-conf'
import { useIsMobile } from './hooks/useIsMobile'

// 设置 Tab 样式
const tabPaneStyle = {
  paddingLeft: 10,
  marginTop: -10,
}

// 定义函数用于渲染 Tab 标题
const getTabTitle = (
  text:
    | string
    | number
    | bigint
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | null
    | undefined
): ReactNode => <div style={{ minWidth: 32, maxWidth: 56, width: 50, textAlign: 'center' }}>{text}</div>

// 组件函数
function Cron(props: ICronProps) {
  // 从 props 中解构获取传入的值
  const { style, footerStyle, footerRenderer, value, onOk } = props
  const isMobile = useIsMobile()

  // 定义当前时间字段状态
  const [currentTab, setCurrentTab] = useState('1') // 当前显示的 Tab
  const [second, setSecond] = useState('*')
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [week, setWeek] = useState('?')
  const [year, setYear] = useState('*')

  const [messageApi, contextHolder] = message.useMessage()

  // 解析传入的 cron 表达式
  const onParse = useCallback(() => {
    if (value) {
      const parts = value.trim().split(' ')
      if (parts.length === 7) {
        try {
          // 分别提取 cron 字段的值
          let [secondVal, minuteVal, hourVal, dayVal, monthVal, weekVal, yearVal] = parts

          // 验证并设置每个字段的值
          secondVal = secondRegex.test(secondVal) ? secondVal : '*'
          minuteVal = minuteRegex.test(minuteVal) ? minuteVal : '*'
          hourVal = hourRegex.test(hourVal) ? hourVal : '*'
          dayVal = dayRegex.test(dayVal) ? dayVal : '*'
          monthVal = monthRegex.test(monthVal) ? monthVal : '*'
          weekVal = weekRegex.test(weekVal) ? weekVal : '?'
          weekVal = dayVal !== '?' ? '?' : weekVal // 如果 day 为 ?，则 week 也为 ?
          yearVal = yearRegex.test(yearVal) ? yearVal : '*'

          // 更新状态
          setSecond(secondVal)
          setMinute(minuteVal)
          setHour(hourVal)
          setDay(dayVal)
          setMonth(monthVal)
          setWeek(weekVal)
          setYear(yearVal)
        } catch (e) {
          // 如果解析失败，回退到默认值
        }
      }
    }
  }, [value])

  // 重置 cron 设置为默认值
  const onReset = useCallback(() => {
    setSecond('*')
    setMinute('*')
    setHour('*')
    setDay('*')
    setMonth('*')
    setWeek('?')
    setYear('*')
  }, [])

  // 生成 cron 表达式并传递给父组件
  const onGenerate = useCallback(() => {
    onOk?.([second, minute, hour, day, month, week, year].join(' '))
  }, [onOk, second, minute, hour, day, month, week, year])

  // 处理 day 字段的变化
  const onChangeDay = (v: string) => {
    setDay(v)
    if (v !== '?') setWeek('?') // 如果 day 被设置为非 ?，则将 week 设置为 ?
  }

  // 处理 week 字段的变化
  const onChangeWeek = (v: string) => {
    setWeek(v)
    if (v !== '?') setDay('?') // 如果 week 被设置为非 ?，则将 day 设置为 ?
  }

  // 当 value 改变时重新解析 cron 表达式
  useEffect(() => {
    onParse()
  }, [onParse])

  // 渲染页脚
  const footerRendererWrapper = useCallback((): ReactNode => {
    if (footerRenderer && typeof footerRenderer === 'function') {
      return footerRenderer(onReset, onGenerate) // 自定义的页脚渲染
    }
    return (
      <Space style={{ marginTop: 5 }}>
        <Button size="small" type="text" onClick={onReset}>
          重置
        </Button>
        <Button size="small" type="default" onClick={onGenerate}>
          生成
        </Button>
      </Space>
    )
  }, [footerRenderer, onReset, onGenerate])

  const getCronExpression = () => {
    return [second || '*', minute || '*', hour || '*', day || '*', month || '*', week || '?', year || '*'].join(' ')
  }

  return (
    <Card
      size={'small'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        outline: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        width: isMobile ? '100%' : style?.width || 480,
        height: style?.height || 'auto',
        ...style, // 可以通过 style prop 覆盖样式
      }}
    >
      {/* 页头 + 内容部分（Tabs） */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <Tabs
          centered
          size="small"
          type="line"
          tabBarGutter={4}
          destroyOnHidden
          activeKey={currentTab}
          onChange={setCurrentTab}
          items={[
            {
              key: '1',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('秒')}</span>, // 加粗秒标签
              children: <SecondPane value={second} onChange={setSecond} />,
              style: tabPaneStyle,
            },
            {
              key: '2',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('分')}</span>, // 加粗分标签
              children: <MinutePane value={minute} onChange={setMinute} />,
              style: tabPaneStyle,
            },
            {
              key: '3',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('时')}</span>, // 加粗时标签
              children: <HourPane value={hour} onChange={setHour} />,
              style: tabPaneStyle,
            },
            {
              key: '4',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('日')}</span>, // 加粗日标签
              children: <DayPane value={day} onChange={onChangeDay} />,
              style: tabPaneStyle,
            },
            {
              key: '5',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('月')}</span>, // 加粗月标签
              children: <MonthPane value={month} onChange={setMonth} />,
              style: tabPaneStyle,
            },
            {
              key: '6',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('周')}</span>, // 加粗周标签
              children: <WeekPane value={week} onChange={onChangeWeek} />,
              style: tabPaneStyle,
            },
            {
              key: '7',
              label: <span style={{ fontWeight: 'bold' }}>{getTabTitle('年')}</span>, // 加粗年标签
              children: <YearPane value={year} onChange={setYear} />,
              style: tabPaneStyle,
            },
          ]}
        />
      </div>

      {/* 页脚部分(flex + 左右布局）：Cron 表达式 + 操作按钮 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '0.8px solid #e8e8e8',
          padding: 0,
          margin: 0,
          ...footerStyle,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#888' }}>
            Cron: <code>{getCronExpression()}</code>
          </span>
          <Button
            size="small"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(getCronExpression())
                messageApi.success('复制成功')
              } catch (err) {
                messageApi.error('复制失败，请手动复制')
              }
            }}
            icon={<CopyOutlined />}
          />
        </div>

        {footerRendererWrapper() || null}
      </div>
      {contextHolder}
    </Card>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default Cron
