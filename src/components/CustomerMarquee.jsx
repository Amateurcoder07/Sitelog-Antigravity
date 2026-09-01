import React from 'react';

const customers = [
  'Raheja Builders', 'Konkan Infra', 'Vishal Constructions',
  'Sundaram Civilworks', 'Patel Contractors', 'Amar Structures',
  'BlueRock Projects', 'Deccan Buildtech',
];

export default function CustomerMarquee() {
  const track = [...customers, ...customers];
  return (
    <section className="py-10 border-y border-black/10 dark:border-white/10 bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      <p className="text-center text-[11px] font-semibold tracking-widest uppercase text-black/40 dark:text-white/40 mb-6">
        Trusted by builders across India
      </p>
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-16">
          {track.map((name, idx) => (
            <span key={idx} className="text-black/30 dark:text-white/30 font-bold text-lg whitespace-nowrap select-none">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}