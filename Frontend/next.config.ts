// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.4.0/24',
    '10.0.4.4',
    'localhost'
  ],
};

export default nextConfig;