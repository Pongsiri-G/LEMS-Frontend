import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Replace with your image host
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      }
    ],
  },
}

export default nextConfig
