import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HomeIcon } from 'lucide-react';
import Logo from './Logo';

export default function AuthNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
        >
          <HomeIcon size={20} />
        </Link>
      </div>
    </header>
  );
}