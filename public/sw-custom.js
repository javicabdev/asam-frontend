// Custom Service Worker additions for ASAM PWA
// This file is merged with Workbox-generated service worker

// Handle offline navigation
self.addEventListener('fetch', (event) => {
  // Only handle navigation requests
  if (event.request.mode !== 'navigate') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // Return the offline page when offline
      return caches.match('/offline.html');
    })
  );
});

// Listen for skip waiting signal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Clean old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Feature: Clean up old caches
      const cacheNames = await caches.keys();
      const currentCaches = [
        'app-shell-cache',
        'static-assets-cache',
        'images-cache',
        'google-fonts-cache',
        'gstatic-fonts-cache',
        'api-cache',
        'user-data-cache',
      ];

      await Promise.all(
        cacheNames
          .filter((cacheName) => !currentCaches.includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );

      // Claim all clients
      await self.clients.claim();
    })()
  );
});

// Background sync for failed mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(syncMutations());
  }
});

async function syncMutations() {
  try {
    // Get queued mutations from IndexedDB or cache
    const cache = await caches.open('api-sync-queue');
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        // Retry the request
        const response = await fetch(request);
        
        if (response.ok) {
          // Remove from queue if successful
          await cache.delete(request);
          
          // Notify the client
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_COMPLETE',
              url: request.url,
            });
          });
        }
      } catch (error) {
        console.error('Failed to sync request:', request.url, error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Handle notification actions
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data.data,
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
