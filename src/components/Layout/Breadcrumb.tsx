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

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { menuConfig, MenuItem } from '@/config/menu.config'

const findBreadcrumbs = (menus: MenuItem[], path: string): MenuItem[] => {
  for (const menu of menus) {
    if (menu.path === path) return [menu]
    if (menu.children) {
      const sub = findBreadcrumbs(menu.children, path)
      if (sub.length) return [menu, ...sub]
    }
  }
  return []
}

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)
  const fullPath = '/' + paths.join('/')
  const breadcrumbs = findBreadcrumbs(menuConfig, fullPath)

  return (
    <div className="text-sm text-gray-500 mb-2">
      {breadcrumbs.map((bc, i) => (
        <span key={bc.path}>
          {i > 0 && ' / '}
          <Link to={bc.path} className="hover:underline">
            {bc.name}
          </Link>
        </span>
      ))}
    </div>
  )
}

export default Breadcrumb
