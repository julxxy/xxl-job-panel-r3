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

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GearIcon } from '@radix-ui/react-icons'
import api from '@/api'
import { isDebugEnable, log } from '@/common/Logger'
import { toast } from '@/utils/toast.ts'
import { Badge } from '@/components/ui/badge.tsx'

interface RegistryNodeModalProps {
  jobGroupId: number
  trigger: React.ReactNode
}

export function RegistryNodeModal({ jobGroupId, trigger }: RegistryNodeModalProps) {
  const [open, setOpen] = useState(false)
  const [nodes, setNodes] = useState<string[]>([])
  const [appName, setAppName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchRegistryNodes()
    }
  }, [open])

  const fetchRegistryNodes = async () => {
    try {
      setLoading(true)
      const { code, content } = await api.jobGroup.getRegistryNode(jobGroupId)
      if (code === 200 && content?.registryList) {
        setNodes(content.registryList)
        setAppName(`${content?.appname}`)
      } else {
        setNodes([])
        toast.warning('未获取到注册节点信息')
      }
    } catch (error) {
      if (isDebugEnable) log.error('获取注册节点失败:', error)
      toast.error('获取注册节点失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GearIcon className="h-5 w-5" />
            注册节点列表 {appName ? <span>({appName})</span> : null}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">加载中...</div>
        ) : nodes.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">暂无注册节点</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">序号</TableHead>
                  <TableHead className="text-center">注册节点</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.map((node, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className={'text-center'}>
                      <Badge className="bg-green-400">{node}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            关闭
          </Button>
          <Button variant="secondary" onClick={fetchRegistryNodes} disabled={loading}>
            刷新
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
