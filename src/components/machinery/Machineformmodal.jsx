import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import ModalShell, { ModalActions, fieldCls, labelCls } from './Modalshell';

export const CATEGORIES = [
  'Cranes & Lifting',
  'Earthmoving',
  'Concrete Equipment',
  'Power Generators',
  'Material Handling',
  'Compaction & Roads',
  'Other',
];
const CLASS_TYPES = ['Owned', 'Rented (Hr)', 'Rented (Mth)'];

const Field = ({ label, hint, children, className = '' }) => (
  <div className={className}>
    <label className={labelCls}>{label}</label>
    {children}
    {hint && <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">{hint}</p>}
  </div>
);

const Section = ({ title }) => (
  <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 pt-1 sm:col-span-2">{title}</p>
);

/**
 * Add (machine = null) or edit (machine = existing) a piece of machinery.
 * onSubmit(payload) must resolve truthy on success.
 */
export default function MachineFormModal({ machine = null, operators = [], onClose, onSubmit }) {
  const editing = !!machine;
  const [form, setForm] = useState(() => ({
    code: machine?.id || '',
    name: machine?.name || '',
    category: machine?.category || CATEGORIES[0],
    classType: machine?.classType || 'Owned',
    serialNumber: machine?.serialNumber || '',
    location: machine?.location || '',
    subcontractor: machine?.subcontractor || 'Self / Main Contractor',
    status: machine?.status && machine.status !== 'BREAKDOWN' ? machine.status : 'STANDBY',
    hmrCurrent: machine ? String(machine.hmrCurrent) : '0',
    fuelCapacity: machine ? String(machine.fuelCapacity || '') : '',
    fuelLevel: machine ? String(machine.fuelLevel ?? '') : '',
    hourlyRate: machine ? String(machine.hourlyRate || '') : '',
    monthlyCommitment: machine ? String(machine.monthlyCommitment || '') : '',
    contractStartDate: machine?.contractStartDate || '',
    contractEndDate: machine?.contractEndDate || '',
    lastServiceDate: machine?.lastServiceDate || '',
    nextServiceHmr: machine?.nextServiceHmr != null ? String(machine.nextServiceHmr) : '',
    assignedOperatorId: machine?.assignedOperatorId || '',
  }));
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const rented = form.classType.startsWith('Rented');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form };
      if (editing) delete payload.status; // status has its own control in the detail panel
      const saved = await onSubmit(payload);
      if (saved) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell
      icon={Truck}
      wide
      title={editing ? 'Edit Machinery' : 'Add Machinery'}
      subtitle={editing ? `${machine.name} (${machine.id})` : 'Register a machine or vehicle on this project'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Section title="Identity" />
          <Field label="Machine name *">
            <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. JCB 3DX Backhoe Loader" className={fieldCls} required />
          </Field>
          <Field label="Asset ID" hint={editing ? 'Asset ID cannot be changed.' : 'Optional — leave blank to auto-generate (MC-001…).'}>
            <input type="text" value={form.code} onChange={set('code')} disabled={editing} placeholder="e.g. EX-05" className={`${fieldCls} font-mono uppercase`} maxLength={12} />
          </Field>
          <Field label="Category *">
            <select value={form.category} onChange={set('category')} className={fieldCls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Ownership *">
            <select value={form.classType} onChange={set('classType')} className={fieldCls}>
              {CLASS_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Serial / registration no.">
            <input type="text" value={form.serialNumber} onChange={set('serialNumber')} className={fieldCls} />
          </Field>
          <Field label="Assigned operator">
            <select value={form.assignedOperatorId} onChange={set('assignedOperatorId')} className={fieldCls}>
              <option value="">None</option>
              {operators.map((o) => <option key={o._id} value={o._id}>{o.name} ({o.id})</option>)}
            </select>
          </Field>

          <Section title="Deployment" />
          <Field label="Current location">
            <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. Tower A, Block 2" className={fieldCls} />
          </Field>
          <Field label="Used by (subcontractor)">
            <input type="text" value={form.subcontractor} onChange={set('subcontractor')} className={fieldCls} />
          </Field>
          {!editing && (
            <Field label="Initial status">
              <select value={form.status} onChange={set('status')} className={fieldCls}>
                <option value="PRODUCTIVE">Productive</option>
                <option value="IDLE">Idle (engine on)</option>
                <option value="STANDBY">Standby (engine off)</option>
              </select>
            </Field>
          )}
          <Field label="Current HMR (hours)" hint={editing ? 'Locked once shifts are logged — log hours instead.' : 'The hour-meter reading today.'}>
            <input type="number" step="0.1" min="0" value={form.hmrCurrent} onChange={set('hmrCurrent')} className={`${fieldCls} font-mono`} />
          </Field>

          <Section title="Fuel" />
          <Field label="Fuel tank capacity (L)">
            <input type="number" min="0" value={form.fuelCapacity} onChange={set('fuelCapacity')} placeholder="e.g. 220" className={`${fieldCls} font-mono`} />
          </Field>
          <Field label="Current fuel level (%)">
            <input type="number" min="0" max="100" value={form.fuelLevel} onChange={set('fuelLevel')} placeholder="0 – 100" className={`${fieldCls} font-mono`} />
          </Field>

          <Section title={rented ? 'Rental terms' : 'Costing'} />
          <Field label={rented ? 'Rental rate (₹/hr)' : 'Internal charge-out rate (₹/hr)'} hint={!rented ? 'Used as the default rate when back-charging subcontractors.' : undefined}>
            <input type="number" min="0" value={form.hourlyRate} onChange={set('hourlyRate')} className={`${fieldCls} font-mono`} />
          </Field>
          {rented && (
            <>
              <Field label="Minimum hours per month" hint="Hours you pay for even if the machine sits idle.">
                <input type="number" min="0" max="744" value={form.monthlyCommitment} onChange={set('monthlyCommitment')} className={`${fieldCls} font-mono`} />
              </Field>
              <Field label="Contract start">
                <input type="date" value={form.contractStartDate} onChange={set('contractStartDate')} className={fieldCls} />
              </Field>
              <Field label="Contract end">
                <input type="date" value={form.contractEndDate} onChange={set('contractEndDate')} className={fieldCls} />
              </Field>
            </>
          )}

          <Section title="Service" />
          <Field label="Last serviced on">
            <input type="date" value={form.lastServiceDate} onChange={set('lastServiceDate')} className={fieldCls} />
          </Field>
          <Field label="Next service due at (HMR)">
            <input type="number" step="0.1" min="0" value={form.nextServiceHmr} onChange={set('nextServiceHmr')} placeholder="e.g. 3500" className={`${fieldCls} font-mono`} />
          </Field>
        </div>

        <ModalActions onClose={onClose} submitLabel={editing ? 'Save Changes' : 'Add Machine'} busy={busy} />
      </form>
    </ModalShell>
  );
}