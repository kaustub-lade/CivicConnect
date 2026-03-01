const CACHE_NAME = 'civicconnect-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Don't cache API requests or Socket.io connections
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('socket.io') ||
      event.request.url.includes('localhost:5000') ||
      event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Background sync for offline complaint reporting
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-complaints') {
    event.waitUntil(syncComplaints());
  }
});

async function syncComplaints() {
  try {
    // Get pending complaints from IndexedDB
    const db = await openDatabase();
    const pendingComplaints = await getPendingComplaints(db);

    // Try to sync each complaint
    for (const complaint of pendingComplaints) {
      try {
        const response = await fetch('/api/complaints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${complaint.token}`,
          },
          body: JSON.stringify(complaint.data),
        });

        if (response.ok) {
          // Remove from pending after successful sync
          await removePendingComplaint(db, complaint.id);
        }
      } catch (error) {
        console.error('Failed to sync complaint:', error);
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Helper functions for IndexedDB (simplified)
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CivicConnectDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingComplaints(db) {
  return new Promise((resolve) => {
    const transaction = db.transaction(['pendingComplaints'], 'readonly');
    const store = transaction.objectStore('pendingComplaints');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
  });
}

function removePendingComplaint(db, id) {
  return new Promise((resolve) => {
    const transaction = db.transaction(['pendingComplaints'], 'readwrite');
    const store = transaction.objectStore('pendingComplaints');
    store.delete(id);
    transaction.oncomplete = () => resolve();
  });
}
