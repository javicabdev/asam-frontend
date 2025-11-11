import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    build: {
      // Configuración optimizada para producción
      rollupOptions: {
        output: {
          // Desactivar code splitting temporal para depuración
          manualChunks: undefined,
          // Un solo archivo JS
          inlineDynamicImports: true,
          // Configuración de nombres de archivo
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      // Configuración de compatibilidad
      target: 'es2015',
      // Usar terser para mejor minificación y compatibilidad
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: isProduction ? {
        compress: {
          drop_console: false, // Mantener console.logs para debug
          drop_debugger: true,
          pure_funcs: ['console.debug']
        },
        format: {
          comments: false
        }
      } : undefined,
      // Prevenir warnings de chunks grandes
      chunkSizeWarningLimit: 1000,
      // Generar sourcemaps para debug en producción
      sourcemap: true
    },
    
    plugins: [
      react(),
      
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: true,
          type: 'module'
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api/, /^\/graphql/],
          runtimeCaching: [
            // Google Fonts CSS
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            // Google Fonts Files
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            // GraphQL API - Strategy: StaleWhileRevalidate for better offline UX
            // This allows showing cached data immediately while fetching fresh data in background
            {
              urlPattern: /\/graphql/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'graphql-cache',
                networkTimeoutSeconds: 3, // Show cached data after 3s if network is slow
                expiration: {
                  maxEntries: 100, // Increased from 50 to cache more queries
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days for better offline experience
                },
                cacheableResponse: {
                  statuses: [0, 200]
                },
                plugins: [
                  {
                    // Custom plugin to add request method to cache key
                    // This ensures GET and POST requests are cached separately
                    cacheKeyWillBeUsed: async ({ request }) => {
                      return request.url + '|' + request.method
                    }
                  }
                ]
              }
            },
            // Images - Cache first for performance
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        manifest: {
          name: 'Mutua ASAM - Solidaridad y Apoyo',
          short_name: 'Mutua ASAM',
          description: 'Asociación para la repatriación de socios fallecidos',
          start_url: '/dashboard',
          display: 'standalone',
          orientation: 'portrait',
          theme_color: '#1976d2',
          background_color: '#ffffff',
          scope: '/',
          lang: 'es-ES',
          dir: 'ltr',
          categories: ['finance', 'utilities'],
          icons: [
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/maskable-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/icons/maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          screenshots: [
            {
              src: '/screenshots/dashboard.png',
              sizes: '1280x720',
              type: 'image/png',
              label: 'Panel principal de ASAM'
            },
            {
              src: '/screenshots/members.png',
              sizes: '1280x720',
              type: 'image/png',
              label: 'Gestión de miembros'
            }
          ],
          shortcuts: [
            {
              name: 'Nuevo Pago',
              short_name: 'Pago',
              description: 'Registrar un nuevo pago',
              url: '/payments/new',
              icons: [
                {
                  src: '/icons/payment-96x96.png',
                  sizes: '96x96',
                  type: 'image/png'
                }
              ]
            },
            {
              name: 'Nuevo Miembro',
              short_name: 'Miembro',
              description: 'Registrar un nuevo miembro',
              url: '/members/new',
              icons: [
                {
                  src: '/icons/member-96x96.png',
                  sizes: '96x96',
                  type: 'image/png'
                }
              ]
            }
          ]
        }
      })
    ],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@graphql': path.resolve(__dirname, './src/graphql'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@types': path.resolve(__dirname, './src/types'),
        '@stores': path.resolve(__dirname, './src/stores')
      }
    },
    
    server: {
      port: 5173,
      proxy: {
        '/graphql': {
          target: env.VITE_GRAPHQL_URI || 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    },
    
    // Optimización de dependencias
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        '@emotion/react',
        '@emotion/styled',
        '@apollo/client',
        'graphql'
      ],
      exclude: ['@vite/client', '@vite/env']
    }
  }
})
