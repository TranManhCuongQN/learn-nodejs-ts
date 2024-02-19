import express from 'express'
import databaseService from './services/database.service'
import usersRouter from './routes/users.router'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import { initFolder } from './utils/file'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { envConfig, isProduction } from '~/constants/config'
import staticRouter from './routes/static.router'
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet'
import tweetsRouter from './routes/tweet.router'
import bookmarksRouter from './routes/bookmarks.router'
import likesRouter from './routes/likes.router'
import searchRouter from '~/routes/search.router'
import { createServer } from 'http'
import conversationsRouter from './routes/conversation.router'
import initSocket from './utils/socket'
import rateLimit from 'express-rate-limit'
// import '~/utils/fake'
import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X clone (Twitter API)',
      version: '1.0.0'
    }
  },
  apis: ['./src/openapi/*.yaml'] // files containing annotations as above
  // apis: ['./src/routes/*.ts'] // files containing annotations as above
}
const openapiSpecification = swaggerJsdoc(options)

const app = express()
const httpServer = createServer(app)
const port = envConfig.port || 4040
app.use(express.json())

app.use(helmet())
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (default milliseconds)
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes) (mỗi ip chỉ đc 100 request trong 15 phút)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
app.use(limiter)

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

//  tao folder upload
initFolder()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)

// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use('/static', staticRouter)

console.log(process.env.ACCESS_TOKEN_EXPIRES_IN, typeof process.env.ACCESS_TOKEN_EXPIRES_IN)
app.use(defaultErrorHandler)

initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
