import { NextFunction, Request, Response } from "express"
import { HttpError } from "./errors.js"

 export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof HttpError) {
      const error = err as HttpError
      res.status(error.code).json({ status: error.code, message: error.message})
    } else {
      const { NODE_ENV } = process.env
      const message = NODE_ENV === 'DEV' ? err.message : 'An error occured'
      res.status(500).send({ status: 500, message })
    }
  }
  next()
 }