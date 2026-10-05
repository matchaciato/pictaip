import type { Author } from '../types/media';

export const IMAGE_AI_PUBLISHER: Author = {
  id: 'pub-image-ai',
  name: 'Image AI Studio',
  handle: 'image.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  verified: true,
};

export const VIDEO_AI_PUBLISHER: Author = {
  id: 'pub-video-ai',
  name: 'Video AI Motion',
  handle: 'video.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80',
  verified: true,
};

export function getPublisherForType(type: 'image' | 'video'): Author {
  return type === 'video' ? VIDEO_AI_PUBLISHER : IMAGE_AI_PUBLISHER;
}
