import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes } from 'lucide-react';

export default function Logo({ iconSize = 16, textClassName = 'text-lg' }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
      <div className="w-7 h-7 bg-black dark:bg-white rounded-md flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
        <Boxes size={iconSize} className="text-white dark:text-black" />
      </div>
      <span className={`text-black dark:text-white font-bold ${textClassName} tracking-tight`}>
        TerraCore<span className="text-black/40 dark:text-white/40">.ai</span>
      </span>
    </Link>
  );
}