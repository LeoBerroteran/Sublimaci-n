import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables x-powered-by header for security
  poweredByHeader: false,
  // Restrict images only to verified trusted storage providers (Supabase Storage)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aurypnerbldinmjwplhd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
