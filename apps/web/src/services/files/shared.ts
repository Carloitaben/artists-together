import { z } from "zod"

export const Bucket = {
  public: "https://pub-a02278b3d408411aba6645978096249a.r2.dev",
}

export type Bucket = keyof typeof Bucket

// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
export const fileType = {
  image: ["image/jpeg", "image/png", "image/webp"],
}

export type FileType = keyof typeof fileType

export function accept(type?: FileType) {
  if (type) {
    return fileType[type].join(", ")
  }

  return Object.values(fileType)
    .flatMap((values) => values)
    .join(", ")
}

export const FileUpload = z.object({
  key: z.string().optional().default(Date.now().toString()),
  bucket: z.enum(["public"]),
  filename: z.string().refine((value) => value.includes(".")),
  folder: z.string(),
  userId: z.string(),
  dimensions: z
    .object({
      width: z.number().int().nonnegative().safe(),
      height: z.number().int().nonnegative().safe(),
    })
    .optional(),
})

export type FileUpload = z.infer<typeof FileUpload>

export function encodeFilename(options: Omit<FileUpload, "bucket">) {
  const parsed = FileUpload.omit({ bucket: true }).parse(options)

  return (
    [
      parsed.folder,
      parsed.userId,
      parsed.key,
      parsed.dimensions
        ? `${parsed.dimensions.width}-${parsed.dimensions.height}`
        : null,
    ]
      .filter(Boolean)
      .join("/") + `.${parsed.filename.split(".").pop()}`
  )
}

export function encodeUrl(options: FileUpload) {
  const { bucket, ...rest } = FileUpload.parse(options)

  return `${Bucket[bucket]}/${encodeFilename(rest)}`
}

const decodeUrlRegex =
  /(?<bucket>https:\/\/[^\/]*)\/(?<filename>(?<folder>[^\/]*)\/(?<userId>[^\/]+)\/(?<key>[^\/]*)(\/{0,1}(?<width>\d*)\-(?<height>\d*)){0,1}\.(?<extension>.*))/gi

export function decodeUrl(url: string) {
  const { bucket, filename, folder, userId, key, width, height, extension } =
    decodeUrlRegex.exec(url)?.groups || {}

  if (!bucket || !filename || !folder || !userId || !key || !extension) {
    throw Error(`Invalid url: "${url}"`)
  }

  const bucketName = Object.entries(Bucket).find(
    ([_, url]) => url === bucket,
  )?.[0]

  if (!bucketName) {
    throw Error(`Invalid bucket: "${bucket}"`)
  }

  const dimensions =
    typeof width === "string" && typeof height === "string"
      ? {
          width: parseInt(width),
          height: parseInt(height),
        }
      : null

  return {
    bucket,
    filename,
    folder,
    userId,
    key,
    extension,
    dimensions,
  }
}

export async function getFileDimensions(file: File) {
  return new Promise<FileUpload["dimensions"]>((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = () => resolve(undefined)
      img.src = url
    } catch {
      resolve(undefined)
    }
  })
}
