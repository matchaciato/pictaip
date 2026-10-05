/**
 * Safe client-side media download helper.
 * Handles cross-origin image & video downloads via Blob conversion,
 * with fallbacks and clean filename sanitization.
 */

export interface DownloadOptions {
  url: string;
  filename: string;
  onProgress?: (percent: number) => void;
}

/**
 * Sanitizes a title string to be safe for filenames across Windows, macOS, and Linux
 */
export function sanitizeFilename(title: string, id: string, extension: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40)
    .replace(/^_|_$/g, '');

  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return `pictaip_${cleanTitle || 'ai_creation'}_${id.slice(0, 8)}${ext}`;
}

/**
 * Downloads a file by fetching it as a blob and triggering an anchor download,
 * falling back to direct anchor navigation if CORS blocks blob fetching.
 */
export async function downloadMediaFile(options: DownloadOptions): Promise<boolean> {
  const { url, filename } = options;

  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = objectUrl;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
    }, 150);

    return true;
  } catch (error) {
    console.warn('[DownloadHelper] Blob download failed, falling back to direct link:', error);

    // Fallback: direct anchor download (cross-origin might open in new tab instead of prompt, but won't crash)
    try {
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = url;
      anchor.download = filename;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';

      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        document.body.removeChild(anchor);
      }, 150);

      return true;
    } catch (fallbackError) {
      console.error('[DownloadHelper] Both download methods failed:', fallbackError);
      return false;
    }
  }
}
