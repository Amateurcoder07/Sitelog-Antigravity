import React, { useState } from 'react';
import { X, Gauge } from 'lucide-react';
import Button from '../Button';

export default function NewEquipmentModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [lastCalibrationDate, setLastCalibrationDate] = useState('');
  const [nextCalibrationDue, setNextCalibrationDue] = useState('');
  const [location, setLocation] = useState('Site QC Lab Block A');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !serialNo.trim()) return;

    const newEquip = {
      id: `EQ-0${Math.floor(5 + Math.random() * 10)}`,
      name: name.trim(),
      model: model.trim() || 'Standard QC Spec',
      serialNo: serialNo.trim(),
      lastCalibrationDate: lastCalibrationDate || new Date().toISOString().split('T')[0],
      nextCalibrationDue: nextCalibrationDue || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Calibrated',
      location: location.trim()
    };

    onSave(newEquip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-2xl p-6 shadow-2xl z-10 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Gauge size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white">Register Lab Equipment</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Track calibration status of testing tools & machines</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Equipment / Machine Name</label>
            <input
              type="text"
              required
              placeholder="e.g. 2000 kN Compression Testing Machine (CTM)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Model / Make</label>
              <input
                type="text"
                placeholder="e.g. HEICO CTM-200"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Serial Number</label>
              <input
                type="text"
                required
                placeholder="e.g. CTM-2022-901"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Last Calibration Date</label>
              <input
                type="date"
                required
                value={lastCalibrationDate}
                onChange={(e) => setLastCalibrationDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Next Due Date</label>
              <input
                type="date"
                required
                value={nextCalibrationDue}
                onChange={(e) => setNextCalibrationDue(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black/70 dark:text-white/70 mb-1">Lab / Site Location</label>
            <input
              type="text"
              placeholder="e.g. Site QC Lab Block A"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Machine
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
