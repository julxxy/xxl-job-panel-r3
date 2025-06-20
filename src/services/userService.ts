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

function formatPermissionToString(permission: number[] | string[] | undefined): string {
  if (Array.isArray(permission) && permission.length > 0) {
    return permission.join(',')
  }
  return ''
}

function formatPermissionToList(permission: string | number[] | undefined): number[] {
  if (Array.isArray(permission)) return permission.map(Number).filter(n => !isNaN(n))

  if (!permission || permission.trim() === '') return []

  return permission
    .split(',')
    .map(s => Number(s))
    .filter(n => !isNaN(n))
}

export { formatPermissionToString, formatPermissionToList }
