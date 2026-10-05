import type { Orientation } from '../types/media';

export interface AspectRatioOption {
  id: string;
  label: string;
  ratio: string;
  width: number;
  height: number;
  orientation: Orientation;
  description: string;
}

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  {
    id: '1:1',
    label: '1:1 Persegi',
    ratio: '1:1',
    width: 1024,
    height: 1024,
    orientation: 'square',
    description: 'Post media sosial & avatar',
  },
  {
    id: '9:16',
    label: '9:16 Story / HP',
    ratio: '9:16',
    width: 1024,
    height: 1820,
    orientation: 'portrait',
    description: 'Reels, TikTok, & Wallpaper HP',
  },
  {
    id: '16:9',
    label: '16:9 Sinematik',
    ratio: '16:9',
    width: 1920,
    height: 1080,
    orientation: 'landscape',
    description: 'Monitor, YouTube, & Film',
  },
  {
    id: '4:5',
    label: '4:5 Portrait',
    ratio: '4:5',
    width: 1024,
    height: 1280,
    orientation: 'portrait',
    description: 'Feed portrait vertikal standar',
  },
  {
    id: '4:6',
    label: '4:6 Foto Klasik',
    ratio: '4:6',
    width: 1024,
    height: 1536,
    orientation: 'portrait',
    description: 'Rasio fotografi potret 2:3',
  },
  {
    id: '21:9',
    label: '21:9 Ultrawide',
    ratio: '21:9',
    width: 2560,
    height: 1080,
    orientation: 'ultrawide',
    description: 'Panorama layar lebar sinema',
  },
];

/**
 * Updates prompt string dynamically based on selected aspect ratio.
 * Replaces existing --ar or [rasio ...] tags or appends [rasio: X:Y].
 */
export function updatePromptWithAspectRatio(originalPrompt: string, newRatio: string): string {
  if (!originalPrompt) return `[rasio: ${newRatio}]`;

  let prompt = originalPrompt.trim();

  // Pattern 1: replace existing [rasio: ...] or [rasio ...]
  const rasioPattern = /\[rasio:?\s*[^\]]+\]/gi;
  // Pattern 2: replace existing --ar \d+:\d+
  const arPattern = /--ar\s+\d+:\d+/gi;

  if (rasioPattern.test(prompt)) {
    prompt = prompt.replace(rasioPattern, `[rasio: ${newRatio}]`);
  } else if (arPattern.test(prompt)) {
    prompt = prompt.replace(arPattern, `--ar ${newRatio} [rasio: ${newRatio}]`);
  } else {
    // Append at the end cleanly
    prompt = `${prompt} [rasio: ${newRatio}]`;
  }

  return prompt;
}
