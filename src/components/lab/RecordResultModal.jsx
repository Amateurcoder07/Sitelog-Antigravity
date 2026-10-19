import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ShieldAlert, Calculator, Lock, History, AlertTriangle } from 'lucide-react';
import Button from '../Button';
import {
  averageWithOutlierCheck,
  previewSteel,
  previewAggregate,
  previewSoil,
} from '../../utils/labEvaluation';

const inputCls =
  'w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed';
const labelCls = 'block text-xs font-extrabold text-black dark:text-white mb-1';
const subLabelCls = 'block text-[10px] font-extrabold text-black/50 dark:text-white/50 mb-1';

const TONES = {
  pass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
  fail: 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-400',
  warn: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400',
};
const TONE_TEXT = {
  pass: 'text-emerald-700 dark:text-emerald-300',
  fail: 'text-red-700 dark:text-red-300',
  warn: 'text-amber-700 dark:text-amber-300',
};

function Banner({ tone, title, text, onNcr, busy }) {
  const Icon = tone === 'pass' ? CheckCircle2 : tone === 'fail' ? XCircle : AlertTriangle;
  return (
    <div className={`border-2 p-4 rounded-2xl space-y-3 ${TONES[tone]}`}>
      <div className="flex items-center gap-2 font-black text-base">
        <Icon size={20} />
        <span>{title}</span>
      </div>
      <p className={`text-xs font-semibold ${TONE_TEXT[tone]}`}>{text}</p>
      {tone === 'fail' && onNcr && (
        <button
          type="button"
          onClick={onNcr}
          disabled={busy}
          className="w-full inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-extrabold py-3 gap-2 min-h-[48px] cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldAlert size={18} /> Save & Generate NCR Draft
        </button>
      )}
    </div>
  );
}

const pad3 = (arr) => [0, 1, 2].map((i) => (arr && arr[i] != null ? String(arr[i]) : ''));
const str = (v) => (v === undefined || v === null ? '' : String(v));

