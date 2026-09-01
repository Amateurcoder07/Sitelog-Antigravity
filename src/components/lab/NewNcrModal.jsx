import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Camera, MapPin, User, Check, Plus, AlertTriangle } from 'lucide-react';
import Button from '../Button';

const ACTION_PLAN_CHIPS = [
  "Extend Water Curing 7 Days",
  "Schedule Rebound Hammer Test",
  "Schedule Core Extraction",
  "Demolish and Recast",
  "Structural Consultant Approval Pending"
];

const TEAM_MEMBERS = [
  "Er. Rajesh Kumar (Structural Consultant)",
  "Amit Patel (Site Quality Engineer)",
  "Priya Verma (QC Technician)",
  "Ramesh Sharma (Site Supervisor)"
];

export default function NewNcrModal({ isOpen, onClose, onSave, samples = [], prefilledData = null }) {
  const [selectedSampleId, setSelectedSampleId] = useState(samples[0]?.id || '');
  const [severity, setSeverity] = useState('High');
  const [title, setTitle] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [assignedTo, setAssignedTo] = useState(TEAM_MEMBERS[0]);
  const [evidencePhotos, setEvidencePhotos] = useState([]);

  // Active sample details derived from selectedSampleId
  const activeSample = samples.find((s) => s.id === selectedSampleId) || samples[0];

  // Auto-generate title whenever severity or sample changes (if title not custom edited)
  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.sampleId) setSelectedSampleId(prefilledData.sampleId);
      if (prefilledData.title) setTitle(prefilledData.title);
      if (prefilledData.severity) setSeverity(prefilledData.severity);
      if (prefilledData.correctiveAction) setCorrectiveAction(prefilledData.correctiveAction);
      if (prefilledData.assignedTo) setAssignedTo(prefilledData.assignedTo);
    } else if (activeSample) {
      const autoTitle = `${severity} Severity - ${activeSample.materialCategory || 'Concrete'} failure at ${activeSample.structureLocation || 'Site'}`;
      setTitle(autoTitle);
    }
  }, [prefilledData, selectedSampleId, severity, activeSample]);

  if (!isOpen) return null;

  const handleChipClick = (chipText) => {
    if (!correctiveAction.includes(chipText)) {
      setCorrectiveAction((prev) => (prev ? `${prev}. ${chipText}` : chipText));
    }
  };

  const handlePhotoAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newPhoto = {
        id: `img-${Date.now()}`,
        url: URL.createObjectURL(file),
        gpsWatermark: `GPS: 19.1197° N, 72.8464° E • ${timestamp}`
      };
      setEvidencePhotos((prev) => [...prev, newPhoto]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !correctiveAction.trim()) return;

    const newNcr = {
      id: `NCR-2026-0${Math.floor(5 + Math.random() * 20)}`,
      title: title.trim(),
      sampleId: selectedSampleId || activeSample?.id || 'TS-2026-003',
      materialCategory: activeSample?.materialCategory || 'Concrete',
      structureLocation: activeSample?.structureLocation || 'Site Element',
      targetValue: activeSample?.targetStrength || '25.0 N/mm²',
      achievedValue: activeSample?.achievedStrength || '17.8 N/mm²',
      severity,
      dateReported: new Date().toISOString().split('T')[0],
      correctiveAction: correctiveAction.trim(),
      status: 'Open', // 'Open' | 'Under Review' | 'Resolved' | 'Closed'
      assignedTo,
      evidencePhotos
    };

    onSave(newNcr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Issue Quality NCR</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Non-conformance defect workflow for site engineers & consultants</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* 1. AUTO-POPULATED FAILED SAMPLE CONTEXT CARD */}
        {activeSample && (
          <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-2xl mb-4 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider text-[10px]">
                Auto-Populated Defect Context
              </span>
              <span className="font-mono text-black dark:text-white font-bold">{activeSample.id}</span>
            </div>
            <p className="font-bold text-black dark:text-white">{activeSample.sampleName} ({activeSample.materialCategory})</p>
            <p className="text-black/60 dark:text-white/60">Location: {activeSample.structureLocation}</p>
            <div className="flex items-center gap-3 pt-1 font-bold text-black dark:text-white">
              <span>Target: {activeSample.targetStrength}</span>
              <span>•</span>
              <span className="text-red-600 dark:text-red-400">Achieved: {activeSample.achievedStrength}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sample Selector & Severity Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Related Sample</label>
              <select
                value={selectedSampleId}
                onChange={(e) => setSelectedSampleId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
              >
                {samples.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-[#0a0f1d]">
                    {s.id} - {s.gradeBadge}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
              >
                <option value="High" className="bg-white dark:bg-[#0a0f1d]">High (Structural Failure Risk)</option>
                <option value="Medium" className="bg-white dark:bg-[#0a0f1d]">Medium (Material Spec Mismatch)</option>
                <option value="Low" className="bg-white dark:bg-[#0a0f1d]">Low (Minor Spec / Documentation)</option>
              </select>
            </div>
          </div>

          {/* Auto-Generated Defect Title */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              Defect Title (Auto-Generated)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
            />
          </div>

          {/* 2. ROOT CAUSE & ACTION PLAN QUICK CHIPS */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              Root Cause & Action Plan Quick Chips
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ACTION_PLAN_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 transition-all cursor-pointer text-left"
                >
                  + {chip}
                </button>
              ))}
            </div>

            <textarea
              required
              rows={3}
              placeholder="Describe corrective actions..."
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-medium"
            />
          </div>

          {/* 3. ASSIGNEE DROPDOWN */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              Assignee (Active Team Member)
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
            >
              {TEAM_MEMBERS.map((member) => (
                <option key={member} value={member} className="bg-white dark:bg-[#0a0f1d]">
                  {member}
                </option>
              ))}
            </select>
          </div>

          {/* 4. EVIDENCE PHOTO ATTACHMENT WITH GPS & TIMESTAMP OVERLAY */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              Evidence Attachments (GPS & Timestamp Watermarked)
            </label>

            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-red-500 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 cursor-pointer transition-colors">
              <Camera size={18} className="text-red-500" />
              <span>Take Evidence Photo (Camera GPS Watermark)</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoAdd}
                className="hidden"
              />
            </label>

            {/* Photo Previews with Watermarks */}
            {evidencePhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                {evidencePhotos.map((photo) => (
                  <div key={photo.id} className="relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 aspect-video bg-black">
                    <img src={photo.url} alt="Evidence" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 px-2 text-[9px] font-mono text-white flex items-center gap-1">
                      <MapPin size={10} className="text-red-400 flex-shrink-0" />
                      <span className="truncate">{photo.gpsWatermark}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="!bg-red-600 dark:!bg-red-500 hover:!opacity-90 !py-3 flex-1 min-h-[48px]">
              Raise Quality NCR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
