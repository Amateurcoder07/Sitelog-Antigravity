import React, { useState } from 'react';
import { X, FileCheck, Upload } from 'lucide-react';
import Button from '../Button';
import API from '../../api';

export default function UploadCertModal({ isOpen, onClose, onSave, projectId, samples = [] }) {
  const [title, setTitle] = useState('');
  const [sampleId, setSampleId] = useState(samples[0]?._id || '');
  const [nablLabName, setNablLabName] = useState('National Quality Assurance Lab (NABL)');
  const [approvalStatus, setApprovalStatus] = useState('Approved');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!sampleId) {
      setError('Select the linked sample.');
      return;
    }
    if (!file) {
      setError('Attach the certificate PDF or scan.');
      return;
    }

    setSaving(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('sample', sampleId);
    formData.append('nablLabName', nablLabName.trim());
    formData.append('approvalStatus', approvalStatus);
    formData.append('file', file);

    try {
      const res = await API.post(`/lab-management/${projectId}/certificates`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data.certificate);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not upload certificate.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-6 shadow-2xl z-10 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <FileCheck size={22} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Upload NABL Certificate</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Attach third-party laboratory test report</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              Certificate / Test Report Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 28-Day Concrete Cube Strength Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
                Linked Sample
              </label>
              <select
                value={sampleId}
                onChange={(e) => setSampleId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
              >
                {samples.map((s) => (
                  <option key={s._id} value={s._id} className="bg-white dark:bg-[#0a0f1d]">
                    {s.code} - {s.sampleName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
                Approval Status
              </label>
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
              >
                <option value="Approved" className="bg-white dark:bg-[#0a0f1d]">Approved ✓</option>
                <option value="Under Review" className="bg-white dark:bg-[#0a0f1d]">Under Review ⏳</option>
                <option value="Rejected" className="bg-white dark:bg-[#0a0f1d]">Rejected ✕</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              NABL Accredited Testing Lab Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. National Quality Assurance & Testing Lab (NABL)"
              value={nablLabName}
              onChange={(e) => setNablLabName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              Upload Certificate PDF or Scan Document
            </label>

            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-orange-500 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 cursor-pointer transition-colors">
              <Upload size={18} className="text-orange-500" />
              <span>{file ? `File Selected: ${file.name}` : 'Choose PDF File or Camera Scan'}</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving} className="!py-3 flex-1 min-h-[48px]">
              {saving ? 'Uploading…' : 'Upload Certificate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}