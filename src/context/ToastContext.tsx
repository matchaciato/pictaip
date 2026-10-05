import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      // Clear any pending dismissal to avoid stacking or premature disappearance
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setActiveToast({ id, message, type });

      // Snappy auto-dismiss in 2.2 seconds to keep view clear
      timerRef.current = setTimeout(() => {
        setActiveToast(null);
        timerRef.current = null;
      }, 2200);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Floating Container - strictly single non-stacking toast */}
      {activeToast && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-sm px-4 flex justify-center">
          <div
            key={activeToast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-neutral-900/95 dark:bg-white/95 text-white dark:text-neutral-900 shadow-2xl backdrop-blur-md border border-neutral-700/60 dark:border-neutral-200 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex items-center gap-2">
              {activeToast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
              )}
              {activeToast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />
              )}
              {activeToast.type === 'info' && (
                <Info className="w-4 h-4 text-sky-400 dark:text-sky-600 shrink-0" />
              )}
              <span className="line-clamp-1">{activeToast.message}</span>
            </div>
            <button
              onClick={dismissToast}
              className="p-1 rounded-full text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
