import React, { useState } from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  FileSpreadsheet, 
  TrendingDown, 
  Plus, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  HelpCircle, 
  Receipt, 
  Building2, 
  ShieldAlert,
  Download,
  Info
} from 'lucide-react';
import { evaluateRentalContractGuardrail } from '../../data/mockMachineryData';

export default function FinancialReconciliationEngine({ 
  fleetData = [], 
  backcharges = [], 
  onAddBackcharge,
  onOpenBackchargeModal 
}) {
  const [activeTab, setActiveTab] = useState('guardrails');
  const [guardrailFilter, setGuardrailFilter] = useState('all');

  const rentedAssets = fleetData.filter(m => m.ownership !== 'OWNED');

  const evaluatedGuardrails = rentedAssets.map(asset => {
    return {
      ...asset,
      guardrail: evaluateRentalContractGuardrail(asset)
    };
  });

  const totalBackchargeAmount = backcharges.reduce((acc, b) => acc + (b.amount || 0), 0);
  const totalLeakageRisk = evaluatedGuardrails.reduce((acc, item) => {
    return acc + (item.guardrail.shortfallAmount || 0);
  }, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Engine Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Section 4: Financial Reconciliation & Billing Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                P&M Finance Audit
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Prevents rental contract cash bleed under-utilization & auto-calculates subcontractor back-charge deductions for monthly RA bills.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBackchargeModal}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            + New Subcontractor Back-Charge
          </button>
        </div>
      </div>

      {/* Top 2 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Potential Contract Cash Bleed</span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              ₹{totalLeakageRisk.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-500">Unused minimum hours committed in active rental contracts</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Subcontractor Back-Charges</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ₹{totalBackchargeAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-500">To be deducted from subcontractor monthly RA bills</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Receipt size={24} />
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('guardrails')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'guardrails'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert size={16} />
          <span>Rental Contract Guardrails</span>
        </button>

        <button
          onClick={() => setActiveTab('backcharges')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'backcharges'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt size={16} />
          <span>Subcontractor Back-Charging Ledger ({backcharges.length})</span>
        </button>
      </div>

      {/* TAB 1: Rental Contract Guardrails */}
      {activeTab === 'guardrails' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluatedGuardrails.map(item => {
              const { guardrail } = item;
              const isAlert = guardrail.hasLeakageAlert;

              return (
                <div
                  key={item.id}
                  className={`bg-slate-950 border p-5 rounded-xl space-y-3 relative overflow-hidden ${
                    isAlert ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.name}</span>
                        <span className="text-xs font-mono text-slate-400">({item.regNo})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Vendor: {item.vendor}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isAlert ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isAlert ? '⚠️ Under-Utilization Risk' : '🟢 Contract On Track'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Commitment Progress</span>
                      <span className="text-white font-mono">{guardrail.loggedHours} / {guardrail.minCommitmentHours} hrs ({guardrail.progressPercent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAlert ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, guardrail.progressPercent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block">Days Remaining:</span>
                      <span className="text-slate-200 font-semibold">{guardrail.daysRemaining} days</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Required Pace:</span>
                      <span className="text-slate-200 font-semibold">{guardrail.requiredDailyPace} hrs/day</span>
                    </div>
                  </div>

                  {isAlert && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-300">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={15} />
                        <span>Est. Shortfall: {guardrail.projectedShortfallHours} hrs</span>
                      </div>
                      <span className="font-bold font-mono">Bleed: ₹{guardrail.shortfallAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Subcontractor Back-Charging Ledger */}
      {activeTab === 'backcharges' && (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Ledger ID</th>
                  <th className="p-3.5">Subcontractor Entity</th>
                  <th className="p-3.5">Equipment Asset</th>
                  <th className="p-3.5">Hours Used</th>
                  <th className="p-3.5">Internal Rate</th>
                  <th className="p-3.5">RA Bill Deduction</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {backcharges.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono text-slate-400 font-semibold">{row.id}</td>
                    <td className="p-3.5 font-bold text-white">{row.subcontractor}</td>
                    <td className="p-3.5">{row.machineName}</td>
                    <td className="p-3.5 font-mono font-semibold">{row.hoursUsed} hrs</td>
                    <td className="p-3.5 font-mono">₹{row.internalRate}/hr</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      ₹{row.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-bold">
                        Pending RA Deduction
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}