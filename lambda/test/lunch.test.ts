import { getLunchMenuForDate, Menu, getLunchMessageForToday, getLunchMessage } from '../src/lunch'

describe('getLunchMenuForDate', () => {
  it('should return menu for a valid date', () => {
    const date = new Date('2025-02-03T00:00:00-05:00')
    const expected: Menu = {
      mainMeal: 'Popcorn chicken bowl with honey wheat dinner roll',
      alternate: 'Bagel & cream cheese, yogurt, string cheese',
      salad: 'Caesar salad with or without grilled chicken'
    }

    const result = getLunchMenuForDate(date)
    expect(result).toEqual(expected)
  })

  it('should handle menu items with commas', () => {
    const date = new Date('2025-02-10T00:00:00-05:00')
    const expected: Menu = {
      mainMeal: 'Chicken or vegetable dumplings with soy sauce and oven-fried brown rice',
      alternate: 'Toasted Cheese',
      salad: 'Garden salad with or without crispy chicken'
    }

    const result = getLunchMenuForDate(date)
    expect(result).toEqual(expected)
  })

  it('should return undefined for dates without menu', () => {
    const date = new Date('2025-02-01T00:00:00-05:00') // No menu on weekends (Eastern Time)
    const result = getLunchMenuForDate(date)
    expect(result).toBeUndefined()
  })

  it('should escape & in response', () => {
    const date = new Date('2025-03-04T00:00:00-05:00')
    const result = getLunchMessage(date, 'Today')
    expect(result).toContain('&amp;')
  })
})

describe('getLunchMessageForToday', () => {
  let originalDate: DateConstructor

  beforeEach(() => {
    originalDate = global.Date
    const mockDate = new Date('2025-02-03T12:00:00Z')
    global.Date = class extends Date {
      constructor() {
        super()
        return mockDate
      }
      static now() {
        return mockDate.getTime()
      }
    } as DateConstructor

    // Also mock these specific date methods
    mockDate.getDate = () => 3
    mockDate.getDay = () => 1  // Monday
    mockDate.getMonth = () => 1 // February
  })

  afterEach(() => {
    global.Date = originalDate
  })

  it('should return formatted lunch message for today', () => {
    const expected = 'Today, Monday February 3rd, main lunch meal is Popcorn chicken bowl with honey wheat dinner roll'
    const result = getLunchMessageForToday()
    expect(result).toEqual(expected)
  })
}) 