import React from 'react';
import { Gauge, Activity, Fuel, TrendingDown } from 'lucide-react';

const cardCls =
  'snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm';

export default function FleetKpiRibbon({ machines = [] }) {
  const total = machines.length;
  const count = (s) => machines.filter((m) => m.status === s).length;
  const productive = count('PRODUCTIVE');
  const idle = count('IDLE');
  const standby = count('STANDBY');
  const breakdown = count('BREAKDOWN');
  const base = Math.max(1, total);

  const available = total - breakdown;
  const availability = total ? Math.round((available / total) * 100) : 0;

  const fuelToday = Math.round(machines.reduce((a, m) => a + (m.fuelFilledToday || 0), 0) * 10) / 10;
  const lowFuel = machines.filter((m) => m.fuelCapacity > 0 && m.fuelLevel < 25).length;

  const bleeding = machines.filter((m) => m.classType.startsWith('Rented') && (m.status === 'IDLE' || m.status === 'BREAKDOWN'));
  const bleedPerHour = bleeding.reduce((a, m) => a + (m.hourlyRate || 0), 0);

  return (
    <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto snap-x scrollbar-none pb-1 -mx-4 px-4 md:mx-0 md:px-0">
      <div className={cardCls}>
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
          <span className="text-xs font-semibold">Fleet Availability</span>
          <Gauge size={16} className="text-emerald-500" />
        </div>
        <p className="text-2xl font-black text-black dark:text-white">{total ? `${availability}%` : '—'}</p>
        <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${availability}%` }} />
        </div>
        <p className="text-[11px] font-medium text-black/40 dark:text-white/40 mt-1.5">
          {available} of {total} machine{total === 1 ? '' : 's'} available
        </p>
      </div>

      <div className={cardCls}>
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
          <span className="text-xs font-semibold">Utilization</span>
          <Activity size={16} className="text-orange-500" />
        </div>
        <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-black/10 dark:bg-white/10">
          <div className="bg-emerald-500 h-full" style={{ width: `${(productive / base) * 100}%` }} />
          <div className="bg-amber-500 h-full" style={{ width: `${(idle / base) * 100}%` }} />
          <div className="bg-slate-400 dark:bg-slate-500 h-full" style={{ width: `${(standby / base) * 100}%` }} />
          <div className="bg-red-500 h-full" style={{ width: `${(breakdown / base) * 100}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-semibold text-black/60 dark:text-white/60 mt-3">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />{productive} Productive</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />{idle} Idle</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" />{standby} Standby</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />{breakdown} Breakdown</span>
        </div>
      </div>

      <div className={cardCls}>
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
          <span className="text-xs font-semibold">Fuel Filled Today</span>
          <Fuel size={16} className="text-orange-500" />
        </div>
        <p className="text-2xl font-black text-black dark:text-white">{fuelToday} L</p>
        <p className={`text-[11px] font-medium mt-1 ${lowFuel ? 'text-amber-600 dark:text-amber-400' : 'text-black/40 dark:text-white/40'}`}>
          {lowFuel ? `${lowFuel} machine${lowFuel === 1 ? '' : 's'} below 25% fuel` : 'No machines low on fuel'}
        </p>
      </div>

      <div className={cardCls}>
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
          <span className="text-xs font-semibold">Idle Rental Cost</span>
          <TrendingDown size={16} className="text-red-500" />
        </div>
        <p className="text-2xl font-black text-red-600 dark:text-red-400">
          ₹{bleedPerHour.toLocaleString('en-IN')}
          <span className="text-xs font-semibold text-black/40 dark:text-white/40">/hr</span>
        </p>
        <p className="text-[11px] font-medium text-black/40 dark:text-white/40 mt-1">
          {bleeding.length} rented machine{bleeding.length === 1 ? '' : 's'} idle or broken down
        </p>
      </div>
    </div>
  );
}