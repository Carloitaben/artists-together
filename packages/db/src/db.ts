import { createClient } from "@libsql/client/web"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "./schema"

export function libsql() {
  return createClient({
    url: process.env.DATABASE_URL || "http://127.0.0.1:8080",
    authToken: process.env.DATABASE_AUTH_TOKEN || "",
    fetch: globalThis.fetch,
    intMode: "number",
  })
}

export function connect() {
  return drizzle(libsql(), { schema })
}

export const db = connect()
