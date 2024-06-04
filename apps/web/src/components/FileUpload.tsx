"use client"

import { useState } from "react";
import type { FileDropItem } from "react-aria-components"
import { Button, DropZone, FileTrigger } from "react-aria-components"
import { getAuth } from "~/services/auth/client"
import { getSignedURL } from "~/services/files/actions"
import { getFileDimensions } from "~/services/files/shared"

export default function FileUpload() {
  const [file, setFile] = useState<File>()
  const auth = getAuth()

  return (
    <>
      <form
        action={async () => {
          if (!file) return

          const dimensions = await getFileDimensions(file)

          const urls = await getSignedURL({
            bucket: "public",
            folder: "avatar",
            key: "avatar",
            filename: file.name,
            userId: auth.user.id,
            dimensions,
          })

          await fetch(urls.signedUrl, {
            body: file,
            method: "put",
            headers: {
              "Content-Type": file.type,
            },
          })

          setFile(undefined)
          alert(urls.fileUrl)
        }}
      >
        <DropZone
          onDrop={async (event) => {
            const item = event.items.find(
              (file) => file.kind === "file",
            ) as FileDropItem

            if (item) {
              const file = await item.getFile()
              setFile(file)
            }
          }}
        >
          <FileTrigger
            onSelect={(event) => {
              const file = event?.item(0)
              if (file) setFile(file)
            }}
          >
            <Button>Select files</Button>
          </FileTrigger>
        </DropZone>
        <Button type="submit" isDisabled={!file}>
          submit
        </Button>
      </form>
      {file ? file.name : null}
    </>
  )
}
