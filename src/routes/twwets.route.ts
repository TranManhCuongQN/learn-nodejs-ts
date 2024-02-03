import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description: Create Tweet
 * Path: /
 * Method: POST
 * Body: TweetRequestBody
 */
tweetsRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(createTweetController))

export default tweetsRouter
