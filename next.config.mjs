/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  /* Force Next.js to strictly keep all trailing slashes in your URLs */
  trailingSlash: true,

  /* Disable auto-reload and the HMR WebSocket.
   *
   * DO NOT remove HotModuleReplacementPlugin — Next.js's own client bundle
   * (next-dev.js / register-deployment-id-global.js) still imports HMR
   * internals and crashes with:
   *   "Cannot read properties of undefined (reading 'data')"
   * if the plugin is absent.
   *
   * Safe strategy:
   *  1. Strip only the HMR *client entry* modules (the pieces that open
   *     the /_next/webpack-hmr WebSocket in the browser), while leaving
   *     HotModuleReplacementPlugin intact so Next internals don't crash.
   *  2. Freeze watchOptions so webpack never detects file changes and
   *     never triggers a rebuild or pushes a reload signal.
   */
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 1. Drop HMR *client* entries — these are the modules that open the
      //    WebSocket. The plugin itself stays so next-dev.js can read its data.
      const HMR_ENTRY_RE =
        /webpack-hot-middleware|webpack[\\/]hot[\\/]|next[\\/]dist[\\/]client[\\/]webpack|noop-turbopack-hmr/;

      const stripHmr = (entries) =>
        Array.isArray(entries)
          ? entries.filter((e) => typeof e !== 'string' || !HMR_ENTRY_RE.test(e))
          : entries;

      if (Array.isArray(config.entry)) {
        config.entry = stripHmr(config.entry);
      } else if (config.entry && typeof config.entry === 'object') {
        for (const key of Object.keys(config.entry)) {
          config.entry[key] = stripHmr(config.entry[key]);
        }
      }

      // 2. Stop webpack's file-watcher entirely — no changes detected,
      //    no rebuild, no reload ping over the WebSocket.
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: /.*/,
        poll: false,
      };
    }
    return config;
  },

  /* Proxy all /api/ calls to your backend on port 8000 */
  async rewrites() {
    return [
      {
        source: '/api/docs/:path*',
        destination: 'https://fileforge-backend-sh8q.onrender.com/api/docs/:path*',
      },
      {
        source: '/api/images/:path*',
        destination: 'https://fileforge-backend-sh8q.onrender.com/api/images/:path*',
      },
    ];
  },
};

export default nextConfig;
