import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { Header } from './components/layout/Header';
import { CategoryPills } from './components/layout/CategoryPills';
import { FilterBar } from './components/layout/FilterBar';
import { MasonryGrid } from './components/feed/MasonryGrid';
import { Footer } from './components/layout/Footer';
import { Pagination } from './components/layout/Pagination';
import { useFilter } from './hooks/useFilter';
import { useBoards } from './hooks/useBoards';
import { useMediaData } from './hooks/useMediaData';
import { useDevicePerformance } from './hooks/useDevicePerformance';
import type { MediaItem, MediaCategory } from './types/media';

// Code-splitting: Heavy modal and drawer components loaded asynchronously on demand
const DetailModal = React.lazy(() =>
  import('./components/modal/DetailModal').then((m) => ({ default: m.DetailModal }))
);
const BoardDrawer = React.lazy(() =>
  import('./components/collections/BoardDrawer').then((m) => ({ default: m.BoardDrawer }))
);

function MainApp() {
  const { showToast } = useToast();
  const perfProfile = useDevicePerformance();

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

  const { mediaItems } = useMediaData();

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
  } = useFilter(mediaItems, perfProfile.recommendedPageSize);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pictaip_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pictaip_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pinId = params.get('pin');
    if (pinId && mediaItems.length > 0) {
      const found = mediaItems.find((m) => m.id === pinId);
      if (found) setSelectedItem(found);
    }
  }, [mediaItems]);

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

  const handleOpenDetail = useCallback((item: MediaItem) => {
    setSelectedItem(item);
    const url = new URL(window.location.href);
    url.searchParams.set('pin', item.id);
    window.history.pushState({}, '', url.toString());
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedItem(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('pin');
    window.history.pushState({}, '', url.toString());
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan', 'info');
      return next;
    });
  }, [showToast]);

  const handleToggleSave = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleQuickSave(id);
    if (added) {
      showToast('Visual berhasil disimpan ke Board!', 'success');
    } else {
      showToast('Visual dihapus dari Board', 'info');
    }
  }, [toggleQuickSave, showToast]);

  const handleSelectCategory = useCallback((cat: MediaCategory) => {
    updateFilter('category', cat);
  }, [updateFilter]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    showToast('Filter telah direset', 'info');
  }, [resetFilters, showToast]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-red-500/20 selection:text-red-700 dark:selection:text-red-300">
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => updateFilter('searchQuery', q)}
        savedCount={allSavedPinIds.length}
        onOpenBoards={() => setIsBoardsDrawerOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <CategoryPills
        selectedCategory={filters.category}
        onSelectCategory={handleSelectCategory}
      />

      <FilterBar
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={handleResetFilters}
        totalResults={totalResults}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-2">
        <MasonryGrid
          items={paginatedItems}
          savedPins={allSavedPinIds}
          onToggleSave={handleToggleSave}
          onSelect={handleOpenDetail}
          onResetFilters={resetFilters}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </main>

      <Suspense fallback={null}>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            allItems={mediaItems}
            isOpen={selectedItem !== null}
            onClose={handleCloseDetail}
            isSaved={allSavedPinIds.includes(selectedItem.id)}
            onToggleSave={handleToggleSave}
            onSelectRelated={handleOpenDetail}
            onSelectTag={(tag) => {
              handleCloseDetail();
              updateFilter('searchQuery', tag);
              showToast(`Menyaring tag: #${tag}`, 'info');
            }}
          />
        )}

        {isBoardsDrawerOpen && (
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
        )}
      </Suspense>

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
