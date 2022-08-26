import { mul, sum } from "./compute"
import { CustomError } from "./errors"

describe('compute', () => {
  describe('sum', () => {
    it('should correctly sum two numbers', () => {
      expect(sum(3,5)).toEqual(8)
    })

    it('should throw if Nan provided', () => {
      const shouldTrow = () => { sum(3, NaN) }
      expect(shouldTrow).toThrow(CustomError)
    })
  })

  describe('mul', () => {
    it('should correctly multiply two numbers', () => {
      expect(mul(3,5)).toEqual(15)
    })
  })
})