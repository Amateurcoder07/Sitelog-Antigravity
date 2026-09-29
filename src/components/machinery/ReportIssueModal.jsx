import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ReportIssueModal({ machine, onClose, onSubmit }) {
  const [issueType, setIssueType] = useState('Hydraulic Seal Leakage');
  const [severity, setSeverity] = useState('CRITICAL');
  const [description, setDescription] = useState('');

  if (!machine) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      machineId: machine.id,
      issueType,
      severity,
      description,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Report Breakdown / Issue</h3>
              <p className="text-xs text-slate-400">{machine.name} ({machine.regNo})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Failure / Issue Category
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-rose-500"
            >
              <option value="Hydraulic Seal Leakage">Hydraulic Hose / Seal Leakage</option>
              <option value="Engine Overheating & Radiator Blockage">Engine Overheating & Radiator Blockage</option>
              <option value="Electrical & Starter Motor Failure">Electrical & Starter Motor Failure</option>
              <option value="Brake Pad / Transmission Failure">Brake Pad / Transmission Failure</option>
              <option value="Tyre Puncture & Axle Fault">Tyre Puncture & Axle Fault</option>
              <option value="Accidental Structure Damage">Accidental Structure Damage</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('LOW')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                  severity === 'LOW'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Minor / Warning
              </button>
              <button
                type="button"
                onClick={() => setSeverity('HIGH')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                  severity === 'HIGH'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                High Priority
              </button>
              <button
                type="button"
                onClick={() => setSeverity('CRITICAL')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                  severity === 'CRITICAL'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Critical Breakdown
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Detailed Breakdown Symptoms & Location
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exact symptoms, exact site spot, and immediate safety actions..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-rose-500 h-24"
              required
            />
          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>Submitting this report will flag machine as BREAKDOWN, alerting the P&M maintenance team immediately.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
            >
              Flag Breakdown
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}