import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages base path
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/portfolio",
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : "/portfolio/",
    // Enable static export for GitHub Pages
    output: "export",
  };

export default nextConfig;
