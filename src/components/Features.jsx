import React from 'react';
import { Users, Layers, ShieldAlert, FileText, Leaf } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Labour Tracking',
    description: 'Log attendance, hours and wages daily. Know exactly what you owe, to who, and when.',
  },
  {
    icon: Layers,
    title: 'Materials Management',
    description: 'Track orders, deliveries and waste. See where your money is leaking.',
  },
  {
    icon: ShieldAlert,
    title: 'Safety Logs',
    description: 'Record incidents and briefings. Stay protected if an inspector shows up.',
  },
  {
    icon: FileText,
    title: 'BOCW Compliance',
    description: 'Never miss a cess payment or worker registration. Avoid project shutdowns.',
  },
  {
    icon: Leaf,
    title: 'Carbon & Waste',
    description: 'Cut waste costs and generate reports that win you better contracts.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-[#040711]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-16 tracking-tight">
          Everything your site needs, in one place.
        </h2>

        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {features.slice(0, 3).map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-6 hover:border-slate-700 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-5 text-[#ea580c]">
                  <Icon size={18} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom 2 Cards Grid (Centered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.slice(3, 5).map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-6 hover:border-slate-700 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-5 text-[#ea580c]">
                  <Icon size={18} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
