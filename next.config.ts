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
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.monkeymum.com https://*.monkeymum.cz http://localhost:* http://127.0.0.1:*",
          },
          {
            key: 'X-Frame-Options',
            value: '', // Clear X-Frame-Options so CSP frame-ancestors takes precedence
          },
        ],
      },
      {
        source: '/((?!embed).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

export default nextConfig
