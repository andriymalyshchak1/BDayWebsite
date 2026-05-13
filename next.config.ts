import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    clientInstrumentationHook: true,
  },
};

export default nextConfig;
