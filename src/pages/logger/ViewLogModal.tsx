import React, { useImperativeHandle, useRef, useState } from 'react'
import api from '@/api'
import { IModalProps } from '@/types/modal.ts'
import { JobLog } from '@/types'
import useZustandStore from '@/stores/useZustandStore.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { ShadcnAntdModal } from '@/components/ShadcnAntdModal.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ReloadIcon } from '@radix-ui/react-icons'

/**
 * 查看日志
 */
export default function ViewLogModal({ parentRef, onRefresh }: IModalProps) {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<JobLog.LogDetailCatParams>()
  const [logContent, setLogContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [end, setEnd] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fromLineNumRef = useRef(1)
  const { isDarkEnable } = useZustandStore()
  const PULL_INTERVAL = 3000 // 3秒
  const pullFailCountRef = useRef(0)

  // 打开弹窗
  useImperativeHandle(parentRef, () => ({
    openModal: (_action, data: JobLog.LogDetailCatParams) => {
      if (isDebugEnable) log.debug('打开弹窗: ', data)
      setVisible(true)
      setLogContent('')
      fromLineNumRef.current = 1
      setData(data)
      fetchLog(data, true)
    },
    closeModal: () => {
      setVisible(false)
      stopPolling()
    },
  }))

  // 停止自动轮询
  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setLoading(false)
  }

  const fetchLog = async (data: JobLog.LogDetailCatParams, isFirst = false) => {
    if (!data?.logId) return
    setLoading(true)
    try {
      const { code, content } = await api.logger.getLogDetailCat({
        ...data,
        fromLineNum: fromLineNumRef.current,
      })
      if (code !== 200) {
        setLoading(false)
        stopPolling()
        setLogContent('<span style="color:#888">暂无日志内容</span>')
        return
      }
      setEnd(!!content?.end)
      if (content) {
        setLogContent(prev => prev + (content.logContent || ''))
        fromLineNumRef.current = content.toLineNum + 1
        pullFailCountRef.current = 0

        if (content?.end) {
          stopPolling() // 保证轮询停止
          setLoading(false) // 无论是不是第一次，都确保 loading 关闭
          setLogContent(
            prev =>
              prev +
              '<span class="ml-[120px] select-none font-semibold text-green-600 dark:text-green-400">✓ 任务执行完毕</span><br>'
          )
          return // 结束
        } else {
          // 只要不是 end，就 setTimeout 拉取
          timerRef.current = setTimeout(() => fetchLog(data), PULL_INTERVAL)
        }
      } else {
        pullFailCountRef.current += 1
        if (pullFailCountRef.current > 20) {
          stopPolling()
          setLoading(false)
          setLogContent(prev => prev + '<br><span style="color:red;">日志拉取失败次数过多</span>')
          return
        }
        timerRef.current = setTimeout(() => fetchLog(data), PULL_INTERVAL)
      }
    } finally {
      // 只有第一次进来的时候才关闭 loading
      if (isFirst) setLoading(false)
    }
  }

  // 手动刷新
  const handleRefresh = async () => {
    setLogContent('')
    fromLineNumRef.current = 1
    if (data) await fetchLog(data, true)
  }

  // 关闭弹窗时清理定时器
  const handleCancel = () => {
    stopPolling()
    setVisible(false)
    onRefresh()
  }

  const LOG_CONTENT_STYLE: React.CSSProperties = {
    minHeight: 320,
    maxHeight: 420,
    overflowY: 'auto',
    overflowX: 'auto',
    background: isDarkEnable ? '#222' : '#e0e0e0',
    color: isDarkEnable ? '#e0e0e0' : '#222',
    fontFamily: 'monospace',
    fontSize: 14,
    whiteSpace: 'pre',
    wordBreak: 'break-all',
    borderRadius: 6,
    padding: 16,
    marginTop: 8,
  }

  function getTitleSuffix() {
    let suffix = ''
    if (data?._jobGroupLabel && data?._jobGroupLabel !== '全部') {
      suffix = data._jobGroupLabel
    }
    if (data?._jobIdLabel && data?._jobIdLabel !== '全部') {
      suffix = (suffix !== '' ? suffix + ' / ' : '') + data._jobIdLabel
    }
    if (suffix !== '') {
      return (
        <span
          className="ml-2 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginLeft: 8,
            fontWeight: 400,
            letterSpacing: 1,
            maxWidth: 220,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={suffix}
        >
          {suffix}
        </span>
      )
    }
    return null
  }

  return (
    <ShadcnAntdModal
      open={visible}
      onCancel={handleCancel}
      width={950}
      footer={null}
      destroyOnHidden
      title={
        <div
          className="drag-handle w-full flex items-center justify-center font-semibold text-base select-none"
          style={{ cursor: 'move' }}
        >
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
              marginLeft: '28px',
            }}
          >
            终端执行日志
            {getTitleSuffix()}
          </span>
          <span className="text-xs text-gray-400 flex mr-12">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || !end}>
              {loading || !end ? <ReloadIcon className="animate-spin mr-1" /> : <ReloadIcon className="mr-1" />}
              刷新
            </Button>
          </span>
        </div>
      }
    >
      {() => (
        <>
          <div
            style={LOG_CONTENT_STYLE}
            dangerouslySetInnerHTML={{
              __html: logContent
                ? logContent
                    .replace(/\n/g, '<br/>')
                    .replace(/\[Load Log Finish]/g, '<span style="color:#6f6;">[Load Log Finish]</span>')
                : '<span style="color:#888">暂无日志内容</span>',
            }}
          />
        </>
      )}
    </ShadcnAntdModal>
  )
}
