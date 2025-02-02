import fs from 'fs'
import path from 'path'

export type Menu = {
  mainMeal: string
  alternate?: string
  salad?: string
}

export type MenuByDate = {
  [date: string]: Menu
}

const lunchData = fs.readFileSync(path.join(__dirname, '../../menus/2025-February.csv'), 'utf8')
const dailyMenu = parseMenu(lunchData)

function getDateString(date: Date): string {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`
}

function parseMenu(lunchData: string): MenuByDate {
  const lines = lunchData.split('\n')
  const menu: MenuByDate = {}

  // Skip header row
  lines.slice(1).forEach(line => {
    // Skip empty lines
    if (!line.trim()) return

    // Parse CSV line handling quoted fields that may contain commas
    const fields: string[] = []
    let field = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(field.trim().replace(/^"|"$/g, ''))
        field = ''
      } else {
        field += char
      }
    }
    fields.push(field.trim().replace(/^"|"$/g, ''))

    const [date, mainMeal, alternate, salad] = fields
    if (date && mainMeal) {
      const dateStr = getDateString(new Date(date))
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

export function getLunchMessageForToday(): string {
  const today = new Date()
  const menu = getLunchMenuForDate(today)

  return `Today, ${vocalDate(today)}, main lunch meal is ${menu?.mainMeal}`
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