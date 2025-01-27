import "dotenv-mono/load"
import type { NextConfig } from "next"

export default {
  env: {
    PORT: process.env.PORT || "3000",
  },
  experimental: {
    ppr: true,
  },
} satisfies NextConfig