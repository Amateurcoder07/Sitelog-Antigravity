import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Camera, MapPin } from 'lucide-react';
import Button from '../Button';
import API from '../../api';

const ACTION_PLAN_CHIPS = [
  "Extend Water Curing 7 Days",
  "Schedule Rebound Hammer Test",
  "Schedule Core Extraction",
  "Demolish and Recast",
  "Structural Consultant Approval Pending"
];

export default function NewNcrModal({ isOpen, onClose, onSave, projectId, samples = [], prefilledData = null }) {
  const [selectedSampleId, setSelectedSampleId] = useState(samples[0]?._id || '');
  const [severity, setSeverity] = useState('High');
  const [title, setTitle] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [loadingEngineers, setLoadingEngineers] = useState(true);
  const [evidencePhotos, setEvidencePhotos] = useState([]); // { id, file, url, gpsWatermark }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const activeSample = samples.find((s) => s._id === selectedSampleId) || samples[0];

  // Assignees are restricted to Engineers on this project — the NCR sign-off
  // convention — never a free-text or hardcoded list.
  useEffect(() => {
    if (!projectId) return;
    setLoadingEngineers(true);
    API.get(`/lab-management/${projectId}/engineers`)
      .then((res) => {
        setEngineers(res.data.engineers || []);
        setAssignedTo((current) => current || res.data.engineers?.[0]?.name || '');
      })
      .catch(() => setEngineers([]))
      .finally(() => setLoadingEngineers(false));
  }, [projectId]);

  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.sample) setSelectedSampleId(prefilledData.sample);
      if (prefilledData.title) setTitle(prefilledData.title);
      if (prefilledData.severity) setSeverity(prefilledData.severity);
      if (prefilledData.correctiveAction) setCorrectiveAction(prefilledData.correctiveAction);
      if (prefilledData.assignedTo) setAssignedTo(prefilledData.assignedTo);
    } else if (activeSample) {
      const autoTitle = `${severity} Severity - ${activeSample.materialCategory || 'Concrete'} failure at ${activeSample.structureLocation || 'Site'}`;
      setTitle(autoTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledData, selectedSampleId]);

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
        file,
        url: URL.createObjectURL(file),
        gpsWatermark: `Captured on-site • ${timestamp}`
      };
      setEvidencePhotos((prev) => [...prev, newPhoto]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !correctiveAction.trim()) return;
    if (!selectedSampleId) {
      setError('Select the related sample.');
      return;
    }
    if (!assignedTo) {
      setError('Assign this NCR to a project engineer.');
      return;
    }

    setSaving(true);
    setError('');

    const formData = new FormData();
    formData.append('sample', selectedSampleId);
    formData.append('title', title.trim());
    formData.append('severity', severity);
    formData.append('correctiveAction', correctiveAction.trim());
    formData.append('assignedTo', assignedTo);
    evidencePhotos.forEach((p) => formData.append('photos', p.file));

    try {
      const res = await API.post(`/lab-management/${projectId}/ncrs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data.ncr);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not raise NCR.');
    } finally {
      setSaving(false);
    }
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

        {activeSample && (
          <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-2xl mb-4 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider text-[10px]">
                Auto-Populated Defect Context
              </span>
              <span className="font-mono text-black dark:text-white font-bold">{activeSample.code}</span>
            </div>
            <p className="font-bold text-black dark:text-white">{activeSample.sampleName} ({activeSample.materialCategory})</p>
            <p className="text-black/60 dark:text-white/60">Location: {activeSample.structureLocation}</p>
            <div className="flex items-center gap-3 pt-1 font-bold text-black dark:text-white">
              <span>Target: {activeSample.targetStrength || '—'}</span>
              <span>•</span>
              <span className="text-red-600 dark:text-red-400">Achieved: {activeSample.achievedStrength || 'Pending Test'}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Related Sample</label>
              <select
                value={selectedSampleId}
                onChange={(e) => setSelectedSampleId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px]"
              >
                {samples.map((s) => (
                  <option key={s._id} value={s._id} className="bg-white dark:bg-[#0a0f1d]">
                    {s.code} - {s.grade || s.materialCategory}
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

          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              Assignee (Project Engineer)
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              disabled={loadingEngineers || engineers.length === 0}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px] disabled:opacity-50"
            >
              {loadingEngineers && <option>Loading engineers…</option>}
              {!loadingEngineers && engineers.length === 0 && <option>No engineers found on this project</option>}
              {engineers.map((eng) => {
                const label = eng.specialization ? `${eng.name} — ${eng.specialization}` : `${eng.name} (Engineer)`;
                return (
                  <option key={eng._id} value={eng.name} className="bg-white dark:bg-[#0a0f1d]">
                    {label}
                  </option>
                );
              })}
            </select>
            {!loadingEngineers && engineers.length === 0 && (
              <p className="text-[11px] text-black/40 dark:text-white/40 mt-1">
                No one with the Engineer role is on this project yet — add one from Document Inventory's member list, or the Project page.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              Evidence Attachments
            </label>

            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-red-500 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 cursor-pointer transition-colors">
              <Camera size={18} className="text-red-500" />
              <span>Take Evidence Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoAdd}
                className="hidden"
              />
            </label>

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

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving} className="!bg-red-600 dark:!bg-red-500 hover:!opacity-90 !py-3 flex-1 min-h-[48px]">
              {saving ? 'Raising…' : 'Raise Quality NCR'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}