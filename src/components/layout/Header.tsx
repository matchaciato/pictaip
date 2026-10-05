import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, Bookmark, Moon, Sun, Layers } from 'lucide-react';
import { Button } from '../common/Button';

export interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedCount: number;
  onOpenBoards: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenBoards,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border-b border-neutral-200/70 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSearchChange('');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white leading-none">
                Picta<span className="text-red-600 dark:text-red-500">IP</span>
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-0.5">
                AI Discovery
              </span>
            </div>
          </a>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari prompt, gaya (e.g. cyberpunk, anime), atau model..."
              className="w-full h-11 pl-11 pr-20 bg-neutral-100 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm rounded-full border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all shadow-inner"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => {
                    onSearchChange('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-200/80 dark:bg-neutral-700/60 rounded-md border border-neutral-300/60 dark:border-neutral-600/50">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Boards / Saved Button */}
          <Button
            variant="secondary"
            size="md"
            onClick={onOpenBoards}
            leftIcon={<Bookmark className="w-4 h-4 text-red-600 dark:text-red-400" />}
            className="relative"
            title="Buka Board Tersimpan"
          >
            <span className="hidden md:inline">Board Saya</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-600 text-white leading-tight">
                {savedCount}
              </span>
            )}
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-600 hover:-rotate-12 transition-transform" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
