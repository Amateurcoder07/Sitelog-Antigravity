import React from 'react';

export default function Footer() {
  return (
    <footer id="about" className="border-t border-slate-900 bg-[#060913] py-8 px-6 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Copyright text */}
        <p className="text-slate-400">
          © 2026 SiteLog. Built for India's builders.
        </p>

        {/* Right Navigation links */}
        <div className="flex items-center gap-6 text-slate-400">
          <a href="#about" className="hover:text-slate-200 transition-colors">About</a>
          <a href="#contact" className="hover:text-slate-200 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
