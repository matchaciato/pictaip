import React from 'react';
import type { MediaItem } from '../../types/media';
import { Sparkles } from 'lucide-react';

export interface RelatedGridProps {
  currentItem: MediaItem;
  allItems: MediaItem[];
  onSelect: (item: MediaItem) => void;
}

export const RelatedGrid: React.FC<RelatedGridProps> = ({
  currentItem,
  allItems,
  onSelect,
}) => {
  // Find related items by category or tags, excluding current item
  const related = allItems
    .filter((item) => item.id !== currentItem.id)
    .map((item) => {
      let score = 0;
      if (item.category === currentItem.category) score += 3;
      if (item.metadata.modelId === currentItem.metadata.modelId) score += 2;
      const sharedTags = item.tags.filter((t) => currentItem.tags.includes(t));
      score += sharedTags.length;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((entry) => entry.item);

  if (related.length === 0) return null;

  return (
    <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-red-500" />
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          Karya AI Serupa (More Like This)
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {related.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative rounded-xl overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg transition-all"
          >
            <div
              className="aspect-square relative overflow-hidden"
              style={{ backgroundColor: item.dominantColor }}
            >
              <img
                src={item.previewUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-[10px] text-white font-medium line-clamp-1">
                  {item.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
