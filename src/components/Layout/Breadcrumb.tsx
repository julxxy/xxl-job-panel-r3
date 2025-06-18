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
