import React, { useState, useEffect, useRef } from 'react';
import { fetchLabData } from '../data/mockLabData';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import NewSampleModal from '../components/lab/NewSampleModal';
import NewNcrModal from '../components/lab/NewNcrModal';
import NewEquipmentModal from '../components/lab/NewEquipmentModal';
import QrScanModal from '../components/lab/QrScanModal';
import RecordResultModal from '../components/lab/RecordResultModal';
import RecalibrateModal from '../components/lab/RecalibrateModal';
import UploadCertModal from '../components/lab/UploadCertModal';
import PdfPreviewShareModal from '../components/lab/PdfPreviewShareModal';
import ConcreteCubeRegister from '../components/lab/ConcreteCubeRegister';
import { INITIAL_CUBE_POURS } from '../data/mockCubeRegisterData';
import {
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
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Camera,
  FileText,
  Share2,
  ExternalLink
} from 'lucide-react';

export default function LabManagement() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('cube-register'); // 'cube-register' | 'samples' | 'ncrs' | 'equipment' | 'certificates'
  const [cubePours, setCubePours] = useState(INITIAL_CUBE_POURS);
  const [samples, setSamples] = useState([]);
  const [ncrs, setNcrs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [summary, setSummary] = useState({
    totalSamplesLogged: 52,
    passRatePercentage: 94.2,
    pendingTestsCount: 3,
    openNcrsCount: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  // Quick Filter Chips State: 'All' | 'Due Today' | 'Concrete' | 'Steel' | 'Aggregates' | 'Failed / NCR'
  const [activeChip, setActiveChip] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals Visibility
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isNcrModalOpen, setIsNcrModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [ncrPrefilledData, setNcrPrefilledData] = useState(null);
  const [selectedSampleForRecord, setSelectedSampleForRecord] = useState(null);

  // New Equipment & Certificate Modals State
  const [selectedEquipForRecalibrate, setSelectedEquipForRecalibrate] = useState(null);
  const [isUploadCertModalOpen, setIsUploadCertModalOpen] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState(null);

  // Touch Swipe State Tracking
  const [touchStartMap, setTouchStartMap] = useState({});
  const [swipeOffsetMap, setSwipeOffsetMap] = useState({});

  // Handler: Touch Swipe Start
  const handleTouchStart = (id, e) => {
    const touchX = e.touches[0].clientX;
    setTouchStartMap((prev) => ({ ...prev, [id]: touchX }));
  };

  // Handler: Touch Swipe Move
  const handleTouchMove = (id, e) => {
    const startX = touchStartMap[id];
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const cappedDiff = Math.max(-110, Math.min(110, diff));
    setSwipeOffsetMap((prev) => ({ ...prev, [id]: cappedDiff }));
  };

  // Handler: Touch Swipe End
  const handleTouchEnd = (sample, id) => {
    const offset = swipeOffsetMap[id] || 0;
    if (offset > 60) {
      setSelectedSampleForRecord(sample);
      showToast(`Swipe Right: Record Result for ${sample.id}`);
    } else if (offset < -60) {
      setIsNcrModalOpen(true);
      showToast(`Swipe Left: Issue NCR for ${sample.id}`);
    }
    setSwipeOffsetMap((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleOpenNcrDraft = (draftData) => {
    setNcrPrefilledData(draftData);
    setIsNcrModalOpen(true);
  };

  // NCR Sub-Tab View State: 'open' | 'resolved'
  const [ncrViewTab, setNcrViewTab] = useState('open');

  const handleUpdateNcrStatus = (id, newStatus) => {
    setNcrs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
    );
    showToast(`NCR ${id} status updated to: ${newStatus}`);
  };

  const handleUploadConsultantReport = (id) => {
    showToast(`Attached structural consultant approval report to ${id}`);
  };

  const handleCloseNcr = (id) => {
    setNcrs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'Resolved' } : n))
    );
    showToast(`NCR ${id} closed & resolved successfully ✓`);
  };

  const handleSaveRecalibration = (updatedEquip) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === updatedEquip.id ? updatedEquip : eq))
    );
    showToast(`Equipment ${updatedEquip.name} recalibrated & activated ✓`);
  };

  const handleSaveNewCert = (newCert) => {
    setCertificates((prev) => [newCert, ...prev]);
    showToast(`NABL Certificate uploaded: ${newCert.title}`);
  };

  const handleShareWhatsApp = (cert) => {
    showToast(`Generated WhatsApp share link for ${cert.title}`);
  };

  const handleShareEmail = (cert) => {
    showToast(`Sent PDF certificate ${cert.id} via email`);
  };

  useEffect(() => {
    fetchLabData().then((data) => {
      setSamples(data.samples);
      setNcrs(data.ncrs);
      setEquipment(data.equipment);
      setCertificates(data.certificates);
      setSummary(data.summary);
      setIsLoading(false);
    });
  }, []);

  // Handler: Add New Sample
  const handleSaveSample = (newSample) => {
    setSamples((prev) => [newSample, ...prev]);
    showToast(`Test sample logged: ${newSample.id}`);
  };

  // Handler: Update Sample Result
  const handleSaveResult = (updatedSample) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    showToast(`Test result saved for ${updatedSample.id}`);
  };

  // Handler: Add New NCR
  const handleSaveNcr = (newNcr) => {
    setNcrs((prev) => [newNcr, ...prev]);
    showToast(`Quality NCR issued: ${newNcr.id}`);
  };

  // Handler: Add New Equipment
  const handleSaveEquipment = (newEquip) => {
    setEquipment((prev) => [newEquip, ...prev]);
    showToast(`Lab equipment registered: ${newEquip.name}`);
  };

  // Filtered Samples Logic with Pill Chips
  const filteredSamples = samples.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.structureLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.gradeBadge.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeChip === 'All') return true;
    if (activeChip === 'Due Today') return s.status === 'Due Today' || s.ageStatus === 'Day 7 Due Today';
    if (activeChip === 'Concrete') return s.materialCategory === 'Concrete';
    if (activeChip === 'Steel') return s.materialCategory === 'Steel';
    if (activeChip === 'Aggregates') return s.materialCategory === 'Soil & Aggregate';
    if (activeChip === 'Failed / NCR') return s.status === 'Fail' || s.ageStatus === 'Failed / NCR';

    return true;
  });

  return (
    <div className="space-y-6 pb-28 md:pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 md:p-6 rounded-2xl shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0">
            <FlaskConical size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-black dark:text-white tracking-tight">
                Lab Management & Quality Control
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                PWA Ready
              </span>
            </div>
            <p className="text-xs md:text-sm text-black/60 dark:text-white/60 mt-1 max-w-2xl">
              Track site specimen strength tests, cube 7-day/28-day ratios, NCR logs & equipment calibration.
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={() => showToast('Generating QC Summary PDF...')} className="!text-xs gap-2 min-h-[44px]">
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

      {/* 1. VIEWPORT ADAPTATION: Metric Summary Ribbon (Mobile Scrollable vs Desktop Grid) */}
      <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto snap-x scrollbar-none pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Total Samples Logged</span>
            <FlaskConical size={16} className="text-orange-500" />
          </div>
          <p className="text-2xl font-black text-black dark:text-white">
            {isLoading ? '...' : summary.totalSamplesLogged}
          </p>
          <p className="text-[11px] font-medium text-black/40 dark:text-white/40 mt-1">Across 5 material grades</p>
        </div>

        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">QC Pass Rate</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {isLoading ? '...' : `${summary.passRatePercentage}%`}
          </p>
          <p className="text-[11px] font-medium text-emerald-600/70 dark:text-emerald-400/70 mt-1">Target IS compliance met</p>
        </div>

        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Pending Strength Tests</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {isLoading ? '...' : summary.pendingTestsCount}
          </p>
          <p className="text-[11px] font-medium text-amber-600/70 dark:text-amber-400/70 mt-1">Due within next 7 days</p>
        </div>

        <div className="snap-start flex-shrink-0 w-64 md:w-auto bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-xs font-semibold">Open Quality NCRs</span>
            <ShieldAlert size={16} className="text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">
            {isLoading ? '...' : summary.openNcrsCount}
          </p>
          <p className="text-[11px] font-medium text-red-600/70 dark:text-red-400/70 mt-1">Action required</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('cube-register')}
          className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'cube-register'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          <Layers size={16} />
          Cube Test Register (Set of 3)
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'samples'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          <FlaskConical size={16} />
          General Test Register ({samples.length})
        </button>

        <button
          onClick={() => setActiveTab('ncrs')}
          className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ncrs'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          <ShieldAlert size={16} />
          Quality NCRs ({ncrs.length})
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'equipment'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          <Gauge size={16} />
          Lab Equipment ({equipment.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'certificates'
              ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
          }`}
        >
          <FileCheck size={16} />
          NABL Reports ({certificates.length})
        </button>
      </div>

      {/* TAB 0: CONCRETE CUBE TEST REGISTER (SET OF 3) */}
      {activeTab === 'cube-register' && (
        <ConcreteCubeRegister
          pours={cubePours}
          onUpdatePours={setCubePours}
          showToast={showToast}
        />
      )}

      {/* TAB 1: GENERAL TEST REGISTER & RESULTS */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          {/* 3. QUICK FILTER HORIZONTAL PILL CHIPS */}
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

            {/* Pill Chips Bar */}
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

          {/* DESKTOP VIEW (>768px): Executive Data Table */}
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
                  <tr key={sample.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
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
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                        <Calendar size={12} /> {sample.ageStatus}
                      </span>
                      <p className="text-black/40 dark:text-white/40 text-[10px] mt-1">Due: {sample.testingDueDate}</p>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-black/50 dark:text-white/50 text-[11px]">Target: {sample.targetStrength}</span>
                        <span className="text-black/30 dark:text-white/30">|</span>
                        <span className="font-black text-black dark:text-white text-sm">{sample.achievedStrength}</span>
                      </div>
                    </td>

                    {/* Prominent Color-coded Status Tags */}
                    <td className="py-4 px-4">
                      {sample.status === 'Pass' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={14} /> Pass
                        </span>
                      )}
                      {sample.status === 'Fail' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          <XCircle size={14} /> Fail (NCR)
                        </span>
                      )}
                      {sample.status === 'Due Today' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                          <Clock size={14} /> Testing Due
                        </span>
                      )}
                      {sample.status === 'Curing' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <FlaskConical size={14} /> Curing
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedSampleForRecord(sample)}
                        className="!text-[11px] !py-1.5 !px-3 gap-1"
                      >
                        Record Result
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. MOBILE CARD DESIGN (<=768px): Vertical List with Swipe Gestures */}
          <div className="md:hidden space-y-3.5">
            <div className="flex items-center justify-between text-[11px] text-black/50 dark:text-white/50 px-1 font-semibold">
              <span className="flex items-center gap-1">👉 Swipe Right: Record Result</span>
              <span className="flex items-center gap-1">Swipe Left: NCR 👈</span>
            </div>

            {filteredSamples.map((sample) => {
              const offset = swipeOffsetMap[sample.id] || 0;
              return (
                <div
                  key={sample.id}
                  className="relative overflow-hidden rounded-2xl touch-pan-y"
                  onTouchStart={(e) => handleTouchStart(sample.id, e)}
                  onTouchMove={(e) => handleTouchMove(sample.id, e)}
                  onTouchEnd={() => handleTouchEnd(sample, sample.id)}
                >
                  {/* Swipe Background Hint Banners */}
                  <div className="absolute inset-0 flex items-center justify-between px-5 font-bold text-xs rounded-2xl pointer-events-none">
                    <div className={`flex items-center gap-2 text-emerald-500 ${offset > 20 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                      <CheckCircle2 size={20} /> Record Result
                    </div>
                    <div className={`flex items-center gap-2 text-red-500 ${offset < -20 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                      Issue Quality NCR <ShieldAlert size={20} />
                    </div>
                  </div>

                  {/* Foreground Card Surface */}
                  <div
                    style={{ transform: `translateX(${offset}px)` }}
                    className="relative bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 p-4 rounded-2xl space-y-3.5 shadow-sm transition-transform duration-100 ease-out"
                  >
                    {/* Top Row: Sample ID & Grade Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-black dark:text-white tracking-tight">{sample.id}</h3>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                            {sample.gradeBadge}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-black/80 dark:text-white/80 mt-1">{sample.sampleName}</p>
                      </div>

                      {/* Prominent Color Coded Badges */}
                      {sample.status === 'Pass' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                          <CheckCircle2 size={12} /> Pass
                        </span>
                      )}
                      {sample.status === 'Fail' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-shrink-0">
                          <XCircle size={12} /> Fail
                        </span>
                      )}
                      {sample.status === 'Due Today' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0 animate-pulse">
                          <Clock size={12} /> Due Today
                        </span>
                      )}
                      {sample.status === 'Curing' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex-shrink-0">
                          <FlaskConical size={12} /> Curing
                        </span>
                      )}
                    </div>

                    {/* Casting Location & Age Status Tag */}
                    <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60 pt-1">
                      <div className="flex items-center gap-1 font-semibold text-black/70 dark:text-white/70">
                        <Building2 size={14} className="text-orange-500" />
                        {sample.structureLocation}
                      </div>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80">
                        {sample.ageStatus}
                      </span>
                    </div>

                    {/* Target vs Achieved Grid */}
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

                    {/* Quick Touch Action Buttons (High contrast min-height 48px) */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => setSelectedSampleForRecord(sample)}
                        className="w-full min-h-[48px] py-3 px-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Record Result
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
        </div>
      )}

      {/* TAB 2: QUALITY NCRs (UPGRADED STREAMLINED WORKFLOW) */}
      {activeTab === 'ncrs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-3.5 rounded-2xl shadow-sm">
            {/* Split View Sub-Tabs: [Open NCRs] vs [Resolved NCRs] */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNcrViewTab('open')}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ncrViewTab === 'open'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                }`}
              >
                ⚠️ Open NCRs ({ncrs.filter((n) => n.status !== 'Resolved' && n.status !== 'Closed').length})
              </button>

              <button
                onClick={() => setNcrViewTab('resolved')}
                className={`px-4 py-2.5 min-h-[44px] text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  ncrViewTab === 'resolved'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                }`}
              >
                ✓ Resolved / Closed ({ncrs.filter((n) => n.status === 'Resolved' || n.status === 'Closed').length})
              </button>
            </div>

            <Button variant="secondary" onClick={() => setIsNcrModalOpen(true)} className="!text-xs gap-1.5 min-h-[44px] border-red-500/30 text-red-600 dark:text-red-400">
              <Plus size={14} /> New NCR
            </Button>
          </div>

          {/* NCR Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ncrs
              .filter((n) =>
                ncrViewTab === 'open'
                  ? n.status !== 'Resolved' && n.status !== 'Closed'
                  : n.status === 'Resolved' || n.status === 'Closed'
              )
              .map((ncr) => (
                <div
                  key={ncr.id}
                  className={`bg-white dark:bg-[#0a0f1d] border p-5 rounded-3xl space-y-4 shadow-sm ${
                    ncr.severity === 'High'
                      ? 'border-red-500/40 shadow-red-500/5'
                      : ncr.severity === 'Medium'
                      ? 'border-amber-500/40'
                      : 'border-blue-500/40'
                  }`}
                >
                  {/* Top Bar: NCR ID & Severity Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-3 py-1 rounded-xl bg-black/5 dark:bg-white/10 text-black dark:text-white font-mono">
                        {ncr.id}
                      </span>
                      <span className="text-[11px] font-bold text-black/50 dark:text-white/50">
                        {ncr.dateReported}
                      </span>
                    </div>

                    {/* Severity Badge */}
                    {ncr.severity === 'High' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        High Severity
                      </span>
                    )}
                    {ncr.severity === 'Medium' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Medium Severity
                      </span>
                    )}
                    {ncr.severity === 'Low' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        Low Severity
                      </span>
                    )}
                  </div>

                  {/* Title & Sample Context */}
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

                  {/* Root Cause & Corrective Action Summary */}
                  <div className="bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 space-y-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Root Cause & Corrective Action Plan:
                    </p>
                    <p className="text-xs font-medium text-black/80 dark:text-white/80 leading-relaxed">
                      {ncr.correctiveAction}
                    </p>
                  </div>

                  {/* Evidence Photo Thumbnails if available */}
                  {ncr.evidencePhotos && ncr.evidencePhotos.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase">Evidence Photos:</span>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {ncr.evidencePhotos.map((img) => (
                          <div key={img.id} className="relative w-20 h-14 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 flex-shrink-0 bg-black">
                            <img src={img.url} alt="Evidence" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Person */}
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

                  {/* Action Buttons: [Update Status], [Upload Consultant Report], [Close NCR] */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={() => handleUpdateNcrStatus(ncr.id, ncr.status === 'Open' ? 'Under Review' : 'Resolved')}
                      className="py-2 px-2 text-[11px] font-bold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all cursor-pointer text-center min-h-[40px]"
                    >
                      Update Status
                    </button>

                    <button
                      onClick={() => handleUploadConsultantReport(ncr.id)}
                      className="py-2 px-2 text-[11px] font-bold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all cursor-pointer text-center min-h-[40px]"
                    >
                      + Consultant Report
                    </button>

                    <button
                      onClick={() => handleCloseNcr(ncr.id)}
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

      {/* TAB 3: LAB EQUIPMENT & CALIBRATION (UPGRADED FAST MOBILE VERIFICATION) */}
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
              <div key={eq.id} className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 rounded-3xl space-y-4 shadow-sm">
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

                  {/* Calibration Status Badges: Active, Due Soon (<15 Days), Expired */}
                  {(eq.status === 'Calibrated' || eq.status === 'Active') && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                      Active ✓
                    </span>
                  )}
                  {eq.status === 'Due Soon' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0 animate-pulse">
                      Due Soon (&lt;15d) ⏰
                    </span>
                  )}
                  {eq.status === 'Expired' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-shrink-0">
                      Expired ✕
                    </span>
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

                  {/* DIRECT ACTION: QUICK RECALIBRATE SNAP BUTTON */}
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
        </div>
      )}

      {/* TAB 4: NABL CERTIFICATES (UPGRADED PDF PREVIEW & DIRECT SHARE) */}
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
              <div key={cert.id} className="bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 rounded-3xl space-y-4 shadow-sm">
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

                  {/* Approval Status Badges: Approved, Under Review, Rejected */}
                  {cert.approvalStatus === 'Approved' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                      Approved ✓
                    </span>
                  )}
                  {cert.approvalStatus === 'Under Review' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex-shrink-0">
                      Under Review ⏳
                    </span>
                  )}
                  {cert.approvalStatus === 'Rejected' && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex-shrink-0">
                      Rejected ✕
                    </span>
                  )}
                </div>

                {/* PDF PREVIEW & DIRECT SHARE SINGLE-TAP BUTTONS */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={() => setSelectedCertForPreview(cert)}
                    className="py-2.5 px-2 text-xs font-bold rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <FileText size={14} /> View PDF
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(cert)}
                    className="py-2.5 px-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <Share2 size={14} /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleShareEmail(cert)}
                    className="py-2.5 px-2 text-xs font-bold rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                  >
                    <ExternalLink size={14} /> Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. MOBILE STICKY BOTTOM ACTION BAR (<=768px PWA Viewport) */}
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
          className="flex-1 min-h-[48px] px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>+ Log Sample</span>
        </button>
      </div>

      {/* Modals */}
      <NewSampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSave={handleSaveSample}
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
      />

      <NewEquipmentModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onSave={handleSaveEquipment}
      />

      <QrScanModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onScanned={(sample) => setSelectedSampleForRecord(sample)}
      />

      <RecordResultModal
        isOpen={!!selectedSampleForRecord}
        onClose={() => setSelectedSampleForRecord(null)}
        sample={selectedSampleForRecord}
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
        onShareWhatsApp={handleShareWhatsApp}
        onShareEmail={handleShareEmail}
      />
    </div>
  );
}
