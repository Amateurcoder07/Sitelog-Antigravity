import React from 'react';

export default function Button({ children, variant = 'primary', className = '', onClick, type = 'button' }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium text-sm rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black';

  const variants = {
    primary: 'bg-black dark:bg-white hover:opacity-90 text-white dark:text-black shadow-md px-5 py-2.5 active:scale-95',
    secondary: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white border border-black/20 dark:border-white/20 px-5 py-2.5 active:scale-95',
    outline: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-black/80 dark:text-white/80 border border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 px-5 py-2.5',
    navPrimary: 'bg-black dark:bg-white hover:opacity-90 text-white dark:text-black font-medium text-xs px-4 py-2 rounded-md shadow-md active:scale-95',
    navSecondary: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white border border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 font-medium text-xs px-4 py-2 rounded-md active:scale-95',
    cardSecondary: 'w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white border border-black/20 dark:border-white/20 font-medium py-3 rounded-md transition-colors text-center'
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </button>
  );
}