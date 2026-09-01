import React from 'react';

export default function Footer() {
  return (
    <footer id="about" className="border-t border-black/10 dark:border-white/10 bg-white dark:bg-black py-8 px-6 text-black/50 dark:text-white/50 text-xs transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 TerraCore.ai. Built for India's builders.</p>
        <div className="flex items-center gap-6">
          <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}