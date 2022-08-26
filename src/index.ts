import express from 'express'
import { sum } from './compute.js'
import { HttpError } from './errors.js'
import { errorMiddleware } from './middlewares.js'

const PORT = process.env.PORT ?? 10000

const testRouter = express.Router()
const app = express()


testRouter.get('/sum', (req, res) => {
  console.log('params', req.query)
  const { a, b } = req.query
  if (!a || !b) {
    throw new HttpError('Some parameters are missing', 400, 'BadRequest')
  }
  const result = sum(+a, +b)
  res.json({ result  })
})

app.use('/test', testRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`)
})