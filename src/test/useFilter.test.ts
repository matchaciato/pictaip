import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilter, INITIAL_FILTER_STATE } from '../hooks/useFilter';
import type { MediaItem } from '../types/media';

const SAMPLE_ITEMS: MediaItem[] = [
  {
    id: 'item-1',
    title: 'Cyberpunk Neon Street',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1.jpg',
    downloadUrl: 'https://images.unsplash.com/photo-1.jpg',
    dominantColor: '#1a1a2e',
    category: 'Cyberpunk',
    tags: ['cyberpunk', 'neon', 'rain'],
    author: {
      id: 'author-1',
      name: 'Image AI Studio',
      handle: 'imageaistudio',
      avatarUrl: 'https://images.unsplash.com/avatar-1.jpg',
    },
    stats: { views: 1000, downloads: 200, likes: 50, saves: 30 },
    createdAt: '2026-03-01T10:00:00Z',
    metadata: {
      modelId: 'flux-1-dev',
      modelName: 'FLUX.1-dev',
      modelBadgeColor: 'bg-emerald-500',
      prompt: 'futuristic neon street in rainy night',
      seed: 42,
      orientation: 'landscape',
      aspectRatio: '16:9',
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 'item-2',
    title: 'Cinematic Flying Drone',
    type: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-2.jpg',
    previewUrl: 'https://images.unsplash.com/photo-2.jpg',
    videoUrl: 'https://assets.mixkit.co/videos/preview/2.mp4',
    downloadUrl: 'https://assets.mixkit.co/videos/preview/2.mp4',
    dominantColor: '#0f3460',
    category: 'Cinematic',
    tags: ['cinematic', 'flying', 'drone'],
    author: {
      id: 'author-2',
      name: 'Video AI Motion',
      handle: 'videoaimotion',
      avatarUrl: 'https://images.unsplash.com/avatar-2.jpg',
    },
    stats: { views: 5000, downloads: 800, likes: 200, saves: 150 },
    createdAt: '2026-03-05T12:00:00Z',
    metadata: {
      modelId: 'runway-gen3',
      modelName: 'Runway Gen-3',
      modelBadgeColor: 'bg-purple-500',
      prompt: 'drone flying over foggy mountain forest',
      seed: 100,
      orientation: 'portrait',
      aspectRatio: '9:16',
      width: 1080,
      height: 1920,
      durationSeconds: 12,
      fps: 30,
    },
  },
  {
    id: 'item-3',
    title: 'Photorealistic Portrait',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-3.jpg',
    previewUrl: 'https://images.unsplash.com/photo-3.jpg',
    downloadUrl: 'https://images.unsplash.com/photo-3.jpg',
    dominantColor: '#e94560',
    category: 'Photorealistic',
    tags: ['portrait', 'studio', 'face'],
    author: {
      id: 'author-1',
      name: 'Image AI Studio',
      handle: 'imageaistudio',
      avatarUrl: 'https://images.unsplash.com/avatar-1.jpg',
    },
    stats: { views: 500, downloads: 50, likes: 20, saves: 10 },
    createdAt: '2026-02-15T08:00:00Z',
    metadata: {
      modelId: 'midjourney-v6',
      modelName: 'Midjourney v6.1',
      modelBadgeColor: 'bg-blue-500',
      prompt: 'studio portrait of a woman with dramatic lighting',
      seed: 777,
      orientation: 'square',
      aspectRatio: '1:1',
      width: 1024,
      height: 1024,
    },
  },
];

describe('useFilter Hook', () => {
  it('initializes with default filters and returns all items', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 2));

    expect(result.current.filters).toEqual(INITIAL_FILTER_STATE);
    expect(result.current.totalResults).toBe(3);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedItems.length).toBe(2);
  });

  it('filters items by mediaType (image vs video)', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 10));

    act(() => {
      result.current.updateFilter('mediaType', 'video');
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.paginatedItems[0].id).toBe('item-2');

    act(() => {
      result.current.updateFilter('mediaType', 'image');
    });

    expect(result.current.totalResults).toBe(2);
  });

  it('filters items by category', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 10));

    act(() => {
      result.current.updateFilter('category', 'Cyberpunk');
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.paginatedItems[0].title).toBe('Cyberpunk Neon Street');
  });

  it('filters items by search query across title, prompt, and tags', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 10));

    act(() => {
      result.current.updateFilter('searchQuery', 'foggy mountain');
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.paginatedItems[0].id).toBe('item-2');

    act(() => {
      result.current.updateFilter('searchQuery', 'non-existent-keyword');
    });

    expect(result.current.totalResults).toBe(0);
  });

  it('sorts items by latest creation date', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 10));

    act(() => {
      result.current.updateFilter('sortBy', 'latest');
    });

    const dates = result.current.paginatedItems.map((i) => new Date(i.createdAt).getTime());
    expect(dates[0]).toBeGreaterThan(dates[1]);
    expect(dates[1]).toBeGreaterThan(dates[2]);
  });

  it('sorts items by most-downloaded count', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 10));

    act(() => {
      result.current.updateFilter('sortBy', 'most-downloaded');
    });

    expect(result.current.paginatedItems[0].stats.downloads).toBe(800);
    expect(result.current.paginatedItems[1].stats.downloads).toBe(200);
    expect(result.current.paginatedItems[2].stats.downloads).toBe(50);
  });

  it('resets all filters back to initial state', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 10));

    act(() => {
      result.current.updateFilter('mediaType', 'video');
      result.current.updateFilter('searchQuery', 'drone');
    });

    expect(result.current.totalResults).toBe(1);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual(INITIAL_FILTER_STATE);
    expect(result.current.totalResults).toBe(3);
  });

  it('handles pagination navigation and clamping correctly', () => {
    const { result } = renderHook(() => useFilter(SAMPLE_ITEMS, 1));

    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    // Clamping: beyond max pages
    act(() => {
      result.current.setPage(999);
    });
    expect(result.current.currentPage).toBe(3);

    // Clamping: below page 1
    act(() => {
      result.current.setPage(0);
    });
    expect(result.current.currentPage).toBe(1);
  });
});
