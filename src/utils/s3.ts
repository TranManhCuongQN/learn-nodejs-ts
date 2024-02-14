import { S3 } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import path from 'path'
import { Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'

config()
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})

s3.listBuckets({}).then((data) => console.log(data))

// const file = fs.readFileSync(path.resolve('uploads/images/pampam.jpg'))
// const parallelUploads3 = new Upload({
//   client: s3,
//   params: { Bucket: 'twitter-clone-ap-southeast-1-2024', Key: 'anh1.jpg', Body: file, ContentType: 'image/jpeg' },
//   tags: [
//     /*...*/
//   ], // optional tags
//   queueSize: 4, // optional concurrency configuration
//   partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
//   leavePartsOnError: false // optional manually handle dropped parts
// })

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })

// parallelUploads3.done().then((res) => {
//   console.log(res)
// })

export const uploadFileToS3 = ({
  filename,
  filepath,
  contentType
}: {
  filename: string
  filepath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: filename,
      Body: fs.readFileSync(filepath),
      ContentType: contentType
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5 * 1024, // optional size of each part, in bytes, at least 5GB
    leavePartsOnError: false // optional manually handle dropped parts
  })

  return parallelUploads3.done()
}

export const sendFileFromS3 = async (res: Response, filepath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: filepath
    })
    ;(data.Body as any).pipe(res)
  } catch (error) {
    console.log('error', error)
    res.status(HTTP_STATUS.NOT_FOUND).send('Not found')
  }
}
