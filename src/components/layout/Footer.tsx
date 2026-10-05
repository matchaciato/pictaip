import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Keyboard } from 'lucide-react';

export const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Picta<span className="text-red-600">IP</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
              Platform discovery dan kurasi visual AI (gambar & video) gratis seperti Pinterest.
              Setiap karya dilengkapi prompt engineering lengkap, negative prompt, seed, model parameter, serta resolusi unduhan bebas royalti.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
              Model Generator
            </h4>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5">
              <li>FLUX.1-dev & FLUX Pro</li>
              <li>Midjourney v6.1 & Niji</li>
              <li>Stable Diffusion XL (SDXL)</li>
              <li>OpenAI DALL-E 3 & Sora</li>
              <li>Runway Gen-3 Alpha</li>
              <li>Luma Dream Machine</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Pintasan Keyboard</span>
            </h4>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>Fokus Pencarian</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono">
                  /
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Tutup Jendela Modal</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono">
                  ESC
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Buka Board Koleksi</span>
                <kbd className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono">
                  B
                </kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>
            &copy; {new Date().getFullYear()} PictaIP. All Rights Reserved.
          </p>
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200 border border-neutral-700/30 dark:border-neutral-300/30"
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};
