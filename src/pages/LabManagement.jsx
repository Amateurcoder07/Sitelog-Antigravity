import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import * as labService from '../services/labService';
import Button from '../components/Button';
import NewSampleModal from '../components/lab/NewSampleModal';
import RecordResultModal from '../components/lab/RecordResultModal';
import NewNcrModal from '../components/lab/NewNcrModal';
import NewEquipmentModal from '../components/lab/NewEquipmentModal';
import RecalibrateModal from '../components/lab/RecalibrateModal';
import UploadCertModal from '../components/lab/UploadCertModal';
import PdfPreviewShareModal from '../components/lab/PdfPreviewShareModal';
import ConcreteCubeRegister from '../components/lab/ConcreteCubeRegister';
import QrScanModal from '../components/lab/QrScanModal'; // adjust path if yours differs
import {
  FlaskConical,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Gauge,
  FileCheck,
  Plus,
  Search,
  Download,
  Building2,
  QrCode,
  Calendar,
  Camera,
  FileText,
  Share2,
  ExternalLink,
  Lock
} from 'lucide-react';

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const recordLabel = (sample) => (sample.canEdit ? 'Record Result' : 'View Readings');

function StatusBadge({ sample, compact }) {
  const size = compact ? 12 : 14;
  const base = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0';
  if (sample.status === 'Pass')
    return <span className={`${base} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}><CheckCircle2 size={size} /> Pass</span>;
  if (sample.status === 'Fail')
    return <span className={`${base} bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20`}><XCircle size={size} /> {compact ? 'Fail' : 'Fail (NCR)'}</span>;
  if (sample.status === 'Retest Required')
    return <span className={`${base} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20`}><XCircle size={size} /> Retest</span>;
  if (sample.status === 'Due Today')
    return <span className={`${base} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse`}><Clock size={size} /> {compact ? 'Due Today' : 'Testing Due'}</span>;
  return <span className={`${base} bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20`}><FlaskConical size={size} /> Curing</span>;
}

export default function LabManagement() {
  const { showToast } = useToast();
  const { projectId } = useParams();
  const hasRealProject = OBJECT_ID_RE.test(projectId || '');

  const [activeTab, setActiveTab] = useState('cube-register');
  const [cubePours, setCubePours] = useState([]);
  const [samples, setSamples] = useState([]);
  const [ncrs, setNcrs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [standards, setStandards] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [activeChip, setActiveChip] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isNcrModalOpen, setIsNcrModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [ncrPrefilledData, setNcrPrefilledData] = useState(null);
  const [selectedSampleForRecord, setSelectedSampleForRecord] = useState(null);
  const [selectedEquipForRecalibrate, setSelectedEquipForRecalibrate] = useState(null);
  const [isUploadCertModalOpen, setIsUploadCertModalOpen] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState(null);

  // Consultant-report upload (hidden input shared by all NCR cards)
  const consultantInputRef = useRef(null);
  const [ncrForReport, setNcrForReport] = useState(null);

  // Swipe tracking
  const [touchStartMap, setTouchStartMap] = useState({});
  const [swipeOffsetMap, setSwipeOffsetMap] = useState({});

  const [ncrViewTab, setNcrViewTab] = useState('open');

  const failToast = (err, fallback) => showToast(`⚠️ ${err?.response?.data?.msg || fallback}`);

  // ------------------------------------------------------------------ load
  useEffect(() => {
    if (!hasRealProject) {
      setIsLoading(false);
      return undefined;
    }
    let cancelled = false;
    setIsLoading(true);
    setLoadError('');

    Promise.all([
      labService.fetchLabData(projectId),
      labService.fetchStandards(),
      labService.fetchEngineers(projectId).catch(() => ({ engineers: [] }))
    ])
      .then(([lab, std, eng]) => {
        if (cancelled) return;
        setSamples(lab.samples);
        setNcrs(lab.ncrs);
        setEquipment(lab.equipment);
        setCertificates(lab.certificates);
        setCubePours(lab.cubePours);
        setStandards(std);
        setEngineers(eng.engineers || []);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.response?.data?.msg || 'Could not load lab management data.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [projectId, hasRealProject]);

  const summary = useMemo(() => {
    const passCount = samples.filter((s) => s.status === 'Pass').length;
    const testedCount = samples.filter((s) => ['Pass', 'Fail'].includes(s.status)).length;
    return {
      totalSamplesLogged: samples.length,
      passRatePercentage: testedCount ? +((passCount / testedCount) * 100).toFixed(1) : 0,
      pendingTestsCount: samples.filter((s) => ['Due Today', 'Curing', 'Retest Required'].includes(s.status)).length,
      openNcrsCount: ncrs.filter((n) => ['Open', 'Under Review'].includes(n.status)).length,
      categoryCount: new Set(samples.map((s) => s.materialCategory)).size
    };
  }, [samples, ncrs]);

  const assigneeNames = engineers.map((e) => (e.specialization ? `${e.name} (${e.specialization})` : e.name));

  // ------------------------------------------------------------ swipe
  const handleTouchStart = (id, e) => {
    const touchX = e.touches[0].clientX;
    setTouchStartMap((prev) => ({ ...prev, [id]: touchX }));
  };

  const handleTouchMove = (id, e) => {
    const startX = touchStartMap[id];
    if (!startX) return;
    const diff = e.touches[0].clientX - startX;
    const cappedDiff = Math.max(-110, Math.min(110, diff));
    setSwipeOffsetMap((prev) => ({ ...prev, [id]: cappedDiff }));
  };

  const handleTouchEnd = (sample, id) => {
    const offset = swipeOffsetMap[id] || 0;
    if (offset > 60) {
      setSelectedSampleForRecord(sample);
      showToast(sample.canEdit ? `Swipe Right: Record Result for ${sample.id}` : `Viewing readings for ${sample.id}`);
    } else if (offset < -60) {
      setIsNcrModalOpen(true);
      showToast(`Swipe Left: Issue NCR for ${sample.id}`);
    }
    setSwipeOffsetMap((prev) => ({ ...prev, [id]: 0 }));
    setTouchStartMap((prev) => ({ ...prev, [id]: 0 }));
  };

  // --------------------------------------------------------- samples
  const handleSaveSample = async (payload) => {
    try {
      const { sample } = await labService.createSample(projectId, payload);
      setSamples((prev) => [sample, ...prev]);
      showToast(`Test sample logged: ${sample.id}`);
      return sample;
    } catch (err) {
      failToast(err, 'Could not register the sample.');
      return null;
    }
  };

  const handleSaveResult = async (sample, payload) => {
    try {
      const { sample: updated } = await labService.recordResult(sample._id, payload);
      setSamples((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
      showToast(`Reading saved for ${updated.id} — ${updated.status}`);
      return updated;
    } catch (err) {
      failToast(err, 'Could not save the test result.');
      return null;
    }
  };

  const handleOpenNcrDraft = (draftData) => {
    setNcrPrefilledData(draftData);
    setIsNcrModalOpen(true);
  };

  // -------------------------------------------------------------- NCRs
  const handleSaveNcr = async (draft) => {
    const sample = samples.find((s) => s.id === draft.sampleId);
    if (!sample) {
      showToast('⚠️ Pick a related sample before raising an NCR.');
      return;
    }
    try {
      const photos = draft.evidencePhotos || [];
      const { ncr } = await labService.createNcr(
        projectId,
        {
          sample: sample._id,
          title: draft.title,
          severity: draft.severity,
          correctiveAction: draft.correctiveAction,
          assignedTo: draft.assignedTo,
          gpsWatermarks: photos.map((p) => p.gpsWatermark)
        },
        photos.map((p) => p.file)
      );
      setNcrs((prev) => [ncr, ...prev]);
      showToast(`Quality NCR issued: ${ncr.id}`);
    } catch (err) {
      failToast(err, 'Could not raise the NCR.');
    }
  };

  const replaceNcr = (ncr) => setNcrs((prev) => prev.map((n) => (n._id === ncr._id ? ncr : n)));

  const handleUpdateNcrStatus = async (ncr, newStatus) => {
    try {
      const { ncr: updated } = await labService.updateNcrStatus(ncr._id, newStatus);
      replaceNcr(updated);
      showToast(`NCR ${ncr.id} status updated to: ${newStatus}`);
    } catch (err) {
      failToast(err, 'Could not update the NCR status.');
    }
  };

  const handleCloseNcr = async (ncr) => {
    try {
      const { ncr: updated } = await labService.updateNcrStatus(ncr._id, 'Closed');
      replaceNcr(updated);
      showToast(`NCR ${ncr.id} closed successfully ✓`);
    } catch (err) {
      failToast(err, 'Could not close the NCR.');
    }
  };

  const pickConsultantReport = (ncr) => {
    setNcrForReport(ncr);
    consultantInputRef.current?.click();
  };

  const handleConsultantFile = async (e) => {
    const file = e.target.files?.[0];
    const ncr = ncrForReport;
    e.target.value = '';
    if (!file || !ncr) return;
    try {
      const { ncr: updated } = await labService.uploadConsultantReport(ncr._id, file);
      replaceNcr(updated);
      showToast(`Attached consultant report to ${ncr.id}`);
    } catch (err) {
      failToast(err, 'Could not upload the consultant report.');
    } finally {
      setNcrForReport(null);
    }
  };

  // --------------------------------------------------------- equipment
  const handleSaveEquipment = async (newEquip) => {
    try {
      const { equipment: created } = await labService.createEquipment(projectId, {
        name: newEquip.name,
        model: newEquip.model,
        serialNo: newEquip.serialNo,
        location: newEquip.location,
        lastCalibrationDate: newEquip.lastCalibrationDate,
        nextCalibrationDue: newEquip.nextCalibrationDue
      });
      setEquipment((prev) => [created, ...prev]);
      showToast(`Lab equipment registered: ${created.name}`);
    } catch (err) {
      failToast(err, 'Could not register the equipment.');
    }
  };

  const handleSaveRecalibration = async (updatedEquip) => {
    try {
      const { equipment: saved } = await labService.recalibrateEquipment(
        updatedEquip._id,
        updatedEquip.nextCalibrationDue,
        updatedEquip.photoFile
      );
      setEquipment((prev) => prev.map((eq) => (eq._id === saved._id ? saved : eq)));
      showToast(`Equipment ${saved.name} recalibrated & activated ✓`);
    } catch (err) {
      failToast(err, 'Could not update the calibration.');
    }
  };

  // ------------------------------------------------------ certificates
  const handleSaveNewCert = async (newCert) => {
    const sample = samples.find((s) => s.id === newCert.sampleId);
    if (!sample) {
      showToast('⚠️ Link the certificate to a registered sample.');
      return;
    }
    if (!newCert.file) {
      showToast('⚠️ Choose the certificate PDF or scan to upload.');
      return;
    }
    try {
      const { certificate } = await labService.uploadCertificate(
        projectId,
        {
          sample: sample._id,
          title: newCert.title,
          nablLabName: newCert.nablLabName,
          approvalStatus: newCert.approvalStatus
        },
        newCert.file
      );
      setCertificates((prev) => [certificate, ...prev]);
      showToast(`NABL Certificate uploaded: ${certificate.title}`);
    } catch (err) {
      failToast(err, 'Could not upload the certificate.');
    }
  };

  const handleShare = async (cert, channel) => {
    try {
      const { shareUrl } = await labService.shareCertificate(cert._id, channel);
      if (channel === 'whatsapp') window.open(shareUrl, '_blank', 'noopener');
      else window.location.href = shareUrl;
      showToast(channel === 'whatsapp' ? `Opened WhatsApp share for ${cert.title}` : `Opened email draft for ${cert.id}`);
    } catch (err) {
      failToast(err, 'Could not prepare the share link.');
    }
  };

  const handleExport = async () => {
    try {
      showToast('Preparing QC register export...');
      await labService.downloadRegister(projectId, activeTab === 'cube-register' ? 'cubes' : 'samples');
    } catch (err) {
      failToast(err, 'Could not export the register.');
    }
  };

  // ------------------------------------------------------ cube register
  const handleCreatePour = async (payload) => {
    try {
      const { pour } = await labService.createCubePour(projectId, payload);
      setCubePours((prev) => [pour, ...prev]);
      showToast(`Concrete pour entry logged: ${pour.id} (Set of 3 Cubes)`);
      return pour;
    } catch (err) {
      failToast(err, 'Could not register the concrete pour.');
      return null;
    }
  };

  const handlePersistReadings = async (pour, period) => {
    try {
      const { pour: saved } = await labService.saveCubeReadings(pour._id, {
        period,
        cubes: pour.cubes.map((c) => ({
          weight: c.weight,
          crushingLoad: c[period]?.crushingLoad || 0,
          testingDate: c[period]?.testingDate || undefined
        }))
      });
      // Only take the sign-off state from the server so keystrokes typed during the request are never overwritten
      setCubePours((prev) =>
        prev.map((p) => (p._id === saved._id ? { ...p, digitallyVerifiedBy: saved.digitallyVerifiedBy } : p))
      );
    } catch (err) {
      failToast(err, 'Could not save the cube readings.');
    }
  };

  const handlePersistDetails = async (pour) => {
    try {
      await labService.saveCubePourDetails(pour._id, {
        remarks: pour.remarks || '',
        deviationReason7Day: pour.deviationReason7Day || '',
        deviationReason28Day: pour.deviationReason28Day || ''
      });
    } catch (err) {
      failToast(err, 'Could not save the pour details.');
    }
  };

  const handleVerifyPour = async (pour) => {
    try {
      const { pour: saved } = await labService.verifyCubePour(pour._id);
      setCubePours((prev) =>
        prev.map((p) => (p._id === saved._id ? { ...p, digitallyVerifiedBy: saved.digitallyVerifiedBy } : p))
      );
      showToast(`Digitally verified & stamped pour ${pour.id} ✓`);
    } catch (err) {
      failToast(err, 'Could not verify the pour.');
    }
  };

  // ------------------------------------------------ filtered samples
  const filteredSamples = samples.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (s.id || '').toLowerCase().includes(q) ||
      (s.sampleName || '').toLowerCase().includes(q) ||
      (s.structureLocation || '').toLowerCase().includes(q) ||
      (s.gradeBadge || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (activeChip === 'All') return true;
    if (activeChip === 'Due Today') return s.status === 'Due Today';
    if (activeChip === 'Concrete') return s.materialCategory === 'Concrete';
    if (activeChip === 'Steel') return s.materialCategory === 'Steel';
    if (activeChip === 'Aggregates') return s.materialCategory === 'Aggregate';
    if (activeChip === 'Failed / NCR') return s.status === 'Fail' || s.status === 'Retest Required';
    return true;
  });

  const openNcrList = ncrs.filter((n) => n.status !== 'Resolved' && n.status !== 'Closed');
  const resolvedNcrList = ncrs.filter((n) => n.status === 'Resolved' || n.status === 'Closed');

  // ------------------------------------------------------------ gates
  if (!hasRealProject) {
    return (
      <div className="text-center py-16 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
        <FlaskConical className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
        <p className="text-sm text-black/50 dark:text-white/50 max-w-md mx-auto">
          Lab Management saves to the server, so it needs a real project. Create or join one from the Dashboard (demo projects are not stored).
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-16 border border-dashed border-red-500/30 rounded-xl">
        <ShieldAlert className="mx-auto text-red-500/60 mb-3" size={32} />
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-black dark:text-white">Lab Management</h1>
          <p className="text-xs md:text-sm text-black/50 dark:text-white/50">
            Material testing, NCRs, equipment calibration and NABL reports
          </p>
        </div>

        <div className="hidden md:flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={handleExport} className="!text-xs gap-2 min-h-[44px]">
            <Download size={14} />
            Export QC Report
          </Button>
          <Button variant="secondary" onClick={() => setIsNcrModalOpen(true)} className="!text-xs gap-2 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 min-h-[44px]">
            <ShieldAlert size={14} />
            Issue NCR
          </Button>
          <Button variant="primary" onClick={() => setIsSampleModalOpen(true)} className="!text-xs gap-2 min-h-[44px]">
            <Plus size={14} />
            Log Test Sample
          </Button>
        </div>
      </div>

      {/* Metric Summary Ribbon */}
      <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto snap-x scrollbar-none pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Total Samples Logged</span>
            <FlaskConical size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-black text-black dark:text-white">{isLoading ? '...' : summary.totalSamplesLogged}</p>
          <p className="text-[11px] font-medium text-black/40 dark:text-white/40 mt-1">
            Across {summary.categoryCount} material categor{summary.categoryCount === 1 ? 'y' : 'ies'}
          </p>
        </div>

        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Pass Rate</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{isLoading ? '...' : `${summary.passRatePercentage}%`}</p>
          <p className="text-[11px] font-medium text-emerald-600/70 dark:text-emerald-400/70 mt-1">Of tested samples</p>
        </div>

        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Pending Strength Tests</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{isLoading ? '...' : summary.pendingTestsCount}</p>
          <p className="text-[11px] font-medium text-amber-600/70 dark:text-amber-400/70 mt-1">Awaiting a recorded result</p>
        </div>

        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Open Quality NCRs</span>
            <ShieldAlert size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">{isLoading ? '...' : summary.openNcrsCount}</p>
          <p className="text-[11px] font-medium text-red-600/70 dark:text-red-400/70 mt-1">Action required</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto">
        {[
          ['cube-register', Layers, 'Cube Test Register (Set of 3)', 'bg-orange-600 text-white shadow-md'],
          ['samples', FlaskConical, `General Test Register (${samples.length})`, 'bg-black dark:bg-white text-white dark:text-black shadow-md'],
          ['ncrs', ShieldAlert, `Quality NCRs (${ncrs.length})`, 'bg-black dark:bg-white text-white dark:text-black shadow-md'],
          ['equipment', Gauge, `Lab Equipment (${equipment.length})`, 'bg-black dark:bg-white text-white dark:text-black shadow-md'],
          ['certificates', FileCheck, `NABL Reports (${certificates.length})`, 'bg-black dark:bg-white text-white dark:text-black shadow-md']
        ].map(([key, Icon, label, activeCls]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === key ? activeCls : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* TAB 0: CONCRETE CUBE TEST REGISTER */}
      {activeTab === 'cube-register' && (
        <ConcreteCubeRegister
          pours={cubePours}
          onUpdatePours={setCubePours}
          onCreatePour={handleCreatePour}
          onPersistReadings={handlePersistReadings}
          onPersistDetails={handlePersistDetails}
          onVerifyPour={handleVerifyPour}
          showToast={showToast}
        />
      )}

      {/* TAB 1: GENERAL TEST REGISTER & RESULTS */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <div className="space-y-3 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
              <input
                type="text"
                placeholder="Search Sample ID, Grade, Location, or Test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs md:text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Due Today', 'Concrete', 'Steel', 'Aggregates', 'Failed / NCR'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer border ${
                    activeChip === chip
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md scale-105'
                      : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                  }`}
                >
                  {chip === 'Due Today' && '⏰ '}
                  {chip === 'Failed / NCR' && '⚠️ '}
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {!isLoading && filteredSamples.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#0a0f1d] border border-dashed border-black/15 dark:border-white/15 rounded-2xl text-xs text-black/50 dark:text-white/50">
              {samples.length === 0 ? 'No samples registered yet. Use "Log Test Sample" to add the first one.' : 'No samples match this search or filter.'}
            </div>
          )}

          {/* DESKTOP VIEW */}
          {filteredSamples.length > 0 && (
            <div className="hidden md:block bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Sample ID & Grade</th>
                    <th className="py-3.5 px-4">Specimen & Location</th>
                    <th className="py-3.5 px-4">Age / Due Status</th>
                    <th className="py-3.5 px-4">Target vs Achieved</th>
                    <th className="py-3.5 px-4">QC Result Tag</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs font-medium text-black dark:text-white">
                  {filteredSamples.map((sample) => (
                    <tr key={sample._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-extrabold text-black dark:text-white text-sm">{sample.id}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                          {sample.gradeBadge}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-black dark:text-white">{sample.sampleName}</p>
                        <p className="text-black/50 dark:text-white/50 text-[11px] flex items-center gap-1 mt-0.5">
                          <Building2 size={12} />
                          {sample.structureLocation}
                        </p>
                        <p className="text-black/40 dark:text-white/40 text-[10px] mt-0.5">Registered by {sample.registeredBy || '—'}</p>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                          <Calendar size={12} /> {sample.ageStatus}
                        </span>
                        {sample.testingDueDate && <p className="text-black/40 dark:text-white/40 text-[10px] mt-1">Due: {sample.testingDueDate}</p>}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-black/50 dark:text-white/50 text-[11px]">Target: {sample.targetStrength}</span>
                          <span className="text-black/30 dark:text-white/30">|</span>
                          <span className="font-black text-black dark:text-white text-sm">{sample.achievedStrength}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4"><StatusBadge sample={sample} /></td>

                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedSampleForRecord(sample)}
                          className="!text-[11px] !py-1.5 !px-3 gap-1"
                        >
                          {!sample.canEdit && <Lock size={11} />}
                          {recordLabel(sample)}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MOBILE CARDS */}
          {filteredSamples.length > 0 && (
            <div className="md:hidden space-y-3.5">
              <div className="flex items-center justify-between text-[11px] text-black/50 dark:text-white/50 px-1 font-semibold">
                <span className="flex items-center gap-1">👉 Swipe Right: Record Result</span>
                <span className="flex items-center gap-1">Swipe Left: NCR 👈</span>
              </div>

              {filteredSamples.map((sample) => {
                const offset = swipeOffsetMap[sample._id] || 0;
                return (
                  <div
                    key={sample._id}
                    className="relative overflow-hidden rounded-2xl touch-pan-y"
                    onTouchStart={(e) => handleTouchStart(sample._id, e)}
                    onTouchMove={(e) => handleTouchMove(sample._id, e)}
                    onTouchEnd={() => handleTouchEnd(sample, sample._id)}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-5 font-bold text-xs rounded-2xl pointer-events-none">
                      <div className={`flex items-center gap-2 text-emerald-500 ${offset > 20 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                        <CheckCircle2 size={20} /> {recordLabel(sample)}
                      </div>
                      <div className={`flex items-center gap-2 text-red-500 ${offset < -20 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                        Issue Quality NCR <ShieldAlert size={20} />
                      </div>
                    </div>

                    <div
                      style={{ transform: `translateX(${offset}px)` }}
                      className="relative bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 p-4 rounded-2xl space-y-3.5 shadow-sm transition-transform duration-100 ease-out"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-black dark:text-white tracking-tight">{sample.id}</h3>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                              {sample.gradeBadge}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-black/80 dark:text-white/80 mt-1">{sample.sampleName}</p>
                          <p className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">Registered by {sample.registeredBy || '—'}</p>
                        </div>
                        <StatusBadge sample={sample} compact />
                      </div>

                      <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60 pt-1">
                        <div className="flex items-center gap-1 font-semibold text-black/70 dark:text-white/70">
                          <Building2 size={14} className="text-orange-500" />
                          {sample.structureLocation}
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                          {sample.ageStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
                        <div>
                          <span className="text-[10px] font-semibold text-black/40 dark:text-white/40 block">Target Spec</span>
                          <span className="font-bold text-black dark:text-white">{sample.targetStrength}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-black/40 dark:text-white/40 block">Achieved Value</span>
                          <span className="font-black text-black dark:text-white text-sm">{sample.achievedStrength}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={() => setSelectedSampleForRecord(sample)}
                          className="w-full min-h-[48px] py-3 px-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {sample.canEdit ? <CheckCircle2 size={16} /> : <Lock size={14} />} {recordLabel(sample)}
                        </button>

                        <button
                          onClick={() => setIsNcrModalOpen(true)}
                          className="w-full min-h-[48px] py-3 px-3 bg-transparent text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/10 font-bold text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldAlert size={16} /> Issue NCR
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUALITY NCRs */}
      {activeTab === 'ncrs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-3.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNcrViewTab('open')}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ncrViewTab === 'open'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                }`}
              >
                ⚠️ Open NCRs ({openNcrList.length})
              </button>

              <button
                onClick={() => setNcrViewTab('resolved')}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ncrViewTab === 'resolved'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                }`}
              >
                ✓ Resolved / Closed ({resolvedNcrList.length})
              </button>
            </div>

            <Button variant="secondary" onClick={() => setIsNcrModalOpen(true)} className="!text-xs gap-1.5 min-h-[44px] border-red-500/30 text-red-600 dark:text-red-400">
              <Plus size={14} /> New NCR
            </Button>
          </div>

          <input ref={consultantInputRef} type="file" accept="application/pdf,image/*" onChange={handleConsultantFile} className="hidden" />

          {!isLoading && (ncrViewTab === 'open' ? openNcrList : resolvedNcrList).length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#0a0f1d] border border-dashed border-black/15 dark:border-white/15 rounded-2xl text-xs text-black/50 dark:text-white/50">
              {ncrViewTab === 'open' ? 'No open non-conformances.' : 'No resolved or closed NCRs yet.'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(ncrViewTab === 'open' ? openNcrList : resolvedNcrList).map((ncr) => (
              <div
                key={ncr._id}
                className={`bg-white dark:bg-[#0a0f1d] border p-5 rounded-3xl space-y-4 shadow-sm ${
                  ncr.severity === 'High'
                    ? 'border-red-500/40 shadow-red-500/5'
                    : ncr.severity === 'Medium'
                    ? 'border-amber-500/40'
                    : 'border-blue-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-3 py-1 rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white font-mono">{ncr.id}</span>
                    <span className="text-[11px] font-bold text-black/50 dark:text-white/50">{ncr.dateReported}</span>
                  </div>

                  {ncr.severity === 'High' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">High Severity</span>
                  )}
                  {ncr.severity === 'Medium' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Medium Severity</span>
                  )}
                  {ncr.severity === 'Low' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Low Severity</span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm md:text-base text-black dark:text-white leading-snug">{ncr.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-black/60 dark:text-white/60 mt-1.5 font-medium">
                    <span>Ref Sample: <strong className="font-mono text-black dark:text-white">{ncr.sampleId}</strong></span>
                    {ncr.structureLocation && (
                      <>
                        <span>•</span>
                        <span>Location: <strong className="text-black dark:text-white">{ncr.structureLocation}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">Root Cause & Corrective Action Plan:</p>
                  <p className="text-xs font-medium text-black/80 dark:text-white/80 leading-relaxed">{ncr.correctiveAction}</p>
                </div>

                {ncr.evidencePhotos && ncr.evidencePhotos.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase">Evidence Photos:</span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {ncr.evidencePhotos.map((img) => (
                        <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="relative w-20 h-14 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 flex-shrink-0 bg-black">
                          <img src={img.url} alt="Evidence" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {ncr.consultantReports && ncr.consultantReports.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase">Consultant Reports:</span>
                    <div className="flex flex-col gap-1">
                      {ncr.consultantReports.map((r) => (
                        <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1.5 truncate">
                          <FileText size={13} className="shrink-0" /> {r.name || 'Report'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-black/70 dark:text-white/70">
                    <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[10px]">
                      {ncr.assignedTo?.[0] || 'E'}
                    </span>
                    <span className="font-bold text-black dark:text-white">{ncr.assignedTo}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ncr.status === 'Closed' || ncr.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {ncr.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => handleUpdateNcrStatus(ncr, ncr.status === 'Open' ? 'Under Review' : 'Resolved')}
                    className="py-2 px-2 text-[11px] font-bold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all cursor-pointer text-center min-h-[40px]"
                  >
                    Update Status
                  </button>

                  <button
                    onClick={() => pickConsultantReport(ncr)}
                    className="py-2 px-2 text-[11px] font-bold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all cursor-pointer text-center min-h-[40px]"
                  >
                    + Consultant Report
                  </button>

                  <button
                    onClick={() => handleCloseNcr(ncr)}
                    className="py-2 px-2 text-[11px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer text-center min-h-[40px]"
                  >
                    Close NCR ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LAB EQUIPMENT & CALIBRATION */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-3.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-3.5 py-2.5 min-h-[44px] text-xs font-bold rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode size={16} /> Scan Equipment QR / Tag
              </button>
            </div>

            <Button variant="secondary" onClick={() => setIsEquipmentModalOpen(true)} className="!text-xs gap-1.5 min-h-[44px]">
              <Plus size={14} /> Register Apparatus
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map((eq) => (
              <div key={eq._id} className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <Gauge size={22} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm md:text-base text-black dark:text-white leading-snug">{eq.name}</h3>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">{eq.model} · S/N: <strong className="font-mono text-black dark:text-white">{eq.serialNo}</strong></p>
                    </div>
                  </div>

                  {(eq.status === 'Calibrated' || eq.status === 'Active') && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">Active ✓</span>
                  )}
                  {eq.status === 'Due Soon' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0 animate-pulse">
                      Due Soon (&lt;15d) ⏰
                    </span>
                  )}
                  {eq.status === 'Overdue' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-shrink-0">Expired ✕</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-black/5 dark:border-white/5">
                  <div>
                    <span className="text-black/40 dark:text-white/40 block text-[10px] font-bold uppercase">Last Calibrated</span>
                    <span className="font-bold text-black dark:text-white">{eq.lastCalibrationDate}</span>
                  </div>
                  <div>
                    <span className="text-black/40 dark:text-white/40 block text-[10px] font-bold uppercase">Next Expiry Due</span>
                    <span className="font-extrabold text-black dark:text-white">{eq.nextCalibrationDue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60 pt-1">
                  <span>Location: <strong className="text-black dark:text-white font-bold">{eq.location}</strong></span>

                  <Button
                    variant="primary"
                    onClick={() => setSelectedEquipForRecalibrate(eq)}
                    className="!text-[11px] !py-2 !px-3 gap-1.5 min-h-[40px]"
                  >
                    <Camera size={14} /> Quick Recalibrate
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {!isLoading && equipment.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#0a0f1d] border border-dashed border-black/15 dark:border-white/15 rounded-2xl text-xs text-black/50 dark:text-white/50">
              No lab equipment registered yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NABL CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-3.5 rounded-2xl shadow-sm">
            <h2 className="text-xs md:text-sm font-bold text-black/80 dark:text-white/80">NABL Accredited Test Reports Repository</h2>
            <Button variant="primary" onClick={() => setIsUploadCertModalOpen(true)} className="!text-xs gap-1.5 min-h-[44px]">
              <Plus size={14} /> Upload NABL Certificate
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert._id} className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0">
                      <FileCheck size={26} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm md:text-base text-black dark:text-white leading-snug">{cert.title}</h3>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">{cert.nablLabName}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-black/50 dark:text-white/50 mt-1 font-semibold">
                        <span>Issued: {cert.issueDate}</span>
                        <span>•</span>
                        <span>Sample: <strong className="font-mono text-black dark:text-white">{cert.sampleId}</strong></span>
                      </div>
                    </div>
                  </div>

                  {cert.approvalStatus === 'Approved' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">Approved ✓</span>
                  )}
                  {cert.approvalStatus === 'Under Review' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">Under Review ⏳</span>
                  )}
                  {cert.approvalStatus === 'Rejected' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-shrink-0">Rejected ✕</span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={() => setSelectedCertForPreview(cert)}
                    className="py-2.5 px-2 text-xs font-bold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <FileText size={14} /> View PDF
                  </button>

                  <button
                    onClick={() => handleShare(cert, 'whatsapp')}
                    className="py-2.5 px-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <Share2 size={14} /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleShare(cert, 'email')}
                    className="py-2.5 px-2 text-xs font-bold rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <ExternalLink size={14} /> Email
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!isLoading && certificates.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-[#0a0f1d] border border-dashed border-black/15 dark:border-white/15 rounded-2xl text-xs text-black/50 dark:text-white/50">
              No NABL certificates uploaded yet.
            </div>
          )}
        </div>
      )}

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-lg border-t border-black/10 dark:border-white/10 p-3 px-4 shadow-2xl flex items-center gap-3">
        <button
          onClick={() => setIsQrModalOpen(true)}
          className="min-h-[48px] px-4 py-3 bg-black/10 dark:bg-white/10 text-black dark:text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all border border-black/10 dark:border-white/10"
        >
          <QrCode size={18} className="text-orange-500" />
          <span className="whitespace-nowrap">Scan ID / QR</span>
        </button>

        <button
          onClick={() => setIsSampleModalOpen(true)}
          className="flex-1 min-h-[48px] px-4 py-3 bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span className="whitespace-nowrap">Log Sample</span>
        </button>

        <button
          onClick={() => setIsNcrModalOpen(true)}
          aria-label="Issue NCR"
          className="min-h-[48px] px-4 py-3 bg-transparent text-red-600 dark:text-red-400 border border-red-500/30 font-extrabold text-xs rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all"
        >
          <ShieldAlert size={18} />
        </button>
      </div>

      {/* Modals */}
      <NewSampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSave={handleSaveSample}
        standards={standards}
      />

      <NewNcrModal
        isOpen={isNcrModalOpen}
        onClose={() => {
          setIsNcrModalOpen(false);
          setNcrPrefilledData(null);
        }}
        onSave={handleSaveNcr}
        samples={samples}
        prefilledData={ncrPrefilledData}
        assignees={assigneeNames}
      />

      <NewEquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onSave={handleSaveEquipment}
      />

      <QrScanModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onScanned={(scanned) => {
          const match = samples.find((s) => s.id === scanned.id);
          if (match) setSelectedSampleForRecord(match);
          else showToast(`⚠️ No sample with ID ${scanned.id} in this project.`);
        }}
      />

      <RecordResultModal
        key={selectedSampleForRecord?._id || 'no-sample'}
        isOpen={!!selectedSampleForRecord}
        onClose={() => setSelectedSampleForRecord(null)}
        sample={selectedSampleForRecord}
        standards={standards}
        onSave={handleSaveResult}
        onOpenNcr={handleOpenNcrDraft}
      />

      <RecalibrateModal
        isOpen={!!selectedEquipForRecalibrate}
        onClose={() => setSelectedEquipForRecalibrate(null)}
        equipment={selectedEquipForRecalibrate}
        onSave={handleSaveRecalibration}
      />

      <UploadCertModal
        isOpen={isUploadCertModalOpen}
        onClose={() => setIsUploadCertModalOpen(false)}
        onSave={handleSaveNewCert}
        samples={samples}
      />

      <PdfPreviewShareModal
        isOpen={!!selectedCertForPreview}
        onClose={() => setSelectedCertForPreview(null)}
        cert={selectedCertForPreview}
        onShareWhatsApp={(cert) => handleShare(cert, 'whatsapp')}
        onShareEmail={(cert) => handleShare(cert, 'email')}
      />
    </div>
  );
}