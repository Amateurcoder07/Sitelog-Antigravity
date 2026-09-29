import React, { useState } from 'react';
import { X, Receipt, DollarSign, Calculator } from 'lucide-react';

export default function NewBackchargeModal({ fleetData = [], onClose, onSubmit }) {
  const [selectedMachineId, setSelectedMachineId] = useState(fleetData[0]?.id || '');
  const [subcontractor, setSubcontractor] = useState('L&T Civil Structure');
  const [hoursUsed, setHoursUsed] = useState(8.5);
  const [hourlyRate, setHourlyRate] = useState(3500);
  const [purpose, setPurpose] = useState('Concrete Pumping for Tower A Floor 12');

  const selectedMachine = fleetData.find(m => m.id === selectedMachineId);
  const calculatedTotal = (hoursUsed * hourlyRate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMachine) return;
    onSubmit({
      id: `BC-${Math.floor(100 + Math.random() * 900)}`,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      subcontractor,
      hoursUsed: parseFloat(hoursUsed),
      internalRate: parseFloat(hourlyRate),
      amount: calculatedTotal,
      date: new Date().toISOString().split('T')[0],
      purpose,
      status: 'PENDING_RA_DEDUCTION'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Subcontractor Back-Charge</h3>
              <p className="text-xs text-slate-400">Deduct equipment usage from Subcontractor monthly RA Bill</p>
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
              Equipment / Asset Used
            </label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-emerald-500"
            >
              {fleetData.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.regNo}) - {m.subcontractor}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Target Subcontractor Entity
            </label>
            <input
              type="text"
              value={subcontractor}
              onChange={(e) => setSubcontractor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Hours Used
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={hoursUsed}
                onChange={(e) => setHoursUsed(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Internal Rate (₹/hr)
              </label>
              <input
                type="number"
                step="100"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <Calculator size={16} />
              <span>Calculated RA Bill Deduction:</span>
            </div>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ₹{calculatedTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Purpose / Work Location Details
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Issue Back-Charge Ledger Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}