import { MongoClient, Db, Collection } from 'mongodb'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import Follower from '~/models/schemas/follower.schema'
import VideoStatus from '~/models/schemas/videoStatus.schema'
import Hashtag from '~/models/schemas/hashtag.schema'
import Bookmark from '~/models/schemas/bookmark.schema'
import Like from '~/models/schemas/like.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Conversation from '~/models/schemas/conversation.schema'
import { envConfig } from '~/constants/config'

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@cluster0.0dsjf2z.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
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
    return this.db.collection(envConfig.dbUsersCollection)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection)
  }

  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationCollection)
  }
}

const databaseService = new DatabaseService()
export default databaseService
