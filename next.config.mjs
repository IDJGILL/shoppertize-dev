await import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.shoppertize.in",
      },
    ],
  },
}

export default config
