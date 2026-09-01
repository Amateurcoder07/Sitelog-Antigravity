import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, XCircle, ShieldAlert, Calculator } from 'lucide-react';
import Button from '../Button';

export default function RecordResultModal({ isOpen, onClose, sample, onSave, onOpenNcr }) {
  const category = sample?.materialCategory || 'Concrete';

  // 1. CONCRETE STATE
  const [cube1, setCube1] = useState('');
  const [cube2, setCube2] = useState('');
  const [cube3, setCube3] = useState('');

  // 2. STEEL REBAR STATE
  const [weightPerMeter, setWeightPerMeter] = useState('');
  const [yieldStress, setYieldStress] = useState('');
  const [tensileStrength, setTensileStrength] = useState('');
  const [elongation, setElongation] = useState('');
  const [bendRebendPass, setBendRebendPass] = useState(true);

  // 3. AGGREGATES STATE
  const [siltVolume, setSiltVolume] = useState('');
  const [totalVolume, setTotalVolume] = useState('100');
  const [is383Conforming, setIs383Conforming] = useState(true);

  // 4. SOIL STATE
  const [fieldWetDensity, setFieldWetDensity] = useState('');
  const [fieldMoistureContent, setFieldMoistureContent] = useState('');

  const [notes, setNotes] = useState('');

  // Extract target numeric value e.g. "25.0 N/mm²" -> 25.0
  const targetNum = useMemo(() => {
    if (!sample?.targetStrength) return 25.0;
    const match = sample.targetStrength.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 25.0;
  }, [sample]);

  // =========================================================================
  // CALCULATIONS & PASS/FAIL EVALUATIONS PER MATERIAL
  // =========================================================================

  // CONCRETE EVALUATION
  const concreteAvg = useMemo(() => {
    const vals = [parseFloat(cube1), parseFloat(cube2), parseFloat(cube3)].filter((v) => !isNaN(v) && v > 0);
    if (vals.length === 0) return 0;
    return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
  }, [cube1, cube2, cube3]);

  const isConcretePassed = concreteAvg >= targetNum;
  const isConcreteEvaluated = concreteAvg > 0;

  // STEEL REBAR EVALUATION
  const yieldNum = parseFloat(yieldStress) || 0;
  const tensileNum = parseFloat(tensileStrength) || 0;
  const targetYieldNum = sample?.targetStrength?.includes('550') ? 550 : 500;
  const isSteelPassed = yieldNum >= targetYieldNum && tensileNum > yieldNum && bendRebendPass;
  const isSteelEvaluated = yieldNum > 0;

  // AGGREGATES EVALUATION
  const siltVolNum = parseFloat(siltVolume) || 0;
  const totalVolNum = parseFloat(totalVolume) || 100;
  const siltPercentage = useMemo(() => {
    if (totalVolNum <= 0) return 0;
    return parseFloat(((siltVolNum / totalVolNum) * 100).toFixed(2));
  }, [siltVolNum, totalVolNum]);

  const isAggregatesPassed = siltPercentage <= 8.0 && is383Conforming;
  const isAggregatesEvaluated = siltVolNum > 0;

  // SOIL EVALUATION
  const wetDensityNum = parseFloat(fieldWetDensity) || 0;
  const moistureNum = parseFloat(fieldMoistureContent) || 0;
  const targetMddNum = sample?.targetMdd || 1.85;

  const fieldDryDensity = useMemo(() => {
    if (wetDensityNum <= 0) return 0;
    const fdd = wetDensityNum / (1 + moistureNum / 100);
    return parseFloat(fdd.toFixed(3));
  }, [wetDensityNum, moistureNum]);

  const compactionPercentage = useMemo(() => {
    if (targetMddNum <= 0 || fieldDryDensity <= 0) return 0;
    const comp = (fieldDryDensity / targetMddNum) * 100;
    return parseFloat(comp.toFixed(1));
  }, [fieldDryDensity, targetMddNum]);

  const isSoilPassed = compactionPercentage >= 95.0;
  const isSoilEvaluated = compactionPercentage > 0;

  if (!isOpen || !sample) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalStatus = 'Pass';
    let achievedText = '';

    if (category === 'Concrete') {
      if (!isConcreteEvaluated) return;
      finalStatus = isConcretePassed ? 'Pass' : 'Fail';
      achievedText = `${concreteAvg} N/mm²`;
    } else if (category === 'Steel Rebar') {
      if (!isSteelEvaluated) return;
      finalStatus = isSteelPassed ? 'Pass' : 'Fail';
      achievedText = `${yieldNum} N/mm² (Yield) / ${tensileNum} N/mm² (UT)`;
    } else if (category === 'Aggregates') {
      if (!isAggregatesEvaluated) return;
      finalStatus = isAggregatesPassed ? 'Pass' : 'Fail';
      achievedText = `Silt ${siltPercentage}% (${is383Conforming ? 'IS 383 OK' : 'IS 383 Fail'})`;
    } else if (category === 'Soil') {
      if (!isSoilEvaluated) return;
      finalStatus = isSoilPassed ? 'Pass' : 'Fail';
      achievedText = `Compaction ${compactionPercentage}% (${fieldDryDensity} g/cc)`;
    }

    const updatedSample = {
      ...sample,
      achievedStrength: achievedText,
      status: finalStatus,
      ageStatus: finalStatus === 'Pass' ? 'Completed' : 'Failed / NCR',
      labTechnician: 'Site QC In-Charge'
    };

    onSave(updatedSample);
    onClose();
  };

  const handleGenerateNcrDraft = () => {
    if (onOpenNcr) {
      let failureReason = '';
      if (category === 'Concrete') {
        failureReason = `Target of ${targetNum} N/mm² failed. Average strength achieved was ${concreteAvg} N/mm².`;
      } else if (category === 'Steel Rebar') {
        failureReason = `Yield strength ${yieldNum} N/mm² or Bend/Rebend test failed required spec.`;
      } else if (category === 'Aggregates') {
        failureReason = `Silt Content ${siltPercentage}% exceeds maximum allowed 8.0% threshold according to IS 383.`;
      } else if (category === 'Soil') {
        failureReason = `Soil Compaction ${compactionPercentage}% is below required minimum 95.0% MDD specification.`;
      }

      onOpenNcr({
        title: `${category} Test Failure on ${sample.sampleName} (${sample.structureLocation})`,
        sampleId: sample.id,
        severity: 'High',
        correctiveAction: failureReason,
        assignedTo: 'Er. Rajesh Kumar'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Step 2: Record Test Result</h2>
              <p className="text-xs text-black/50 dark:text-white/50">{sample.id} — {category} Result Entry</p>
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
          <p className="text-black/60 dark:text-white/60">Required Target Spec: <strong className="text-black dark:text-white font-extrabold">{sample.targetStrength}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ========================================================================= */}
          {/* A. CONCRETE FORM */}
          {/* ========================================================================= */}
          {category === 'Concrete' && (
            <div className="space-y-4">
              <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                3-Cube Failure Loads / Compressive Strengths (N/mm²)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <span className="block text-[10px] font-extrabold text-black/50 dark:text-white/50 mb-1">Cube 1</span>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="e.g. 26.5"
                    value={cube1}
                    onChange={(e) => setCube1(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
                <div>
                  <span className="block text-[10px] font-extrabold text-black/50 dark:text-white/50 mb-1">Cube 2</span>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="e.g. 27.8"
                    value={cube2}
                    onChange={(e) => setCube2(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
                <div>
                  <span className="block text-[10px] font-extrabold text-black/50 dark:text-white/50 mb-1">Cube 3</span>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="e.g. 27.3"
                    value={cube3}
                    onChange={(e) => setCube3(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
              </div>

              {isConcreteEvaluated && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs">
                    <span className="font-bold text-black dark:text-white">Calculated Average Strength:</span>
                    <span className="text-base font-black text-black dark:text-white">{concreteAvg} N/mm²</span>
                  </div>

                  {isConcretePassed ? (
                    <div className="bg-emerald-500/15 border-2 border-emerald-500/40 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-1">
                      <div className="flex items-center gap-2 font-black text-base">
                        <CheckCircle2 size={20} />
                        <span>PASSED SPECIFICATION</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Average {concreteAvg} N/mm² meets required target of {targetNum} N/mm².
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-500/15 border-2 border-red-500/40 p-4 rounded-2xl text-red-600 dark:text-red-400 space-y-3">
                      <div className="flex items-center gap-2 font-black text-base">
                        <XCircle size={20} />
                        <span>SPECIFICATION FAILED</span>
                      </div>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                        Average {concreteAvg} N/mm² is below required target of {targetNum} N/mm².
                      </p>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleGenerateNcrDraft}
                        className="w-full !bg-red-600 hover:!bg-red-700 text-white font-extrabold !py-3 gap-2 min-h-[48px]"
                      >
                        <ShieldAlert size={18} /> Generate NCR Draft
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* B. STEEL REBAR FORM */}
          {/* ========================================================================= */}
          {category === 'Steel Rebar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Weight per Meter (kg/m)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 1.58"
                    value={weightPerMeter}
                    onChange={(e) => setWeightPerMeter(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Yield Stress (N/mm²)
                  </label>
                  <input
                    type="number"
                    step="1"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 525"
                    value={yieldStress}
                    onChange={(e) => setYieldStress(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Ultimate Tensile Strength (N/mm²)
                  </label>
                  <input
                    type="number"
                    step="1"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 610"
                    value={tensileStrength}
                    onChange={(e) => setTensileStrength(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Elongation (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 16.5"
                    value={elongation}
                    onChange={(e) => setElongation(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Bend / Rebend Test Toggle */}
              <div>
                <label className="block text-xs font-extrabold text-black dark:text-white mb-1.5">
                  Bend / Rebend Mandrel Test
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBendRebendPass(true)}
                    className={`py-3 px-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      bendRebendPass
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                    }`}
                  >
                    Pass ✓ (No Cracks)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBendRebendPass(false)}
                    className={`py-3 px-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      !bendRebendPass
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                    }`}
                  >
                    Fail ✕ (Cracks Detected)
                  </button>
                </div>
              </div>

              {isSteelEvaluated && (
                <div className="pt-2">
                  {isSteelPassed ? (
                    <div className="bg-emerald-500/15 border-2 border-emerald-500/40 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-1">
                      <div className="flex items-center gap-2 font-black text-base">
                        <CheckCircle2 size={20} />
                        <span>REBAR PASSED SPECIFICATION</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Yield stress {yieldNum} N/mm² exceeds target of {targetYieldNum} N/mm². Bend test passed.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-500/15 border-2 border-red-500/40 p-4 rounded-2xl text-red-600 dark:text-red-400 space-y-3">
                      <div className="flex items-center gap-2 font-black text-base">
                        <XCircle size={20} />
                        <span>REBAR SPECIFICATION FAILED</span>
                      </div>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                        Yield stress {yieldNum} N/mm² is below required target of {targetYieldNum} N/mm² or Bend test failed.
                      </p>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleGenerateNcrDraft}
                        className="w-full !bg-red-600 hover:!bg-red-700 text-white font-extrabold !py-3 gap-2 min-h-[48px]"
                      >
                        <ShieldAlert size={18} /> Generate NCR Draft
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* C. AGGREGATES FORM */}
          {/* ========================================================================= */}
          {category === 'Aggregates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Silt Content Volume (ml)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 6.5"
                    value={siltVolume}
                    onChange={(e) => setSiltVolume(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Total Jar Volume (ml)
                  </label>
                  <input
                    type="number"
                    step="1"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 100"
                    value={totalVolume}
                    onChange={(e) => setTotalVolume(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Grading Conforms to IS 383 Toggle */}
              <div>
                <label className="block text-xs font-extrabold text-black dark:text-white mb-1.5">
                  Grading Sieve Analysis Conforms to IS 383
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIs383Conforming(true)}
                    className={`py-3 px-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      is383Conforming
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                    }`}
                  >
                    Conforms ✓ (Zone II)
                  </button>

                  <button
                    type="button"
                    onClick={() => setIs383Conforming(false)}
                    className={`py-3 px-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      !is383Conforming
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                    }`}
                  >
                    Non-Conforming ✕
                  </button>
                </div>
              </div>

              {isAggregatesEvaluated && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs">
                    <span className="font-bold text-black dark:text-white">Auto-Calculated Silt Percentage:</span>
                    <span className="text-base font-black text-black dark:text-white">{siltPercentage}%</span>
                  </div>

                  {isAggregatesPassed ? (
                    <div className="bg-emerald-500/15 border-2 border-emerald-500/40 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-1">
                      <div className="flex items-center gap-2 font-black text-base">
                        <CheckCircle2 size={20} />
                        <span>AGGREGATE PASSED SPECIFICATION</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Silt content {siltPercentage}% is within maximum allowed 8.0% limit. IS 383 conforming.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-500/15 border-2 border-red-500/40 p-4 rounded-2xl text-red-600 dark:text-red-400 space-y-3">
                      <div className="flex items-center gap-2 font-black text-base">
                        <XCircle size={20} />
                        <span>AGGREGATE SPECIFICATION FAILED</span>
                      </div>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                        Silt content {siltPercentage}% exceeds maximum allowed 8.0% threshold or fails IS 383 grading.
                      </p>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleGenerateNcrDraft}
                        className="w-full !bg-red-600 hover:!bg-red-700 text-white font-extrabold !py-3 gap-2 min-h-[48px]"
                      >
                        <ShieldAlert size={18} /> Generate NCR Draft
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* D. SOIL FORM (FIELD DENSITY TEST - FDT) */}
          {/* ========================================================================= */}
          {category === 'Soil' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Field Wet Density (g/cc)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 1.98"
                    value={fieldWetDensity}
                    onChange={(e) => setFieldWetDensity(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
                    Field Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 11.8"
                    value={fieldMoistureContent}
                    onChange={(e) => setFieldMoistureContent(e.target.value)}
                    className="w-full px-3 py-3 text-sm font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                  />
                </div>
              </div>

              {isSoilEvaluated && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-black/50 dark:text-white/50 block">Field Dry Density (FDD)</span>
                      <span className="text-sm font-extrabold text-black dark:text-white">{fieldDryDensity} g/cc</span>
                    </div>

                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-black/50 dark:text-white/50 block">Compaction Degree</span>
                      <span className="text-sm font-extrabold text-black dark:text-white">{compactionPercentage}%</span>
                    </div>
                  </div>

                  {isSoilPassed ? (
                    <div className="bg-emerald-500/15 border-2 border-emerald-500/40 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-1">
                      <div className="flex items-center gap-2 font-black text-base">
                        <CheckCircle2 size={20} />
                        <span>SOIL COMPACTION PASSED</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Achieved compaction of {compactionPercentage}% meets required minimum 95.0% MDD threshold.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-500/15 border-2 border-red-500/40 p-4 rounded-2xl text-red-600 dark:text-red-400 space-y-3">
                      <div className="flex items-center gap-2 font-black text-base">
                        <XCircle size={20} />
                        <span>COMPACTION SPECIFICATION FAILED</span>
                      </div>
                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                        Achieved compaction {compactionPercentage}% is below required minimum 95.0% MDD requirement.
                      </p>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleGenerateNcrDraft}
                        className="w-full !bg-red-600 hover:!bg-red-700 text-white font-extrabold !py-3 gap-2 min-h-[48px]"
                      >
                        <ShieldAlert size={18} /> Generate NCR Draft
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* QC Remarks */}
          <div>
            <label className="block text-xs font-extrabold text-black dark:text-white mb-1">
              Testing Technician Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Verified with calibrated lab apparatus"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                (category === 'Concrete' && !isConcreteEvaluated) ||
                (category === 'Steel Rebar' && !isSteelEvaluated) ||
                (category === 'Aggregates' && !isAggregatesEvaluated) ||
                (category === 'Soil' && !isSoilEvaluated)
              }
              className="!py-3 flex-1 min-h-[48px]"
            >
              Save Test Result
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
