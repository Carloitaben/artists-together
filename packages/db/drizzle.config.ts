import "dotenv-mono/load"
import type { Config } from "drizzle-kit"

export default {
  schema: "src/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "http://127.0.0.1:8080",
    authToken: process.env.DATABASE_AUTH_TOKEN || "",
  },
} satisfies Config
