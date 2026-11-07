import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    // Off because restarting the dev server on this cache can leave pages reloading
    // themselves in a loop. It only makes the first dev compile a little slower.
    turbopackFileSystemCacheForDev: false,
  },
};

export default config;
