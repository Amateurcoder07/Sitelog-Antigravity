import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, SearchX } from 'lucide-react';
import Logo from '../components/Logo';
import AnimatedAuthBackground from '../components/AnimatedAuthBackground';
import Button from '../components/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedAuthBackground />

      <header className="w-full px-6 h-16 flex items-center">
        <Logo />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-black bg-[#d4ff3f] rounded-full px-3 py-1 mb-8 shadow-[0_0_20px_rgba(212,255,63,0.35)]">
          <SearchX size={12} />
          Page not found
        </span>

        <h1 className="text-black dark:text-white font-extrabold tracking-tight leading-none text-[120px] md:text-[180px] select-none">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight mt-2 mb-4">
          This site doesn't exist. Yet.
        </h2>
        <p className="text-black/60 dark:text-white/60 text-sm md:text-base max-w-md mb-10 leading-relaxed">
          The page you're looking for was moved, renamed, or never logged in the register. Let's get you back on solid ground.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button variant="primary" onClick={() => navigate('/')} className="flex items-center gap-2 px-6 py-3 text-sm">
            <Home size={16} />
            Back to Home
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>

        <div className="mt-16 flex items-center gap-6 text-xs text-black/40 dark:text-white/40">
          <Link to="/login" className="hover:text-black dark:hover:text-white transition-colors">Sign in</Link>
          <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
          <Link to="/signup" className="hover:text-black dark:hover:text-white transition-colors">Create account</Link>
          <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
          <a href="/#features" className="hover:text-black dark:hover:text-white transition-colors">Features</a>
        </div>
      </div>
    </div>
  );
}