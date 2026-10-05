export type MediaType = 'image' | 'video';

export type Orientation = 'portrait' | 'landscape' | 'square' | 'ultrawide';

export type AIModelId =
  | 'flux-1-dev'
  | 'midjourney-v6'
  | 'sdxl-1-0'
  | 'dalle-3'
  | 'runway-gen3'
  | 'luma-dream-machine'
  | 'kling-ai'
  | 'openai-sora';

export type MediaCategory =
  | 'All'
  | 'Photorealistic'
  | 'Cinematic'
  | 'Cyberpunk'
  | 'Anime & Manga'
  | '3D & Clay'
  | 'Architecture'
  | 'Sci-Fi'
  | 'Nature & Animals'
  | 'Logos & Vector';

export const MEDIA_CATEGORIES = [
  'All',
  'Photorealistic',
  'Cinematic',
  'Cyberpunk',
  'Anime & Manga',
  '3D & Clay',
  'Architecture',
  'Sci-Fi',
  'Nature & Animals',
  'Logos & Vector',
] as const;

export const MEDIA_TYPES = ['image', 'video'] as const;


export interface AIMetadata {
  modelId: AIModelId;
  modelName: string;
  modelBadgeColor: string; // Tailwind/OKLCH badge style
  prompt: string;
  negativePrompt?: string;
  seed: number;
  cfgScale?: number;
  steps?: number;
  sampler?: string;
  orientation: Orientation;
  aspectRatio: string; // e.g. "9:16", "16:9", "1:1", "4:5", "21:9"
  width: number;
  height: number;
  // Specific to Video
  durationSeconds?: number;
  fps?: number;
  cameraMotion?: string;
  motionStrength?: number;
}

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  verified?: boolean;
}

export interface MediaStats {
  views: number;
  downloads: number;
  likes: number;
  saves: number;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  mediaUrl: string;
  previewUrl: string; // Thumbnail / poster image
  videoUrl?: string; // Looping preview / full mp4 for video
  downloadUrl: string;
  dominantColor: string; // OKLCH or Hex for zero-CLS skeleton placeholder
  metadata: AIMetadata;
  category: MediaCategory;
  tags: string[];
  author: Author;
  stats: MediaStats;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: MediaCategory;
  mediaType: 'all' | 'image' | 'video';
  orientation: 'all' | Orientation;
  modelId: 'all' | AIModelId;
  sortBy: 'trending' | 'latest' | 'most-downloaded';
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  itemIds: string[];
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}
