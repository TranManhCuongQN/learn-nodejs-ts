import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import Follower from '~/models/schemas/follower.schema'
config()
import VideoStatus from '~/models/schemas/videoStatus.schema'

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.0dsjf2z.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  // Mongodb có 1 background task là một tác vụ chạy ngầm, nó sẽ chạy khoảng 60s 1 lần (sau 1 phút nó sẽ chạy 1 lần) để kiểm tra xem thử còn thời gian sống (TTL - time to live ) hay không, nếu hết thời gian sống thì nó sẽ xóa dữ liệu đó đi
  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }

    // Sau 1 khoảng thời gian là 10s là exp sẽ hết hạn
    // this.refreshTokens.createIndex(
    //   { exp: 1 },
    //   {
    //     expireAfterSeconds: 10
    //   }
    // )

    // sau 1 thời điểm nào đó, token hết hạn => nó sẽ không còn giá trị nữa => xóa nó ra khỏi database => mongodb có thể tự động xóa được không cần phải can thiệp (time to live)
    // Hết hạn nó sẽ dựa vào mốc thời gian exp
    // sau 1 phút background của mongodb sẽ chạy và xem thử ông nào hết hạn thì xóa đi
    // this.refreshTokens.createIndex(
    //   { exp: 1 },
    //   {
    //     expireAfterSeconds: 0
    //   }
    // )
  }
  async indexVideoStatus() {
    const exists = await this.videoStatus.indexExists(['name_1'])

    if (!exists) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }
  async indexFollowers() {
    const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
