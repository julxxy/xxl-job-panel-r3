#!/usr/bin/env node

import fs from 'fs'
import path, { dirname } from 'path'
import minimist from 'minimist'
import { fileURLToPath } from 'url'

const TOOL_VERSION = '1.0.0'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const args = minimist(process.argv.slice(2), {
  boolean: ['version', 'help'],
  alias: { v: 'version', h: 'help' },
})

if (args.version) {
  console.log(`add-header version ${TOOL_VERSION}`)
  process.exit(0)
}

if (args.help || !args.project || !args.author) {
  console.log(`
📝 add-header ${TOOL_VERSION}

批量给项目文件添加 License 头部信息

用法:
  node add-header.js --dir <目录> --project <项目名> --author <作者名> [--license <协议类型>]

参数说明:
  --dir        目标目录 (默认: ./src)
  --project    项目名称 (必填)
  --author     作者名称 (必填)
  --license    协议类型 (可选: gpl | mit | apache，默认: gpl)
  --version    查看版本
  --help       查看帮助信息

示例:

  GNU GPL v3 (默认):
    node add-header.js --dir ./src --project "xxl-job-panel-r3" --author "Julian"

  MIT 协议:
    node add-header.js --dir ./src --project "xxl-job-panel-r3" --author "Julian" --license mit

  Apache 协议:
    node add-header.js --dir ./src --project "xxl-job-panel-r3" --author "Julian" --license apache

`)
  process.exit(0)
}

const targetDir = args.dir || path.join(__dirname, 'src')
const projectName = args.project
const authorName = args.author
const licenseType = (args.license || 'gpl').toLowerCase()

const year = new Date().getFullYear()
const ignoredDirs = ['node_modules', '.git', '.idea', '.vscode']

function getLicenseHeader() {
  if (licenseType === 'mit') {
    return `/**
 * ${projectName}
 *
 * Copyright (c) ${year} ${authorName}
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

`
  }

  if (licenseType === 'apache') {
    return `/**
 * ${projectName}
 *
 * Copyright (c) ${year} ${authorName}
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

`
  }

  // 默认 GPL v3
  return `/**
 * This file is part of ${projectName}.
 *
 * Copyright (C) ${year} ${authorName}
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

`
}

const copyrightHeader = getLicenseHeader()

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      const base = path.basename(fullPath)
      if (!ignoredDirs.includes(base) && !base.startsWith('.')) {
        walk(fullPath)
      }
    } else if (
      fullPath.endsWith('.ts') ||
      fullPath.endsWith('.tsx') ||
      fullPath.endsWith('.js') ||
      fullPath.endsWith('.jsx')
    ) {
      addCopyright(fullPath)
    }
  })
}

function addCopyright(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  if (content.includes('Copyright') && content.includes(authorName)) {
    console.log(`⚠️ 已存在: ${filePath}`)
    return
  }

  content = copyrightHeader + content
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ 已添加: ${filePath}`)
}

console.log(`🚀 开始处理目录: ${targetDir}`)
console.log(`📄 项目: ${projectName} | 作者: ${authorName} | 协议: ${licenseType.toUpperCase()}\n`)
walk(targetDir)
console.log('\n🎉 全部处理完成')
