import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstallable(false);
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-black/60 dark:text-white/60">
          <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.features')}</a>
          <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.pricing')}</a>
          <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.about')}</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isInstallable && (
            <Button
              variant="navSecondary"
              onClick={handleInstallClick}
              className="flex items-center gap-2"
            >
              <Download size={13} />
              <span>{t('nav.install')}</span>
            </Button>
          )}
          <Button variant="navPrimary" onClick={() => navigate('/login')}>
            {t('nav.getStarted')}
          </Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-black/70 dark:text-white/70"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black/70 dark:text-white/70 p-2 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-black/10 dark:border-white/10 px-6 py-4 flex flex-col gap-4">
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white text-sm py-1">{t('nav.features')}</a>
          <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white text-sm py-1">{t('nav.pricing')}</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white text-sm py-1">{t('nav.about')}</a>

          <div className="pt-2 flex flex-col gap-2">
            {isInstallable && (
              <Button
                variant="outline"
                onClick={() => { handleInstallClick(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 border-black/20 dark:border-white/20 text-black dark:text-white"
              >
                <Download size={15} />
                <span>{t('nav.install')}</span>
              </Button>
            )}
            <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
              {t('nav.getStarted')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}