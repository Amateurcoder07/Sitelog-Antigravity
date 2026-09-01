import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, FolderOpen, Plus, X, Lock, User as UserIcon } from 'lucide-react';
import API from '../api';
import { useProject } from '../context/ProjectContext';

function CreateFolderModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const { projectId } = useParams();

  useEffect(() => {
    API.get('/folders/members', { params: { projectId } })
      .then((res) => setMembers(res.data.members))
      .catch(() => {});
  }, [projectId]);

  const toggleMember = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Folder name is required.');
    setSaving(true);
    setError('');
    try {
      const res = await API.post('/folders', { name, projectId, allowedUserIds: selected });
      onCreated(res.data.folder);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not create folder.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black dark:text-white">New Folder</h2>
          <button onClick={onClose} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Folder Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Structural Drawings"
              className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">
              Give access to (project members)
            </label>
            <div className="max-h-40 overflow-y-auto border border-black/15 dark:border-white/15 rounded-lg divide-y divide-black/5 dark:divide-white/5">
              {members.length === 0 && (
                <p className="px-3.5 py-3 text-xs text-black/40 dark:text-white/40">No other members found on this project yet.</p>
              )}
              {members.map((m) => (
                <label key={m._id} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={selected.includes(m._id)}
                    onChange={() => toggleMember(m._id)}
                    className="accent-black dark:accent-white"
                  />
                  <span className="text-black dark:text-white">{m.name}</span>
                  <span className="text-black/40 dark:text-white/40 text-xs">
                    {m.role}{m.role === 'Engineer' && m.specialization ? ` — ${m.specialization}` : ''}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit" disabled={saving}
            className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Folder'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DocumentInventory() {
  const { selectedProjectId, projects } = useProject();
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const loadFolders = useCallback(() => {
    if (!selectedProjectId) return;
    API.get('/folders', { params: { projectId: selectedProjectId } })
      .then((res) => setFolders(res.data.folders))
      .catch(() => {});
  }, [selectedProjectId]);

  useEffect(() => { loadFolders(); }, [loadFolders]);

  useEffect(() => {
    if (!query.trim() || !selectedProjectId) { setSuggestions([]); return; }
    const timeout = setTimeout(() => {
      API.get('/documents/search', { params: { q: query, projectId: selectedProjectId } })
        .then((res) => setSuggestions(res.data.results))
        .catch(() => {});
    }, 250); // debounce
    return () => clearTimeout(timeout);
  }, [query, selectedProjectId]);

  const handleSuggestionClick = (doc) => {
    setShowSuggestions(false);
    // navigate(`/documents-inventory/${doc.folderId}`, { state: { focusDocId: doc._id } });
    navigate(`/projects/${projectId}/documents-inventory/${doc.folderId}`, { state: { focusDocId: doc._id } });
  };

  if (!selectedProjectId) {
    return (
      <div className="text-center py-16 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
        <FolderOpen className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
        <p className="text-sm text-black/50 dark:text-white/50">
          {projects.length === 0
            ? 'Join or create a project first — from the Dashboard — to start using Document Inventory.'
            : 'Select a project from the Dashboard to see its documents.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">Document Inventory</h1>
          <p className="text-black/50 dark:text-white/50 text-sm mt-1">
            Folders shared across your project — drawings, lab reports, compliance certs and material logs.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={15} />
          New Folder
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search documents in this project…"
          className="w-full bg-white dark:bg-[#0a0a0a] border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />

        {showSuggestions && query.trim() && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/15 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
              {suggestions.length === 0 && (
                <p className="px-4 py-4 text-xs text-black/40 dark:text-white/40">No matching documents.</p>
              )}
              {suggestions.map((doc) => (
                <button
                  key={doc._id}
                  onClick={() => handleSuggestionClick(doc)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-black/5 dark:border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black dark:text-white truncate">{doc.name}</p>
                    <p className="text-[11px] text-black/40 dark:text-white/40">
                      in {doc.folderName} • uploaded by {doc.uploadedBy?.name}
                    </p>
                  </div>
                  {!doc.hasAccess && <Lock size={14} className="text-black/30 dark:text-white/30 shrink-0" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
          <FolderOpen className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
          <p className="text-sm text-black/50 dark:text-white/50">No folders yet — create one to start organizing site documents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <button
              key={folder._id}
              onClick={() => navigate(`/projects/${projectId}/documents-inventory/${folder._id}`)}
              className="text-left bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black mb-4">
                <FolderOpen size={17} />
              </div>
              <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{folder.name}</h3>
              <p className="text-black/40 dark:text-white/40 text-xs flex items-center gap-1.5">
                <UserIcon size={11} />
                {folder.createdBy?.name} • {folder.createdBy?.role}
                {folder.createdBy?.role === 'Engineer' && folder.createdBy?.specialization ? ` (${folder.createdBy.specialization})` : ''}
              </p>
              <p className="text-black/40 dark:text-white/40 text-xs mt-1.5">
                {folder.allowedUsers?.length || 0} member{folder.allowedUsers?.length === 1 ? '' : 's'} with access
              </p>
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <CreateFolderModal
          projectId={selectedProjectId}
          onClose={() => setShowModal(false)}
          onCreated={(f) => setFolders((prev) => [f, ...prev])}
        />
      )}
    </div>
  );
}