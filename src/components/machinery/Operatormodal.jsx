import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import ModalShell, { ModalActions, fieldCls, labelCls } from './ModalShell';

export default function OperatorModal({ machines = [], onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [pin, setPin] = useState('');
  const [defaultMachineId, setDefaultMachineId] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await onSubmit({ name, role, pin, defaultMachineId });
      if (saved) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell icon={UserPlus} title="Add Operator" subtitle="Operators confirm their shift logbook with a 4-digit PIN" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Full name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rajesh Kumar" className={fieldCls} required />
        </div>

        <div>
          <label className={labelCls}>Role</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Crane Operator" className={fieldCls} />
        </div>

        <div>
          <label className={labelCls}>4-digit PIN *</label>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className={`${fieldCls} font-mono tracking-[0.4em] text-center`}
            required
          />
          <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">
            Stored securely and never shown again. Share it only with the operator.
          </p>
        </div>

        <div>
          <label className={labelCls}>Usually operates (optional)</label>
          <select value={defaultMachineId} onChange={(e) => setDefaultMachineId(e.target.value)} className={fieldCls}>
            <option value="">No default machine</option>
            {machines.map((m) => <option key={m._id} value={m._id}>{m.id} — {m.name}</option>)}
          </select>
        </div>

        <ModalActions onClose={onClose} submitLabel="Add Operator" busy={busy} disabled={pin.length !== 4} />
      </form>
    </ModalShell>
  );
}