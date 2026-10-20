import React, { useState } from 'react';
import { Receipt, Calculator } from 'lucide-react';
import ModalShell, { ModalActions, fieldCls, labelCls } from './Modalshell';

const SELF = 'Self / Main Contractor';
const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

export default function NewBackchargeModal({ machines = [], onClose, onSubmit }) {
  const first = machines[0];
  const [machineId, setMachineId] = useState(first?._id || '');
  const [subcontractor, setSubcontractor] = useState(first && first.subcontractor !== SELF ? first.subcontractor : '');
  const [hoursUsed, setHoursUsed] = useState('');
  const [internalRate, setInternalRate] = useState(first?.hourlyRate ? String(first.hourlyRate) : '');
  const [workDate, setWorkDate] = useState(today);
  const [purpose, setPurpose] = useState('');
  const [busy, setBusy] = useState(false);

  const total = Math.round((Number(hoursUsed) || 0) * (Number(internalRate) || 0));

  const changeMachine = (id) => {
    setMachineId(id);
    const m = machines.find((x) => x._id === id);
    if (m) {
      setSubcontractor(m.subcontractor && m.subcontractor !== SELF ? m.subcontractor : '');
      setInternalRate(m.hourlyRate ? String(m.hourlyRate) : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await onSubmit({
        machineId,
        subcontractor,
        hoursUsed: Number(hoursUsed),
        internalRate: Number(internalRate),
        workDate,
        purpose,
      });
      if (saved) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      icon={Receipt}
      title="New Subcontractor Back-charge"
      subtitle="Deduct equipment usage from the subcontractor's RA bill"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Equipment used</label>
          <select value={machineId} onChange={(e) => changeMachine(e.target.value)} className={fieldCls} required>
            {machines.map((m) => <option key={m._id} value={m._id}>{m.id} — {m.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Subcontractor</label>
          <input type="text" value={subcontractor} onChange={(e) => setSubcontractor(e.target.value)} placeholder="Who used the machine?" className={fieldCls} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Hours used</label>
            <input type="number" step="0.5" min="0.5" value={hoursUsed} onChange={(e) => setHoursUsed(e.target.value)} placeholder="e.g. 8.5" className={`${fieldCls} font-mono`} required />
          </div>
          <div>
            <label className={labelCls}>Rate (₹/hr)</label>
            <input type="number" step="50" min="0" value={internalRate} onChange={(e) => setInternalRate(e.target.value)} className={`${fieldCls} font-mono`} required />
          </div>
          <div>
            <label className={labelCls}>Work date</label>
            <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} className={fieldCls} required />
          </div>
        </div>

        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-orange-700 dark:text-orange-300 font-semibold">
            <Calculator size={16} />
            <span>RA bill deduction:</span>
          </div>
          <span className="text-lg font-black text-orange-600 dark:text-orange-400 font-mono">₹{total.toLocaleString('en-IN')}</span>
        </div>

        <div>
          <label className={labelCls}>Purpose / work location</label>
          <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Concrete pumping for Tower A Floor 12" className={fieldCls} required />
        </div>

        <ModalActions onClose={onClose} submitLabel="Create Back-charge" busy={busy} />
      </form>
    </ModalShell>
  );
}