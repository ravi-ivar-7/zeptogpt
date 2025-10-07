import type { NextConfig } from "next";

// Import environment validator to run at startup
import '@/main/services/env/envValidator';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      {
        source: '/account/:path*',
        destination: '/main/account/:path*',
      },
      {
        source: '/company/:path*',
        destination: '/main/company/:path*',
      },
    ]
  },
};

export default nextConfig;
