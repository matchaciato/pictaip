import type { MediaItem } from '../types/media';

const CACHE_KEY = 'pictaip_catalog_cache_v1';
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedCatalogEnvelope {
  timestamp: number;
  items: MediaItem[];
}

let memoryCache: CachedCatalogEnvelope | null = null;

export const mediaCache = {
  getCachedItems(): MediaItem[] | null {
    const now = Date.now();

    if (memoryCache && now - memoryCache.timestamp < DEFAULT_TTL_MS) {
      return memoryCache.items;
    }

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const envelope: CachedCatalogEnvelope = JSON.parse(raw);
          if (envelope && now - envelope.timestamp < DEFAULT_TTL_MS) {
            memoryCache = envelope;
            return envelope.items;
          }
        }
      } catch {
        // Ignore session storage parse/quota issues safely
      }
    }

    return null;
  },

  setCachedItems(items: MediaItem[]): void {
    const envelope: CachedCatalogEnvelope = {
      timestamp: Date.now(),
      items,
    };

    memoryCache = envelope;

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(envelope));
      } catch {
        // Quota exceeded on low memory devices; in-memory fallback remains intact
      }
    }
  },

  invalidate(): void {
    memoryCache = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem(CACHE_KEY);
      } catch {
        // Safe no-op
      }
    }
  },
};
