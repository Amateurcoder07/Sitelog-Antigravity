import React from 'react';

export default function Button({ children, variant = 'primary', className = '', onClick, type = 'button' }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium text-sm rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variants = {
    primary: 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md shadow-orange-950/30 px-5 py-2.5 active:scale-95',
    secondary: 'bg-[#0b101e] hover:bg-slate-800/60 text-slate-200 border border-slate-800 px-5 py-2.5 active:scale-95',
    outline: 'bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-500 px-5 py-2.5',
    navPrimary: 'bg-[#ea580c] hover:bg-[#c2410c] text-white font-medium text-xs px-4 py-2 rounded-md shadow-md active:scale-95',
    cardSecondary: 'w-full bg-[#0b101e] hover:bg-slate-800/60 text-slate-200 border border-slate-800 font-medium py-3 rounded-md transition-colors text-center'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
