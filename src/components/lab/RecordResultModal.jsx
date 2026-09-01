import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, XCircle, ShieldAlert, Calculator } from 'lucide-react';
import Button from '../Button';

export default function RecordResultModal({ isOpen, onClose, sample, onSave, onOpenNcr }) {
  const [cube1, setCube1] = useState('');
  const [cube2, setCube2] = useState('');
  const [cube3, setCube3] = useState('');
  const [notes, setNotes] = useState('');

  // Extract target numeric value e.g. "25.0 N/mm²" -> 25.0
  const targetNum = useMemo(() => {
    if (!sample?.targetStrength) return 25.0;
    const match = sample.targetStrength.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 25.0;
  }, [sample]);

  // Auto-calculate average strength on the fly
  const averageStrength = useMemo(() => {
    const vals = [parseFloat(cube1), parseFloat(cube2), parseFloat(cube3)].filter((v) => !isNaN(v) && v > 0);
    if (vals.length === 0) return 0;
    const sum = vals.reduce((a, b) => a + b, 0);
    return parseFloat((sum / vals.length).toFixed(1));
  }, [cube1, cube2, cube3]);

  // Determine Pass / Fail comparison
  const isPassed = averageStrength >= targetNum;
  const isEvaluated = averageStrength > 0;

  if (!isOpen || !sample) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (averageStrength <= 0) return;

    const finalStatus = isPassed ? 'Pass' : 'Fail';
    const updatedSample = {
      ...sample,
      achievedStrength: `${averageStrength} N/mm²`,
      status: finalStatus,
      ageStatus: isPassed ? 'Completed' : 'Failed / NCR',
      labTechnician: 'Site QC In-Charge'
    };

    onSave(updatedSample);
    onClose();
  };

  const handleGenerateNcrDraft = () => {
    if (onOpenNcr) {
      onOpenNcr({
        title: `Low Cube Strength on ${sample.sampleName} (${sample.structureLocation})`,
        sampleId: sample.id,
        severity: 'High',
        correctiveAction: `Target of ${targetNum} N/mm² failed. Average strength achieved was ${averageStrength} N/mm². Structural consultant review required.`,
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
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Step 2: Record Test Result</h2>
              <p className="text-xs text-black/50 dark:text-white/50">{sample.id} — {sample.gradeBadge}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Target Spec Summary Banner */}
        <div className="bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl mb-4 text-xs space-y-1">
          <p className="font-bold text-black dark:text-white">Specimen: {sample.sampleName}</p>
          <p className="text-black/60 dark:text-white/60">Location: {sample.structureLocation}</p>
          <p className="text-black/60 dark:text-white/60">Required Target Spec: <strong className="text-black dark:text-white font-extrabold">{sample.targetStrength}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 3 SEPARATE NUMERIC INPUT FIELDS (WITH inputmode="decimal") */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              3-Cube Compressive Failure Loads / Strengths (N/mm²)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <span className="block text-[10px] font-bold text-black/40 dark:text-white/40 mb-1">Cube 1</span>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="e.g. 26.5"
                  value={cube1}
                  onChange={(e) => setCube1(e.target.value)}
                  className="w-full px-3 py-3 text-sm font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                />
              </div>

              <div>
                <span className="block text-[10px] font-bold text-black/40 dark:text-white/40 mb-1">Cube 2</span>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="e.g. 27.8"
                  value={cube2}
                  onChange={(e) => setCube2(e.target.value)}
                  className="w-full px-3 py-3 text-sm font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                />
              </div>

              <div>
                <span className="block text-[10px] font-bold text-black/40 dark:text-white/40 mb-1">Cube 3</span>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="e.g. 27.3"
                  value={cube3}
                  onChange={(e) => setCube3(e.target.value)}
                  className="w-full px-3 py-3 text-sm font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC AUTO-CALCULATED AVERAGE & EVALUATION BANNERS */}
          {isEvaluated && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-xs">
                <span className="font-bold text-black/70 dark:text-white/70">Calculated Average Strength:</span>
                <span className="text-base font-black text-black dark:text-white">{averageStrength} N/mm²</span>
              </div>

              {/* PASSED BANNER */}
              {isPassed ? (
                <div className="bg-emerald-500/15 border-2 border-emerald-500/40 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-1">
                  <div className="flex items-center gap-2 font-black text-base">
                    <CheckCircle2 size={20} />
                    <span>PASSED SPECIFICATION</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Average {averageStrength} N/mm² exceeds required target of {targetNum} N/mm². Meets IS 456 standards.
                  </p>
                </div>
              ) : (
                /* FAILED BANNER WITH GENERATE NCR DRAFT BUTTON */
                <div className="bg-red-500/15 border-2 border-red-500/40 p-4 rounded-2xl text-red-600 dark:text-red-400 space-y-3">
                  <div className="flex items-center gap-2 font-black text-base">
                    <XCircle size={20} />
                    <span>SPECIFICATION FAILED</span>
                  </div>
                  <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                    Average {averageStrength} N/mm² is below required target of {targetNum} N/mm². Non-conformance detected.
                  </p>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleGenerateNcrDraft}
                    className="w-full !bg-red-600 hover:!bg-red-700 text-white font-extrabold !py-3 gap-2 min-h-[48px]"
                  >
                    <ShieldAlert size={18} />
                    Generate NCR Draft
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* QC Remarks */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              Testing Technician Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Tested on CTM Machine #1 at 2000 kN capacity"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!isEvaluated} className="!py-3 flex-1 min-h-[48px]">
              Save Test Result
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
