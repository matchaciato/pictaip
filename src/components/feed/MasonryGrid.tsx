import React from 'react';
import type { MediaItem } from '../../types/media';
import { MediaCard } from './MediaCard';
import { useMasonryColumns } from '../../hooks/useMasonryColumns';
import { Search } from 'lucide-react';

export interface MasonryGridProps {
  items: MediaItem[];
  savedPins: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (item: MediaItem) => void;
  onResetFilters: () => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = React.memo(({
  items,
  savedPins,
  onToggleSave,
  onSelect,
  onResetFilters,
}) => {
  const { columns } = useMasonryColumns(items);

  if (items.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 shadow-inner">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Tidak ada visual AI yang cocok
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-5 leading-relaxed">
          Kami tidak menemukan media dengan filter yang Anda tentukan. Coba cari kata kunci lain atau reset filter.
        </p>
        <button
          onClick={onResetFilters}
          className="px-5 py-2.5 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-all shadow-md active:scale-95"
        >
          Reset Semua Filter
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex items-start gap-3 sm:gap-4 md:gap-5">
      {columns.map((columnItems, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex-1 flex flex-col min-w-0">
          {columnItems.map((item, itemIndex) => (
            <MediaCard
              key={item.id}
              item={item}
              isSaved={savedPins.includes(item.id)}
              onToggleSave={onToggleSave}
              onSelect={onSelect}
              priority={itemIndex < 2}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

MasonryGrid.displayName = 'MasonryGrid';
