import React from 'react';
import { 
  Gauge, 
  Activity, 
  Fuel, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Wrench,
  Sparkles
} from 'lucide-react';

export default function FleetKpiRibbon({ fleetData = [] }) {
  const totalFleet = fleetData.length || 1;
  const breakdownCount = fleetData.filter(m => m.status === 'BREAKDOWN').length;
  const productiveCount = fleetData.filter(m => m.status === 'PRODUCTIVE').length;
  const idleCount = fleetData.filter(m => m.status === 'IDLE').length;
  const standbyCount = fleetData.filter(m => m.status === 'STANDBY').length;

  const availableCount = totalFleet - breakdownCount;
  const availabilityRate = Math.round((availableCount / totalFleet) * 100);

  const productivePct = Math.round((productiveCount / totalFleet) * 100);
  const idlePct = Math.round((idleCount / totalFleet) * 100);
  const breakdownPct = Math.round((breakdownCount / totalFleet) * 100);
  const standbyPct = Math.max(0, 100 - (productivePct + idlePct + breakdownPct));

  const totalFuelConsumed = fleetData.reduce((acc, item) => acc + (item.fuelConsumedToday || 0), 0);
  const theftAlerts = fleetData.filter(m => m.fuelTheftAlert);

  const idleOrBreakdownRented = fleetData.filter(
    m => m.classType && m.classType.includes('Rented') && (m.status === 'IDLE' || m.status === 'BREAKDOWN')
  );
  
  const cashBleedRate = idleOrBreakdownRented.reduce((acc, m) => acc + (m.hourlyRentalRate || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Fleet Availability Rate</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Gauge size={18} />
          </div>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-black dark:text-white font-mono">
            {availabilityRate}%
          </span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            Available ({availableCount}/{totalFleet})
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: availabilityRate + "%" }}
          />
        </div>
        <span className="text-[11px] text-black/50 dark:text-white/50 mt-2 block">
          Formula: (Total Fleet - Breakdown) / Total Fleet
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Utilization Efficiency</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Activity size={18} />
          </div>
        </div>

        <div className="my-2">
          <div className="flex items-baseline justify-between text-xs font-semibold mb-1.5">
            <span className="text-emerald-600 dark:text-emerald-400">{productivePct}% Productive</span>
            <span className="text-amber-600 dark:text-amber-400">{idlePct}% Idle</span>
            <span className="text-red-600 dark:text-red-400">{breakdownPct}% Downtime</span>
          </div>

          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 p-0.5">
            <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: productivePct + "%" }} title="Productive" />
            <div className="bg-amber-500 h-full" style={{ width: idlePct + "%" }} title="Idle" />
            <div className="bg-slate-400 dark:bg-slate-600 h-full" style={{ width: standbyPct + "%" }} title="Standby" />
            <div className="bg-red-500 h-full rounded-r-full" style={{ width: breakdownPct + "%" }} title="Breakdown" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-black/50 dark:text-white/50 mt-1">
          <span>🟢 {productiveCount} Productive</span>
          <span>🟡 {idleCount} Idle</span>
          <span>🔴 {breakdownCount} Breakdown</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-black/50 dark:text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Fuel Burn & Theft Risk</span>
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Fuel size={18} />
          </div>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold font-mono text-black dark:text-white">
              {totalFuelConsumed} L
            </span>
            <span className="text-xs text-black/50 dark:text-white/50 block">Consumed Today</span>
          </div>

          {theftAlerts.length > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={14} />
              <span className="text-xs font-bold">Theft Flag!</span>
            </div>
          )}
        </div>

        {theftAlerts.length > 0 ? (
          <div className="p-2 rounded-lg bg-red-500/10 text-[11px] text-red-700 dark:text-red-300 font-medium truncate">
            ⚠️ {theftAlerts[0].id}: {theftAlerts[0].fuelTheftDetail || 'Off-shift diesel drop detected!'}
          </div>
        ) : (
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle size={13} />
            No fuel theft anomalies flagged today
          </div>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-900/20 via-slate-900 to-slate-900 dark:from-red-950/40 dark:via-black dark:to-black border border-red-500/30 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
        <div className="flex items-center justify-between text-red-400 text-xs font-semibold uppercase tracking-wider">
          <span>Rental Cash Bleed</span>
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400 animate-pulse">
            <TrendingDown size={18} />
          </div>
        </div>

        <div className="my-2">
          <div className="text-2xl font-extrabold font-mono text-red-400">
            ₹{cashBleedRate.toLocaleString('en-IN')}<span className="text-xs text-red-300 font-sans font-normal">/hr</span>
          </div>
          <span className="text-xs text-slate-300 block mt-0.5">
            Real-time loss from idle/broken rented assets
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-red-500/20 pt-2 mt-1">
          <span>Rented Idle: {idleOrBreakdownRented.length} Machine(s)</span>
          <span className="font-bold text-red-400">Action Required</span>
        </div>
      </div>
    </div>
  );
}