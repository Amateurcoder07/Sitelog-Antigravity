import React, { useState } from 'react';
import { Clock, ShieldCheck } from 'lucide-react';
import ModalShell, { ModalActions, fieldCls, labelCls } from './ModalShell';

export default function LogHoursModal({ machine, onClose, onSubmit }) {
  const [closingHmr, setClosingHmr] = useState(String(machine.hmrCurrent));
  const [shift, setShift] = useState('Day');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const openingHmr = machine.hmrCurrent;
  const hoursLogged = Math.max(0, Math.round((Number(closingHmr) - openingHmr) * 10) / 10) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await onSubmit(machine, { closingHmr: Number(closingHmr), shift, notes });
      if (saved) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell icon={Clock} title="Log Machine Hours" subtitle={`${machine.name} (${machine.id})`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Opening HMR (locked)</label>
            <div className="bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-black/70 dark:text-white/70 font-mono text-sm font-semibold flex items-center justify-between min-h-[44px]">
              <span>{openingHmr.toFixed(1)} hrs</span>
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Closing HMR (meter)</label>
            <input
              type="number"
              step="0.1"
              min={openingHmr + 0.1}
              value={closingHmr}
              onChange={(e) => setClosingHmr(e.target.value)}
              className={`${fieldCls} font-mono`}
              required
            />
          </div>
        </div>

        <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-black/60 dark:text-white/60 font-medium">Shift work duration:</span>
          <span className="text-sm font-black text-orange-600 dark:text-orange-400 font-mono">+ {hoursLogged} hrs</span>
        </div>

        <div>
          <label className={labelCls}>Operating shift</label>
          <select value={shift} onChange={(e) => setShift(e.target.value)} className={fieldCls}>
            <option value="Day">Day Shift (08:00 - 20:00)</option>
            <option value="Night">Night Shift (20:00 - 08:00)</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Remarks (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Completed excavation for Block B footing..."
            className={`${fieldCls} h-20 resize-none`}
          />
        </div>

        <ModalActions onClose={onClose} submitLabel="Save HMR Log" busy={busy} disabled={hoursLogged <= 0} />
      </form>
    </ModalShell>
  );
}