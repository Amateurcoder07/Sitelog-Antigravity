import React, { useState, useEffect } from 'react';
import { Tablet, Plus, Trash2, UserPlus, Lock } from 'lucide-react';
import { fieldCls, labelCls } from './Modalshell';

const SHIFTS = {
  Day: { label: 'Day Shift (08:00 - 20:00)', start: '08:00' },
  Night: { label: 'Night Shift (20:00 - 08:00)', start: '20:00' },
};
const IDLE_REASONS = [
  ['NO_DUMPER_AVAILABLE', 'No Dumper Available'],
  ['DELAY_MATERIAL_DELIVERY', 'Delay in Material Delivery'],
  ['NO_SUPERVISOR_INSTRUCTION', 'No Supervisor Instructions'],
  ['RAIN_WEATHER_HALT', 'Rain / Weather Halt'],
];

const cardCls = 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5';
const sectionTitle = 'text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider';

let segmentSeq = 0;
const newSegment = (startTime = '') => ({ key: ++segmentSeq, startTime, endTime: '', status: 'WORK', activity: '', idleReason: '' });

const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const segHours = (s) => {
  if (!s.startTime || !s.endTime) return 0;
  let d = toMin(s.endTime) - toMin(s.startTime);
  if (d < 0) d += 1440; // crosses midnight
  return d / 60;
};

