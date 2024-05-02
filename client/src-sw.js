const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

// precacheAndRoute(self.__WB_MANIFEST);
precacheAndRoute(
  self.__WB_MANIFEST.map((entry) => ({
    url: `/${entry.url}`,
    revision: entry.revision,
  })),
);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// Implement the offline fallback strategy
const assetsCache = new CacheFirst({
  cacheName: "assets-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 60,
      maxAgeSeconds: 365 * 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
  ],
});

registerRoute(
  ({ url }) =>
    url.pathname.startsWith("/src/css/") ||
    url.pathname.startsWith("/src/images/") ||
    url.pathname.startsWith("/src/js/"),
  assetsCache,
);
