export interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  fit?: 'crop' | 'clip' | 'scale' | 'max';
  isLowEnd?: boolean;
}

export function optimizeImageUrl(
  url: string,
  options: OptimizeImageOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';

  const {
    width,
    height,
    quality = options.isLowEnd ? 65 : 80,
    format = 'auto',
    fit = 'crop',
    isLowEnd = false,
  } = options;

  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', format === 'auto' ? 'format' : format);
      urlObj.searchParams.set('fit', fit);
      urlObj.searchParams.set('q', String(isLowEnd ? Math.min(quality, 65) : quality));

      if (width) {
        urlObj.searchParams.set('w', String(isLowEnd ? Math.min(width, 480) : width));
      }
      if (height) {
        urlObj.searchParams.set('h', String(isLowEnd ? Math.min(height, 640) : height));
      }

      return urlObj.toString();
    } catch {
      return url;
    }
  }

  if (url.includes('res.cloudinary.com')) {
    try {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        const transforms = [
          format === 'auto' ? 'f_auto' : `f_${format}`,
          `q_${isLowEnd ? Math.min(quality, 65) : quality}`,
          width ? `w_${isLowEnd ? Math.min(width, 480) : width}` : null,
          height ? `h_${height}` : null,
          `c_${fit === 'crop' ? 'fill' : 'scale'}`,
        ]
          .filter(Boolean)
          .join(',');

        return `${parts[0]}/upload/${transforms}/${parts[1]}`;
      }
    } catch {
      return url;
    }
  }

  return url;
}

export function generateSrcSet(
  url: string,
  widths: number[] = [320, 480, 640, 800, 1080],
  isLowEnd: boolean = false
): string {
  if (!url || !url.includes('images.unsplash.com')) return '';

  const targetWidths = isLowEnd ? widths.filter((w) => w <= 640) : widths;

  return targetWidths
    .map((w) => `${optimizeImageUrl(url, { width: w, isLowEnd })} ${w}w`)
    .join(', ');
}
