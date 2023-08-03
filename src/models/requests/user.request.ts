import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'
// đinh nghĩa các request body cho user

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

// JwtPayload lúc nào cũng phải thêm 2 ông nữa user_id và token_type nên phải tạo ra 1 interface mới kế thừa JwtPayload
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
