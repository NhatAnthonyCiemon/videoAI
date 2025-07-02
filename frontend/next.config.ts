import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true, // ✅ Tắt lint khi build
    },
    experimental: {
    }
};

export default nextConfig;
