import { describe, it, expect } from 'vitest';
import {
  formatCompactNumber,
  formatDuration,
  calculateAspectRatio,
  formatRelativeTime,
  truncateText,
} from '../utils/formatters';

describe('Formatters Utilities', () => {
  describe('formatCompactNumber', () => {
    it('formats numbers below 1000 verbatim', () => {
      expect(formatCompactNumber(0)).toBe('0');
      expect(formatCompactNumber(450)).toBe('450');
      expect(formatCompactNumber(999)).toBe('999');
    });

    it('formats thousands with k suffix', () => {
      expect(formatCompactNumber(1000)).toBe('1k');
      expect(formatCompactNumber(1200)).toBe('1.2k');
      expect(formatCompactNumber(25000)).toBe('25k');
      expect(formatCompactNumber(999000)).toBe('999k');
    });

    it('formats millions with M suffix', () => {
      expect(formatCompactNumber(1000000)).toBe('1M');
      expect(formatCompactNumber(2400000)).toBe('2.4M');
    });

    it('handles negative or undefined values cleanly', () => {
      expect(formatCompactNumber(-5)).toBe('0');
      expect(formatCompactNumber(0)).toBe('0');
    });
  });

  describe('formatDuration', () => {
    it('formats seconds into MM:SS correctly', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(5)).toBe('0:05');
      expect(formatDuration(45)).toBe('0:45');
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(74)).toBe('1:14');
      expect(formatDuration(125)).toBe('2:05');
    });

    it('handles missing or negative duration', () => {
      expect(formatDuration(undefined)).toBe('0:00');
      expect(formatDuration(-10)).toBe('0:00');
    });
  });

  describe('calculateAspectRatio', () => {
    it('computes aspect ratio decimal value correctly', () => {
      expect(calculateAspectRatio(1024, 1024)).toBe(1);
      expect(calculateAspectRatio(1920, 1080)).toBe(1.778);
      expect(calculateAspectRatio(1080, 1920)).toBe(0.563);
    });

    it('handles zero or invalid dimensions without divide-by-zero errors', () => {
      expect(calculateAspectRatio(0, 1080)).toBe(1);
      expect(calculateAspectRatio(1920, 0)).toBe(1);
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "Baru saja" for current timestamp', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('Baru saja');
    });

    it('returns minutes ago for timestamps under an hour', () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatRelativeTime(tenMinutesAgo)).toBe('10 menit lalu');
    });

    it('returns hours ago for timestamps under 24 hours', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(threeHoursAgo)).toBe('3 jam lalu');
    });

    it('handles invalid dates safely', () => {
      expect(formatRelativeTime('invalid-date-string')).toBe('Baru saja');
    });
  });

  describe('truncateText', () => {
    it('returns short text unmodified', () => {
      expect(truncateText('Hello world', 20)).toBe('Hello world');
    });

    it('truncates long text and appends ellipsis', () => {
      expect(truncateText('A very long description of an AI artwork', 15)).toBe('A very long des...');
    });

    it('handles empty text', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });
});
