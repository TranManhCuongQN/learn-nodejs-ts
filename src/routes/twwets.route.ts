import { Router } from 'express'

import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { createTweetController, getTweetController } from '~/controllers/tweets.controller'
import { createTweetValidator, tweetIdValidator } from '~/middlewares/tweets.middleware'

const tweetsRouter = Router()

/**
 * Description: Create Tweet
 * Path: /
 * Method: POST
 * Body: TweetRequestBody
 * Header: { Authorization: Bearer <access_token> }
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Description: Get Tweet detail
 * Path: /:tweet_id
 * Method: GET
 * Header: { Authorization?: Bearer <access_token> }
 */
tweetsRouter.get('/:tweet_id', tweetIdValidator, wrapRequestHandler(getTweetController))

export default tweetsRouter
