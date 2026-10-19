import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { calculateCompressiveStrength, addDaysToDate, formatDateDisplay } from '../../data/mockCubeRegisterData';
import { localToday } from '../../utils/labEvaluation';
import { X, Layers, Clock, Sparkles } from 'lucide-react';

const fieldCls =
  'w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5';
const cubeInputCls =
  'w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs font-semibold text-black dark:text-white';

// Suggest the next Sr No / Cube ID from the pours already in the register
function suggestNext(pours) {
  const srNums = [];
  const idNums = [];
  (pours || []).forEach((p) =>
    (p.cubes || []).forEach((c) => {
      const sr = parseInt(c.srNo, 10);
      const id = parseInt(c.cubeId, 10);
      if (Number.isFinite(sr)) srNums.push(sr);
      if (Number.isFinite(id)) idNums.push(id);
    })
  );
  const nextSr = (srNums.length ? Math.max(...srNums) : 0) + 1;
  const nextId = (idNums.length ? Math.max(...idNums) : 0) + 1;
  return ['A', 'B', 'C'].map((letter, i) => ({
    cubeId: `${nextId}${letter}`,
    srNo: String(nextSr + i).padStart(4, '0'),
    weight: '',
    load7: '',
    load28: '',
  }));
}

export default function NewCubePourModal({ isOpen, onClose, onSave, pours = [] }) {
  const [mixDesignNo, setMixDesignNo] = useState('');
  const [grade, setGrade] = useState('M30');
  const [pourDate, setPourDate] = useState(localToday);
  const [pourCardNo, setPourCardNo] = useState('');
  const [location, setLocation] = useState('');
  const [remarks, setRemarks] = useState('150mm Cubes (Set of 3). Standard moist curing tank.');
  const [cubesData, setCubesData] = useState(() => suggestNext(pours));
  const [saving, setSaving] = useState(false);

  // Each time the modal opens, restart with fresh Sr Nos / Cube IDs continuing the register
  useEffect(() => {
    if (isOpen) {
      setCubesData(suggestNext(pours));
      setPourDate(localToday());
      setLocation('');
      setPourCardNo('');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const target7DayDate = addDaysToDate(pourDate, 7);
  const target28DayDate = addDaysToDate(pourDate, 28);

  const handleCubeChange = (index, field, val) => {
    setCubesData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await onSave({
        mixDesignNo,
        grade,
        pourDate,
        pourCardNo,
        location,
        remarks,
        cubes: cubesData.map((c) => ({
          cubeId: c.cubeId,
          srNo: c.srNo,
          weight: c.weight === '' ? 0 : Number(c.weight),
          load7: c.load7 === '' ? 0 : Number(c.load7),
          load28: c.load28 === '' ? 0 : Number(c.load28),
        })),
      });
      if (created) onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-black dark:text-white">Register Concrete Pour Entry</h2>
              <p className="text-xs text-black/60 dark:text-white/60">Logbook format: Parent pour card with 3 test cubes (Set of 3)</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Concrete Grade</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className={fieldCls}>
                {['M15', 'M20', 'M25', 'M30', 'M35', 'M40'].map((g) => (
                  <option key={g} value={g}>{g} Concrete</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Mix Design No.</label>
              <input type="text" value={mixDesignNo} onChange={(e) => setMixDesignNo(e.target.value)} placeholder="e.g. MD016" className={fieldCls} required />
            </div>
            <div>
              <label className={labelCls}>Date of Pour</label>
              <input type="date" value={pourDate} onChange={(e) => setPourDate(e.target.value)} className={fieldCls} required />
            </div>
            <div>
              <label className={labelCls}>Pour Card No.</label>
              <input type="text" value={pourCardNo} onChange={(e) => setPourCardNo(e.target.value)} placeholder="e.g. 15" className={fieldCls} required />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Location of Structure</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Tower A - Floor 5 - Column C1" className={fieldCls} required />
            </div>
          </div>

          <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs font-semibold text-orange-700 dark:text-orange-300">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500 shrink-0" />
              <span>Target Testing Schedule (Auto-Calculated):</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="bg-white dark:bg-[#0a0f1d] px-3 py-1 rounded-lg border border-orange-500/30 shadow-xs">
                ⚡ 7-Day: <strong>{formatDateDisplay(target7DayDate)}</strong>
              </span>
              <span className="bg-white dark:bg-[#0a0f1d] px-3 py-1 rounded-lg border border-orange-500/30 shadow-xs">
                🏆 28-Day: <strong>{formatDateDisplay(target28DayDate)}</strong>
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Specimen Cubes (Set of 3)
              </h3>
              <span className="text-[11px] font-medium text-black/50 dark:text-white/50">Formula: (kN × 1000) / 22,500 mm²</span>
            </div>

            {cubesData.map((cube, idx) => {
              const str7 = calculateCompressiveStrength(cube.load7);
              const str28 = calculateCompressiveStrength(cube.load28);
              return (
                <div key={idx} className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                    <span className="text-xs font-black text-black dark:text-white">Cube #{idx + 1}</span>
                    <span className="text-[11px] font-mono text-black/60 dark:text-white/60">Standard 150mm Cube</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">Cube ID</label>
                      <input type="text" value={cube.cubeId} onChange={(e) => handleCubeChange(idx, 'cubeId', e.target.value)} className={cubeInputCls} required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">Sr No</label>
                      <input type="text" value={cube.srNo} onChange={(e) => handleCubeChange(idx, 'srNo', e.target.value)} className={cubeInputCls} required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">Weight (kg)</label>
                      <input type="number" step="0.001" value={cube.weight} onChange={(e) => handleCubeChange(idx, 'weight', e.target.value)} placeholder="e.g. 8.774" className={cubeInputCls} required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">7-Day Load (kN)</label>
                      <input type="number" step="1" value={cube.load7} onChange={(e) => handleCubeChange(idx, 'load7', e.target.value)} placeholder="Optional load" className={cubeInputCls} />
                      {str7 > 0 && <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">Str: {str7} N/mm²</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">28-Day Load (kN)</label>
                      <input type="number" step="1" value={cube.load28} onChange={(e) => handleCubeChange(idx, 'load28', e.target.value)} placeholder="Optional load" className={cubeInputCls} />
                      {str28 > 0 && <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">Str: {str28} N/mm²</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className={labelCls}>Remarks</label>
            <textarea rows="2" value={remarks} onChange={(e) => setRemarks(e.target.value)} className={`${fieldCls} text-xs font-normal`} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center font-medium text-sm rounded-md bg-orange-600 hover:bg-orange-700 text-white shadow-md px-5 py-2.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Concrete Pour Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}