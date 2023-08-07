import express, { Request, Response, NextFunction } from 'express'
import databaseService from './services/database.service'
import usersRouter from './routes/users.router'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import { initFolder } from './utils/file'

const app = express()
const port = 4040
app.use(express.json())

databaseService.connect()

//  tao folder upload
initFolder()

app.use('/users', usersRouter)
app.use('/medias', mediasRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
