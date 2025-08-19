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
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  experimental: {
    outputFileTracingRoot: undefined,  // disable tracing to avoid EPERM on Windows
  },
};

module.exports = withPWA(nextConfig);
