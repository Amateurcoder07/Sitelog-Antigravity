import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FlaskConical, ShieldAlert, Gauge, FileCheck, Plus, QrCode,
  CheckCircle2, XCircle, Clock, AlertTriangle, Eye, RefreshCw, History,
} from 'lucide-react';
import API from '../api';
import NewSampleModal from '../components/lab/NewSampleModal';
import RecordResultModal from '../components/lab/RecordResultModal';
import SampleHistoryModal from '../components/lab/SampleHistoryModal';
import NewNcrModal from '../components/lab/NewNcrModal';
import NewEquipmentModal from '../components/lab/NewEquipmentModal';
import RecalibrateModal from '../components/lab/RecalibrateModal';
import UploadCertModal from '../components/lab/UploadCertModal';
import PdfPreviewShareModal from '../components/lab/PdfPreviewShareModal';
import QrScanModal from '../components/lab/QrScanModal';

const TABS = [
  { id: 'samples', label: 'Sample Testing', icon: FlaskConical },
  { id: 'ncrs', label: 'Quality NCRs', icon: ShieldAlert },
  { id: 'equipment', label: 'Equipment', icon: Gauge },
  { id: 'certificates', label: 'Certificates', icon: FileCheck },
];

const SAMPLE_STATUS_STYLE = {
  Pass: { label: 'Pass', icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  Fail: { label: 'Fail', icon: XCircle, className: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20' },
  Curing: { label: 'Curing', icon: Clock, className: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
  'Due Today': { label: 'Due Today', icon: Clock, className: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
  'Retest Required': { label: 'Retest Required', icon: AlertTriangle, className: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20' },
};

const NCR_STATUS_STYLE = {
  Open: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
  'Under Review': 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  Resolved: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
  Closed: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

function equipmentDisplayStatus(eq) {
  const due = new Date(eq.nextCalibrationDue);
  const today = new Date();
  const daysLeft = Math.ceil((due - today) / (24 * 60 * 60 * 1000));
  if (daysLeft < 0) return { label: 'Overdue', className: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20' };
  if (daysLeft <= 30) return { label: 'Due Soon', className: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
  return { label: eq.status === 'Active' ? 'Active' : 'Calibrated', className: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-4">
      <p className="text-black/40 dark:text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-black dark:text-white text-2xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="text-center py-14 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
      <Icon className="mx-auto text-black/20 dark:text-white/20 mb-3" size={30} />
      <p className="text-sm text-black/50 dark:text-white/50 max-w-sm mx-auto">{text}</p>
    </div>
  );
}

function SamplesTab({ samples, onNew, onRecord, onRaiseNcr, onViewHistory }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-black/50 dark:text-white/50">{samples.length} sample{samples.length === 1 ? '' : 's'} registered</p>
        <button onClick={onNew} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={15} /> New Sample
        </button>
      </div>

      {samples.length === 0 ? (
        <EmptyState icon={FlaskConical} text="No samples registered yet. Cast a sample to begin the IS testing workflow." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {samples.map((s) => {
            const st = SAMPLE_STATUS_STYLE[s.status] || SAMPLE_STATUS_STYLE.Curing;
            const StatusIcon = st.icon;
            const canRecord = ['Curing', 'Due Today', 'Retest Required'].includes(s.status);
            const hasHistory = (s.resultData?.history || []).length > 0;
            return (
              <div key={s._id} className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-black/60 dark:text-white/60">{s.code}</span>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.className}`}>
                    <StatusIcon size={11} /> {st.label}
                  </span>
                </div>
                <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{s.sampleName}</h3>
                <p className="text-black/40 dark:text-white/40 text-xs mb-2">{s.materialCategory} • {s.structureLocation}</p>
                {s.grade && (
                  <p className="text-black/50 dark:text-white/50 text-xs mb-1">
                    Grade: <span className="font-semibold text-black dark:text-white">{s.grade}</span>
                  </p>
                )}
                <p className="text-black/50 dark:text-white/50 text-xs mb-1">Target: {s.targetStrength || '—'}</p>
                <p className="text-black/50 dark:text-white/50 text-xs mb-1">Achieved: {s.achievedStrength || 'Pending Test'}</p>
                <p className="text-black/30 dark:text-white/30 text-[11px] mb-3">{s.standardCode}</p>
                <p className="text-black/40 dark:text-white/40 text-[11px] mb-4">{s.ageStatus}</p>

                <div className="flex items-center gap-2">
                  {canRecord && (
                    <button
                      onClick={() => onRecord(s)}
                      className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Add Reading
                    </button>
                  )}
                  {s.status === 'Fail' && (
                    <button
                      onClick={() => onRaiseNcr(s)}
                      className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Raise NCR
                    </button>
                  )}
                  <button
                    onClick={() => onViewHistory(s)}
                    disabled={!hasHistory}
                    title={hasHistory ? 'View reading history' : 'No readings recorded yet'}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-black/15 dark:border-white/15 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <History size={13} /> History
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NcrsTab({ ncrs, onNew }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-black/50 dark:text-white/50">{ncrs.length} NCR{ncrs.length === 1 ? '' : 's'} raised</p>
        <button onClick={onNew} className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={15} /> Raise NCR
        </button>
      </div>
      {ncrs.length === 0 ? (
        <EmptyState icon={ShieldAlert} text="No non-conformances raised. Failed samples can be escalated directly from the Sample Testing tab." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ncrs.map((n) => (
            <div key={n._id} className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-black/60 dark:text-white/60">{n.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${NCR_STATUS_STYLE[n.status] || ''}`}>{n.status}</span>
              </div>
              <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{n.title}</h3>
              <p className="text-black/50 dark:text-white/50 text-xs mb-2">Severity: <span className="font-semibold">{n.severity}</span> • Assigned to {n.assignedTo}</p>
              <p className="text-black/40 dark:text-white/40 text-xs">{n.correctiveAction}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EquipmentTab({ equipment, onNew, onRecalibrate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-black/50 dark:text-white/50">{equipment.length} instrument{equipment.length === 1 ? '' : 's'} tracked</p>
        <button onClick={onNew} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={15} /> Register Equipment
        </button>
      </div>
      {equipment.length === 0 ? (
        <EmptyState icon={Gauge} text="No lab equipment registered yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((eq) => {
            const disp = equipmentDisplayStatus(eq);
            return (
              <div key={eq._id} className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-black/60 dark:text-white/60">{eq.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${disp.className}`}>{disp.label}</span>
                </div>
                <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{eq.name}</h3>
                <p className="text-black/40 dark:text-white/40 text-xs mb-1">{eq.model} • S/N {eq.serialNo}</p>
                <p className="text-black/40 dark:text-white/40 text-xs mb-3">Next due {new Date(eq.nextCalibrationDue).toLocaleDateString('en-IN')}</p>
                <button
                  onClick={() => onRecalibrate(eq)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-black/15 dark:border-white/15 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} /> Recalibrate
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CertificatesTab({ certificates, onNew, onPreview }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-black/50 dark:text-white/50">{certificates.length} certificate{certificates.length === 1 ? '' : 's'} on file</p>
        <button onClick={onNew} className="flex items-center gap-2 bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
          <Plus size={15} /> Upload Certificate
        </button>
      </div>
      {certificates.length === 0 ? (
        <EmptyState icon={FileCheck} text="No NABL certificates uploaded yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((c) => (
            <button
              key={c._id}
              onClick={() => onPreview({ ...c, id: c.code, sampleId: c.sample })}
              className="text-left bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-black/60 dark:text-white/60">{c.code}</span>
                <Eye size={14} className="text-black/30 dark:text-white/30" />
              </div>
              <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{c.title}</h3>
              <p className="text-black/40 dark:text-white/40 text-xs">{c.nablLabName}</p>
              <p className="text-black/30 dark:text-white/30 text-[11px] mt-1">{new Date(c.issueDate).toLocaleDateString('en-IN')}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LabManagement() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('samples');
  const [data, setData] = useState({ samples: [], ncrs: [], equipment: [], certificates: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showNewSample, setShowNewSample] = useState(false);
  const [recordingSample, setRecordingSample] = useState(null);
  const [historySample, setHistorySample] = useState(null);
  const [showNcr, setShowNcr] = useState(false);
  const [ncrPrefill, setNcrPrefill] = useState(null);
  const [showEquipment, setShowEquipment] = useState(false);
  const [recalibrating, setRecalibrating] = useState(null);
  const [showCert, setShowCert] = useState(false);
  const [previewingCert, setPreviewingCert] = useState(null);
  const [showScan, setShowScan] = useState(false);

  const load = useCallback(() => {
    if (!projectId) return;
    setLoading(true);
    API.get(`/lab-management/${projectId}`)
      .then((res) => { setData(res.data); setError(''); })
      .catch(() => setError('Could not load lab management data.'))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  if (!projectId) {
    return <p className="text-sm text-black/50 dark:text-white/50">Select a project to view lab data.</p>;
  }

  const { samples, ncrs, equipment, certificates, summary } = data;

  const handleScanned = (sample) => {
    setShowScan(false);
    setRecordingSample(sample);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">Lab Management</h1>
          <p className="text-black/50 dark:text-white/50 text-sm mt-1">
            Site testing register — concrete, steel & aggregates, tested per Indian Standard methods.
          </p>
        </div>
        <button
          onClick={() => setShowScan(true)}
          className="flex items-center justify-center gap-2 border border-black/15 dark:border-white/15 text-black dark:text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <QrCode size={15} />
          Scan Sample
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Samples Logged" value={summary.totalSamplesLogged ?? 0} />
        <SummaryCard label="Pass Rate" value={`${summary.passRatePercentage ?? 0}%`} />
        <SummaryCard label="Pending Tests" value={summary.pendingTestsCount ?? 0} />
        <SummaryCard label="Open NCRs" value={summary.openNcrsCount ?? 0} />
      </div>

      <div className="flex items-center gap-1 border-b border-black/10 dark:border-white/10 mb-6 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70'
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-black/40 dark:text-white/40">Loading lab data…</p>
      ) : (
        <>
          {activeTab === 'samples' && (
            <SamplesTab
              samples={samples}
              onNew={() => setShowNewSample(true)}
              onRecord={(s) => setRecordingSample(s)}
              onRaiseNcr={(s) => { setNcrPrefill(s); setShowNcr(true); }}
              onViewHistory={(s) => setHistorySample(s)}
            />
          )}
          {activeTab === 'ncrs' && (
            <NcrsTab ncrs={ncrs} onNew={() => { setNcrPrefill(null); setShowNcr(true); }} />
          )}
          {activeTab === 'equipment' && (
            <EquipmentTab equipment={equipment} onNew={() => setShowEquipment(true)} onRecalibrate={(eq) => setRecalibrating(eq)} />
          )}
          {activeTab === 'certificates' && (
            <CertificatesTab certificates={certificates} onNew={() => setShowCert(true)} onPreview={(c) => setPreviewingCert(c)} />
          )}
        </>
      )}

      {showNewSample && (
        <NewSampleModal
          isOpen={showNewSample}
          projectId={projectId}
          onClose={() => setShowNewSample(false)}
          onSave={() => load()}
        />
      )}

      {recordingSample && (
        <RecordResultModal
          isOpen={!!recordingSample}
          sample={recordingSample}
          onClose={() => { setRecordingSample(null); load(); }}
          onSave={() => load()}
        />
      )}

      {historySample && (
        <SampleHistoryModal
          isOpen={!!historySample}
          sample={historySample}
          onClose={() => setHistorySample(null)}
        />
      )}

      {showNcr && (
        <NewNcrModal
          isOpen={showNcr}
          projectId={projectId}
          samples={samples}
          prefilledData={
            ncrPrefill
              ? {
                  sample: ncrPrefill._id,
                  title: `${ncrPrefill.status === 'Fail' ? 'High' : 'Medium'} Severity - ${ncrPrefill.materialCategory} failure at ${ncrPrefill.structureLocation}`,
                  severity: ncrPrefill.status === 'Fail' ? 'High' : 'Medium',
                }
              : null
          }
          onClose={() => setShowNcr(false)}
          onSave={() => load()}
        />
      )}

      {showEquipment && (
        <NewEquipmentModal
          isOpen={showEquipment}
          projectId={projectId}
          onClose={() => setShowEquipment(false)}
          onSave={() => load()}
        />
      )}

      {recalibrating && (
        <RecalibrateModal
          isOpen={!!recalibrating}
          equipment={recalibrating}
          onClose={() => setRecalibrating(null)}
          onSave={() => load()}
        />
      )}

      {showCert && (
        <UploadCertModal
          isOpen={showCert}
          projectId={projectId}
          samples={samples}
          onClose={() => setShowCert(false)}
          onSave={() => load()}
        />
      )}

      {previewingCert && (
        <PdfPreviewShareModal
          isOpen={!!previewingCert}
          cert={previewingCert}
          onClose={() => setPreviewingCert(null)}
          onShareWhatsApp={(cert) => window.open(`https://wa.me/?text=${encodeURIComponent(`${cert.title} — ${cert.cloudinaryUrl}`)}`, '_blank')}
          onShareEmail={(cert) => window.open(`mailto:?subject=${encodeURIComponent(cert.title)}&body=${encodeURIComponent(cert.cloudinaryUrl)}`, '_blank')}
        />
      )}

      {showScan && (
        <QrScanModal
          isOpen={showScan}
          samples={samples}
          onClose={() => setShowScan(false)}
          onScanned={handleScanned}
        />
      )}
    </div>
  );
}