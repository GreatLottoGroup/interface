/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
    output: 'export',
    images: { unoptimized: true },

    trailingSlash: true,
    
    typescript: {
        ignoreBuildErrors: true,
    },

    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },

}

module.exports = nextConfig;
