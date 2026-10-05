import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeFilename, downloadMediaFile } from '../utils/downloadHelper';

describe('Download Helper Utilities', () => {
  describe('sanitizeFilename', () => {
    it('creates sanitized, safe filename with pictaip prefix and extension', () => {
      const result = sanitizeFilename('Cyberpunk Samurai Cat', 'item-12345678-abcd', 'jpg');
      expect(result).toBe('pictaip_cyberpunk_samurai_cat_item-123.jpg');
    });

    it('strips special characters and path traversal tokens', () => {
      const result = sanitizeFilename('../../../Dangerous/File*Name?!:;', 'safe-id-999', '.png');
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
      expect(result).not.toContain('*');
      expect(result).toBe('pictaip_dangerous_file_name_safe-id-.png');
    });

    it('handles empty title by falling back to "ai_creation"', () => {
      const result = sanitizeFilename('', 'fallback-id-123', 'mp4');
      expect(result).toBe('pictaip_ai_creation_fallback.mp4');
    });

    it('normalizes extensions missing leading dots', () => {
      const withDot = sanitizeFilename('Test Artwork', 'abc12345', '.jpg');
      const withoutDot = sanitizeFilename('Test Artwork', 'abc12345', 'jpg');
      expect(withDot).toBe(withoutDot);
      expect(withoutDot.endsWith('.jpg')).toBe(true);
    });

    it('limits title length to 40 characters maximum', () => {
      const longTitle = 'a'.repeat(80);
      const result = sanitizeFilename(longTitle, 'short-id', 'jpg');
      expect(result.length).toBeLessThan(80);
      expect(result).toContain('a'.repeat(40));
    });
  });

  describe('downloadMediaFile', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('successfully triggers blob download when fetch succeeds', async () => {
      const mockBlob = new Blob(['mock-data'], { type: 'image/jpeg' });
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      });

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      const success = await downloadMediaFile({
        url: 'https://images.unsplash.com/photo-test.jpg',
        filename: 'pictaip_test.jpg',
      });

      expect(success).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledWith('https://images.unsplash.com/photo-test.jpg', {
        method: 'GET',
        mode: 'cors',
      });
      expect(appendChildSpy).toHaveBeenCalled();
    });

    it('falls back to direct link download when blob fetch throws an error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('CORS blocked'));
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');

      const success = await downloadMediaFile({
        url: 'https://cdn.example.com/external-video.mp4',
        filename: 'pictaip_fallback.mp4',
      });

      expect(success).toBe(true);
      expect(appendChildSpy).toHaveBeenCalled();
    });
  });
});
