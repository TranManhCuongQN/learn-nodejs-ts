import { ObjectId, WithId } from 'mongodb'
import { TweetRequestBody } from '~/models/requests/tweet.request'
import databaseService from '~/services/database.service'
import Hashtag from '~/models/schemas/hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
class TweetsService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocuemts = await Promise.all(
      hashtags.map((hashtag) => {
        // Tìm hashtag trong database, nếu có thì lấy, không thì tạo mới
        //returnDocument: 'after' để trả về document sau khi update, mặc định là trả về document trước khi update
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuemts.map((hashtag) => (hashtag.value as WithId<Hashtag>)._id)
  }

  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: hashtags, // Chỗ này chưa làm, tạm thời để rỗng
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

  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    // projection: chỉ lấy ra những field mà mình cần, ở đây chỉ cần lấy ra 2 field là guest_views và user_views
    const result = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_views: 1,
          user_views: 1
        }
      }
    )

    return result.value as WithId<{
      guest_views: number
      user_views: number
    }>
  }
}

const tweetsService = new TweetsService()
export default tweetsService
