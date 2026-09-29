import React, { useState } from 'react';
import { X, Gauge, Camera } from 'lucide-react';
import Button from '../Button';
import API from '../../api';

export default function RecalibrateModal({ isOpen, onClose, equipment, onSave }) {
  const [newDueDate, setNewDueDate] = useState(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !equipment) return null;

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData();
    formData.append('nextCalibrationDue', newDueDate);
    if (photoFile) formData.append('photo', photoFile);

    try {
      const res = await API.patch(`/lab-management/equipment/${equipment._id}/recalibrate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data.equipment);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not update calibration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-6 shadow-2xl z-10 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Gauge size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">Quick Recalibrate</h2>
              <p className="text-xs text-black/50 dark:text-white/50">{equipment.name} ({equipment.serialNo})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              Snap Calibration Sticker / Certificate Photo
            </label>

            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-blue-500 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 cursor-pointer transition-colors">
              <Camera size={18} className="text-blue-500" />
              <span>{photoFile ? 'Sticker Captured ✓ (Tap to retake)' : 'Snap Photo of Calibration Tag'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>

            {photoPreview && (
              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                <img src={photoPreview} alt="Calibration Tag" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
              New Calibration Expiry / Next Due Date
            </label>
            <input
              type="date"
              required
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving} className="!py-3 flex-1 min-h-[48px]">
              {saving ? 'Updating…' : 'Update & Activate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}