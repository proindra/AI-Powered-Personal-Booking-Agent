import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// Falls back to the repo name if the env var isn't set
const basePath = isProd
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "/AI-Powered-Personal-Booking-Agent")
  : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  webpack(config) {
    // Required for @react-three/rapier WASM (used when running with --webpack)
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;


