import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions:{
       bodySizeLimit: "100MB"
    }
  },
  images: {
    domains: ['images.unsplash.com']
  }
};

export default nextConfig;
