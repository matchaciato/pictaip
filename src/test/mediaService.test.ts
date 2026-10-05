import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mediaService } from '../services/mediaService';
import { MOCK_MEDIA_ITEMS } from '../data/mockMedia';
import { IMAGE_AI_PUBLISHER, VIDEO_AI_PUBLISHER } from '../constants/publishers';

// Mock Firebase service so unit tests run 100% offline and blazingly fast in CI
vi.mock('../services/firebase', () => ({
  db: null,
  isFirebaseConfigured: vi.fn(() => false),
}));

describe('MediaService & Fallback Catalog Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('falls back seamlessly to mock media catalog when Firebase is offline/not configured', async () => {
    const { items, isFromFirebase } = await mediaService.getMediaItems();

    expect(items).toBeDefined();
    expect(items.length).toBeGreaterThan(0);
    expect(Array.isArray(items)).toBe(true);
    expect(isFromFirebase).toBe(false);
  });

  it('guarantees that all mock media items use the standardized publishers', () => {
    const validAuthorNames = [IMAGE_AI_PUBLISHER.name, VIDEO_AI_PUBLISHER.name];

    MOCK_MEDIA_ITEMS.forEach((item) => {
      expect(validAuthorNames).toContain(item.author.name);
      if (item.type === 'video') {
        expect(item.author.name).toBe(VIDEO_AI_PUBLISHER.name);
      } else {
        expect(item.author.name).toBe(IMAGE_AI_PUBLISHER.name);
      }
    });
  });

  it('verifies that each media item has valid non-empty metadata fields', () => {
    MOCK_MEDIA_ITEMS.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.previewUrl).toBeDefined();
      expect(item.downloadUrl).toBeDefined();
      expect(item.metadata.prompt.length).toBeGreaterThan(0);
      expect(item.metadata.seed).toBeDefined();
      expect(item.metadata.aspectRatio).toBeDefined();
      expect(item.metadata.width).toBeGreaterThan(0);
      expect(item.metadata.height).toBeGreaterThan(0);
    });
  });
});
