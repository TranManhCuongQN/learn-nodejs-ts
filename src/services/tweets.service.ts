import { ObjectId } from 'mongodb'
import { TweetRequestBody } from '~/models/requests/tweet.request'
import Tweet from '~/models/schemas/tweet.schema'
import databaseService from '~/services/database.service'

class TweetsService {
  async createTweet(user_id: string, body: TweetRequestBody) {
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [], // Chỗ này chưa làm, tạm thời để rỗng
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )

    // khi tạo tweet xong thì result chỉ trả về insertedId, nếu muốn lấy kết quả vừa insert vào database thì phải find lại
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}

const tweetsService = new TweetsService()
export default tweetsService
