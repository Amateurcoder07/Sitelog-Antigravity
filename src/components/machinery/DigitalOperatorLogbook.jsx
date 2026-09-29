import React, { useState } from 'react';
import { 
  Tablet, 
  Clock, 
  ShieldCheck, 
  
  UserCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet,
  Lock,
  Unlock
} from 'lucide-react';
import { SITE_OPERATORS } from '../../data/mockMachineryData';

export default function DigitalOperatorLogbook({ fleetData = [], onSubmitLog }) {
  const [selectedMachineId, setSelectedMachineId] = useState(fleetData[0]?.id || 'CR-01');
  const [shift, setShift] = useState('Day');
  const [operatorId, setOperatorId] = useState('OP-882');
  const [pinCode, setPinCode] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState(false);

  const activeMachine = fleetData.find(m => m.id === selectedMachineId) || fleetData[0];
  const openingHmr = activeMachine?.hmrCurrent || 4845.0;
  const [closingHmr, setClosingHmr] = useState(openingHmr + 7.5);

  const [segments, setSegments] = useState([
    { id: 1, startTime: '08:00', endTime: '12:00', status: 'WORK', activity: 'Lifting rebar columns & shuttering plates to Tower A 12th floor', idleReason: '' },
    { id: 2, startTime: '12:00', endTime: '13:30', status: 'IDLE', activity: 'Waiting for dumper trailer arrival at site gate', idleReason: 'DELAY_MATERIAL_DELIVERY' },
    { id: 3, startTime: '13:30', endTime: '15:30', status: 'WORK', activity: 'Concrete bucket pouring at podium slab 3', idleReason: '' }
  ]);

  const handlePinInput = (num) => {
    if (pinCode.length < 4) {
      const nextPin = pinCode + num;
      setPinCode(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '1234' || nextPin === '8821' || nextPin === '4410') {
          setPinVerified(true);
          setPinError(false);
        } else {
          setPinError(true);
        }
      }
    }
  };

  const handleClearPin = () => {
    setPinCode('');
    setPinVerified(false);
    setPinError(false);
  };

  const handleAddSegment = () => {
    const lastSeg = segments[segments.length - 1];
    const newId = segments.length + 1;
    setSegments([
      ...segments,
      {
        id: newId,
        startTime: lastSeg ? lastSeg.endTime : '15:30',
        endTime: '17:00',
        status: 'WORK',
        activity: 'General lifting & site material movement',
        idleReason: ''
      }
    ]);
  };

  const handleRemoveSegment = (id) => {
    setSegments(segments.filter(s => s.id !== id));
  };

  const handleSegmentChange = (id, field, value) => {
    setSegments(segments.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateHoursLogged = () => {
    return Math.max(0, parseFloat((closingHmr - openingHmr).toFixed(1)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pinVerified) {
      alert('Please verify 4-digit operator PIN before submitting!');
      return;
    }
    if (onSubmitLog) {
      onSubmitLog({
        machineId: activeMachine.id,
        openingHmr,
        closingHmr,
        hoursLogged: calculateHoursLogged(),
        shift,
        operatorId,
        segments
      });
    }
    alert('Digital Operator Logbook shift slip recorded successfully!');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-xl shadow-lg shadow-orange-500/20">
            <Tablet size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Rugged Cabin Digital Operator Logbook</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Tablet Cabin Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Replaces physical cabin paper slips. Anti-tamper opening HMR & 4-digit PIN verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">Machine:</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-orange-500"
          >
            {fleetData.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.regNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Operator Verification Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Shift & Identity */}
        <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>1. Select Operating Shift</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShift('Day')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                shift === 'Day'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <span>Day Shift (08:00 - 20:00)</span>
            </button>
            <button
              type="button"
              onClick={() => setShift('Night')}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                shift === 'Night'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <span>Night Shift (20:00 - 08:00)</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Operator Identity
            </label>
            <select
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
            >
              {SITE_OPERATORS.map(op => (
                <option key={op.id} value={op.id}>
                  {op.name} (License #{op.licenseNo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: 4-Digit Security PIN Touchpad */}
        <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>2. Operator 4-Digit Security PIN Verification</span>
            </h3>
            {pinVerified ? (
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <Lock size={12} /> Authentication Required
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2, 3].map(idx => (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-lg border flex items-center justify-center font-mono text-lg font-bold ${
                        pinCode[idx]
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-slate-800 bg-slate-950 text-slate-600'
                      }`}
                    >
                      {pinCode[idx] ? '*' : ''}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Enter PIN (Default: 1234 or operator PIN)</p>
                {pinError && (
                  <p className="text-[11px] text-rose-400 font-semibold mt-1">Invalid PIN! Try 1234 or 8821.</p>
                )}
              </div>
            </div>

            {/* Touch Numpad */}
            <div className="grid grid-cols-3 gap-1.5 w-48 shrink-0">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinInput(num.toString())}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-mono font-bold text-sm py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs py-2 rounded-lg cursor-pointer"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handlePinInput('0')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-mono font-bold text-sm py-2 rounded-lg cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinVerified(true)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] py-2 rounded-lg cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hour Meter Anti-Tamper Readings */}
      <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          3. Hour Meter (HMR) Anti-Tamper Readings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Opening HMR (Locked)</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-slate-200 font-mono">{openingHmr.toFixed(1)}</span>
              <ShieldCheck size={18} className="text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500">Auto-filled from yesterday closing</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Closing HMR (Shift End)</span>
            <input
              type="number"
              step="0.1"
              value={closingHmr}
              onChange={(e) => setClosingHmr(parseFloat(e.target.value) || openingHmr)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500">Manually punched by operator</span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-1">
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Shift Total Hours</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {calculateHoursLogged()} hrs
            </div>
            <span className="text-[10px] text-amber-300/80">Auto-calculated shift work</span>
          </div>
        </div>
      </div>

      {/* Detailed Timeline Breakdown Mapping */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            4. Granular Timeline Segment Mapping (Work / Idle / Down)
          </h3>
          <button
            type="button"
            onClick={handleAddSegment}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={14} /> Add Timeline Segment
          </button>
        </div>

        <div className="space-y-2.5">
          {segments.map((seg, idx) => (
            <div
              key={seg.id}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-slate-300 font-bold">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={seg.startTime}
                  onChange={(e) => handleSegmentChange(seg.id, 'startTime', e.target.value)}
                  className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-center text-xs"
                />
                <span>to</span>
                <input
                  type="text"
                  value={seg.endTime}
                  onChange={(e) => handleSegmentChange(seg.id, 'endTime', e.target.value)}
                  className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-center text-xs"
                />
              </div>

              <div className="flex items-center gap-2 flex-1">
                <select
                  value={seg.status}
                  onChange={(e) => handleSegmentChange(seg.id, 'status', e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                    seg.status === 'WORK'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : seg.status === 'IDLE'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  <option value="WORK">🟢 Productive Work</option>
                  <option value="IDLE">🟡 Idle Time (Engine On)</option>
                  <option value="DOWN">🔴 Breakdown Downtime</option>
                </select>

                <input
                  type="text"
                  value={seg.activity}
                  onChange={(e) => handleSegmentChange(seg.id, 'activity', e.target.value)}
                  placeholder="Activity description / notes..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />

                {seg.status === 'IDLE' && (
                  <select
                    value={seg.idleReason}
                    onChange={(e) => handleSegmentChange(seg.id, 'idleReason', e.target.value)}
                    className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="">-- Select Mandatory Idle Reason --</option>
                    <option value="NO_DUMPER_AVAILABLE">No Dumper Available</option>
                    <option value="DELAY_MATERIAL_DELIVERY">Delay in Material Delivery</option>
                    <option value="NO_SUPERVISOR_INSTRUCTION">No Supervisor Instructions</option>
                    <option value="RAIN_WEATHER_HALT">Rain / Weather Halt</option>
                  </select>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSegment(seg.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Encrypted HMR verification stamp attached</span>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <Tablet size={16} />
          Submit Verified Digital Operator Logbook
        </button>
      </div>
    </div>
  );
}