export default function DigitalOperatorLogbook({ machines = [], operators = [], onSubmitLog, onAddOperator, onRemoveOperator }) {
  const loggable = machines.filter((m) => m.status !== 'BREAKDOWN');
  const [machineId, setMachineId] = useState('');
  const [shift, setShift] = useState('Day');
  const [operatorId, setOperatorId] = useState('');
  const [pin, setPin] = useState('');
  const [closingHmr, setClosingHmr] = useState('');
  const [segments, setSegments] = useState(() => [newSegment(SHIFTS.Day.start)]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const machine = machines.find((m) => m._id === machineId);

  // keep a valid machine selected
  useEffect(() => {
    if (!loggable.find((m) => m._id === machineId)) setMachineId(loggable[0]?._id || '');
  }, [machines]); // eslint-disable-line react-hooks/exhaustive-deps

  // opening HMR changes with the machine (and after each submitted shift)
  useEffect(() => {
    setClosingHmr(machine ? String(machine.hmrCurrent) : '');
  }, [machineId, machine?.hmrCurrent]); // eslint-disable-line react-hooks/exhaustive-deps

  // preselect the machine's assigned operator
  useEffect(() => {
    if (!machine) return;
    const preferred = operators.find((o) => o._id === machine.assignedOperatorId || o.defaultMachineId === machine._id);
    setOperatorId(preferred?._id || operators[0]?._id || '');
  }, [machineId, operators.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const openingHmr = machine?.hmrCurrent ?? 0;
  const hoursLogged = Math.max(0, Math.round((Number(closingHmr) - openingHmr) * 10) / 10) || 0;

  const totals = segments.reduce(
    (acc, s) => ({ ...acc, [s.status]: acc[s.status] + segHours(s) }),
    { WORK: 0, IDLE: 0, DOWN: 0 }
  );

  const changeShift = (next) => {
    setShift(next);
    setSegments((prev) => (prev.length === 1 && !prev[0].endTime ? [newSegment(SHIFTS[next].start)] : prev));
  };

  const updateSegment = (key, field, value) =>
    setSegments((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)));

  const addSegment = () => setSegments((prev) => [...prev, newSegment(prev[prev.length - 1]?.endTime || '')]);

  const validate = () => {
    if (!machine) return 'Select a machine.';
    if (!operatorId) return 'Select the operator.';
    if (!/^\d{4}$/.test(pin)) return 'Enter the operator\'s 4-digit PIN.';
    if (!(Number(closingHmr) > openingHmr)) return `Closing HMR must be greater than ${openingHmr}.`;
    for (const [i, s] of segments.entries()) {
      if (!s.startTime || !s.endTime) return `Segment ${i + 1}: enter start and end times.`;
      if (segHours(s) === 0) return `Segment ${i + 1}: end time must differ from start time.`;
      if (s.status === 'IDLE' && !s.idleReason) return `Segment ${i + 1}: select an idle reason.`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setError('');
    setSaving(true);
    try {
      const result = await onSubmitLog(machine, {
        operatorId,
        pin,
        shift,
        closingHmr: Number(closingHmr),
        segments: segments.map(({ key, ...s }) => s),
      });
      if (result?.ok) {
        setPin('');
        setSegments([newSegment(SHIFTS[shift].start)]);
      } else {
        setError(result?.error || 'Could not submit the logbook.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (machines.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-[#0a0f1d] border border-dashed border-black/15 dark:border-white/15 rounded-2xl text-xs text-black/50 dark:text-white/50">
        Add a machine first, then operators can log their shifts here.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Tablet size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-black dark:text-white tracking-tight">Operator Logbook</h2>
            <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
              End-of-shift hour-meter reading and timeline, confirmed with the operator's PIN.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddOperator}
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-3 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <UserPlus size={14} /> Add Operator
        </button>
      </div>

      {/* Operators */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={sectionTitle}>Site operators:</span>
        {operators.length === 0 && (
          <span className="text-xs text-black/50 dark:text-white/50">None yet — add an operator with a 4-digit PIN to start logging.</span>
        )}
        {operators.map((o) => (
          <span key={o._id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-semibold text-black dark:text-white">
            {o.name} <span className="text-black/40 dark:text-white/40 font-normal">{o.id}</span>
            {o.locked && <Lock size={11} className="text-amber-500" title="Locked after wrong PINs" />}
            <button type="button" onClick={() => onRemoveOperator(o)} className="text-black/40 dark:text-white/40 hover:text-red-500 cursor-pointer" title="Remove operator">
              <Trash2 size={12} />
            </button>
          </span>
        ))}
      </div>

      {loggable.length === 0 ? (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
          Every machine is currently broken down. Mark one as repaired to log a shift.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${cardCls} space-y-4`}>
              <h3 className={sectionTitle}>1. Machine, shift & operator</h3>
              <div>
                <label className={labelCls}>Machine</label>
                <select value={machineId} onChange={(e) => setMachineId(e.target.value)} className={fieldCls}>
                  {loggable.map((m) => (
                    <option key={m._id} value={m._id}>{m.id} — {m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(SHIFTS).map(([key, s]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => changeShift(key)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      shift === key
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white dark:bg-[#0a0f1d] text-black/70 dark:text-white/70 border border-black/10 dark:border-white/10'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Operator</label>
                  <select value={operatorId} onChange={(e) => setOperatorId(e.target.value)} className={fieldCls} disabled={operators.length === 0}>
                    {operators.length === 0 && <option value="">No operators yet</option>}
                    {operators.map((o) => (
                      <option key={o._id} value={o._id}>{o.name} ({o.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Operator PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className={`${fieldCls} font-mono tracking-[0.4em] text-center`}
                  />
                </div>
              </div>
            </div>

            <div className={`${cardCls} space-y-4`}>
              <h3 className={sectionTitle}>2. Hour meter (HMR)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl p-3">
                  <span className="text-[11px] text-black/50 dark:text-white/50 font-medium uppercase tracking-wider block">Opening (locked)</span>
                  <span className="text-xl font-black text-black dark:text-white font-mono">{openingHmr.toFixed(1)}</span>
                </div>
                <div>
                  <label className="text-[11px] text-black/50 dark:text-white/50 font-medium uppercase tracking-wider block mb-1">Closing</label>
                  <input type="number" step="0.1" value={closingHmr} onChange={(e) => setClosingHmr(e.target.value)} className={`${fieldCls} font-mono text-base`} />
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                  <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider block">Shift total</span>
                  <span className="text-xl font-black text-orange-600 dark:text-orange-400 font-mono">{hoursLogged} hrs</span>
                </div>
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50">
                Opening HMR is the machine's last recorded reading and can't be edited here.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className={sectionTitle}>3. Shift timeline (work / idle / down)</h3>
              <button
                type="button"
                onClick={addSegment}
                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={14} /> Add Segment
              </button>
            </div>

            <div className="space-y-2.5">
              {segments.map((seg, idx) => (
                <div key={seg.key} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5 flex flex-col lg:flex-row lg:items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-black/70 dark:text-white/70">
                    <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px]">{idx + 1}</span>
                    <input type="time" value={seg.startTime} onChange={(e) => updateSegment(seg.key, 'startTime', e.target.value)} className={`${fieldCls} !w-28 !min-h-[38px] !py-1.5`} />
                    <span>to</span>
                    <input type="time" value={seg.endTime} onChange={(e) => updateSegment(seg.key, 'endTime', e.target.value)} className={`${fieldCls} !w-28 !min-h-[38px] !py-1.5`} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                    <select
                      value={seg.status}
                      onChange={(e) => updateSegment(seg.key, 'status', e.target.value)}
                      className={`${fieldCls} sm:!w-48 !min-h-[38px] !py-1.5`}
                    >
                      <option value="WORK">Productive work</option>
                      <option value="IDLE">Idle (engine on)</option>
                      <option value="DOWN">Breakdown downtime</option>
                    </select>
                    <input
                      type="text"
                      value={seg.activity}
                      onChange={(e) => updateSegment(seg.key, 'activity', e.target.value)}
                      placeholder="Activity / notes..."
                      className={`${fieldCls} flex-1 !min-h-[38px] !py-1.5`}
                    />
                    {seg.status === 'IDLE' && (
                      <select
                        value={seg.idleReason}
                        onChange={(e) => updateSegment(seg.key, 'idleReason', e.target.value)}
                        className={`${fieldCls} sm:!w-56 !min-h-[38px] !py-1.5 !bg-amber-500/10 !border-amber-500/30`}
                      >
                        <option value="">Select idle reason *</option>
                        {IDLE_REASONS.map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={segments.length === 1}
                    onClick={() => setSegments((prev) => prev.filter((s) => s.key !== seg.key))}
                    className="p-1.5 text-black/40 dark:text-white/40 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove segment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold text-black/60 dark:text-white/60">
              Work {totals.WORK.toFixed(1)} h · Idle {totals.IDLE.toFixed(1)} h · Down {totals.DOWN.toFixed(1)} h
            </p>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
          )}

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving || operators.length === 0}
              className="bg-black dark:bg-white text-white dark:text-black font-semibold text-xs px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Tablet size={16} />
              {saving ? 'Submitting…' : 'Submit Shift Logbook'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}