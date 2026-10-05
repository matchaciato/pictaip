import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { CategoryPills } from './components/layout/CategoryPills';
import { FilterBar } from './components/layout/FilterBar';
import { useFilter } from './hooks/useFilter';
import { MOCK_MEDIA_ITEMS } from './data/mockMedia';
import { MediaCategory } from './types/media';
import { Sparkles, Layers, Search, Bookmark } from 'lucide-react';
import { Modal } from './components/common/Modal';

function MainApp() {
  const { showToast } = useToast();
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

  const [savedPins, setSavedPins] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pictaip_saved_pins');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [isBoardsModalOpen, setIsBoardsModalOpen] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan', 'info');
      return next;
    });
  };

  const handleSelectCategory = (cat: MediaCategory) => {
    updateFilter('category', cat);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-red-500/20 selection:text-red-700 dark:selection:text-red-300">
      {/* 1. Header Navigation */}
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => updateFilter('searchQuery', q)}
        savedCount={savedPins.length}
        onOpenBoards={() => setIsBoardsModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Horizontal Category Pills */}
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

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {/* Feed Status Summary */}
        <div className="mb-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Kategori: <strong className="text-neutral-800 dark:text-neutral-200">{filters.category}</strong>
            </span>
            {filters.searchQuery && (
              <span>
                &bull; Kata kunci: &ldquo;<strong className="text-neutral-800 dark:text-neutral-200">{filters.searchQuery}</strong>&rdquo;
              </span>
            )}
          </div>
          <span className="hidden sm:inline">
            Fase 2: Komponen Dasar & Shell Navigasi Terhubung
          </span>
        </div>

        {/* Temporary Feed Showcase Card List (Fase 2 state inspection before Fase 3 Masonry) */}
        {filteredItems.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Tidak ada visual AI yang cocok
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-4">
              Coba cari dengan kata kunci lain, ganti pilihan model AI, atau reset filter Anda.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors shadow-sm"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => showToast(`Item dipilih: ${item.title}`, 'info')}
              >
                <div
                  className="aspect-[3/4] relative overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: item.dominantColor }}
                >
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.type === 'video' && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      Video
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/50 text-white backdrop-blur-md">
                    {item.metadata.modelName}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                    {item.metadata.prompt}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{item.author.name}</span>
                    <span>{item.stats.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Boards Modal */}
      <Modal
        isOpen={isBoardsModalOpen}
        onClose={() => setIsBoardsModalOpen(false)}
        title="Board Koleksi Anda"
        maxWidth="max-w-lg"
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            Pin & Koleksi Tersimpan
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-4">
            Simpan prompt dan visual AI favorit Anda ke dalam board bertema untuk diakses kapan saja.
          </p>
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-300">
            {savedPins.length === 0 ? (
              <span>Belum ada pin yang disimpan. Jelajahi feed dan klik tombol &quot;Simpan&quot; pada gambar/video yang Anda suka!</span>
            ) : (
              <span>Anda memiliki <strong>{savedPins.length} pin</strong> tersimpan di browser ini.</span>
            )}
          </div>
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
