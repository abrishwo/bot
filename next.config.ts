import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: ['c8.alamy.com','image.shutterstock.com', 'www.shutterstock.com','*'], // Add the external image domain here
  },

  eslint: {
    ignoreDuringBuilds: true,  // Disables ESLint during the build
  },
};

export default nextConfig;
