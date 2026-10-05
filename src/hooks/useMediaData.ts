import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../services/mediaService';
import { isFirebaseConfigured } from '../services/firebase';
import type { MediaItem } from '../types/media';
import { MOCK_MEDIA_ITEMS } from '../data/mockMedia';

export function useMediaData() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA_ITEMS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Set up real-time subscription or fetch
    const unsubscribe = mediaService.subscribeToMedia((items, isFromFirebase) => {
      if (!isMounted) return;
      setMediaItems(items);
      setIsFirebaseConnected(isFromFirebase);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const syncToFirestore = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const success = await mediaService.seedInitialData(MOCK_MEDIA_ITEMS);
    setIsLoading(false);
    if (success) {
      setIsFirebaseConnected(true);
    }
    return success;
  }, []);

  return {
    mediaItems,
    isLoading,
    isFirebaseConnected,
    isFirebaseAvailable: isFirebaseConfigured(),
    syncToFirestore,
  };
}
