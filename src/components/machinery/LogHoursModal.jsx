import React, { useState } from 'react';
import { X, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LogHoursModal({ machine, onClose, onSubmit }) {
  const [closingHmr, setClosingHmr] = useState(machine ? (machine.hmrCurrent || 0) + 8 : 0);
  const [shift, setShift] = useState('Day');
  const [notes, setNotes] = useState('');

  if (!machine) return null;

  const openingHmr = machine.hmrCurrent || 0;
  const hoursLogged = Math.max(0, parseFloat((closingHmr - openingHmr).toFixed(1)));
  const minContractAlert = (machine.loggedHoursThisMonth || 0) + hoursLogged < 160;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (closingHmr <= openingHmr) {
      alert('Closing HMR must be greater than Opening HMR!');
      return;
    }
    onSubmit({
      machineId: machine.id,
      openingHmr,
      closingHmr: parseFloat(closingHmr),
      hoursLogged,
      shift,
      notes,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Log HMR Machine Hours</h3>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Opening HMR (Locked)
              </label>
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-slate-300 font-mono text-sm font-semibold flex items-center justify-between">
                <span>{openingHmr.toFixed(1)} hrs</span>
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Closing HMR (Meter)
              </label>
              <input
                type="number"
                step="0.1"
                min={openingHmr + 0.1}
                value={closingHmr}
                onChange={(e) => setClosingHmr(parseFloat(e.target.value) || openingHmr)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Calculated Shift Work Duration:</span>
            <span className="text-sm font-black text-orange-400 font-mono">
              + {hoursLogged} hrs
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Operating Shift
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-orange-500"
            >
              <option value="Day">Day Shift (08:00 - 20:00)</option>
              <option value="Night">Night Shift (20:00 - 08:00)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Supervisor Notes / Operational Remarks
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed excavation for Block B footing..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-orange-500 h-20"
            />
          </div>

          {minContractAlert && machine.ownership === 'RENTED_MONTHLY' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>Rental Commitment Notice: Logged hours remain below contractual minimum cutoff for current billing cycle.</span>
            </div>
          )}

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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              Save HMR Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}