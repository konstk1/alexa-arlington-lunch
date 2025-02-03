import { generateGoodbye, dateToEasternTime } from '../src/helpers'

describe('generateGoodbye', () => {
  it('should return a goodbye message', () => {
    const result = generateGoodbye(true)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('dateToEasternTime', () => {
  it('should maintain the correct date', () => {
    const result = dateToEasternTime('2024-03-19')
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(2) // March is 2 (zero-based)
    expect(result.getDate()).toBe(19)
  })

  it('should handle date strings with slashes', () => {
    const result = dateToEasternTime('2024/03/19')
    expect(result.getFullYear()).toBe(2024)
    expect(result.getMonth()).toBe(2)
    expect(result.getDate()).toBe(19)
  })
}) 