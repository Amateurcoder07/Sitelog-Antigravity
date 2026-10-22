import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import ModalShell, { ModalActions, fieldCls, labelCls } from './Modalshell';

const ISSUE_TYPES = [
  'Hydraulic Hose / Seal Leakage',
  'Engine Overheating & Radiator Blockage',
  'Electrical & Starter Motor Failure',
  'Brake Pad / Transmission Failure',
  'Tyre Puncture & Axle Fault',
  'Accidental Structure Damage',
  'Other',
];

export default function ReportIssueModal({ machine, onClose, onSubmit }) {
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await onSubmit(machine, { issueType, description });
      if (saved) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell icon={AlertTriangle} tone="red" title="Report Breakdown" subtitle={`${machine.name} (${machine.id})`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Failure category</label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className={fieldCls}>
            {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Symptoms & location</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the exact symptoms, where the machine is, and any immediate safety action taken..."
            className={`${fieldCls} h-28 resize-none`}
            required
          />
        </div>

        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>This marks the machine as broken down and blocks hour logging until it is marked as repaired.</span>
        </div>

        <ModalActions onClose={onClose} submitLabel="Flag Breakdown" busy={busy} tone="red" />
      </form>
    </ModalShell>
  );
}