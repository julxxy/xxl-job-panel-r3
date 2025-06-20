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

/**
 * Converts a string or boolean value to boolean.
 * - Returns true for the following string values: 'true', '1', 'on'.
 * - For boolean values, returns the value itself.
 * @param value - The value to be evaluated.
 * @returns True if the value represents a truthy state, false otherwise.
 */
export const isTrue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    return ['true', '1', 'on', 'yes'].includes(lowerValue)
  }
  return false
}

export const isFalse = (value: unknown): boolean => {
  return !isTrue(value)
}
