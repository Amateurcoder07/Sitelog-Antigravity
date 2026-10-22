import React, { useState } from 'react';
import { Fuel } from 'lucide-react';
import ModalShell, { ModalActions, fieldCls, labelCls } from './Modalshell';

const SOURCES = ['Site diesel tank / bowser', 'External fuel station', 'Vendor delivery truck'];

export default function LogFuelModal({ machine, onClose, onSubmit }) {
  const [litres, setLitres] = useState('');
  const [slipNo, setSlipNo] = useState('');
  const [source, setSource] = useState(SOURCES[0]);
  const [busy, setBusy] = useState(false);

  const hasTank = machine.fuelCapacity > 0;
  const freeLitres = hasTank ? Math.max(0, Math.round(machine.fuelCapacity * (1 - machine.fuelLevel / 100))) : null;
  const projected = hasTank && Number(litres) > 0
    ? Math.min(100, Math.round((machine.fuelLevel + (Number(litres) / machine.fuelCapacity) * 100) * 10) / 10)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const saved = await onSubmit(machine, { litres: Number(litres), slipNo, source });
      if (saved) onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell icon={Fuel} title="Log Diesel Top-up" subtitle={`${machine.name} (${machine.id})`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Fuel added (litres)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max={hasTank ? machine.fuelCapacity : undefined}
            value={litres}
            onChange={(e) => setLitres(e.target.value)}
            placeholder="e.g. 50"
            className={`${fieldCls} font-mono text-base`}
            required
          />
          {hasTank ? (
            <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">
              Tank {machine.fuelCapacity} L · currently {machine.fuelLevel}% (about {freeLitres} L free)
              {projected != null && <> · after top-up ≈ <strong className="text-black dark:text-white">{projected}%</strong></>}
            </p>
          ) : (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              No tank capacity is set for this machine, so the tank level won't update. Edit the machine to add it.
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Fuel slip / voucher no.</label>
          <input type="text" value={slipNo} onChange={(e) => setSlipNo(e.target.value)} placeholder="Number printed on the slip" className={`${fieldCls} font-mono`} required />
          <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">Each slip number can only be logged once.</p>
        </div>

        <div>
          <label className={labelCls}>Fuel source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)} className={fieldCls}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <ModalActions onClose={onClose} submitLabel="Record Fuel Log" busy={busy} />
      </form>
    </ModalShell>
  );
}