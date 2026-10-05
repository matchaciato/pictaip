import React, { useState } from 'react';
import { Copy, Check, Cpu, Ratio, Hash, Sliders, Layers, Clock, Film } from 'lucide-react';
import type { AIMetadata } from '../../types/media';
import { useToast } from '../../context/ToastContext';
import { formatDuration } from '../../utils/formatters';

export interface SpecsTableProps {
  metadata: AIMetadata;
  mediaType: 'image' | 'video';
}

export const SpecsTable: React.FC<SpecsTableProps> = ({ metadata, mediaType }) => {
  const { showToast } = useToast();
  const [isSeedCopied, setIsSeedCopied] = useState(false);

  const handleCopySeed = () => {
    navigator.clipboard.writeText(metadata.seed.toString());
    setIsSeedCopied(true);
    showToast(`Seed ${metadata.seed} berhasil disalin!`, 'success');
    setTimeout(() => setIsSeedCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        <Cpu className="w-3.5 h-3.5 text-red-500" />
        <span>Spesifikasi Parameter AI</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        {/* Orientation & Resolution */}
        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 mb-0.5">
            <Ratio className="w-3 h-3" />
            <span>Rasio & Resolusi</span>
          </div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
            {metadata.aspectRatio} ({metadata.width}&times;{metadata.height})
          </span>
        </div>

        {/* Seed */}
        <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 dark:text-neutral-500 mb-0.5">
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              <span>Seed</span>
            </div>
            <button
              onClick={handleCopySeed}
              className="text-neutral-500 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
              title="Salin Seed"
            >
              {isSeedCopied ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
          <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 truncate block">
            {metadata.seed}
          </span>
        </div>

        {/* CFG Scale */}
        {metadata.cfgScale !== undefined && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 mb-0.5">
              <Sliders className="w-3 h-3" />
              <span>CFG / Guidance</span>
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              {metadata.cfgScale}
            </span>
          </div>
        )}

        {/* Steps */}
        {metadata.steps !== undefined && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 mb-0.5">
              <Layers className="w-3 h-3" />
              <span>Steps</span>
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              {metadata.steps} langkah
            </span>
          </div>
        )}

        {/* Sampler */}
        {metadata.sampler && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-400 dark:text-neutral-500 block mb-0.5">Sampler</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate block">
              {metadata.sampler}
            </span>
          </div>
        )}

        {/* Video Duration (if video) */}
        {mediaType === 'video' && metadata.durationSeconds && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 mb-0.5">
              <Clock className="w-3 h-3" />
              <span>Durasi & FPS</span>
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              {formatDuration(metadata.durationSeconds)} ({metadata.fps || 30} FPS)
            </span>
          </div>
        )}

        {/* Camera Motion (if video) */}
        {mediaType === 'video' && metadata.cameraMotion && (
          <div className="col-span-2 sm:col-span-3 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-neutral-400 dark:text-neutral-500 mb-0.5">
              <Film className="w-3 h-3" />
              <span>Gerakan Kamera (Camera Motion)</span>
            </div>
            <span className="font-medium text-neutral-800 dark:text-neutral-200 block">
              {metadata.cameraMotion}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
