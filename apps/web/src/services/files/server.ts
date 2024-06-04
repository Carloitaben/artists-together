import "server-only"
import { S3Client } from "@aws-sdk/client-s3"

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: String(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY),
  },
})
