import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'

// tao ra 1 cai mang co item la cac key cua 1 object T
type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
