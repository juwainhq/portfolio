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

  basePath: "/portfolio",
  assetPrefix: "/portfolio/",
  trailingSlash: true,

  output: "export",
};

export default nextConfig;
