import React, { useState } from 'react';
import { Download, ChevronDown, Check, Sparkles } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { downloadMediaFile, sanitizeFilename } from '../../utils/downloadHelper';
import { useToast } from '../../context/ToastContext';

export interface DownloadDropdownProps {
  item: MediaItem;
}

interface ResolutionOption {
  id: 'original' | '4k' | 'wallpaper' | 'webp';
  label: string;
  sublabel: string;
  ext: string;
}

export const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ item }) => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ResolutionOption['id']>('original');

  const isVideo = item.type === 'video';

  const options: ResolutionOption[] = [
    {
      id: 'original',
      label: 'Resolusi Asli',
      sublabel: `${item.metadata.width} \u00D7 ${item.metadata.height}px (${isVideo ? 'MP4' : 'Original'})`,
      ext: isVideo ? 'mp4' : 'jpg',
    },
    {
      id: '4k',
      label: '4K Ultra HD',
      sublabel: '3840 \u00D7 2160px (Super Res)',
      ext: isVideo ? 'mp4' : 'png',
    },
    {
      id: 'wallpaper',
      label: 'Format Wallpaper HP',
      sublabel: '1080 \u00D7 1920px (9:16 Vertical)',
      ext: isVideo ? 'mp4' : 'jpg',
    },
    {
      id: 'webp',
      label: 'WebP Ringan',
      sublabel: 'Kompresi efisien untuk web & desain',
      ext: isVideo ? 'webm' : 'webp',
    },
  ];

  const handleDownload = async (option: ResolutionOption) => {
    setSelectedFormat(option.id);
    setIsOpen(false);
    setIsDownloading(true);

    showToast(`Mengunduh format ${option.label}...`, 'info');

    const filename = sanitizeFilename(item.title, item.id, option.ext);

    const success = await downloadMediaFile({
      url: item.downloadUrl,
      filename,
    });

    setIsDownloading(false);
    if (success) {
      showToast('Unduhan berhasil diselesaikan!', 'success');
    } else {
      showToast('Gagal mengunduh file secara otomatis. Coba lagi.', 'error');
    }
  };

  const currentOption = options.find((o) => o.id === selectedFormat) || options[0];

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-1.5 w-full">
        {/* Main Action Button */}
        <button
          onClick={() => handleDownload(currentOption)}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
        >
          <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
          <span>{isDownloading ? 'Mengunduh...' : `Download ${currentOption.label}`}</span>
        </button>

        {/* Format Selector Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer shadow-xs"
          title="Pilih Format & Resolusi"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-full max-w-xs bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Pilihan Resolusi & Format
          </div>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleDownload(opt)}
              className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {opt.label}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {opt.sublabel}
                </div>
              </div>
              {selectedFormat === opt.id && (
                <Check className="w-4 h-4 text-red-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
