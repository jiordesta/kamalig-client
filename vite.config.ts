import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // or @vitejs/plugin-react-swc
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Smoothly updates your app structure in the background when you deploy fixes
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],

      // 1. Workbox configuration handles the offline caching rules
      workbox: {
        // This regex tells the worker to cache ALL your code split assets, HTML, styles, and imagery files
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

        // Dynamic runtime API caching layout (Optional)
        // If your app fetches data from an external backend API, this caches those responses for offline fallbacks
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-endpoint\.com\/api\/.*/i,
            handler: "NetworkFirst", // Tries the internet first. If offline, instantly serves the cached database payload
            options: {
              cacheName: "api-data-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 3, // Cache data for up to 3 days
              },
            },
          },
        ],
      },

      // 2. The Web Manifest enables the "Add to Home Screen" mobile/desktop layout prompt
      manifest: {
        name: "Kamalig Management App",
        short_name: "Kamalig",
        description:
          "Inventory, stock tracking, and retail transaction management",
        theme_color: "#c385ff", // Change to match your primary dashboard accent
        background_color: "#ffffff",
        display: "standalone", // Removes browser URL address bars to make it feel like a real native app
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Required by Android to crop your launcher icons perfectly on homescreens
          },
        ],
      },
    }),
  ],
});
