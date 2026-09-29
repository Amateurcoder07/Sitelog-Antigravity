import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  User, 
  MapPin, 
  Building2, 
  ShieldCheck,
  Wrench,
  FileText
} from 'lucide-react';

export default function MachineDetailPanel({ machine, onClose, onLogHours, onLogFuel, onReportIssue }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!machine) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl">
            <Truck size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{machine.name}</h3>
            <span className="text-xs font-mono text-slate-400">{machine.regNo} | {machine.category}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Action Buttons Header Bar */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800 grid grid-cols-3 gap-2">
        <button
          onClick={() => onLogHours(machine)}
          className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Clock size={14} className="text-orange-400" />
          Log Hours
        </button>

        <button
          onClick={() => onLogFuel(machine)}
          className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Fuel size={14} className="text-amber-400" />
          Log Fuel
        </button>

        <button
          onClick={() => onReportIssue(machine)}
          className="py-2 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <AlertTriangle size={14} />
          Breakdown
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center border-b border-slate-800 px-4 pt-2 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer ${
            activeTab === 'compliance'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Compliance & Fitness
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer ${
            activeTab === 'maintenance'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Maintenance
        </button>
      </div>

      {/* Panel Body Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl text-xs space-y-2.5 bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span>Current Status:</span>
                <span className="font-bold text-white">{machine.status}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Location Spot:</span>
                <span className="font-semibold text-slate-200">{machine.location}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Assigned Subcontractor:</span>
                <span className="font-semibold text-slate-200">{machine.subcontractor}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Active Operator:</span>
                <span className="font-semibold text-amber-400">{machine.operatorName || 'Rajesh Y.'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 font-semibold block">HMR Counter Telemetry</span>
              <div className="text-xl font-black text-white font-mono">{machine.hmrCurrent || 4852.5} hrs</div>
              <span className="text-[10px] text-slate-500">Logged this month: {machine.loggedHoursThisMonth || 142} hrs</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-slate-400 font-semibold block">Fuel Tank Level</span>
              <div className="flex items-center justify-between">
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mr-3">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${machine.fuelLevel || 78}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-amber-400">{machine.fuelLevel || 78}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">PUC Emission Certificate</span>
                <span className="text-[10px] text-slate-400">Valid until: 15 Oct 2026</span>
              </div>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Third Party Lifting Fitness</span>
                <span className="text-[10px] text-slate-400">Valid until: 28 Nov 2026</span>
              </div>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Comprehensive Insurance</span>
                <span className="text-[10px] text-slate-400">Valid until: 04 Jan 2027</span>
              </div>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-white block">Last Preventive Service (P&M)</span>
              <span className="text-slate-400">Completed at 4,500 HMR (Engine Oil & Filter Change)</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-white block">Next Scheduled Service</span>
              <span className="text-amber-400 font-semibold">Due at 5,000 HMR (in ~147.5 operating hours)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}