import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Project media is still hosted where it was first published: the v4
    // (Framer) and v3 (Webflow) sites, GitHub, and YouTube thumbnails.
    remotePatterns: [
      new URL("https://framerusercontent.com/**"),
      new URL("https://cdn.prod.website-files.com/**"),
      new URL("https://raw.githubusercontent.com/rkdotxyz/**"),
      new URL("https://i.ytimg.com/vi/**"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
