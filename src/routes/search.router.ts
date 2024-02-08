import { Router } from 'express'
import { searchController } from '~/controllers/search.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
const searchRouter = Router()

searchRouter.get('/', accessTokenValidator, wrapRequestHandler(searchController))

export default searchRouter
