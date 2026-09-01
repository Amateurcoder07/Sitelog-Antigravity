import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  // { code: 'mr', label: 'मराठी' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const select = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        className="w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
      >
        <Languages size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 min-w-[140px] bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/15 rounded-lg shadow-xl py-1">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {l.label}
                {current.code === l.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}