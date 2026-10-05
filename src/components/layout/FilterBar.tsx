import React from 'react';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { FilterState, Orientation, AIModelId } from '../../types/media';
import { AI_MODEL_LIST } from '../../constants/models';

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
  totalResults,
}) => {
  const isFiltered =
    filters.mediaType !== 'all' ||
    filters.orientation !== 'all' ||
    filters.modelId !== 'all' ||
    filters.searchQuery !== '' ||
    filters.category !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left Side: Media Type Tabs & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Media Type Segmented Pills */}
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

          {/* Orientation Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={filters.orientation}
              onChange={(e) =>
                onFilterChange('orientation', e.target.value as 'all' | Orientation)
              }
              className="appearance-none h-8.5 pl-3 pr-8 rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">Semua Rasio</option>
              <option value="portrait">Portrait (9:16)</option>
              <option value="landscape">Landscape (16:9)</option>
              <option value="square">Square (1:1)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* AI Model Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={filters.modelId}
              onChange={(e) =>
                onFilterChange('modelId', e.target.value as 'all' | AIModelId)
              }
              className="appearance-none h-8.5 pl-3 pr-8 rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <option value="all">Semua Model AI</option>
              {AI_MODEL_LIST.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
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

        {/* Right Side: Sort Selector & Results Counter */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {totalResults}
            </span>{' '}
            karya AI
          </span>

          <div className="relative inline-flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange(
                  'sortBy',
                  e.target.value as 'trending' | 'latest' | 'most-downloaded'
                )
              }
              className="appearance-none h-8.5 pl-8 pr-8 rounded-full bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
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
