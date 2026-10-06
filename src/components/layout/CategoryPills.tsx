import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import type { MediaCategory } from '../../types/media';

export interface CategoryPillsProps {
  selectedCategory: MediaCategory;
  onSelectCategory: (category: MediaCategory) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
      {showLeftArrow && (
        <div className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center pr-6 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-neutral-900 dark:via-neutral-900/90 h-full">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 shadow-md border border-neutral-200 dark:border-neutral-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Gulir ke kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap cursor-pointer transition-all duration-150 select-none ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                  : 'bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {showRightArrow && (
        <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center pl-6 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-neutral-900 dark:via-neutral-900/90 h-full">
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 shadow-md border border-neutral-200 dark:border-neutral-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Gulir ke kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
