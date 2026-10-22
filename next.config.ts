import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
}

export default nextConfig
