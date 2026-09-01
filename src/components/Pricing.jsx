import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from './Button';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 px-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest text-black/50 dark:text-white/50 uppercase mb-12">
          Simple pricing. No hidden costs. Cancel anytime.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-start gap-8">
          {/* Free Plan */}
          <div className="w-full md:w-[300px] flex flex-col">
            <p className="text-center text-[11px] font-bold tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">
              Get Started Free
            </p>
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-8 min-h-[520px] flex flex-col justify-between hover:border-black/40 dark:hover:border-white/40 transition-colors">
              <div>
                <h3 className="text-black dark:text-white font-bold text-xl mb-4">Free Plan</h3>
                <div className="mb-6">
                  <span className="text-black dark:text-white font-extrabold text-4xl">₹0</span>
                  <p className="text-black/50 dark:text-white/50 text-xs mt-1">forever free</p>
                </div>
                <ul className="space-y-3.5 text-black/70 dark:text-white/70 text-sm mb-8">
                  {['1 active project', 'Up to 15 workers', 'Labour and materials tracking', 'Basic safety logs'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={14} className="text-black/40 dark:text-white/40 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant="cardSecondary" onClick={() => navigate('/login')}>Get Started</Button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="w-full md:w-[300px] flex flex-col">
            <p className="text-center text-[11px] font-bold tracking-widest uppercase text-black dark:text-white mb-3">
              Most Popular
            </p>
            <div className="bg-black dark:bg-white border-2 border-black dark:border-white rounded-2xl p-8 min-h-[520px] flex flex-col justify-between shadow-xl shadow-black/10 dark:shadow-white/10">
              <div>
                <h3 className="text-white dark:text-black font-bold text-xl mb-4">Pro Plan</h3>
                <div className="mb-6">
                  <span className="text-white dark:text-black font-extrabold text-4xl">₹999</span>
                  <p className="text-white/50 dark:text-black/50 text-xs mt-1">per month</p>
                </div>
                <ul className="space-y-3.5 text-white/80 dark:text-black/80 text-sm mb-8">
                  {['Unlimited projects', 'Unlimited workers', 'Full BOCW compliance reports', 'Priority support', 'Export to PDF'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={14} className="text-white/60 dark:text-black/60 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-white dark:bg-black text-black dark:text-white hover:opacity-90 rounded-lg font-semibold text-sm transition-opacity cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}