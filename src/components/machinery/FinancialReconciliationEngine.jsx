import React, { useState } from 'react';
import { Plus, TrendingDown, Receipt, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

export default function FinancialReconciliationEngine({ machines = [], backcharges = [], onOpenBackchargeModal, onToggleDeducted }) {
  const [activeTab, setActiveTab] = useState('contracts');

  const rented = machines.filter((m) => m.rental);
  const atRisk = rented.filter((m) => m.rental.atRisk);
  const totalBleed = rented.reduce((a, m) => a + (m.rental.financialRisk || 0), 0);

  const pending = backcharges.filter((b) => b.status === 'PENDING');
  const pendingTotal = pending.reduce((a, b) => a + b.amount, 0);

  const tabCls = (key) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
      activeTab === key
        ? 'bg-black dark:bg-white text-white dark:text-black font-bold'
        : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  return (
    <div className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-5">
        <div>
          <h2 className="text-lg font-black text-black dark:text-white tracking-tight">Billing & Back-charges</h2>
          <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
            Catch rented machines that won't use their minimum monthly hours, and charge equipment usage back to subcontractors' RA bills.
          </p>
        </div>
        <button
          onClick={onOpenBackchargeModal}
          disabled={machines.length === 0}
          className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> New Back-charge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider">Projected unused rental hours</span>
            <div className="text-2xl font-black text-red-600 dark:text-red-400 font-mono">{inr(totalBleed)}</div>
            <p className="text-[11px] text-black/50 dark:text-white/50">
              {atRisk.length} of {rented.length} rented machine{rented.length === 1 ? '' : 's'} on pace to miss the minimum
            </p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl"><TrendingDown size={24} /></div>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-black/50 dark:text-white/50 uppercase tracking-wider">Back-charges awaiting deduction</span>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">{inr(pendingTotal)}</div>
            <p className="text-[11px] text-black/50 dark:text-white/50">{pending.length} of {backcharges.length} entr{backcharges.length === 1 ? 'y' : 'ies'} pending</p>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl"><Receipt size={24} /></div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-3 overflow-x-auto">
        <button onClick={() => setActiveTab('contracts')} className={tabCls('contracts')}>
          <ShieldAlert size={16} /> Rental Contracts ({rented.length})
        </button>
        <button onClick={() => setActiveTab('backcharges')} className={tabCls('backcharges')}>
          <Receipt size={16} /> Back-charge Ledger ({backcharges.length})
        </button>
      </div>

      {activeTab === 'contracts' && (
        rented.length === 0 ? (
          <p className="text-center py-10 text-xs text-black/50 dark:text-white/50">
            No rented machines with a minimum monthly commitment. Add one (ownership "Rented" + minimum monthly hours) to track it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rented.map((m) => {
              const r = m.rental;
              return (
                <div
                  key={m._id}
                  className={`border p-5 rounded-xl space-y-3 ${r.atRisk ? 'border-amber-500/40 bg-amber-500/5' : 'border-black/10 dark:border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black dark:text-white text-sm">{m.name}</span>
                        <span className="text-xs font-mono text-black/50 dark:text-white/50">({m.id})</span>
                      </div>
                      <span className="text-[11px] text-black/50 dark:text-white/50">{m.classType} · {m.subcontractor}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        r.atRisk
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      {r.atRisk ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                      {r.atRisk ? 'Under-utilization risk' : 'On track'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-black/50 dark:text-white/50">Minimum hours this month</span>
                      <span className="text-black dark:text-white font-mono">{r.loggedHours} / {r.monthlyCommitment} hrs ({r.completionPct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.atRisk ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${r.completionPct}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-black/10 dark:border-white/10">
                    <div>
                      <span className="text-black/50 dark:text-white/50 block">Days left</span>
                      <span className="text-black dark:text-white font-semibold">{r.daysRemaining}</span>
                    </div>
                    <div>
                      <span className="text-black/50 dark:text-white/50 block">Current pace</span>
                      <span className="text-black dark:text-white font-semibold">{r.dailyAvg} h/day</span>
                    </div>
                    <div>
                      <span className="text-black/50 dark:text-white/50 block">Needed pace</span>
                      <span className="text-black dark:text-white font-semibold">{r.requiredDailyPace} h/day</span>
                    </div>
                  </div>

                  {r.atRisk && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
                      <span className="flex items-center gap-2"><AlertTriangle size={15} /> Projected shortfall: {r.projectedShortfallHours} hrs</span>
                      <span className="font-bold font-mono">{inr(r.financialRisk)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {activeTab === 'backcharges' && (
        backcharges.length === 0 ? (
          <p className="text-center py-10 text-xs text-black/50 dark:text-white/50">No back-charges raised yet.</p>
        ) : (
          <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-xl">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10">
                <tr>
                  <th className="p-3.5">ID / Date</th>
                  <th className="p-3.5">Subcontractor</th>
                  <th className="p-3.5">Equipment</th>
                  <th className="p-3.5">Hours × Rate</th>
                  <th className="p-3.5">Deduction</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-black dark:text-white">
                {backcharges.map((b) => (
                  <tr key={b._id} className="hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="p-3.5">
                      <span className="font-mono font-semibold block">{b.id}</span>
                      <span className="text-black/50 dark:text-white/50 text-[11px]">{fmtDate(b.date)}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold block">{b.subcontractor}</span>
                      <span className="text-black/50 dark:text-white/50 text-[11px]">{b.purpose}</span>
                    </td>
                    <td className="p-3.5">{b.machineName} <span className="text-black/40 dark:text-white/40 font-mono">({b.machineCode})</span></td>
                    <td className="p-3.5 font-mono">{b.hoursUsed} h × ₹{b.internalRate.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-mono font-bold text-orange-600 dark:text-orange-400">{inr(b.amount)}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => onToggleDeducted(b)}
                        title={b.status === 'PENDING' ? 'Mark as deducted from the RA bill' : 'Move back to pending'}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border cursor-pointer transition-colors ${
                          b.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {b.status === 'PENDING' ? 'Pending — mark deducted' : 'Deducted ✓'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}