import { Router } from 'express'
import { searchController } from '~/controllers/search.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middleware'
const searchRouter = Router()

searchRouter.get('/', accessTokenValidator, verifiedUserValidator, searchController)

export default searchRouter
