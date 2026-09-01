import React from 'react';

export default function AnimatedAuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-black bg-grid-pattern transition-colors duration-300">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#d4ff3f]/20 blur-[100px] animate-blob-1 top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-black/10 dark:bg-white/10 blur-[100px] animate-blob-2 bottom-[-80px] right-[-80px]" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#d4ff3f]/10 blur-[90px] animate-blob-3 top-[40%] left-[60%]" />
    </div>
  );
}