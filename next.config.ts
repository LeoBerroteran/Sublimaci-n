import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables x-powered-by header
  poweredByHeader: false,
  // Ensure images from external providers (like Supabase storage or Unsplash) load properly
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
