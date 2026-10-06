import React, { useState } from 'react';
import { Bookmark, Download, Copy, Play, Check } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { formatDuration } from '../../utils/formatters';
import { VideoPreview } from './VideoPreview';
import { useToast } from '../../context/ToastContext';
import { downloadMediaFile, sanitizeFilename } from '../../utils/downloadHelper';

export interface MediaCardProps {
  item: MediaItem;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const aspectRatio =
    item.metadata.width > 0 && item.metadata.height > 0
      ? `${item.metadata.width} / ${item.metadata.height}`
      : '1 / 1';

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.metadata.prompt);
    setIsCopied(true);
    showToast('Prompt berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    showToast('Memulai pengunduhan media...', 'info');

    const ext = item.type === 'video' ? 'mp4' : 'jpg';
    const filename = sanitizeFilename(item.title, item.id, ext);

    const success = await downloadMediaFile({
      url: item.downloadUrl,
      filename,
    });

    setIsDownloading(false);
    if (success) {
      showToast('Media berhasil diunduh!', 'success');
    } else {
      showToast('Gagal mengunduh media. Coba buka tautan langsung.', 'error');
    }
  };

  return (
    <div
      className="mb-4 break-inside-avoid group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/60 shadow-xs hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(item)}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio,
          backgroundColor: item.dominantColor,
        }}
      >
        {item.type === 'video' && item.videoUrl ? (
          <VideoPreview
            videoUrl={item.videoUrl}
            posterUrl={item.previewUrl}
            isHovered={isHovered}
          />
        ) : (
          <img
            src={item.previewUrl}
            alt={item.title}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-103 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {item.type === 'video' && !isHovered && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-md">
              <Play className="w-3 h-3 fill-current text-red-500" />
              <span>{formatDuration(item.metadata.durationSeconds)}</span>
            </span>
          </div>
        )}

        <div
          className={`absolute inset-0 z-30 bg-black/35 backdrop-blur-[1px] p-3 flex flex-col justify-between transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-end">
            <button
              onClick={(e) => onToggleSave(item.id, e)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isSaved ? 'Tersimpan di Board' : 'Simpan ke Board'}
            >
              <Bookmark className={`size-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleCopyPrompt}
              className="p-2 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 shadow-md backdrop-blur-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold px-3"
              title="Salin Prompt AI"
            >
              {isCopied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 rounded-full bg-white/90 hover:bg-white dark:bg-neutral-800/90 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 shadow-md backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
              title="Download Cepat"
            >
              <Download
                className={`w-4 h-4 ${isDownloading ? 'animate-bounce text-red-500' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={item.author.avatarUrl}
            alt={item.author.name}
            className="w-5 h-5 rounded-full object-cover shrink-0"
            loading="lazy"
          />
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
            {item.author.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
            {item.metadata.aspectRatio}
          </span>
          <button
            onClick={(e) => onToggleSave(item.id, e)}
            className={`sm:hidden p-1 rounded-full transition-colors cursor-pointer ${
              isSaved
                ? 'text-red-600 dark:text-red-500'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
            title={isSaved ? 'Tersimpan di Board' : 'Simpan ke Board'}
            aria-label={isSaved ? 'Tersimpan' : 'Simpan'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
