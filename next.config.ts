import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    const upstream = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
    const url = new URL(upstream);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('API_URL must be an HTTP(S) API URL without credentials, query, or fragment');
    }
    return [{ source: '/api/:path*', destination: `${upstream}/:path*` }];
  },
};

export default nextConfig;
