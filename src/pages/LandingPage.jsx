import React, { useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CustomerMarquee from '../components/CustomerMarquee';
import DemoPreview from '../components/DemoPreview';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function LandingPage() {
  useEffect(() => {
    API.get('/test-route')
      .then((response) => console.log(response.data.msg))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <CustomerMarquee />
        <DemoPreview />
        <Features />
        <Pricing />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}