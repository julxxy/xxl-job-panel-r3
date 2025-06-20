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

import { Badge } from '@/components/ui/badge.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { handleCopy } from '@/utils'
import { IconTooltipButton } from '@/components/IconTooltipButton.tsx'

type NodeListProps = {
  nodes?: string[]
  showMore?: (nodes: string[]) => void
}

export const ExecutorNode: React.FC<NodeListProps> = ({ nodes = [], showMore }) => {
  if (nodes.length === 0) {
    return <span className="text-gray-400">无</span>
  }
  // 只有1个节点
  if (nodes.length === 1) {
    return (
      <div className="flex flex-col gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className="bg-green-300 text-green-700 hover:bg-green-400 rounded-full px-3 py-1 w-fit cursor-pointer"
              onClick={() => handleCopy(nodes[0])}
            >
              {nodes[0]}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>点击复制</TooltipContent>
        </Tooltip>
      </div>
    )
  }
  // 2个及以上节点
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className="bg-green-300 text-green-700 hover:bg-green-400 rounded-full px-3 py-1 w-fit cursor-pointer"
              onClick={() => handleCopy(nodes[1])}
            >
              {nodes[0]}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>点击复制</TooltipContent>
        </Tooltip>
        {nodes.length > 1 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <IconTooltipButton
                variant="ghost"
                size="sm"
                tooltip="查看更多节点"
                icon={<MoreHorizontalIcon />}
                onClick={() => showMore?.(nodes)}
              />
            </TooltipTrigger>
            <TooltipContent>查看更多节点</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
