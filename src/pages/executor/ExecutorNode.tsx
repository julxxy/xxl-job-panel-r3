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
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              className="bg-green-300 text-green-700 hover:bg-green-400 rounded-full px-3 py-1 w-fit cursor-pointer"
              onClick={() => handleCopy(nodes[1])}
            >
              {nodes[1]}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>点击复制</TooltipContent>
        </Tooltip>
        {nodes.length > 2 && (
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
