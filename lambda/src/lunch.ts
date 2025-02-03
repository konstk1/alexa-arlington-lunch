import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { dateToEasternTime } from './helpers'

export type Menu = {
  mainMeal: string
  alternate?: string
  salad?: string
}

export type MenuByDate = {
  [date: string]: Menu
}

const lunchData = fs.readFileSync(path.join(__dirname, '../menus/2025-February.csv'), 'utf8')
const dailyMenu = parseMenu(lunchData)

function getDateString(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function parseMenu(lunchData: string): MenuByDate {
  const records = parse(lunchData, {
    columns: false, // Use header row
    skip_empty_lines: true,
    trim: true
  })

  const menu: MenuByDate = {}

  records.forEach((record: any) => {
    const [date, mainMeal, alternate, salad] = record
    if (date && mainMeal) {
      const dateObj = dateToEasternTime(date)
      const dateStr = getDateString(dateObj)
      menu[dateStr] = { mainMeal, alternate, salad }
    }
  })

  return menu
}

export function getLunchMenuForDate(date: Date): Menu | undefined {
  const dateStr = getDateString(date)
  console.log('Getting lunch menu for date', dateStr)
  return dailyMenu[dateStr]
}

function vocalDate(date: Date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const day = days[date.getDay()]
  const month = months[date.getMonth()]
  const dateNum = date.getDate()
  const suffix = dateNum % 10 === 1 && dateNum !== 11 ? 'st' :
    dateNum % 10 === 2 && dateNum !== 12 ? 'nd' :
      dateNum % 10 === 3 && dateNum !== 13 ? 'rd' : 'th'

  return `${day} ${month} ${dateNum}${suffix}`
}

export function getLunchMessage(date: Date, dayLabel: string): string {
  // if weekend, say so
  if (date.getDay() === 0 || date.getDay() === 6) {
    return `${dayLabel} is a weekend, ask your parents for lunch.`
  }

  const menu = getLunchMenuForDate(date)
  if (!menu) {
    return `I don't know what's for lunch ${dayLabel.toLowerCase()}.`
  }

  return `${dayLabel}, ${vocalDate(date)}, main lunch meal is ${menu.mainMeal}`
}

export function getLunchMessageForToday(): string {
  return getLunchMessage(new Date(), 'Today')
}

export function getLunchMessageForTomorrow(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return getLunchMessage(tomorrow, 'Tomorrow')
}