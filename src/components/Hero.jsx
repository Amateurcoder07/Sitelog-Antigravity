import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Hero() {
  const navigate = useNavigate();
  const { startDemoMode } = useAuth();

  const handleDemoClick = () => {
    startDemoMode();
    navigate('/dashboard');
  };

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <section className="relative min-h-[580px] flex items-center justify-center pt-16 pb-24 px-6 overflow-hidden bg-grid-pattern">
      {/* Background Radial Glow */}
      <div className="hero-glow"></div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Tighter sites, <span className="text-gradient-orange">better margins,</span> winning bids.
        </h1>

        {/* Subheading */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Built for small Indian contractors who are tired of scattered registers, missed BOCW payments, and shrinking margins.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" onClick={handleGetStartedClick} className="w-full sm:w-auto px-7 py-3 text-sm">
            Get Started
          </Button>
          <Button variant="secondary" onClick={handleDemoClick} className="w-full sm:w-auto px-7 py-3 text-sm">
            Try Demo — No Sign Up Needed
          </Button>
        </div>
      </div>
    </section>
  );
}
