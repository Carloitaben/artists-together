"use server"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { authenticate } from "~/services/auth/server"
import { S3 } from "./server"
import { decodeUrl, encodeFilename, encodeUrl } from "./shared"
import type { FileUpload } from "./shared"

export async function getSignedURL(params: FileUpload) {
  const filename = encodeFilename(params)
  const fileUrl = encodeUrl(params)

  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: "artists-together-public",
      Key: filename,
    }),
    { expiresIn: 15 * 60 },
  )

  return {
    fileUrl,
    filename,
    signedUrl,
  }
}

export async function removeFile(url: string) {
  const auth = await authenticate()

  if (!auth) {
    return {
      error: "Unauthorized",
    }
  }

  const decoded = decodeUrl(url)

  if (auth.user.id !== decoded.userId) {
    return {
      error: "Unauthorized",
    }
  }

  const command = new DeleteObjectCommand({
    Bucket: `artists-together-${decoded.bucket}`,
    Key: decoded.filename,
  })

  await S3.send(command)
}
