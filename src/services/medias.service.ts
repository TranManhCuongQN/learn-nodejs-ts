import { Request } from 'express'
import { getNameFromFullname, handleUploadSingleImage } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'

class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)

    // xóa file ảnh gốc trong thư mục temp
    fs.unlinkSync(file.filepath)
    return isProduction
      ? `${process.env.HOST}/static/image/${newName}.jpg`
      : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`
  }
}

const mediasService = new MediasService()

export default mediasService
