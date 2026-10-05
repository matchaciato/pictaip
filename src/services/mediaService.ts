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
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { MediaItem } from '../types/media';
import { MOCK_MEDIA_ITEMS } from '../data/mockMedia';

const MEDIA_COLLECTION = 'media';

/**
 * Service to fetch, subscribe, seed, and manage media items dynamically in Firebase Firestore.
 */
export const mediaService = {
  /**
   * Fetches all media items.
   * If Firestore is configured and has documents, returns from Firestore.
   * Otherwise falls back gracefully to default catalog.
   */
  async getMediaItems(): Promise<{ items: MediaItem[]; isFromFirebase: boolean }> {
    if (!isFirebaseConfigured() || !db) {
      console.info('[MediaService] Firebase not configured, serving default catalog.');
      return { items: MOCK_MEDIA_ITEMS, isFromFirebase: false };
    }

    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const q = query(mediaRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.info('[MediaService] Firestore collection empty. Seeding initial catalog...');
        await this.seedInitialData(MOCK_MEDIA_ITEMS);
        return { items: MOCK_MEDIA_ITEMS, isFromFirebase: true };
      }

      const items = snapshot.docs.map((docSnap) => docSnap.data() as MediaItem);
      return { items, isFromFirebase: true };
    } catch (error) {
      console.warn('[MediaService] Error fetching from Firestore, falling back:', error);
      return { items: MOCK_MEDIA_ITEMS, isFromFirebase: false };
    }
  },

  /**
   * Subscribes to real-time changes in Firestore media collection.
   * Allows administrator to add/edit/delete pictures in Firebase Console and see instant live updates!
   */
  subscribeToMedia(
    onUpdate: (items: MediaItem[], isFromFirebase: boolean) => void
  ): Unsubscribe | null {
    if (!isFirebaseConfigured() || !db) {
      onUpdate(MOCK_MEDIA_ITEMS, false);
      return null;
    }

    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const q = query(mediaRef, orderBy('createdAt', 'desc'));

      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((docSnap) => docSnap.data() as MediaItem);
            onUpdate(items, true);
          } else {
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

  /**
   * Seeds initial catalog into Firestore for administrator management.
   */
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

  /**
   * Admin: Add a new media item to Firestore.
   */
  async addMediaItem(item: MediaItem): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const itemRef = doc(db, MEDIA_COLLECTION, item.id);
      await setDoc(itemRef, item);
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to add media item:', error);
      return false;
    }
  },

  /**
   * Admin: Update an existing media item in Firestore.
   */
  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const itemRef = doc(db, MEDIA_COLLECTION, id);
      await updateDoc(itemRef, updates);
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to update media item:', error);
      return false;
    }
  },

  /**
   * Admin: Delete a media item from Firestore.
   */
  async deleteMediaItem(id: string): Promise<boolean> {
    if (!isFirebaseConfigured() || !db) return false;
    try {
      const itemRef = doc(db, MEDIA_COLLECTION, id);
      await deleteDoc(itemRef);
      return true;
    } catch (error) {
      console.error('[MediaService] Failed to delete media item:', error);
      return false;
    }
  },
};
