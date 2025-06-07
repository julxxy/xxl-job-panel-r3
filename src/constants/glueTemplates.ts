import { GlueTypeEnum } from '@/types/enum'

/**
 * Glue 脚本模板（完整参数示例）
 */
export const glueTemplates: Partial<Record<GlueTypeEnum, string>> = {
  [GlueTypeEnum.GLUE_SHELL]: `#!/bin/bash
echo "xxl-job: hello shell"

echo "脚本位置：$0"
echo "任务参数：$1"
echo "分片序号 = $2"
echo "分片总数 = $3"

for param in "$@"; do
  echo "参数 : $param"
  sleep 1s
done

echo "Good bye!"
exit 0`,

  [GlueTypeEnum.GLUE_PYTHON]: `#!/usr/bin/python
# -*- coding: UTF-8 -*-
import time
import sys

print("xxl-job: hello python")

print("脚本位置：", sys.argv[0])
print("任务参数：", sys.argv[1])
print("分片序号：", sys.argv[2])
print("分片总数：", sys.argv[3])

for i in range(1, len(sys.argv)):
    time.sleep(1)
    print("参数", i, sys.argv[i])

print("Good bye!")
exit(0)`,

  [GlueTypeEnum.GLUE_PHP]: `<?php

echo "xxl-job: hello php\n";
echo "脚本位置：$argv[0]\n";
echo "任务参数：$argv[1]\n";
echo "分片序号 = $argv[2]\n";
echo "分片总数 = $argv[3]\n";

echo "Good bye!\n";
exit(0);

?>`,

  [GlueTypeEnum.GLUE_NODEJS]: `#!/usr/bin/env node
console.log("xxl-job: hello nodejs")

const args = process.argv;

console.log("脚本位置: " + args[1])
console.log("任务参数: " + args[2])
console.log("分片序号: " + args[3])
console.log("分片总数: " + args[4])

console.log("Good bye!")
process.exit(0)`,

  [GlueTypeEnum.GLUE_POWERSHELL]: `Write-Host "xxl-job: hello powershell"

Write-Host "脚本位置: " $MyInvocation.MyCommand.Definition
Write-Host "任务参数: "
if ($args.Count -gt 2) { $args[0..($args.Count - 3)] }
Write-Host "分片序号: " $args[$args.Count - 2]
Write-Host "分片总数: " $args[$args.Count - 1]

Write-Host "Good bye!"
exit 0`,

  [GlueTypeEnum.GLUE_GROOVY]: `package com.xxl.job.service.handler;

import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.IJobHandler;

public class JobHandlerExample extends IJobHandler {

    @Override
    public void execute() throws Exception {
        XxlJobHelper.log("Hello from Groovy");
    }

}`,
}
