import { generateGoodbye } from '../src/helpers'

describe('generateGoodbye', () => {
  it('should return a goodbye message', () => {
    const result = generateGoodbye(true)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
}) 