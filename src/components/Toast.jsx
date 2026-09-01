import React from 'react';
import { Check, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="relative bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/15 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 pr-6 min-w-[260px] max-w-sm">
        <button
          onClick={onClose}
          className="absolute -top-2 -left-2 w-5 h-5 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
          aria-label="Close notification"
        >
          <X size={12} />
        </button>
        <div className="w-5 h-5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center flex-shrink-0">
          <Check size={13} strokeWidth={2.5} />
        </div>
        <span className="text-black dark:text-white font-medium text-xs md:text-sm tracking-tight">
          {message}
        </span>
      </div>
    </div>
  );
}