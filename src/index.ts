import express from 'express'
import databaseService from './services/database.service'
import usersRouter from './routes/users.router'

const app = express()
const port = 4040
app.use(express.json())

databaseService.connect()
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
