import React, { useState } from 'react';
import { Download } from 'lucide-react';
import type { MediaItem } from '../../types/media';
import { downloadMediaFile, sanitizeFilename } from '../../utils/downloadHelper';
import { useToast } from '../../context/ToastContext';

export interface DownloadDropdownProps {
  item: MediaItem;
}

export const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ item }) => {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const isVideo = item.type === 'video';

  const handleDownload = async () => {
    setIsDownloading(true);
    showToast(`Memulai pengunduhan ${isVideo ? 'video' : 'gambar'}...`, 'info');

    const ext = isVideo ? 'mp4' : 'jpg';
    const filename = sanitizeFilename(item.title, item.id, ext);

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

  return (
    <div className="w-full">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
      >
        <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
        <span>
          {isDownloading
            ? 'Mengunduh...'
            : `Download ${isVideo ? 'Video' : 'Gambar'} Gratis`}
        </span>
      </button>
    </div>
  );
};
