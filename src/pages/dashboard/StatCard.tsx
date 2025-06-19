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
