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
 * 每日任务执行趋势 mock 数据
 */
let rawDataOfDailyExecution = [
  { date: '2024-04-01', success: 222, running: 150 },
  { date: '2024-04-02', success: 97, running: 180 },
  { date: '2024-04-03', success: 167, running: 120 },
  { date: '2024-04-04', success: 242, running: 260 },
  { date: '2024-04-05', success: 373, running: 290 },
  { date: '2024-04-06', success: 301, running: 340 },
  { date: '2024-04-07', success: 245, running: 180 },
  { date: '2024-04-08', success: 409, running: 320 },
  { date: '2024-04-09', success: 59, running: 110 },
  { date: '2024-04-10', success: 261, running: 190 },
  { date: '2024-04-11', success: 327, running: 350 },
  { date: '2024-04-12', success: 292, running: 210 },
  { date: '2024-04-13', success: 342, running: 380 },
  { date: '2024-04-14', success: 137, running: 220 },
  { date: '2024-04-15', success: 120, running: 170 },
  { date: '2024-04-16', success: 138, running: 190 },
  { date: '2024-04-17', success: 446, running: 360 },
  { date: '2024-04-18', success: 364, running: 410 },
  { date: '2024-04-19', success: 243, running: 180 },
  { date: '2024-04-20', success: 89, running: 150 },
  { date: '2024-04-21', success: 137, running: 200 },
  { date: '2024-04-22', success: 224, running: 170 },
  { date: '2024-04-23', success: 138, running: 230 },
  { date: '2024-04-24', success: 387, running: 290 },
  { date: '2024-04-25', success: 215, running: 250 },
  { date: '2024-04-26', success: 75, running: 130 },
  { date: '2024-04-27', success: 383, running: 420 },
  { date: '2024-04-28', success: 122, running: 180 },
  { date: '2024-04-29', success: 315, running: 240 },
  { date: '2024-04-30', success: 454, running: 380 },
  { date: '2024-05-01', success: 165, running: 220 },
  { date: '2024-05-02', success: 293, running: 310 },
  { date: '2024-05-03', success: 247, running: 190 },
  { date: '2024-05-04', success: 385, running: 420 },
  { date: '2024-05-05', success: 481, running: 390 },
  { date: '2024-05-06', success: 498, running: 520 },
  { date: '2024-05-07', success: 388, running: 300 },
  { date: '2024-05-08', success: 149, running: 210 },
  { date: '2024-05-09', success: 227, running: 180 },
  { date: '2024-05-10', success: 293, running: 330 },
  { date: '2024-05-11', success: 335, running: 270 },
  { date: '2024-05-12', success: 197, running: 240 },
  { date: '2024-05-13', success: 197, running: 160 },
  { date: '2024-05-14', success: 448, running: 490 },
  { date: '2024-05-15', success: 473, running: 380 },
  { date: '2024-05-16', success: 338, running: 400 },
  { date: '2024-05-17', success: 499, running: 420 },
  { date: '2024-05-18', success: 315, running: 350 },
  { date: '2024-05-19', success: 235, running: 180 },
  { date: '2024-05-20', success: 177, running: 230 },
  { date: '2024-05-21', success: 82, running: 140 },
  { date: '2024-05-22', success: 81, running: 120 },
  { date: '2024-05-23', success: 252, running: 290 },
  { date: '2024-05-24', success: 294, running: 220 },
  { date: '2024-05-25', success: 201, running: 250 },
  { date: '2024-05-26', success: 213, running: 170 },
  { date: '2024-05-27', success: 420, running: 460 },
  { date: '2024-05-28', success: 233, running: 190 },
  { date: '2024-05-29', success: 78, running: 130 },
  { date: '2024-05-30', success: 340, running: 280 },
  { date: '2024-05-31', success: 178, running: 230 },
  { date: '2024-06-01', success: 178, running: 200 },
  { date: '2024-06-02', success: 470, running: 410 },
  { date: '2024-06-03', success: 103, running: 160 },
  { date: '2024-06-04', success: 439, running: 380 },
  { date: '2024-06-05', success: 88, running: 140 },
  { date: '2024-06-06', success: 294, running: 250 },
  { date: '2024-06-07', success: 323, running: 370 },
  { date: '2024-06-08', success: 385, running: 320 },
  { date: '2024-06-09', success: 438, running: 480 },
  { date: '2024-06-10', success: 155, running: 200 },
  { date: '2024-06-11', success: 92, running: 150 },
  { date: '2024-06-12', success: 492, running: 420 },
  { date: '2024-06-13', success: 81, running: 130 },
  { date: '2024-06-14', success: 426, running: 380 },
  { date: '2024-06-15', success: 307, running: 350 },
  { date: '2024-06-16', success: 371, running: 310 },
  { date: '2024-06-17', success: 475, running: 520 },
  { date: '2024-06-18', success: 107, running: 170 },
  { date: '2024-06-19', success: 341, running: 290 },
  { date: '2024-06-20', success: 408, running: 450 },
  { date: '2024-06-21', success: 169, running: 210 },
  { date: '2024-06-22', success: 317, running: 270 },
  { date: '2024-06-23', success: 480, running: 530 },
  { date: '2024-06-24', success: 132, running: 180 },
  { date: '2024-06-25', success: 141, running: 190 },
  { date: '2024-06-26', success: 434, running: 380 },
  { date: '2024-06-27', success: 448, running: 490 },
  { date: '2024-06-28', success: 149, running: 200 },
  { date: '2024-06-29', success: 103, running: 160 },
  { date: '2024-06-30', success: 446, running: 400 },
]
const FAILURE_RATE = 0.03
rawDataOfDailyExecution = rawDataOfDailyExecution.map(item => ({
  ...item,
  failure: Math.floor((item.success ?? 0) * FAILURE_RATE),
}))

export { rawDataOfDailyExecution }
