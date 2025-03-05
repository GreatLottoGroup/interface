const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
  } = require("next/constants");

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

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
      const withSerwist = (await import("@serwist/next")).default({
        // Note: This is only an example. If you use Pages Router,
        // use something else that works, such as "service-worker/index.ts".
        swSrc: "src/app/sw.js",
        swDest: "public/sw.js",
      });
      return withSerwist(nextConfig);
    }
  
    return nextConfig;
};
