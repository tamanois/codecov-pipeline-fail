
export class HttpError extends Error {
  public code: number
  public  type: string

  constructor(message: string, code: number, type: string) {
    super(message)
    this.code = code
    this.type = type
  }
}

export class CustomError extends Error {
  public  context: string

  constructor(message: string, context: string) {
    super(message)
    this.context = context
  }
}