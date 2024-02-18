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

// khi client connect success thì cái callback này sẽ được gọi (socket) => { ... }
// socket.on là lắng nghe sự kiện từ client gửi lên
// socket.emit là gửi sự kiện từ server xuống client
io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)

  const user_id = socket.handshake.auth._id
  // {'user_id': {socket_id: 'socket_id'}}
  // {
  //   '65c0b8adda0742a7dad804dd': { socket_id: '-E07swDikIPBapmHAAA8' },
  //   '65c0bbd5da0742a7dad804e1': { socket_id: '9kAodQKlHhIPQpiFAAA-' }
  // }
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('private message', async (data) => {
    // socket_id của người nhận
    const receiver_socket_id = users[data.to]?.socket_id

    if (!receiver_socket_id) {
      return
    }

    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: new ObjectId(data.from),
        receiver_id: new ObjectId(data.to),
        content: data.content
      })
    )

    // gửi đến socket_id của người nhận
    socket.to(receiver_socket_id).emit('receive private message', {
      content: data.content,
      from: user_id
    })
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
