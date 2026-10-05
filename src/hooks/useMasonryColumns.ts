import { useState, useEffect, useMemo } from 'react';
import type { MediaItem } from '../types/media';

interface UseMasonryOptions {
  minColumns?: number;
  maxColumns?: number;
}

/**
 * Custom hook that calculates responsive column count and balances items
 * across columns using a greedy shortest-column algorithm to minimize vertical gaps.
 */
export function useMasonryColumns(items: MediaItem[], options: UseMasonryOptions = {}) {
  const { minColumns = 1, maxColumns = 5 } = options;

  const [columnCount, setColumnCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 540) return 2;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1440) return 4;
    return 5;
  });

  useEffect(() => {
    let timeoutId: number;

    const updateColumns = () => {
      const width = window.innerWidth;
      let count = 3;

      if (width < 540) count = 2;
      else if (width < 768) count = 2;
      else if (width < 1024) count = 3;
      else if (width < 1440) count = 4;
      else count = 5;

      const clamped = Math.max(minColumns, Math.min(maxColumns, count));
      setColumnCount((prev) => (prev !== clamped ? clamped : prev));
    };

    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateColumns, 60);
    };

    window.addEventListener('resize', handleResize);
    updateColumns();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timeoutId);
    };
  }, [minColumns, maxColumns]);

  // Greedy Height Balancing Algorithm
  const columns = useMemo(() => {
    const cols: MediaItem[][] = Array.from({ length: columnCount }, () => []);
    const heights: number[] = Array.from({ length: columnCount }, () => 0);

    items.forEach((item) => {
      // Find the index of the column with the minimum cumulative height
      let shortestColIndex = 0;
      let minHeight = heights[0];

      for (let i = 1; i < columnCount; i++) {
        if (heights[i] < minHeight) {
          minHeight = heights[i];
          shortestColIndex = i;
        }
      }

      // Calculate approximate aspect ratio height (height / width)
      const ratio =
        item.metadata.width > 0
          ? item.metadata.height / item.metadata.width
          : 1.33;

      cols[shortestColIndex].push(item);
      heights[shortestColIndex] += ratio;
    });

    return cols;
  }, [items, columnCount]);

  return {
    columns,
    columnCount,
  };
}
