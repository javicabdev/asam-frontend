import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: false, // Usamos nuestro propio manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        // Incluir la página offline en el precache
        additionalManifestEntries: [
          { url: '/offline.html', revision: null }
        ],
        // Estrategias de caché avanzadas
        runtimeCaching: [
          {
            // App Shell - Cache First
            urlPattern: /^\/$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            // Assets estáticos (JS, CSS) - Cache First
            urlPattern: /\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            // Imágenes - Cache First
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            // Google Fonts - Cache First
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 días
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Google Fonts Static - Cache First
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 días
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // API GraphQL - Stale While Revalidate
            urlPattern: /\/graphql/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              // Background sync para mutaciones
              backgroundSync: {
                name: 'api-sync-queue',
                options: {
                  maxRetentionTime: 24 * 60 // Reintentar por 24 horas
                }
              }
            }
          },
          {
            // Datos de usuario - Network First
            urlPattern: /\/api\/user\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'user-data-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 // 1 hora
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        // Página offline personalizada
        navigateFallback: null,
        navigateFallbackDenylist: [/^\/api/, /^\/graphql/],
        // Manejar navegación offline
        navigationPreload: true
      },
      // Configuración para desarrollo
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
