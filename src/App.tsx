import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { CategoryPills } from './components/layout/CategoryPills';
import { FilterBar } from './components/layout/FilterBar';
import { MasonryGrid } from './components/feed/MasonryGrid';
import { useFilter } from './hooks/useFilter';
import { MOCK_MEDIA_ITEMS } from './data/mockMedia';
import type { MediaItem, MediaCategory } from './types/media';
import { Modal } from './components/common/Modal';
import { Bookmark, Sparkles, Trash2, ExternalLink } from 'lucide-react';

function MainApp() {
  const { showToast } = useToast();

  // Dark mode persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('pictaip_theme') === 'dark' ||
        (!localStorage.getItem('pictaip_theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Saved pins in LocalStorage
  const [savedPins, setSavedPins] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pictaip_saved_pins');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isBoardsModalOpen, setIsBoardsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const { filters, updateFilter, resetFilters, filteredItems, totalResults } =
    useFilter(MOCK_MEDIA_ITEMS);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pictaip_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pictaip_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist saved pins to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pictaip_saved_pins', JSON.stringify(savedPins));
    } catch (e) {
      console.error('Failed to save pins to localStorage:', e);
    }
  }, [savedPins]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan', 'info');
      return next;
    });
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPins((prev) => {
      const isAlreadySaved = prev.includes(id);
      if (isAlreadySaved) {
        showToast('Item dihapus dari Board tersimpan', 'info');
        return prev.filter((pinId) => pinId !== id);
      } else {
        showToast('Item berhasil disimpan ke Board!', 'success');
        return [...prev, id];
      }
    });
  };

  const handleSelectCategory = (cat: MediaCategory) => {
    updateFilter('category', cat);
  };

  const savedItemsList = MOCK_MEDIA_ITEMS.filter((item) =>
    savedPins.includes(item.id)
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-red-500/20 selection:text-red-700 dark:selection:text-red-300">
      {/* 1. Pinterest Header */}
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => updateFilter('searchQuery', q)}
        savedCount={savedPins.length}
        onOpenBoards={() => setIsBoardsModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Category Pills Navigation */}
      <CategoryPills
        selectedCategory={filters.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Advanced Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={() => {
          resetFilters();
          showToast('Filter telah direset', 'info');
        }}
        totalResults={totalResults}
      />

      {/* 4. Fluid Masonry Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        <MasonryGrid
          items={filteredItems}
          savedPins={savedPins}
          onToggleSave={handleToggleSave}
          onSelect={(item) => {
            setSelectedItem(item);
            showToast(`Membuka: ${item.title}`, 'info');
          }}
          onResetFilters={resetFilters}
        />
      </main>

      {/* 5. Board / Saved Pins Modal */}
      <Modal
        isOpen={isBoardsModalOpen}
        onClose={() => setIsBoardsModalOpen(false)}
        title="Board Koleksi Saya"
        maxWidth="max-w-2xl"
      >
        <div className="p-4 sm:p-6">
          {savedItemsList.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Belum ada visual yang disimpan
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                Arahkan kursor pada kartu visual di feed dan klik tombol &quot;Simpan&quot; untuk mengoleksi karya AI favorit Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span>{savedItemsList.length} pin tersimpan</span>
                <button
                  onClick={() => {
                    setSavedPins([]);
                    showToast('Semua pin tersimpan telah dihapus', 'info');
                  }}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer font-medium"
                >
                  Hapus Semua
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {savedItemsList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 group"
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {item.metadata.modelName}
                      </p>
                      <button
                        onClick={(e) => handleToggleSave(item.id, e)}
                        className="text-[10px] text-red-500 hover:underline mt-1 cursor-pointer"
                      >
                        Hapus dari board
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
