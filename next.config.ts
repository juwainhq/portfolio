import type { NextConfig } from "next";

const isProduction = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

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

  basePath: isProduction ? "/portfolio" : "",
  assetPrefix: isProduction ? "/portfolio/" : "",

  output: "export",
};

export default nextConfig;