export default function RecordResultModal({ isOpen, onClose, sample, standards, onSave, onOpenNcr }) {
  const category = sample?.materialCategory || 'Concrete';
  const rd = sample?.resultData || {};
  const history = Array.isArray(rd.history) ? rd.history : [];
  const last = history.length ? history[history.length - 1].inputs || {} : {};
  const canEdit = !!sample?.canEdit;

  // Concrete
  const [day, setDay] = useState(() => (rd.day7Readings?.length ? '28' : '7'));
  const [r7, setR7] = useState(() => pad3(rd.day7Readings));
  const [r28, setR28] = useState(() => pad3(rd.day28Readings));
  // Steel
  const [weightPerMeter, setWeightPerMeter] = useState(() => str(last.weightPerMeter));
  const [yieldStress, setYieldStress] = useState(() => str(last.yieldStrength));
  const [tensileStrength, setTensileStrength] = useState(() => str(last.ultimateStrength));
  const [elongation, setElongation] = useState(() => str(last.elongation));
  const [bendTest, setBendTest] = useState(() => last.bendTest || 'Pass');
  // Aggregate
  const [aggValue, setAggValue] = useState(() => str(last.value));
  // Soil
  const [wetDensity, setWetDensity] = useState(() => str(last.fieldWetDensity));
  const [moisture, setMoisture] = useState(() => str(last.fieldMoisture));

  const [saving, setSaving] = useState(false);

  const updateReading = (idx, val) => {
    setReadings((prev) => prev.map((r, i) => (i === idx ? val : r)));
  };

  // ---------- previews ----------
  const grade = sample.grade;
  const concreteTarget = standards?.concreteGrades?.[grade] ?? null;
  const readings = day === '7' ? r7 : r28;
  const readingsFilled = readings.every((v) => v !== '' && Number(v) > 0);
  const concreteCalc = readings.some((v) => Number(v) > 0) ? averageWithOutlierCheck(readings) : null;

  const steelPreview = previewSteel({ grade, yieldStrength: yieldStress, ultimateStrength: tensileStrength, elongation, bendTest }, standards);
  const aggTestType = sample.details?.aggregateTestType;
  const aggUsage = sample.details?.aggregateUsage;
  const aggUnit = standards?.aggregateTests?.[aggTestType]?.unit || '';
  const aggPreview = previewAggregate({ testType: aggTestType, usage: aggUsage, value: aggValue }, standards);
  const soilPreview = previewSoil({ wetDensity, moisture, targetMdd: sample.details?.targetMdd });

  let canSave = false;
  if (category === 'Concrete') canSave = readingsFilled;
  if (category === 'Steel') canSave = !!steelPreview && elongation !== '' && tensileStrength !== '';
  if (category === 'Aggregate') canSave = aggValue !== '' && !!aggPreview;
  if (category === 'Soil') canSave = !!soilPreview;

  const buildPayload = () => {
    if (category === 'Concrete') return { day, readings: readings.map(Number) };
    if (category === 'Steel') {
      return {
        yieldStrength: Number(yieldStress),
        ultimateStrength: Number(tensileStrength),
        elongation: Number(elongation),
        bendTest,
        weightPerMeter: weightPerMeter === '' ? undefined : Number(weightPerMeter),
      };
    }
    if (category === 'Aggregate') return { value: Number(aggValue) };
    return { fieldWetDensity: Number(wetDensity), fieldMoisture: Number(moisture) };
  };

  const save = async () => {
    setSaving(true);
    try {
      return await onSave(sample, buildPayload());
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit || !canSave) return;
    const saved = await save();
    if (saved) onClose();
  };

  const failureReason = () => {
    if (category === 'Concrete') {
      return `28-day target of ${concreteTarget} N/mm² (${grade}) not achieved. Average strength was ${concreteCalc?.average} N/mm².`;
    }
    if (category === 'Steel') {
      const failed = Object.entries(steelPreview?.checks || {}).filter(([, ok]) => !ok).map(([k]) => k);
      return `Steel ${grade} failed IS 1786 checks: ${failed.join(', ')}.`;
    }
    if (category === 'Aggregate') {
      return `${aggTestType} result ${aggValue}${aggUnit} exceeds the ${aggPreview?.limit}${aggUnit} limit for ${aggUsage} (IS 2386).`;
    }
    return `Soil compaction ${soilPreview?.compaction}% is below the required 95% of MDD.`;
  };

  const handleGenerateNcr = async () => {
    if (!canEdit || !canSave) return;
    const saved = await save();
    if (!saved) return;
    onOpenNcr?.({
      title: `${category} test failure on ${sample.sampleName} (${sample.structureLocation})`,
      sampleId: sample.id,
      severity: 'High',
      correctiveAction: failureReason(),
    });
    onClose();
  };

  const alreadyRecorded =
    category === 'Concrete' ? (day === '7' ? !!rd.day7Readings?.length : !!rd.day28Readings?.length) : history.length > 0;

  const numInput = (value, setter, placeholder, step = '0.1') => (
    <input
      type="number"
      step={step}
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setter(e.target.value)}
      disabled={!canEdit}
      className={inputCls}
    />
  );

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

        {/* Spec Target Banner */}
        <div className="bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl mb-4 text-xs space-y-1">
          <p className="font-extrabold text-black dark:text-white">Specimen: {sample.sampleName}</p>
          <p className="text-black/60 dark:text-white/60">Location: {sample.structureLocation}</p>
          <p className="text-black/60 dark:text-white/60">
            Required Target Spec: <strong className="text-black dark:text-white font-extrabold">{sample.targetStrength}</strong>
            {sample.standardCode ? <span className="text-black/40 dark:text-white/40"> · {sample.standardCode}</span> : null}
          </p>
          <p className="text-black/60 dark:text-white/60">
            Registered by: <strong className="text-black dark:text-white font-extrabold">{sample.registeredBy || '—'}</strong>
          </p>
        </div>

        {!canEdit && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Lock size={14} className="shrink-0 mt-0.5" />
            <span>Read-only. Only {sample.registeredBy || 'the person who registered this sample'} can record or edit its readings.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ===================== CONCRETE ===================== */}
          {category === 'Concrete' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
                {[['7', '7-Day Test'], ['28', '28-Day Test']].map(([d, label]) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={`py-2.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      day === d ? 'bg-orange-600 text-white shadow-md' : 'text-black/70 dark:text-white/70'
                    }`}
                  >
                    {label}
                    {(d === '7' ? rd.day7Readings?.length : rd.day28Readings?.length) ? ' ✓' : ''}
                  </button>
                ))}
              </div>

              {alreadyRecorded && canEdit && (
                <p className="text-[11px] font-semibold text-black/60 dark:text-white/60">
                  A {day}-day reading is already recorded. You can correct it — the earlier entry stays in the reading history below.
                </p>
              )}

              <label className={labelCls}>
                {day}-Day Cube Compressive Strengths (N/mm²) — set of 3
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <span className={subLabelCls}>Cube {i + 1}</span>
                    <input
                      type="number"
                      step="0.1"
                      inputMode="decimal"
                      placeholder={['e.g. 26.5', 'e.g. 27.8', 'e.g. 27.3'][i]}
                      value={readings[i]}
                      onChange={(e) => {
                        const next = [...readings];
                        next[i] = e.target.value;
                        (day === '7' ? setR7 : setR28)(next);
                      }}
                      disabled={!canEdit}
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>

              {concreteCalc && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs">
                    <span className="font-bold text-black dark:text-white">Calculated Average Strength:</span>
                    <span className="text-base font-black text-black dark:text-white">
                      {concreteCalc.average != null ? `${concreteCalc.average} N/mm²` : '—'}
                    </span>
                  </div>

                  {concreteCalc.invalid ? (
                    <Banner tone="warn" title="RETEST REQUIRED" text="More than one specimen deviates >15% from the mean (IS 516 cl. 8). The set is inconclusive." />
                  ) : concreteCalc.discarded.length > 0 ? (
                    <Banner tone="warn" title="OUTLIER DISCARDED" text={`${concreteCalc.discarded[0]} N/mm² deviates >15% from the mean and is excluded; the other two are averaged.`} />
                  ) : null}

                  {!concreteCalc.invalid && day === '28' && concreteTarget != null && readingsFilled && (
                    concreteCalc.average >= concreteTarget ? (
                      <Banner tone="pass" title="PASSED SPECIFICATION" text={`Average ${concreteCalc.average} N/mm² meets the ${grade} target of ${concreteTarget} N/mm².`} />
                    ) : (
                      <Banner tone="fail" title="SPECIFICATION FAILED" text={`Average ${concreteCalc.average} N/mm² is below the ${grade} target of ${concreteTarget} N/mm².`} onNcr={handleGenerateNcr} busy={saving || !canEdit} />
                    )
                  )}

                  {!concreteCalc.invalid && day === '7' && concreteTarget != null && (
                    <p className="text-[11px] font-semibold text-black/60 dark:text-white/60">
                      7-day result is informational. {concreteCalc.average >= 0.65 * concreteTarget
                        ? 'Early strength is tracking toward the 28-day target.'
                        : 'Early strength is low — check curing conditions.'}
                    </p>
                  )}
                  {concreteTarget == null && (
                    <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">This sample has no valid grade, so no target can be compared.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===================== STEEL ===================== */}
          {category === 'Steel' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={labelCls}>Weight per Meter (kg/m)</label>{numInput(weightPerMeter, setWeightPerMeter, 'e.g. 1.58', '0.001')}</div>
                <div><label className={labelCls}>Yield Stress (N/mm²)</label>{numInput(yieldStress, setYieldStress, 'e.g. 525', '1')}</div>
                <div><label className={labelCls}>Ultimate Tensile Strength (N/mm²)</label>{numInput(tensileStrength, setTensileStrength, 'e.g. 610', '1')}</div>
                <div><label className={labelCls}>Elongation (%)</label>{numInput(elongation, setElongation, 'e.g. 16.5')}</div>
              </div>

              <div>
                <label className={labelCls}>Bend / Rebend Mandrel Test</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['Pass', 'Pass ✓ (No Cracks)', 'bg-emerald-600 border-emerald-600'], ['Fail', 'Fail ✕ (Cracks Detected)', 'bg-red-600 border-red-600']].map(([val, label, on]) => (
                    <button
                      key={val}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => setBendTest(val)}
                      className={`py-3 px-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer disabled:cursor-not-allowed ${
                        bendTest === val ? `${on} text-white shadow-md` : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {steelPreview && (
                steelPreview.passed ? (
                  <Banner tone="pass" title="REBAR PASSED SPECIFICATION" text={`Meets all IS 1786 requirements for ${grade}. UTS/Yield ratio ${steelPreview.ratio}.`} />
                ) : (
                  <Banner
                    tone="fail"
                    title="REBAR SPECIFICATION FAILED"
                    text={`Failed: ${Object.entries(steelPreview.checks).filter(([, ok]) => !ok).map(([k]) => ({ yield: `yield < ${steelPreview.spec.minYield}`, ratio: `UTS/Yield ${steelPreview.ratio} < ${steelPreview.spec.minUtsYieldRatio}`, elongation: `elongation < ${steelPreview.spec.minElongation}%`, bend: 'bend test' }[k])).join(', ')}.`}
                    onNcr={handleGenerateNcr}
                    busy={saving || !canEdit}
                  />
                )
              )}
            </div>
          )}

          {/* ===================== AGGREGATE ===================== */}
          {category === 'Aggregate' && (
            <div className="space-y-4">
              <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs space-y-0.5">
                <p className="font-bold text-black dark:text-white">{aggTestType}</p>
                {aggUsage && <p className="text-black/60 dark:text-white/60">Usage: {aggUsage}</p>}
              </div>
              <div>
                <label className={labelCls}>Test Result Value {aggUnit ? `(${aggUnit})` : ''}</label>
                {numInput(aggValue, setAggValue, 'e.g. 24.5')}
              </div>

              {aggPreview && (
                aggPreview.passed ? (
                  <Banner tone="pass" title="AGGREGATE PASSED SPECIFICATION" text={aggPreview.informational ? 'Informational only — no pass/fail limit under IS 2386.' : `${aggValue}${aggUnit} is within the ${aggPreview.limit}${aggUnit} limit for ${aggUsage}.`} />
                ) : (
                  <Banner tone="fail" title="AGGREGATE SPECIFICATION FAILED" text={`${aggValue}${aggUnit} exceeds the ${aggPreview.limit}${aggUnit} limit for ${aggUsage}.`} onNcr={handleGenerateNcr} busy={saving || !canEdit} />
                )
              )}
            </div>
          )}

          {/* ===================== SOIL ===================== */}
          {category === 'Soil' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={labelCls}>Field Wet Density (g/cc)</label>{numInput(wetDensity, setWetDensity, 'e.g. 1.98', '0.01')}</div>
                <div><label className={labelCls}>Field Moisture Content (%)</label>{numInput(moisture, setMoisture, 'e.g. 11.8')}</div>
              </div>

              {soilPreview && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-black/50 dark:text-white/50 block">Field Dry Density (FDD)</span>
                      <span className="text-sm font-extrabold text-black dark:text-white">{soilPreview.dryDensity} g/cc</span>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-black/50 dark:text-white/50 block">Compaction Degree</span>
                      <span className="text-sm font-extrabold text-black dark:text-white">{soilPreview.compaction}%</span>
                    </div>
                  </div>
                  {soilPreview.passed ? (
                    <Banner tone="pass" title="SOIL COMPACTION PASSED" text={`${soilPreview.compaction}% meets the minimum 95% of MDD.`} />
                  ) : (
                    <Banner tone="fail" title="COMPACTION SPECIFICATION FAILED" text={`${soilPreview.compaction}% is below the required 95% of MDD.`} onNcr={handleGenerateNcr} busy={saving || !canEdit} />
                  )}
                </div>
              )}
            </div>

          {/* ===================== READING HISTORY ===================== */}
          {history.length > 0 && (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-extrabold text-black dark:text-white flex items-center gap-1.5">
                <History size={14} className="text-orange-500" /> Reading History
              </p>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {[...history].reverse().map((h, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-black dark:text-white">{h.stage}</span>
                      <span className="font-bold text-black/60 dark:text-white/60">{h.status}{h.average != null ? ` · ${h.average}` : ''}</span>
                    </div>
                    <p className="text-black/50 dark:text-white/50">
                      {h.recordedBy} · {h.recordedAt ? new Date(h.recordedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                    {h.recommendation && <p className="text-black/70 dark:text-white/70 leading-snug">{h.recommendation}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              {canEdit ? 'Cancel' : 'Close'}
            </Button>
            {canEdit && (
              <button
                type="submit"
                disabled={!canSave || saving}
                className="inline-flex items-center justify-center font-medium text-sm rounded-md bg-black dark:bg-white text-white dark:text-black shadow-md px-5 !py-3 flex-1 min-h-[48px] hover:opacity-90 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : alreadyRecorded ? 'Update Reading' : 'Save Test Result'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}