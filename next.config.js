/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
    output: 'export',
    images: { unoptimized: true },

    trailingSlash: true,
    
    typescript: {
        ignoreBuildErrors: true,
    },

    server: {
        host: '0.0.0.0',  // 允许所有网络接口访问
    },

    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },

}

module.exports = nextConfig;
