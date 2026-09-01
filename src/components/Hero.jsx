import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const navigate = useNavigate();
  const { startDemoMode } = useAuth();
  const { t } = useTranslation();   // ← moved here

  const handleDemoClick = () => {
    startDemoMode();
    navigate('/dashboard');
  };
  const handleGetStartedClick = () => navigate('/login');

  return (
    <section className="relative min-h-[580px] flex items-center justify-center pt-16 pb-24 px-6 overflow-hidden bg-grid-pattern bg-white dark:bg-black transition-colors duration-300">
      <div className="hero-glow" />

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-black bg-[#d4ff3f] border border-black/10 rounded-full px-3 py-1 mb-6 shadow-[0_0_20px_rgba(212,255,63,0.35)]">
          {t('hero.badge')}
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white tracking-tight leading-[1.15] mb-6">
          {t('hero.titleLine1')} <span className="text-gradient-mono">{t('hero.titleHighlight')}</span> {t('hero.titleLine2')}
        </h1>

        <p className="text-black/60 dark:text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" onClick={handleGetStartedClick} className="w-full sm:w-auto px-7 py-3 text-sm">
            {t('hero.ctaPrimary')}
          </Button>
          <Button variant="secondary" onClick={handleDemoClick} className="w-full sm:w-auto px-7 py-3 text-sm">
            {t('hero.ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  );
}