import { accessTokenValidator, loginValidator, refreshTokenValidator } from './../middlewares/users.middleware'
import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controller'
import { registerValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
export default usersRouter
