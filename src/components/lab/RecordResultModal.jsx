import React, { useState, useMemo } from 'react';
import { X, ClipboardCheck, CheckCircle2, XCircle, AlertTriangle, Info, Lock } from 'lucide-react';
import Button from '../Button';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { STEEL_GRADES, getConcreteTarget, getAggregateLimit, AGGREGATE_TEST_TYPES } from '../../utils/labStandards';

const STATUS_BANNER = {
  Pass: { icon: CheckCircle2, className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400', label: 'Passed' },
  Fail: { icon: XCircle, className: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400', label: 'Failed' },
  'Retest Required': { icon: AlertTriangle, className: 'bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400', label: 'Retest Required' },
  Curing: { icon: Info, className: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400', label: 'Recorded' },
};

// A small read-only card for a reading that's already locked in — shown
// instead of an editable field so nobody can quietly change a past result.
function LockedReadingCard({ title, children }) {
  return (
    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Lock size={12} className="text-black/40 dark:text-white/40" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function RecordResultModal({ isOpen, onClose, onSave, sample }) {
  const { user } = useAuth();
  const category = sample?.materialCategory;
  const rd = sample?.resultData || {};

  // Locking rules — mirrored from the backend's authoritative check in
  // LabManagement.controller.js (recordResult). The 7-day reading is locked
  // the moment it exists. The 28-day reading is locked once it produces a
  // valid Pass/Fail; only an invalidated (outlier) 28-day attempt reopens.
  const day7Locked = !!rd.day7;
  const day28Locked = !!rd.day28 && rd.day28.invalid !== true;
  const steelLocked = !!rd.steel;
  const aggregateLocked = !!rd.aggregate;
  const soilLocked = !!rd.soil;

  const defaultDay = !day7Locked ? '7' : '28';
  const [day, setDay] = useState(defaultDay);
  const [readings, setReadings] = useState(['', '', '']);

  const [yieldStrength, setYieldStrength] = useState('');
  const [ultimateStrength, setUltimateStrength] = useState('');
  const [elongation, setElongation] = useState('');
  const [bendTest, setBendTest] = useState('Pass');

  const [aggregateValue, setAggregateValue] = useState('');
  const [fieldDensity, setFieldDensity] = useState('');

  // "Tested by" is always the logged-in user — never a free-text field the
  // tester could change. The backend independently derives this from the
  // session too, so this is a display convenience, not the source of truth.
  const testerName = user?.name || 'Unknown';
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // API response after save

  const steelSpec = category === 'Steel' ? STEEL_GRADES[sample.grade] : null;
  const concreteTarget = category === 'Concrete' ? getConcreteTarget(sample.grade) : null;
  const aggregateLimit = category === 'Aggregate' ? getAggregateLimit(sample.details?.aggregateTestType, sample.details?.aggregateUsage) : null;
  const aggregateUnit = category === 'Aggregate' ? (AGGREGATE_TEST_TYPES[sample.details?.aggregateTestType]?.unit || '') : '';

  const ratioPreview = useMemo(() => {
    const y = Number(yieldStrength), u = Number(ultimateStrength);
    if (!y || !u) return null;
    return +(u / y).toFixed(2);
  }, [yieldStrength, ultimateStrength]);

  if (!isOpen || !sample) return null;

  // Nothing left to record for this category — show a summary only.
  const fullyLocked =
    (category === 'Concrete' && day7Locked && day28Locked) ||
    (category === 'Steel' && steelLocked) ||
    (category === 'Aggregate' && aggregateLocked) ||
    (category === 'Soil' && soilLocked);

  const updateReading = (idx, val) => {
    setReadings((prev) => prev.map((r, i) => (i === idx ? val : r)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    let payload = {};

    if (category === 'Concrete') {
      const nums = readings.map((r) => r.trim());
      if (nums.some((n) => n === '' || Number.isNaN(Number(n)))) {
        setError('Enter all three specimen readings (N/mm²).');
        setSaving(false);
        return;
      }
      payload = { ...payload, day, readings: nums.map(Number) };
    } else if (category === 'Steel') {
      if (!yieldStrength || !ultimateStrength || !elongation) {
        setError('Fill in yield strength, ultimate strength and elongation.');
        setSaving(false);
        return;
      }
      payload = { ...payload, yieldStrength: Number(yieldStrength), ultimateStrength: Number(ultimateStrength), elongation: Number(elongation), bendTest };
    } else if (category === 'Aggregate') {
      if (aggregateValue === '') {
        setError('Enter the test result value.');
        setSaving(false);
        return;
      }
      payload = { ...payload, value: Number(aggregateValue) };
    } else if (category === 'Soil') {
      if (!fieldDensity) {
        setError('Enter the field dry density.');
        setSaving(false);
        return;
      }
      payload = { ...payload, fieldDensity: Number(fieldDensity) };
    }

    try {
      const res = await API.patch(`/lab-management/samples/${sample._id}/result`, payload);
      setResult(res.data);
      onSave(res.data.sample);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not save test result.');
    } finally {
      setSaving(false);
    }
  };

  const finalStatus = result?.sample?.status;
  const banner = finalStatus ? STATUS_BANNER[finalStatus] || STATUS_BANNER.Curing : null;
  const BannerIcon = banner?.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Record Test Reading</h2>
              <p className="text-xs text-black/50 dark:text-white/50">{sample.code} — {sample.sampleName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 rounded-2xl border p-4 ${banner?.className}`}>
              {BannerIcon && <BannerIcon size={22} className="shrink-0 mt-0.5" />}
              <div>
                <p className="font-extrabold text-sm">{banner?.label} — {sample.standardCode}</p>
                <p className="text-xs mt-1 opacity-90">
                  {category === 'Concrete' && result.evaluation?.day28 && `Average: ${result.evaluation.day28.average ?? '—'} N/mm² vs target ${result.evaluation.targetStrength} N/mm²`}
                  {category === 'Concrete' && !result.evaluation?.day28 && result.evaluation?.day7 && `7-day average: ${result.evaluation.day7.average ?? '—'} N/mm² — ${result.evaluation.day7.note}`}
                  {category === 'Steel' && `Fy ${result.evaluation?.achieved?.yieldStrength} N/mm², UTS/Fy ${result.evaluation?.achieved?.utsYieldRatio}, Elongation ${result.evaluation?.achieved?.elongation}%`}
                  {category === 'Aggregate' && `Result: ${result.evaluation?.value}${aggregateUnit} (limit ${result.evaluation?.limit ?? '—'}${aggregateUnit})`}
                  {category === 'Soil' && `Compaction achieved: ${result.evaluation?.compactionPercent ?? '—'}%`}
                </p>
                {result.evaluation?.day28?.discarded?.length > 0 && (
                  <p className="text-[11px] mt-1 opacity-75">{result.evaluation.day28.discarded.length} specimen(s) discarded as outliers per IS 516 cl. 8.</p>
                )}
              </div>
            </div>
            <Button variant="primary" onClick={onClose} className="w-full !py-3 min-h-[48px]">Done</Button>
          </div>
        ) : fullyLocked ? (
          <div className="space-y-4">
            {category === 'Concrete' && (
              <>
                <LockedReadingCard title="7-Day Reading (locked)">
                  <p className="text-xs font-bold text-black dark:text-white">{rd.day7.readings.join(', ')} N/mm² → avg {rd.day7.average ?? '—'} N/mm²</p>
                  <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">{rd.day7.recommendation || rd.day7.note}</p>
                </LockedReadingCard>
                <LockedReadingCard title="28-Day Reading (locked)">
                  <p className="text-xs font-bold text-black dark:text-white">{rd.day28.readings.join(', ')} N/mm² → avg {rd.day28.average ?? '—'} N/mm²</p>
                  <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">Target {concreteTarget} N/mm² — Final result: <span className="font-bold">{sample.status}</span></p>
                  {rd.day28.recommendation && (
                    <p className="text-[11px] text-black/60 dark:text-white/60 mt-1.5">{rd.day28.recommendation}</p>
                  )}
                </LockedReadingCard>
              </>
            )}
            {category === 'Steel' && (
              <LockedReadingCard title="Mechanical Test (locked)">
                <p className="text-xs font-bold text-black dark:text-white">
                  Fy {rd.steel.achieved?.yieldStrength} N/mm² • UTS {rd.steel.achieved?.ultimateStrength} N/mm² • Elong. {rd.steel.achieved?.elongation}% • Bend {rd.steel.achieved?.bendTest}
                </p>
                <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">Result: <span className="font-bold">{sample.status}</span></p>
                {rd.steel.recommendation && (
                  <p className="text-[11px] text-black/60 dark:text-white/60 mt-1.5">{rd.steel.recommendation}</p>
                )}
              </LockedReadingCard>
            )}
            {category === 'Aggregate' && (
              <LockedReadingCard title="Test Result (locked)">
                <p className="text-xs font-bold text-black dark:text-white">{rd.aggregate.value}{aggregateUnit} (limit {rd.aggregate.limit ?? '—'}{aggregateUnit})</p>
                <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">Result: <span className="font-bold">{sample.status}</span></p>
                {rd.aggregate.recommendation && (
                  <p className="text-[11px] text-black/60 dark:text-white/60 mt-1.5">{rd.aggregate.recommendation}</p>
                )}
              </LockedReadingCard>
            )}
            {category === 'Soil' && (
              <LockedReadingCard title="Compaction Result (locked)">
                <p className="text-xs font-bold text-black dark:text-white">{rd.soil.compactionPercent}% compaction achieved</p>
                <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">Result: <span className="font-bold">{sample.status}</span></p>
                {rd.soil.recommendation && (
                  <p className="text-[11px] text-black/60 dark:text-white/60 mt-1.5">{rd.soil.recommendation}</p>
                )}
              </LockedReadingCard>
            )}
            <Button variant="primary" onClick={onClose} className="w-full !py-3 min-h-[48px]">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {category === 'Concrete' && (
              <>
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-black/60 dark:text-white/60">
                  Grade <span className="font-bold text-black dark:text-white">{sample.grade}</span> — target{' '}
                  <span className="font-bold text-black dark:text-white">{concreteTarget} N/mm²</span> at 28 days (IS 516 Part 1/Sec 1:2021)
                </div>

                {day7Locked && (
                  <LockedReadingCard title="7-Day Reading (locked)">
                    <p className="text-xs font-bold text-black dark:text-white">{rd.day7.readings.join(', ')} N/mm² → avg {rd.day7.average ?? '—'} N/mm²</p>
                    <p className="text-[11px] text-black/50 dark:text-white/50 mt-1">{rd.day7.recommendation || rd.day7.note}</p>
                  </LockedReadingCard>
                )}

                {rd.day28 && rd.day28.invalid === true && (
                  <LockedReadingCard title="Previous 28-Day Attempt (invalidated)">
                    <p className="text-xs font-bold text-black dark:text-white">{rd.day28.readings.join(', ')} N/mm²</p>
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 mt-1">More than one specimen deviated &gt;15% from the mean — a fresh retest is required below.</p>
                  </LockedReadingCard>
                )}

                {!day7Locked && (
                  <div>
                    <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Testing Age</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['7', '28'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDay(d)}
                          className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            day === d
                              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                              : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 border-black/15 dark:border-white/15'
                          }`}
                        >
                          {d}-Day Test
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {day7Locked && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                    Recording the 28-Day Test{rd.day28?.invalid ? ' (Retest)' : ''}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
                    Individual Specimen Strengths (N/mm²) — 3 cubes
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {readings.map((r, idx) => (
                      <input
                        key={idx}
                        type="number" step="0.01"
                        placeholder={`Cube ${idx + 1}`}
                        value={r}
                        onChange={(e) => updateReading(idx, e.target.value)}
                        className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-black/40 dark:text-white/40 mt-1.5">
                    A specimen deviating more than ±15% from the average is discarded (IS 516 cl. 8); more than one outlier invalidates the set.
                    Once submitted, this reading is locked and cannot be edited.
                  </p>
                </div>
              </>
            )}

            {category === 'Steel' && (
              <>
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-black/60 dark:text-white/60">
                  Grade <span className="font-bold text-black dark:text-white">{sample.grade}</span> — min Fy{' '}
                  <span className="font-bold text-black dark:text-white">{steelSpec?.minYield} N/mm²</span>, UTS/Fy ≥{' '}
                  <span className="font-bold text-black dark:text-white">{steelSpec?.minUtsYieldRatio}</span>, Elongation ≥{' '}
                  <span className="font-bold text-black dark:text-white">{steelSpec?.minElongation}%</span> (IS 1786:2008)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Yield Strength (N/mm²)</label>
                    <input type="number" step="0.1" value={yieldStrength} onChange={(e) => setYieldStrength(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Ultimate Tensile Strength (N/mm²)</label>
                    <input type="number" step="0.1" value={ultimateStrength} onChange={(e) => setUltimateStrength(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Elongation (%)</label>
                    <input type="number" step="0.1" value={elongation} onChange={(e) => setElongation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Bend / Re-bend Test</label>
                    <select value={bendTest} onChange={(e) => setBendTest(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]">
                      <option value="Pass" className="bg-white dark:bg-[#0a0f1d]">Pass</option>
                      <option value="Fail" className="bg-white dark:bg-[#0a0f1d]">Fail</option>
                    </select>
                  </div>
                </div>
                {ratioPreview && (
                  <p className="text-[11px] text-black/40 dark:text-white/40">UTS/Yield ratio: <span className="font-bold text-black dark:text-white">{ratioPreview}</span></p>
                )}
                <p className="text-[11px] text-black/40 dark:text-white/40">Once submitted, this result is locked and cannot be edited.</p>
              </>
            )}

            {category === 'Aggregate' && (
              <>
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-black/60 dark:text-white/60">
                  {sample.details?.aggregateTestType} — limit{' '}
                  <span className="font-bold text-black dark:text-white">{aggregateLimit != null ? `≤ ${aggregateLimit}${aggregateUnit}` : 'informational only'}</span>{' '}
                  for {sample.details?.aggregateUsage} (IS 2386 Part IV:1963)
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Test Result ({aggregateUnit || 'value'})</label>
                  <input type="number" step="0.01" value={aggregateValue} onChange={(e) => setAggregateValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                </div>
                <p className="text-[11px] text-black/40 dark:text-white/40">Once submitted, this result is locked and cannot be edited.</p>
              </>
            )}

            {category === 'Soil' && (
              <>
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-black/60 dark:text-white/60">
                  Target MDD <span className="font-bold text-black dark:text-white">{sample.details?.targetMdd ?? '—'} g/cc</span> — pass at ≥95% compaction
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Field Dry Density (g/cc)</label>
                  <input type="number" step="0.01" value={fieldDensity} onChange={(e) => setFieldDensity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
                </div>
                <p className="text-[11px] text-black/40 dark:text-white/40">Once submitted, this result is locked and cannot be edited.</p>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Tested By</label>
              <div className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black/70 dark:text-white/70 min-h-[44px]">
                <Lock size={12} className="text-black/40 dark:text-white/40 shrink-0" />
                {testerName}
              </div>
              <p className="text-[11px] text-black/40 dark:text-white/40 mt-1">Set automatically from your account — cannot be changed.</p>
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
              <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">Cancel</Button>
              <Button variant="primary" type="submit" disabled={saving} className="!py-3 flex-1 min-h-[48px]">
                {saving ? 'Calculating…' : 'Submit Reading'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}