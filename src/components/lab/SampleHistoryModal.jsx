import React from 'react';
import { X, History, CheckCircle2, XCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';

const STAGE_STATUS_STYLE = {
  Pass: { icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  Fail: { icon: XCircle, className: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20' },
  'Retest Required': { icon: AlertTriangle, className: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20' },
  Recorded: { icon: Info, className: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
};

function formatInputs(inputs) {
  if (!inputs) return '—';
  if (inputs.readings) return `${inputs.readings.join(', ')} N/mm²`;
  if (inputs.yieldStrength !== undefined) {
    return `Fy ${inputs.yieldStrength} N/mm², UTS ${inputs.ultimateStrength} N/mm², Elong. ${inputs.elongation}%, Bend ${inputs.bendTest}`;
  }
  if (inputs.value !== undefined) return `${inputs.value}`;
  if (inputs.fieldDensity !== undefined) return `Field density ${inputs.fieldDensity} g/cc`;
  return JSON.stringify(inputs);
}

export default function SampleHistoryModal({ isOpen, onClose, sample }) {
  if (!isOpen || !sample) return null;

  const history = sample.resultData?.history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <History size={22} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Reading History</h2>
              <p className="text-xs text-black/50 dark:text-white/50">{sample.code} — {sample.sampleName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3.5 mb-4 text-xs text-black/60 dark:text-white/60 flex items-center justify-between">
          <span>{sample.materialCategory} • {sample.grade || sample.details?.aggregateTestType || '—'}</span>
          <span className="font-bold text-black dark:text-white">{sample.standardCode}</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
            <History className="mx-auto text-black/20 dark:text-white/20 mb-2" size={26} />
            <p className="text-sm text-black/50 dark:text-white/50">No readings recorded yet for this sample.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry, idx) => {
              const style = STAGE_STATUS_STYLE[entry.status] || STAGE_STATUS_STYLE.Recorded;
              const Icon = style.icon;
              return (
                <div key={idx} className="border border-black/10 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-black dark:text-white">{entry.stage}</span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.className}`}>
                      <Icon size={11} /> {entry.status}
                    </span>
                  </div>

                  <p className="text-xs text-black/60 dark:text-white/60 mb-1">
                    Reading: <span className="font-mono font-bold text-black dark:text-white">{formatInputs(entry.inputs)}</span>
                    {entry.average != null && (
                      <span className="ml-2 text-black/40 dark:text-white/40">(avg {entry.average})</span>
                    )}
                  </p>

                  <p className="text-[11px] text-black/40 dark:text-white/40 mb-2">
                    {entry.recordedBy} • {new Date(entry.recordedAt).toLocaleString('en-IN')}
                  </p>

                  {entry.recommendation && (
                    <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5">
                      <Lightbulb size={13} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-black/70 dark:text-white/70 leading-relaxed">{entry.recommendation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}