import express from 'express'
import databaseService from './services/database.service'

const app = express()
const port = 4040
app.use(express.json())
databaseService.connect()
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
