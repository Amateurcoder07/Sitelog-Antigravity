import React from 'react';
import { UserPlus, ClipboardList, FileText } from 'lucide-react';

const steps = [
  { step: 'STEP 1', icon: UserPlus, title: 'Register your workers and project', description: 'Register your workers and project in minutes.' },
  { step: 'STEP 2', icon: ClipboardList, title: 'Log daily site activity', description: 'Log attendance, materials and safety issues daily.' },
  { step: 'STEP 3', icon: FileText, title: 'Get instant reports', description: 'Get instant reports for compliance, costs and contracts.' },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-black dark:text-white mb-16 tracking-tight">
          How TerraCore works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-8 text-center flex flex-col items-center hover:border-black/30 dark:hover:border-white/30 transition-all duration-200">
                <span className="absolute top-4 right-5 text-black/10 dark:text-white/10 font-extrabold text-4xl select-none">{idx + 1}</span>
                <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center mb-5 text-white dark:text-black">
                  <Icon size={20} />
                </div>
                <span className="text-black/50 dark:text-white/50 font-bold text-xs tracking-wider uppercase mb-2">{item.step}</span>
                <h3 className="text-black dark:text-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-black/60 dark:text-white/60 text-xs md:text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}