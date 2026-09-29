import React, { useState } from 'react';
import { X, Fuel, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function LogFuelModal({ machine, onClose, onSubmit }) {
  const [litersFilled, setLitersFilled] = useState(50);
  const [vendor, setVendor] = useState('Site Bowser Tank #1');
  const [slipNo, setSlipNo] = useState(`FSL-${Math.floor(10000 + Math.random() * 90000)}`);
  const [density, setDensity] = useState(835);

  if (!machine) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      machineId: machine.id,
      litersFilled: parseFloat(litersFilled),
      vendor,
      slipNo,
      density,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Fuel size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Log Diesel Top-up Fuel</h3>
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
              Fuel Volume Added (Liters)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={litersFilled}
              onChange={(e) => setLitersFilled(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Fuel Slip Voucher #
              </label>
              <input
                type="text"
                value={slipNo}
                onChange={(e) => setSlipNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Diesel Density (kg/m³)
              </label>
              <input
                type="number"
                value={density}
                onChange={(e) => setDensity(parseInt(e.target.value) || 835)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fuel Dispenser Source / Bowser Tanker
            </label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="Site Bowser Tank #1">Site Bowser Tank #1</option>
              <option value="Site Bowser Tank #2">Site Bowser Tank #2</option>
              <option value="External IOCL Fuel Station">External IOCL Fuel Station</option>
              <option value="BPCL Vendor Delivery Truck">BPCL Vendor Delivery Truck</option>
            </select>
          </div>

          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Anti-Theft Check: Logged volume will automatically update tank telemetry level.</span>
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Record Fuel Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}