import { json } from "@remix-run/node"
import { makeRemoteAsset } from "~/server/files.server"

export async function loader() {
  const src =
    "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?q=80&w=1287&auto=format"

  const alt = "Lorem ipsum"

  const asset = await makeRemoteAsset(src)

  return json({
    asset,
    alt,
  })
}