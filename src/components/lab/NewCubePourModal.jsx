import React, { useState } from 'react';
import Button from '../Button';
import { calculateCompressiveStrength } from '../../data/mockCubeRegisterData';
import { X, Calendar, Layers, Hash, MapPin, Scale, Activity, ShieldCheck, Sparkles } from 'lucide-react';

export default function NewCubePourModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [mixDesignNo, setMixDesignNo] = useState('MD016');
  const [grade, setGrade] = useState('M30');
  const [pourDate, setPourDate] = useState(new Date().toISOString().split('T')[0]);
  const [pourCardNo, setPourCardNo] = useState('15');
  const [location, setLocation] = useState('Tower A - Floor 5 - Beam B4');
  const [remarks, setRemarks] = useState('150mm Cubes (Set of 3). Standard moist curing tank.');

  // 3 Cubes State
  const [cubesData, setCubesData] = useState([
    { cubeId: '60A', srNo: '0232', weight: '8.750', load7: '', load28: '' },
    { cubeId: '60B', srNo: '0233', weight: '8.780', load7: '', load28: '' },
    { cubeId: '60C', srNo: '0234', weight: '8.720', load7: '', load28: '' }
  ]);

  const handleCubeChange = (index, field, val) => {
    setCubesData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const startSr = cubesData[0].srNo || '0232';
    const endSr = cubesData[2].srNo || '0234';

    const newPour = {
      id: `POUR-2026-${startSr}`,
      srNoRange: `${startSr} - ${endSr}`,
      mixDesignNo,
      grade,
      pourDate,
      pourCardNo,
      location,
      remarks,
      digitallyVerifiedBy: null,
      cubes: cubesData.map((c) => {
        const str7 = calculateCompressiveStrength(c.load7);
        const str28 = calculateCompressiveStrength(c.load28);

        return {
          cubeId: c.cubeId,
          srNo: c.srNo,
          weight: parseFloat(c.weight) || 8.75,
          day7: {
            testingDate: c.load7 ? pourDate : '',
            crushingLoad: parseFloat(c.load7) || 0,
            compressiveStrength: str7
          },
          day28: {
            testingDate: c.load28 ? pourDate : '',
            crushingLoad: parseFloat(c.load28) || 0,
            compressiveStrength: str28
          }
        };
      })
    };

    onSave(newPour);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-black dark:text-white">
                Register Concrete Pour Entry
              </h2>
              <p className="text-xs text-black/60 dark:text-white/60">
                Logbook format: Parent pour card with 3 test cubes (Set of 3)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Parent Pour Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5">
                Concrete Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="M15">M15 Concrete</option>
                <option value="M20">M20 Concrete</option>
                <option value="M25">M25 Concrete</option>
                <option value="M30">M30 Concrete</option>
                <option value="M35">M35 Concrete</option>
                <option value="M40">M40 Concrete</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5">
                Mix Design No.
              </label>
              <input
                type="text"
                value={mixDesignNo}
                onChange={(e) => setMixDesignNo(e.target.value)}
                placeholder="e.g. MD016"
                className="w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5">
                Date of Pour
              </label>
              <input
                type="date"
                value={pourDate}
                onChange={(e) => setPourDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5">
                Pour Card No.
              </label>
              <input
                type="text"
                value={pourCardNo}
                onChange={(e) => setPourCardNo(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5">
                Location of Structure
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tower A - Floor 5 - Column C1"
                className="w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-semibold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Child Sub-Rows: The Set of 3 Cubes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Specimen Cubes (Set of 3)
              </h3>
              <span className="text-[11px] font-medium text-black/50 dark:text-white/50">
                Formula: (kN × 1000) / 22,500 mm²
              </span>
            </div>

            {cubesData.map((cube, idx) => {
              const str7 = calculateCompressiveStrength(cube.load7);
              const str28 = calculateCompressiveStrength(cube.load28);

              return (
                <div
                  key={idx}
                  className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                    <span className="text-xs font-black text-black dark:text-white">
                      Cube #{idx + 1}: <span className="text-orange-600 dark:text-orange-400 font-mono">{cube.cubeId}</span> (Sr #{cube.srNo})
                    </span>
                    <span className="text-[11px] font-mono text-black/60 dark:text-white/60">
                      Standard 150mm Cube
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={cube.weight}
                        onChange={(e) => handleCubeChange(idx, 'weight', e.target.value)}
                        placeholder="e.g. 8.774"
                        className="w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs font-semibold text-black dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">
                        7-Day Load (kN)
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={cube.load7}
                        onChange={(e) => handleCubeChange(idx, 'load7', e.target.value)}
                        placeholder="Optional load"
                        className="w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs font-semibold text-black dark:text-white"
                      />
                      {str7 > 0 && (
                        <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                          Str: {str7} N/mm²
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-black/60 dark:text-white/60 mb-1">
                        28-Day Load (kN)
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={cube.load28}
                        onChange={(e) => handleCubeChange(idx, 'load28', e.target.value)}
                        placeholder="Optional load"
                        className="w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs font-semibold text-black dark:text-white"
                      />
                      {str28 > 0 && (
                        <p className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                          Str: {str28} N/mm²
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5">
              Remarks
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-orange-600 hover:bg-orange-700 text-white">
              Save Concrete Pour Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
