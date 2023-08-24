import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.service'
import { USERS_MESSAGES } from '~/constants/messages'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.handleUploadSingleImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
