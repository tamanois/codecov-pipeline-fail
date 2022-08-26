import { CustomError } from "./errors"

const sum = (a: number, b: number) => {
  if (isNaN(a) || isNaN(b)) {
    throw new CustomError('Compute: sum: Wrong values provided', 'compute:sum')
  }
  return a + b
}

const mul = (a: number, b: number) => (a * b)


export { sum, mul }