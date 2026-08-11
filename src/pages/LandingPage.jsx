import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
