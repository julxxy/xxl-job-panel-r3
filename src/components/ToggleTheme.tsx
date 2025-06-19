import { useTheme } from '@/components/ThemeProvider.tsx'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import useZustandStore from '@/stores/useZustandStore.ts'

export function ToggleTheme() {
  const { setTheme } = useTheme()
  const { isDarkEnable, setIsDarkEnable } = useZustandStore()

  const handleClick = () => {
    const nextIsDark = !isDarkEnable
    setIsDarkEnable() // 切换状态
    setTheme(nextIsDark ? 'dark' : 'light') // 应用到 UI
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={handleClick} variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
          {isDarkEnable ? (
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{isDarkEnable ? '切换为浅色模式' : '切换为深色模式'}</TooltipContent>
    </Tooltip>
  )
}
