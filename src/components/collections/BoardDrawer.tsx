import React, { useState } from 'react';
import {
  FolderPlus,
  Bookmark,
  Trash2,
  X,
} from 'lucide-react';
import type { Board, MediaItem } from '../../types/media';
import { DEFAULT_BOARD_ID } from '../../hooks/useBoards';
import { useToast } from '../../context/ToastContext';

export interface BoardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  boards: Board[];
  activeBoardId: string | null;
  onSelectBoard: (boardId: string | null) => void;
  onCreateBoard: (name: string, description?: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onRemovePin: (boardId: string, itemId: string) => void;
  allItems: MediaItem[];
  onOpenDetail: (item: MediaItem) => void;
}

export const BoardDrawer: React.FC<BoardDrawerProps> = ({
  isOpen,
  onClose,
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
  onRemovePin,
  allItems,
  onOpenDetail,
}) => {
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  if (!isOpen) return null;

  const currentBoardId = activeBoardId || DEFAULT_BOARD_ID;
  const currentBoard = boards.find((b) => b.id === currentBoardId) || boards[0];

  const currentItems = allItems.filter((item) =>
    currentBoard?.itemIds.includes(item.id)
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) {
      showToast('Masukkan nama board terlebih dahulu', 'error');
      return;
    }
    onCreateBoard(newBoardName, newBoardDesc);
    showToast(`Board "${newBoardName}" berhasil dibuat!`, 'success');
    setNewBoardName('');
    setNewBoardDesc('');
    setIsCreating(false);
  };

  const handleDelete = (board: Board) => {
    if (board.id === DEFAULT_BOARD_ID) {
      showToast('Board utama bawaan tidak dapat dihapus', 'error');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus board "${board.name}"?`)) {
      onDeleteBoard(board.id);
      showToast(`Board "${board.name}" telah dihapus`, 'info');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Surface Card */}
      <div
        className="relative z-10 w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Board & Koleksi Saya
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {boards.length} board &bull;{' '}
                {boards.reduce((acc, b) => acc + b.itemIds.length, 0)} total pin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Tutup jendela board"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar Tabs + Grid Stage */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Boards List & Creator */}
          <div className="w-full md:w-64 max-h-44 md:max-h-none border-b md:border-b-0 md:border-r border-neutral-100 dark:border-neutral-800 p-3 sm:p-4 shrink-0 flex flex-col justify-between bg-neutral-50/50 dark:bg-neutral-950/40 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Daftar Board
                </span>
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Baru</span>
                  </button>
                )}
              </div>

              {/* Inline Create Board Form */}
              {isCreating && (
                <form
                  onSubmit={handleCreateSubmit}
                  className="mb-3 p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-red-500/30 space-y-2 animate-in fade-in duration-150"
                >
                  <input
                    type="text"
                    placeholder="Nama Board (e.g. Cyberpunk)"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    autoFocus
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-transparent focus:border-red-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Deskripsi singkat (opsional)"
                    value={newBoardDesc}
                    onChange={(e) => setNewBoardDesc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-transparent focus:border-red-500 focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              )}

              {/* Boards List Items */}
              <div className="space-y-1">
                {boards.map((board) => {
                  const isSelected = board.id === currentBoardId;

                  return (
                    <div
                      key={board.id}
                      onClick={() => onSelectBoard(board.id)}
                      className={`group flex items-center justify-between p-2.5 rounded-2xl text-xs font-medium cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold truncate">{board.name}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected
                              ? 'text-neutral-300 dark:text-neutral-600'
                              : 'text-neutral-400'
                          }`}
                        >
                          {board.itemIds.length} pin
                        </div>
                      </div>

                      {board.id !== DEFAULT_BOARD_ID && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(board);
                          }}
                          className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-500 cursor-pointer ${
                            isSelected ? 'text-red-400' : ''
                          }`}
                          title="Hapus board ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Board Grid */}
          <div className="flex-1 p-3 sm:p-5 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {currentBoard?.name}
                </h3>
                {currentBoard?.description && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {currentBoard.description}
                  </p>
                )}
              </div>
              <span className="text-xs text-neutral-400">
                {currentItems.length} visual tersimpan
              </span>
            </div>

            {currentItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  Board ini masih kosong
                </h4>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs mb-4">
                  Kembali ke feed utama dan klik tombol &quot;Simpan&quot; pada gambar atau video yang Anda minati.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:scale-105 transition-transform cursor-pointer"
                >
                  Jelajahi Feed
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      onClose();
                      onOpenDetail(item);
                    }}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePin(currentBoard.id, item.id);
                          showToast('Item dihapus dari board', 'info');
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        title="Hapus dari board ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <h5 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {item.author.name} &bull; {item.metadata.aspectRatio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
