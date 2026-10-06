import React from 'react';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import type { FilterState } from '../../types/media';

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const isFiltered =
    filters.mediaType !== 'all' ||
    filters.searchQuery !== '' ||
    filters.category !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60">
            <button
              onClick={() => onFilterChange('mediaType', 'all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                filters.mediaType === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua</span>
            </button>
            <button
              onClick={() => onFilterChange('mediaType', 'image')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                filters.mediaType === 'image'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Gambar</span>
            </button>
            <button
              onClick={() => onFilterChange('mediaType', 'video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                filters.mediaType === 'video'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Video</span>
            </button>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="relative inline-flex items-center w-full sm:w-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange(
                  'sortBy',
                  e.target.value as 'trending' | 'latest' | 'most-downloaded'
                )
              }
              className="w-full sm:w-auto appearance-none h-8.5 pl-8 pr-8 rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60 text-xs sm:text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="trending">Populer / Trending</option>
              <option value="latest">Terbaru</option>
              <option value="most-downloaded">Paling Banyak Diunduh</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
