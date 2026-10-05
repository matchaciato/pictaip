/**
 * Utility functions for formatting numbers, dates, video durations, and dimensions.
 */

/**
 * Formats large numbers into readable compact strings (e.g. 1200 -> "1.2k", 1400000 -> "1.4M")
 */
export function formatCompactNumber(num: number): string {
  if (!num || num < 0) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${Math.floor(num / 1000)}k` : `${formatted}k`;
  }
  const formatted = (num / 1000000).toFixed(1);
  return formatted.endsWith('.0') ? `${Math.floor(num / 1000000)}M` : `${formatted}M`;
}

/**
 * Formats seconds into MM:SS format for video durations (e.g. 5 -> "0:05", 72 -> "1:12")
 */
export function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const remainingSecs = Math.floor(seconds % 60);
  return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
}

/**
 * Returns aspect ratio decimal value (width / height)
 */
export function calculateAspectRatio(width: number, height: number): number {
  if (!width || !height || height === 0) return 1;
  return Number((width / height).toFixed(3));
}

/**
 * Formats timestamp into human-readable relative time in Indonesian
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 60) {
    return 'Baru saja';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari lalu`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan lalu`;
  }
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} tahun lalu`;
}

/**
 * Sanitize prompt for clean display
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
