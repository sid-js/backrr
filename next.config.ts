import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
    config.module.rules.push({
        test: /\.node$/,
        loader: 'node-loader'
    });
    return config;
}
};

export default nextConfig;
