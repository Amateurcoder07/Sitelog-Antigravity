import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Users, X } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import API from '../api';

function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Project name is required.');
    setSaving(true);
    setError('');
    try {
      const res = await API.post('/projects', { name, address });
      onCreated(res.data.project);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not create project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black dark:text-white">New Project</h2>
          <button onClick={onClose} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Project Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Konkan Bypass Extension"
              className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Site Address</label>
            <input
              type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Andheri East, Mumbai"
              className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit" disabled={saving}
            className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
}

function JoinProjectPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [requestedIds, setRequestedIds] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await API.get('/projects/search', { params: { q: query } });
      setResults(res.data.projects);
    } finally {
      setSearching(false);
    }
  };

  const handleRequest = async (projectId) => {
    try {
      await API.post(`/projects/${projectId}/join-request`);
      setRequestedIds((prev) => [...prev, projectId]);
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not send request.');
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-black dark:text-white mb-3">Join an existing project</h3>
      <form onSubmit={handleSearch} className="relative mb-4">
        <Search className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={15} />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search project by name…"
          className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
      </form>

      {searching && <p className="text-xs text-black/40 dark:text-white/40">Searching…</p>}

      <div className="space-y-2">
        {results.map((p) => {
          const requested = p.hasPendingRequest || requestedIds.includes(p._id);
          return (
            <div key={p._id} className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg border border-black/10 dark:border-white/10">
              <div className="min-w-0">
                <p className="text-sm font-medium text-black dark:text-white truncate">{p.name}</p>
                <p className="text-[11px] text-black/40 dark:text-white/40">
                  {p.address || 'No address listed'} • {p.memberCount} member{p.memberCount === 1 ? '' : 's'}
                </p>
              </div>
              <button
                onClick={() => handleRequest(p._id)}
                disabled={requested}
                className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {requested ? 'Requested' : 'Ask to Join'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MainDashboard() {
  const { projects, selectedProjectId, setSelectedProjectId, refreshProjects } = useProject();
  const { searchQuery = '' } = useOutletContext() || {};
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">Your Projects</h1>
          <p className="text-black/50 dark:text-white/50 text-sm mt-1">
            Every site you're part of, in one place.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={15} />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-black/15 dark:border-white/15 rounded-xl mb-8">
          <Building2 className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
          <p className="text-sm text-black/50 dark:text-white/50">You're not part of any project yet.</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-black/15 dark:border-white/15 rounded-xl mb-8">
          <p className="text-sm text-black/50 dark:text-white/50">No projects match "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredProjects.map((p) => (
            <button
              key={p._id}
              onClick={() => setSelectedProjectId(p._id)}
              className={`text-left bg-white dark:bg-[#0a0a0a] border rounded-xl p-5 transition-colors cursor-pointer ${
                selectedProjectId === p._id
                  ? 'border-black dark:border-white'
                  : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                  <Building2 size={17} />
                </div>
                {selectedProjectId === p._id && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">Active</span>
                )}
              </div>
              <h3 className="text-black dark:text-white font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-black/40 dark:text-white/40 text-xs">{p.address || 'No address listed'}</p>
              <p className="text-black/40 dark:text-white/40 text-xs mt-1.5 flex items-center gap-1.5">
                <Users size={11} />
                {p.members?.length || 0} member{p.members?.length === 1 ? '' : 's'} • by {p.createdBy?.name}
              </p>
            </button>
          ))}
        </div>
      )}

      <JoinProjectPanel />

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => refreshProjects()}
        />
      )}
    </div>
  );
}