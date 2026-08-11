import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 px-6 bg-[#040711]">
      <div className="max-w-5xl mx-auto">
        {/* Overline Heading */}
        <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-12">
          SIMPLE PRICING. NO HIDDEN COSTS. CANCEL ANYTIME.
        </p>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Plan Card */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Free Plan</h3>
              <div className="mb-6">
                <span className="text-white font-extrabold text-4xl">₹0</span>
                <p className="text-slate-400 text-xs mt-1">forever free</p>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 text-slate-300 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <span>1 active project</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Up to 15 workers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Labour and materials tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Basic safety logs</span>
                </li>
              </ul>
            </div>

            <Button variant="cardSecondary" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          </div>

          {/* Pro Plan Card */}
          <div className="bg-[#090e1a] border border-[#ea580c]/40 rounded-2xl p-8 flex flex-col justify-between shadow-xl shadow-orange-950/10 relative">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Pro Plan</h3>
              <div className="mb-6">
                <span className="text-white font-extrabold text-4xl">₹999</span>
                <p className="text-slate-400 text-xs mt-1">per month</p>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 text-slate-300 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Unlimited workers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Full BOCW compliance reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Export to PDF</span>
                </li>
              </ul>
            </div>

            <Button variant="primary" onClick={() => navigate('/login')} className="w-full py-3">
              Get Started
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
