import React from 'react';
import { UserPlus, ClipboardList, FileText } from 'lucide-react';

const steps = [
  {
    step: 'STEP 1',
    icon: UserPlus,
    title: 'Register your workers and project',
    description: 'Register your workers and project in minutes.',
  },
  {
    step: 'STEP 2',
    icon: ClipboardList,
    title: 'Log daily site activity',
    description: 'Log attendance, materials and safety issues daily.',
  },
  {
    step: 'STEP 3',
    icon: FileText,
    title: 'Get instant reports',
    description: 'Get instant reports for compliance, costs and contracts.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#040711]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-16 tracking-tight">
          How SiteLog works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-8 text-center flex flex-col items-center hover:border-slate-700 transition-all duration-200"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-full bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-5 text-[#ea580c]">
                  <Icon size={20} />
                </div>

                {/* Step Subtitle */}
                <span className="text-[#ea580c] font-bold text-xs tracking-wider uppercase mb-2">
                  {item.step}
                </span>

                {/* Step Title */}
                <h3 className="text-white font-bold text-lg mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
