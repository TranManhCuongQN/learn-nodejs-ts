import { Router } from 'express'
import { registerController } from '~/controllers/users.controller'
import { registerValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
