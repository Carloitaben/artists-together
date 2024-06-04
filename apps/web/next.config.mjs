import "dotenv-mono/load"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    staleTimes: {
      dynamic: Infinity,
      static: Infinity,
    },
  },
}

export default nextConfig
