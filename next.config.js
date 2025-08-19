const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/], // prevent SSR leftovers
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // required for Azure static
  distDir: "out",         // specify output directory explicitly - this replaces the need for next export -o out
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  experimental: {
    outputFileTracingRoot: undefined,  // disable tracing to avoid EPERM on Windows
  },
  // Temporarily disable PWA to fix build issues
  webpack: (config) => {
    // Fix for syntax errors in build process
    config.optimization.minimize = false;
    return config;
  }
};

// Temporarily bypass PWA to fix build issues
module.exports = nextConfig;
