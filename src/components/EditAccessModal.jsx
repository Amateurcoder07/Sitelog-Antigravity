import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../api';

export default function EditAccessModal({ documentId, folderMembers, onClose, onSaved }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/documents/${documentId}`)
      .then((res) => setSelected(res.data.document.authorizedUsers.map((u) => u._id)))
      .catch(() => setError('Could not load current access list.'))
      .finally(() => setLoading(false));
  }, [documentId]);

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await API.patch(`/documents/${documentId}/access`, { authorizedUserIds: selected });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not update access.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black dark:text-white">Edit Access</h2>
          <button onClick={onClose} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-black/40 dark:text-white/40">Loading…</p>
        ) : (
          <>
            <p className="text-xs text-black/50 dark:text-white/50 mb-3">
              Choose who can view this document. The uploader always keeps access.
            </p>
            <div className="max-h-56 overflow-y-auto border border-black/15 dark:border-white/15 rounded-lg divide-y divide-black/5 dark:divide-white/5 mb-4">
              {folderMembers.map((m) => (
                <label key={m._id} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={selected.includes(m._id)}
                    onChange={() => toggle(m._id)}
                    className="accent-black dark:accent-white"
                  />
                  <span className="text-black dark:text-white">{m.name}</span>
                  <span className="text-black/40 dark:text-white/40 text-xs">{m.role}</span>
                </label>
              ))}
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400 mb-3">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Access'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}