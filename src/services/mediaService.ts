import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { mediaCache } from './mediaCache';
import type { MediaItem } from '../types/media';
import { MOCK_MEDIA_ITEMS } from '../data/mockMedia';

const MEDIA_COLLECTION = 'media';
const DEFAULT_QUERY_LIMIT = 100;

export interface FetchMediaOptions {
  limitCount?: number;
  forceRefresh?: boolean;
}

export const mediaService = {
  async getMediaItems(options?: FetchMediaOptions): Promise<{ items: MediaItem[]; isFromFirebase: boolean }> {
    if (!options?.forceRefresh) {
      const cached = mediaCache.getCachedItems();
      if (cached && cached.length > 0) {
        return { items: cached, isFromFirebase: true };
      }
    }

    if (!isFirebaseConfigured() || !db) {
      console.info('[MediaService] Firebase not configured, serving default catalog.');
      return { items: MOCK_MEDIA_ITEMS, isFromFirebase: false };
    }

    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const limitCount = options?.limitCount || DEFAULT_QUERY_LIMIT;
      const q = query(mediaRef, orderBy('createdAt', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.info('[MediaService] Firestore collection empty. Seeding initial catalog...');
        await this.seedInitialData(MOCK_MEDIA_ITEMS);
        mediaCache.setCachedItems(MOCK_MEDIA_ITEMS);
        return { items: MOCK_MEDIA_ITEMS, isFromFirebase: true };
      }

      const items = snapshot.docs.map((docSnap) => docSnap.data() as MediaItem);
      mediaCache.setCachedItems(items);
      return { items, isFromFirebase: true };
    } catch (error) {
      console.warn('[MediaService] Error fetching from Firestore, falling back:', error);
      return { items: MOCK_MEDIA_ITEMS, isFromFirebase: false };
    }
  },

  subscribeToMedia(
    onUpdate: (items: MediaItem[], isFromFirebase: boolean) => void,
    options?: { limitCount?: number }
  ): Unsubscribe | null {
    const cached = mediaCache.getCachedItems();
    if (cached && cached.length > 0) {
      onUpdate(cached, true);
    }

    if (!isFirebaseConfigured() || !db) {
      onUpdate(MOCK_MEDIA_ITEMS, false);
      return null;
    }

    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const limitCount = options?.limitCount || DEFAULT_QUERY_LIMIT;
      const q = query(mediaRef, orderBy('createdAt', 'desc'), limit(limitCount));

      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((docSnap) => docSnap.data() as MediaItem);
            mediaCache.setCachedItems(items);
            onUpdate(items, true);
          } else {
            mediaCache.setCachedItems(MOCK_MEDIA_ITEMS);
            onUpdate(MOCK_MEDIA_ITEMS, true);
          }
        },
        (error) => {
          console.warn('[MediaService] Real-time listener error, falling back:', error);
          onUpdate(MOCK_MEDIA_ITEMS, false);
        }
      );
    } catch (error) {
      console.warn('[MediaService] Failed to set up subscription:', error);
      onUpdate(MOCK_MEDIA_ITEMS, false);
      return null;
    }
  },

  async seedInitialData(items: MediaItem[]): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;

    try {
      for (const item of items) {
        const itemRef = doc(db, MEDIA_COLLECTION, item.id);
        await setDoc(itemRef, item, { merge: true });
      }
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to seed initial data:', error);
      return false;
    }
  },

  async addMediaItem(item: MediaItem): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const itemRef = doc(db, MEDIA_COLLECTION, item.id);
      await setDoc(itemRef, item);
      mediaCache.invalidate();
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to add media item:', error);
      return false;
    }
  },

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const itemRef = doc(db, MEDIA_COLLECTION, id);
      await updateDoc(itemRef, updates);
      mediaCache.invalidate();
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to update media item:', error);
      return false;
    }
  },

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const itemRef = doc(db, MEDIA_COLLECTION, id);
      await deleteDoc(itemRef);
      mediaCache.invalidate();
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to delete media item:', error);
      return false;
    }
  },
};

