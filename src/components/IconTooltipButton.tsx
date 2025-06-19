import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

interface IconTooltipButtonProps {
  onClick: () => void
  tooltip: string
  icon: ReactNode
  variant?: 'outline' | 'ghost' | 'default'
  size?: 'sm' | 'default' | 'lg'
}

export function IconTooltipButton({
  onClick,
  tooltip,
  icon,
  variant = 'outline',
  size = 'sm',
}: IconTooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} variant={variant} size={size}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  )
}
