import { useState, useMemo, useCallback } from 'react';
import type { MediaItem, FilterState, MediaCategory, Orientation, AIModelId } from '../types/media';

export const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  category: 'All',
  mediaType: 'all',
  orientation: 'all',
  modelId: 'all',
  sortBy: 'trending',
};

export function useFilter(items: MediaItem[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // 1. Category Filter
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        // 2. Media Type Filter
        if (filters.mediaType !== 'all' && item.type !== filters.mediaType) {
          return false;
        }

        // 3. Orientation Filter
        if (
          filters.orientation !== 'all' &&
          item.metadata.orientation !== filters.orientation
        ) {
          return false;
        }

        // 4. Model Filter
        if (filters.modelId !== 'all' && item.metadata.modelId !== filters.modelId) {
          return false;
        }

        // 5. Search Query
        if (filters.searchQuery.trim() !== '') {
          const query = filters.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchPrompt = item.metadata.prompt.toLowerCase().includes(query);
          const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
          const matchModel = item.metadata.modelName.toLowerCase().includes(query);
          const matchAuthor = item.author.name.toLowerCase().includes(query) || item.author.handle.toLowerCase().includes(query);

          if (!matchTitle && !matchPrompt && !matchTags && !matchModel && !matchAuthor) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort
        if (filters.sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'most-downloaded') {
          return b.stats.downloads - a.stats.downloads;
        }
        // Default: Trending (composite score of likes + saves + views)
        const scoreA = a.stats.likes * 2 + a.stats.saves * 3 + a.stats.views * 0.1;
        const scoreB = b.stats.likes * 2 + b.stats.saves * 3 + b.stats.views * 0.1;
        return scoreB - scoreA;
      });
  }, [items, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredItems,
    totalResults: filteredItems.length,
  };
}
