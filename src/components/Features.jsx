import React from 'react';
import { Users, Layers, ShieldAlert, FileText, Leaf } from 'lucide-react';

const features = [
  { icon: Users, title: 'Labour Tracking', description: 'Log attendance, hours and wages daily. Know exactly what you owe, to who, and when.' },
  { icon: Layers, title: 'Materials Management', description: 'Track orders, deliveries and waste. See where your money is leaking.' },
  { icon: ShieldAlert, title: 'Safety Logs', description: 'Record incidents and briefings. Stay protected if an inspector shows up.' },
  { icon: FileText, title: 'BOCW Compliance', description: 'Never miss a cess payment or worker registration. Avoid project shutdowns.' },
  { icon: Leaf, title: 'Carbon & Waste', description: 'Cut waste costs and generate reports that win you better contracts.' },
];

function FeatureCard({ feature }) {
  const Icon = feature.icon;
  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-6 hover:border-black/30 dark:hover:border-white/30 transition-all duration-200">
      <div className="w-9 h-9 rounded-lg bg-black dark:bg-white flex items-center justify-center mb-5 text-white dark:text-black">
        <Icon size={18} />
      </div>
      <h3 className="text-black dark:text-white font-bold text-base mb-2">{feature.title}</h3>
      <p className="text-black/60 dark:text-white/60 text-xs md:text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-black dark:text-white mb-16 tracking-tight">
          Everything your site needs, in one place.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {features.slice(0, 3).map((f, idx) => <FeatureCard key={idx} feature={f} />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.slice(3, 5).map((f, idx) => <FeatureCard key={idx} feature={f} />)}
        </div>
      </div>
    </section>
  );
}