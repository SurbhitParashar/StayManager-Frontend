import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  // Skip static generation for dynamic pages to avoid build errors
  experimental: {
    preloadFonts: true,
  },
};

export default nextConfig;
