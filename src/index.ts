import express, { Request, Response, NextFunction } from 'express'
import databaseService from './services/database.service'
import usersRouter from './routes/users.router'
import { defaultErrorHandler } from './middlewares/error.middleware'

const app = express()
const port = 4040
app.use(express.json())

databaseService.connect()
app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
