import express, { Request, Response, NextFunction } from 'express'
import databaseService from './services/database.service'
import usersRouter from './routes/users.router'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediasRouter from './routes/medias.router'
import { initFolder } from './utils/file'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { config } from 'dotenv'
import staticRouter from './routes/static.router'
import cors from 'cors'
import tweetsRouter from './routes/tweet.router'
import bookmarksRouter from './routes/bookmarks.router'
import likesRouter from './routes/likes.router'
import searchRouter from '~/routes/search.router'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Conversation from './models/schemas/conversation.schema'
import { ObjectId } from 'mongodb'
import conversationsRouter from './routes/conversation.router'
import { verifyAccessToken } from '~/utils/commons'
import { TokenPayload } from '~/models/requests/user.request'
import { UserVerifyStatus } from '~/constants/enum'
import { ErrorWithStatus } from '~/models/error'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
// import '~/utils/fake'

const app = express()
const httpServer = createServer(app)
const port = process.env.PORT || 4000
app.use(express.json())
app.use(cors())

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

//  tao folder upload
initFolder()

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

app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

// register middleware cho socket (run trước khi connection)
io.use(async (socket, next) => {
  const { Authorization } = socket.handshake.auth
  const access_token = Authorization?.split(' ')[1]
  try {
    const decoded_authorization = await verifyAccessToken(access_token)
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
    socket.handshake.auth.decoded_authorization = decoded_authorization
    next()
  } catch (error) {
    next({
      message: 'Unauthorized',
      name: 'UnauthorizedError',
      data: error
    })
  }
})

// khi client connect success thì cái callback này sẽ được gọi (socket) => { ... }
// socket.on là lắng nghe sự kiện từ client gửi lên
// socket.emit là gửi sự kiện từ server xuống client
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)

  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload

  // {'user_id': {socket_id: 'socket_id'}}
  // {
  //   '65c0b8adda0742a7dad804dd': { socket_id: '-E07swDikIPBapmHAAA8' },
  //   '65c0bbd5da0742a7dad804e1': { socket_id: '9kAodQKlHhIPQpiFAAA-' }
  // }
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('send_message', async (data) => {
    console.log(data)
    const { receiver_id, sender_id, content } = data.payload

    // lấy socket_id của người nhận
    const receiver_socket_id = users[receiver_id]?.socket_id

    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content: content
    })

    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId
    if (receiver_socket_id) {
      socket.to(receiver_socket_id).emit('receive_message', {
        payload: conversation
      })
    }
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnected`)
  })

  console.log(users)

  // socket.on('hello', (agr) => {
  //   console.log(agr)
  // })
  // socket.emit('hi', {
  //   message: `Xin chào ${socket.id} đã kết nối thành công`
  // })
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
