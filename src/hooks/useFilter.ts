import { useState, useMemo, useCallback } from 'react';
import type { MediaItem, FilterState } from '../types/media';

export const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  category: 'All',
  mediaType: 'all',
  orientation: 'all',
  modelId: 'all',
  sortBy: 'trending',
};

export function useFilter(items: MediaItem[], initialPageSize: number = 12) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setCurrentPage(1);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTER_STATE);
    setCurrentPage(1);
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        if (filters.mediaType !== 'all' && item.type !== filters.mediaType) {
          return false;
        }

        if (
          filters.orientation !== 'all' &&
          item.metadata.orientation !== filters.orientation
        ) {
          return false;
        }

        if (filters.modelId !== 'all' && item.metadata.modelId !== filters.modelId) {
          return false;
        }

        if (filters.searchQuery.trim() !== '') {
          const query = filters.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchPrompt = item.metadata.prompt.toLowerCase().includes(query);
          const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
          const matchModel = item.metadata.modelName.toLowerCase().includes(query);
          const matchAuthor =
            item.author.name.toLowerCase().includes(query) ||
            item.author.handle.toLowerCase().includes(query);

          if (!matchTitle && !matchPrompt && !matchTags && !matchModel && !matchAuthor) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'most-downloaded') {
          return b.stats.downloads - a.stats.downloads;
        }
        const scoreA = a.stats.likes * 2 + a.stats.saves * 3 + a.stats.views * 0.1;
        const scoreB = b.stats.likes * 2 + b.stats.saves * 3 + b.stats.views * 0.1;
        return scoreB - scoreA;
      });
  }, [items, filters]);

  const totalResults = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const setPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
    },
    [totalPages]
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredItems,
    paginatedItems,
    totalResults,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
  };
}
