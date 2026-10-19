import React from 'react';
import { X } from 'lucide-react';
import Button from '../Button';

export const fieldCls =
  'w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed';
export const labelCls = 'block text-xs font-bold text-black/70 dark:text-white/70 mb-1';

const TONES = {
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

export default function ModalShell({ icon: Icon, title, subtitle, onClose, children, tone = 'orange', wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6 max-h-[92vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl ${TONES[tone]}`}>
              <Icon size={20} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">{title}</h2>
              {subtitle && <p className="text-xs text-black/50 dark:text-white/50">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ModalActions({ onClose, submitLabel, busy, tone = 'primary', disabled = false }) {
  const submitCls =
    tone === 'red'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90';
  return (
    <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
      <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
        Cancel
      </Button>
      <button
        type="submit"
        disabled={busy || disabled}
        className={`inline-flex items-center justify-center font-medium text-sm rounded-md shadow-md px-5 py-3 flex-1 min-h-[48px] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${submitCls}`}
      >
        {busy ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}