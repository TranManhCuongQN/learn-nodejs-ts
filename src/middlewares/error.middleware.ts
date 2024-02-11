import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error'

// middleware này xử lý lỗi khi có lỗi xảy ra trong quá trình xử lý request toan bộ các lỗi sẽ được xử lý ở đây
// next(err) sẽ chuyển đến middleware này để xử lý lỗi
// (err: any, req: Request, res: Response, next: NextFunction) có dạng này để express biết đây là middleware xử lý lỗi
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ErrorWithStatus) {
      return res.status(err.status).json(omit(err, ['status']))
    }
    const finalError: any = {}

    Object.getOwnPropertyNames(err).forEach((key) => {
      // key $response  nó set configurable = false, writable = false nên không thể sửa đổi enumrable là true được (key $response này là từ ses của amazon sdk trả về mặc định có configurable = false, writable = false nên không thể sửa đổi được)
      if (
        !Object.getOwnPropertyDescriptor(err, key)?.configurable ||
        !Object.getOwnPropertyDescriptor(err, key)?.writable
      ) {
        return
      }
      finalError[key] = err[key]
    })
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: finalError.message,
      errorInfo: omit(finalError, ['stack'])
    })
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      errorInfo: omit(error as any, ['stack'])
    })
  }
}
