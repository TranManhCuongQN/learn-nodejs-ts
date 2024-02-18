import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversation.controller'
import { paginationValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationsRouter
