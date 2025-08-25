import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isAnalyze = mode === 'analyze'

  return {
    build: {
      // Configuración para optimizar el tamaño de chunks
      rollupOptions: {
        output: {
          // División manual de chunks más granular
          manualChunks: (id) => {
            // Separar las dependencias grandes en chunks individuales
            if (id.includes('node_modules')) {
              // Material-UI - División más granular
              if (id.includes('@mui/material/styles')) {
                return 'mui-styles';
              }
              if (id.includes('@mui/material/Button') || 
                  id.includes('@mui/material/TextField') ||
                  id.includes('@mui/material/Box')) {
                return 'mui-core';
              }
              if (id.includes('@mui/material')) {
                return 'mui-components';
              }
              if (id.includes('@mui/icons-material')) {
                return 'mui-icons';
              }
              
              // DataGrid de MUI - Separar componentes pesados
              if (id.includes('@mui/x-data-grid-pro')) {
                return 'mui-data-grid-pro';
              }
              if (id.includes('@mui/x-data-grid')) {
                return 'mui-data-grid';
              }
              
              // Apollo Client - División más granular
              if (id.includes('@apollo/client/core')) {
                return 'apollo-core';
              }
              if (id.includes('@apollo/client/cache')) {
                return 'apollo-cache';
              }
              if (id.includes('@apollo/client')) {
                return 'apollo-client';
              }
              if (id.includes('graphql')) {
                return 'graphql';
              }
              
              // React ecosystem
              if (id.includes('react-dom')) {
                return 'react-dom';
              }
              if (id.includes('react-router')) {
                return 'react-router';
              }
              if (id.includes('react/jsx-runtime')) {
                return 'react-jsx';
              }
              if (id.includes('react')) {
                return 'react';
              }
              
              // Librerías de formularios
              if (id.includes('react-hook-form')) {
                return 'react-hook-form';
              }
              if (id.includes('yup')) {
                return 'yup';
              }
              if (id.includes('@hookform')) {
                return 'hookform-resolvers';
              }
              
              // Date utilities
              if (id.includes('date-fns')) {
                return 'date-fns';
              }
              
              // i18n
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'i18n';
              }
              
              // Utilidades pequeñas agrupadas
              if (id.includes('clsx') || 
                  id.includes('classnames') || 
                  id.includes('tslib')) {
                return 'utils-small';
              }
              
              // Emotion (CSS-in-JS usado por MUI)
              if (id.includes('@emotion')) {
                return 'emotion';
              }
              
              // Zustand state management
              if (id.includes('zustand')) {
                return 'zustand';
              }
              
              // Resto de vendor code
              return 'vendor-misc';
            }
            
            // Separar features grandes
            if (id.includes('src/features/members/components/MembersTable')) {
              return 'members-table';
            }
            if (id.includes('src/features/members/components/MemberForm')) {
              return 'members-form';
            }
            if (id.includes('src/features/members')) {
              return 'members-feature';
            }
            
            // Separar componentes compartidos pesados
            if (id.includes('src/components/shared') && id.includes('Table')) {
              return 'shared-tables';
            }
            if (id.includes('src/components/shared') && id.includes('Form')) {
              return 'shared-forms';
            }
          },
          
          // Configuración de nombres de archivo más limpios
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name].[hash:8].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name].[hash:8][extname]`;
            }
            if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
              return `fonts/[name].[hash:8][extname]`;
            }
            return `assets/[name].[hash:8][extname]`;
          },
          entryFileNames: 'js/[name].[hash:8].js',
        },
        
        // Optimización adicional: external para CDN (opcional)
        // Si quieres cargar React desde CDN para reducir aún más el bundle:
        // external: ['react', 'react-dom'],
      },
      
      // Límite de advertencia para chunks grandes (150KB)
      chunkSizeWarningLimit: 150,
      
      // Minificación con terser para mejor compresión
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
          passes: 2, // Múltiples pasadas para mejor compresión
        },
        mangle: {
          safari10: true, // Compatibilidad con Safari 10
        },
        format: {
          comments: false, // Eliminar todos los comentarios
        },
      },
      
      // Generar sourcemaps para debugging
      sourcemap: true,
      
      // Mejorar tree-shaking
      cssCodeSplit: true,
      
      // Configuración adicional de optimización
      reportCompressedSize: false, // Más rápido sin reportar tamaño comprimido
      
      // Configuración de módulos
      modulePreload: {
        polyfill: true, // Polyfill para modulepreload en navegadores antiguos
      },
    },
    
    // Optimizaciones adicionales
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@apollo/client',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },
    
    // Configuración de CSS
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      // preprocessorOptions: {
      //   scss: {
      //     additionalData: `@import "@/styles/variables.scss";`,
      //   },
      // },
    },
    
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          cleanupOutdatedCaches: true,
          sourcemap: false, // No sourcemaps en SW para reducir tamaño
          
          // Excluir chunks muy grandes del precache
          maximumFileSizeToCacheInBytes: 300 * 1024, // 300KB max para precache (aumentado para incluir chunks grandes)
          
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
              // Assets estáticos (JS, CSS) - Cache First con Network Fallback
              urlPattern: /\.(?:js|css)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets-cache',
                expiration: {
                  maxEntries: 100, // Más entradas para múltiples chunks
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              }
            },
            {
              // Chunks grandes - Network First para actualizaciones
              urlPattern: /\/js\/(mui|vendor|apollo).*\.js$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'large-chunks-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
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
                backgroundSync: {
                  name: 'api-sync-queue',
                  options: {
                    maxRetentionTime: 24 * 60 // Reintentar por 24 horas
                  }
                }
              }
            },
          ],
          navigateFallback: null,
          navigateFallbackDenylist: [/^\/api/, /^\/graphql/],
          navigationPreload: true
        },
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
    },
    
    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    }
  }
})
