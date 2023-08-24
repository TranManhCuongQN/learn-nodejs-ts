import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.service'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadSingleImage(req)
  return res.json({
    result: result
  })
}
