import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, FileText, X, Loader2, CheckCircle2, AlertCircle,
  Clock, XCircle, IndianRupee,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';

const ACCEPTED_EXTENSIONS = ['.dwg', '.dxf'];

const STATUS_CONFIG = {
  uploaded: { label: 'Queued', icon: Clock, className: 'text-black/50 dark:text-white/50' },
  processing: { label: 'Processing', icon: Loader2, className: 'text-blue-600 dark:text-blue-400', spin: true },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'text-emerald-600 dark:text-emerald-400' },
  failed: { label: 'Failed', icon: XCircle, className: 'text-red-600 dark:text-red-400' },
};

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function formatCurrency(amount, currency = 'INR') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function UploadPlan() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [planName, setPlanName] = useState('');
  const [notes, setNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await API.get(`/plans/project/${projectId}`);
      setPlans(res.data.plans);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [projectId]);

  const validateAndSetFile = (selected) => {
    setError('');
    if (!selected) return;
    const ext = '.' + selected.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError('Only DWG or DXF files are supported right now.');
      return;
    }
    setFile(selected);
    if (!planName) setPlanName(selected.name.replace(/\.(dwg|dxf)$/i, ''));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    setFile(null);
    setPlanName('');
    setNotes('');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a plan file to upload.');
    if (!planName.trim()) return setError('Give this plan a name.');

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('plan', file);
    formData.append('projectId', projectId);
    formData.append('name', planName);
    formData.append('notes', notes);

    try {
      const res = await API.post('/plans/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        },
      });
      setPlans((prev) => [res.data.plan, ...prev]);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.msg || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const completedPlans = plans.filter((p) => p.status === 'completed');
  const totalEstimate = completedPlans.reduce((sum, p) => sum + (p.estimate?.totalCost || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">Upload a Plan</h1>
        <p className="text-black/50 dark:text-white/50 text-sm mt-1">
          Upload a DWG or DXF layout to generate a 3D model and cost estimate.
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-5 max-w-2xl mb-10">
        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center text-center py-14 px-6 border border-dashed rounded-xl cursor-pointer transition-colors ${
              dragActive
                ? 'border-black dark:border-white bg-black/[0.03] dark:bg-white/[0.05]'
                : 'border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30'
            }`}
          >
            <div className="w-11 h-11 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black mb-3">
              <Upload size={18} />
            </div>
            <p className="text-sm font-medium text-black dark:text-white">
              Drag & drop your plan here, or click to browse
            </p>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1.5">
              Supports .dwg and .dxf files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".dwg,.dxf"
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                <FileText size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-black dark:text-white truncate">{file.name}</p>
                <p className="text-[11px] text-black/40 dark:text-white/40">{formatBytes(file.size)}</p>
              </div>
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={removeFile}
                className="shrink-0 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Plan Name</label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g. Ground Floor - Villa 3"
            className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any context for this plan — floor count, materials preference, etc."
            className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
          />
        </div>

        {uploading && (
          <div>
            <div className="h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-black dark:bg-white transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-black/40 dark:text-white/40 mt-1.5">Uploading… {progress}%</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            Plan uploaded.
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Uploading…
            </>
          ) : (
            'Upload & Process Plan'
          )}
        </button>
      </form>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black dark:text-white tracking-tight">Plans</h2>
        <p className="text-black/50 dark:text-white/50 text-sm">
          {plans.length} plan{plans.length === 1 ? '' : 's'}
          {completedPlans.length > 0 && <> · combined estimate {formatCurrency(totalEstimate)}</>}
        </p>
      </div>

      {plansLoading ? (
        <p className="text-sm text-black/40 dark:text-white/40">Loading plans…</p>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
          <FileText className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
          <p className="text-sm text-black/50 dark:text-white/50">No plans uploaded to this project yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const status = STATUS_CONFIG[plan.status] || STATUS_CONFIG.uploaded;
            const StatusIcon = status.icon;
            return (
              <button
                key={plan._id}
                onClick={() => navigate(`/projects/${projectId}/plans/${plan._id}`)}
                className="text-left bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 rounded-xl p-5 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                    <FileText size={16} />
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
                    <StatusIcon size={11} className={status.spin ? 'animate-spin' : ''} />
                    {status.label}
                  </span>
                </div>
                <h3 className="text-black dark:text-white font-semibold text-sm mb-1 truncate">{plan.name}</h3>
                <p className="text-black/40 dark:text-white/40 text-xs">Uploaded {formatDate(plan.createdAt)}</p>
                <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex items-center gap-1.5">
                  <IndianRupee size={12} className="text-black/40 dark:text-white/40" />
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {plan.status === 'completed' ? formatCurrency(plan.estimate?.totalCost) : '—'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}