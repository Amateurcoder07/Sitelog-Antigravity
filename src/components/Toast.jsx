import React from 'react';
import { Check, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className="relative bg-[#e8faf0] border border-[#bbf7d0] rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 pr-6 min-w-[260px] max-w-sm">
        {/* Floating Top-Left Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -left-2 w-5 h-5 bg-white text-emerald-600 rounded-full shadow-md border border-emerald-200 flex items-center justify-center hover:scale-110 transition-transform focus:outline-none"
          aria-label="Close notification"
        >
          <X size={12} />
        </button>

        {/* Checkmark Icon Circle */}
        <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Check size={13} strokeWidth={2.5} />
        </div>

        {/* Toast Message */}
        <span className="text-[#065f46] font-medium text-xs md:text-sm tracking-tight">
          {message}
        </span>
      </div>
    </div>
  );
}
