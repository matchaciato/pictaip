import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface PromptInspectorProps {
  prompt: string;
  negativePrompt?: string;
  tags: string[];
  onSelectTag?: (tag: string) => void;
}

export const PromptInspector: React.FC<PromptInspectorProps> = ({
  prompt,
  negativePrompt,
  tags,
  onSelectTag,
}) => {
  const { showToast } = useToast();
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [isNegPromptCopied, setIsNegPromptCopied] = useState(false);
  const [isNegativeExpanded, setIsNegativeExpanded] = useState(false);

  const copyToClipboard = (text: string, isNegative: boolean) => {
    navigator.clipboard.writeText(text);
    if (isNegative) {
      setIsNegPromptCopied(true);
      showToast('Negative prompt berhasil disalin!', 'success');
      setTimeout(() => setIsNegPromptCopied(false), 2000);
    } else {
      setIsPromptCopied(true);
      showToast('Prompt utama berhasil disalin!', 'success');
      setTimeout(() => setIsPromptCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Prompt Section */}
      <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/70 p-4 transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Prompt Generator</span>
          </div>
          <button
            onClick={() => copyToClipboard(prompt, false)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {isPromptCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400 dark:text-emerald-600" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin Prompt</span>
              </>
            )}
          </button>
        </div>
        <p className="text-sm font-mono leading-relaxed text-neutral-800 dark:text-neutral-200 select-text whitespace-pre-wrap break-words">
          {prompt}
        </p>
      </div>

      {/* Negative Prompt Accordion (if present) */}
      {negativePrompt && (
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/40 overflow-hidden transition-all">
          <button
            onClick={() => setIsNegativeExpanded(!isNegativeExpanded)}
            className="w-full flex items-center justify-between p-3.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
          >
            <span className="font-semibold">Negative Prompt</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-400">
                {isNegativeExpanded ? 'Tutup' : 'Lihat'}
              </span>
              {isNegativeExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {isNegativeExpanded && (
            <div className="px-4 pb-4 pt-1 border-t border-neutral-200/50 dark:border-neutral-800/50">
              <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-2 whitespace-pre-wrap break-words">
                {negativePrompt}
              </p>
              <button
                onClick={() => copyToClipboard(negativePrompt, true)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {isNegPromptCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Negative prompt tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Negative Prompt</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tags Chips */}
      {tags.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Tag Terkait</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag?.(tag)}
                className="px-2.5 py-1 text-xs rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer select-none"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Free AI License Guarantee Badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          <strong>Free AI License:</strong> Bebas digunakan dan dimodifikasi untuk proyek komersial maupun personal tanpa royalti.
        </span>
      </div>
    </div>
  );
};
