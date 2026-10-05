import React, { useState, useEffect, useMemo } from 'react';
import { X, Bookmark, Share2, Eye, Download } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { MediaViewer } from './MediaViewer';
import { PromptInspector } from './PromptInspector';
import { SpecsTable } from './SpecsTable';
import { DownloadDropdown } from './DownloadDropdown';
import { RelatedGrid } from './RelatedGrid';
import { formatCompactNumber, formatRelativeTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { updatePromptWithAspectRatio, ASPECT_RATIO_OPTIONS } from '../../constants/aspectRatios';

export interface DetailModalProps {
  item: MediaItem | null;
  allItems: MediaItem[];
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectRelated: (item: MediaItem) => void;
  onSelectTag?: (tag: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  allItems,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onSelectRelated,
  onSelectTag,
}) => {
  const { showToast } = useToast();
  const [selectedRatio, setSelectedRatio] = useState<string>('1:1');

  // Synchronize initial ratio whenever the selected item changes
  useEffect(() => {
    if (item) {
      setSelectedRatio(item.metadata.aspectRatio || '1:1');
    }
  }, [item?.id]);

  // Close on ESC & lock scroll
  useEffect(() => {
    if (!isOpen || !item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, item, onClose]);

  // Dynamically altered prompt incorporating chosen aspect ratio
  const dynamicPrompt = useMemo(() => {
    if (!item) return '';
    return updatePromptWithAspectRatio(item.metadata.prompt, selectedRatio);
  }, [item?.metadata.prompt, selectedRatio]);

  // Dynamically calculated specs
  const dynamicMetadata = useMemo(() => {
    if (!item) return null;
    const ratioOption = ASPECT_RATIO_OPTIONS.find((o) => o.ratio === selectedRatio);
    return {
      ...item.metadata,
      aspectRatio: selectedRatio,
      width: ratioOption?.width || item.metadata.width,
      height: ratioOption?.height || item.metadata.height,
      prompt: dynamicPrompt,
    };
  }, [item, selectedRatio, dynamicPrompt]);

  if (!isOpen || !item || !dynamicMetadata) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: `Lihat visual AI ini di PictaIP: ${item.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan visual telah disalin ke clipboard!', 'success');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Dimmed Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Studio Card */}
      <div
        className="relative z-10 w-full max-w-5xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          aria-label="Tutup jendela detail"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Dual-Pane Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-neutral-100 dark:border-neutral-800">
            {/* Left Column: Media Stage (55% on desktop) */}
            <div className="lg:col-span-7 bg-neutral-950 flex items-center justify-center overflow-hidden">
              <MediaViewer item={item} selectedRatio={selectedRatio} />
            </div>

            {/* Right Column: Prompt & Metadata Studio (45% on desktop) */}
            <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between space-y-6 bg-white dark:bg-neutral-900">
              {/* 1. Header Toolbar (Creator Info + Actions) */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.author.avatarUrl}
                    alt={item.author.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-xs"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {item.author.name}
                    </h4>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                      @{item.author.handle} &bull; {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 pr-8 lg:pr-0">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                    title="Bagikan Visual"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => onToggleSave(item.id, e)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      isSaved
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
                  </button>
                </div>
              </div>

              {/* 2. Title & Stats Bar */}
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                  {item.title}
                </h1>
                {item.description && (
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <strong>{formatCompactNumber(item.stats.views)}</strong> views
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <strong>{formatCompactNumber(item.stats.downloads)}</strong> downloads
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5" />
                    <strong>{formatCompactNumber(item.stats.saves)}</strong> saves
                  </span>
                </div>
              </div>

              {/* 3. Primary Prompt with Interactive Aspect Ratio Selector */}
              <PromptInspector
                prompt={dynamicPrompt}
                negativePrompt={item.metadata.negativePrompt}
                tags={item.tags}
                onSelectTag={onSelectTag}
                selectedRatio={selectedRatio}
                onSelectRatio={(ratio) => {
                  setSelectedRatio(ratio);
                  showToast(`Rasio diubah ke ${ratio} (Prompt diperbarui)`, 'info');
                }}
              />

              {/* 4. Generation Specs Breakdown Table (Dynamic based on selected ratio) */}
              <SpecsTable metadata={dynamicMetadata} mediaType={item.type} />

              {/* 5. Download Center */}
              <div className="pt-2">
                <DownloadDropdown item={item} />
              </div>
            </div>
          </div>

          {/* Bottom Section: More Like This (Related Items) */}
          <div className="p-5 sm:p-7 bg-neutral-50/50 dark:bg-neutral-950/40">
            <RelatedGrid
              currentItem={item}
              allItems={allItems}
              onSelect={onSelectRelated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
