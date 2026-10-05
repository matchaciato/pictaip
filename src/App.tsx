import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { CategoryPills } from './components/layout/CategoryPills';
import { FilterBar } from './components/layout/FilterBar';
import { MasonryGrid } from './components/feed/MasonryGrid';
import { DetailModal } from './components/modal/DetailModal';
import { BoardDrawer } from './components/collections/BoardDrawer';
import { Footer } from './components/layout/Footer';
import { Pagination } from './components/layout/Pagination';
import { useFilter } from './hooks/useFilter';
import { useBoards } from './hooks/useBoards';
import { useMediaData } from './hooks/useMediaData';
import type { MediaItem, MediaCategory } from './types/media';
import { RefreshCw } from 'lucide-react';

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

  // Dynamic media items from Firebase Firestore (or resilient local fallback)
  const {
    mediaItems,
    isFirebaseConnected,
    isFirebaseAvailable,
    syncToFirestore,
  } = useMediaData();

  // State management for Boards & Saved Pins
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    createBoard,
    deleteBoard,
    togglePinInBoard,
    toggleQuickSave,
    allSavedPinIds,
  } = useBoards();

  const [isBoardsDrawerOpen, setIsBoardsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filters & Pagination hook
  const {
    filters,
    updateFilter,
    resetFilters,
    paginatedItems,
    totalResults,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
  } = useFilter(mediaItems, 12);

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

  // Deep linking: read '?pin=id' from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pinId = params.get('pin');
    if (pinId && mediaItems.length > 0) {
      const found = mediaItems.find((m) => m.id === pinId);
      if (found) setSelectedItem(found);
    }
  }, [mediaItems]);

  // Keyboard shortcut 'b' or 'B' to toggle boards drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if ((e.key === 'b' || e.key === 'B') && !isInput && !selectedItem) {
        e.preventDefault();
        setIsBoardsDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  // Update URL on pin selection
  const handleOpenDetail = (item: MediaItem) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('pin', item.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('pin');
    window.history.pushState({}, '', url.toString());
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan', 'info');
      return next;
    });
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleQuickSave(id);
    if (added) {
      showToast('Visual berhasil disimpan ke Board!', 'success');
    } else {
      showToast('Visual dihapus dari Board', 'info');
    }
  };

  const handleSelectCategory = (cat: MediaCategory) => {
    updateFilter('category', cat);
  };

  const handleSyncFirebase = async () => {
    setIsSyncing(true);
    showToast('Sinkronisasi katalog ke Firebase Firestore...', 'info');
    const ok = await syncToFirestore();
    setIsSyncing(false);
    if (ok) {
      showToast('Katalog visual berhasil disinkronkan ke Firestore!', 'success');
    } else {
      showToast(
        isFirebaseAvailable
          ? 'Gagal menyinkronkan data ke Firestore.'
          : 'Konfigurasi Firebase belum terpasang di file .env',
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-red-500/20 selection:text-red-700 dark:selection:text-red-300">
      {/* 1. Header Navigation */}
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => updateFilter('searchQuery', q)}
        savedCount={allSavedPinIds.length}
        onOpenBoards={() => setIsBoardsDrawerOpen(true)}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-2">
        {/* Dynamic Data / Firebase Status Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {isFirebaseConnected ? 'Firebase Firestore Aktif' : 'Database Visual AI Siap'}
            </span>
            <span className="text-neutral-400 hidden sm:inline">&bull;</span>
            <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline">
              {isFirebaseConnected
                ? 'Data termuat dinamis & terkelola via Firebase Console'
                : 'Mendukung live updates dari Firebase Firestore tanpa perlu push kode'}
            </span>
          </div>

          <button
            onClick={handleSyncFirebase}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 border border-neutral-200 dark:border-neutral-700 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Sinkronkan / Inisialisasi data ke Firebase Firestore"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-red-500' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkron Firestore'}</span>
          </button>
        </div>

        {/* 4. Fluid Masonry Grid (Paginated) */}
        <MasonryGrid
          items={paginatedItems}
          savedPins={allSavedPinIds}
          onToggleSave={handleToggleSave}
          onSelect={handleOpenDetail}
          onResetFilters={resetFilters}
        />

        {/* 5. Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </main>

      {/* 6. Detail Pin Studio Modal with Aspect Ratio Switching */}
      <DetailModal
        item={selectedItem}
        allItems={mediaItems}
        isOpen={selectedItem !== null}
        onClose={handleCloseDetail}
        isSaved={selectedItem ? allSavedPinIds.includes(selectedItem.id) : false}
        onToggleSave={handleToggleSave}
        onSelectRelated={(relatedItem) => {
          handleOpenDetail(relatedItem);
        }}
        onSelectTag={(tag) => {
          handleCloseDetail();
          updateFilter('searchQuery', tag);
          showToast(`Menyaring tag: #${tag}`, 'info');
        }}
      />

      {/* 7. Board & Collections Drawer */}
      <BoardDrawer
        isOpen={isBoardsDrawerOpen}
        onClose={() => setIsBoardsDrawerOpen(false)}
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoardId}
        onCreateBoard={createBoard}
        onDeleteBoard={deleteBoard}
        onRemovePin={togglePinInBoard}
        allItems={mediaItems}
        onOpenDetail={handleOpenDetail}
      />

      {/* 8. Modern Footer */}
      <Footer />
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
