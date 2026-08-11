import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { Menu, X, Building2 } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#040711]/90 backdrop-blur-md border-b border-slate-800/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-7 h-7 bg-[#ea580c] rounded-md flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SiteLog</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button variant="navPrimary" onClick={() => navigate('/login')}>Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2 cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#090e1a] border-b border-slate-800 px-6 py-4 flex flex-col gap-4">
          <a 
            href="#features" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-300 hover:text-white text-sm py-1"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-300 hover:text-white text-sm py-1"
          >
            Pricing
          </a>
          <a 
            href="#about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-300 hover:text-white text-sm py-1"
          >
            About
          </a>
          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/login')} className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
