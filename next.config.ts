import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'monkeymum.cz',
      },
      {
        protocol: 'https',
        hostname: '**.monkeymum.cz',
      },
    ],
  },
}

export default nextConfig
