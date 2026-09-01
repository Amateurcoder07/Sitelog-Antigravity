import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, User as UserIcon, Users } from 'lucide-react';
import API from '../api';
import RequestAccessCard from '../components/RequestAccessCard';
import EditAccessModal from '../components/EditAccessModal';

export default function FolderDetail() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { projectId, id } = useParams();

    const [folder, setFolder] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [editingDocId, setEditingDocId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(() => {
        API.get(`/folders/${id}`)
            .then((res) => {
                setFolder(res.data.folder);
                setDocuments(res.data.documents);
            })
            .catch(() => setError('Could not load this folder.'));
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            await API.post(`/folders/${id}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            load();
        } catch (err) {
            setError(err.response?.data?.msg || 'Upload failed.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!folder) {
        return error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : (
            <p className="text-sm text-black/40 dark:text-white/40">Loading…</p>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate(`/projects/${projectId}/documents-inventory`)}
                className="flex items-center gap-1.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors mb-6 cursor-pointer"
            >
                <ArrowLeft size={14} />
                Back to Document Inventory
            </button>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">{folder.name}</h1>
                    <p className="text-black/50 dark:text-white/50 text-sm mt-1 flex items-center gap-1.5">
                        <UserIcon size={13} />
                        Created by {folder.createdBy?.name} • {folder.createdBy?.role}
                        {folder.createdBy?.role === 'Engineer' && folder.createdBy?.specialization ? ` (${folder.createdBy.specialization})` : ''}
                    </p>
                    <p className="text-black/40 dark:text-white/40 text-xs mt-1 flex items-center gap-1.5">
                        <Users size={12} />
                        {folder.allowedUsers?.map((u) => u.name).join(', ') || 'No additional members'}
                    </p>
                </div>

                <div>
                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                        <Upload size={15} />
                        {uploading ? 'Uploading…' : 'Upload Document'}
                    </button>
                </div>
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400 mb-4">{error}</p>}

            {selectedDoc && !selectedDoc.hasAccess ? (
                <RequestAccessCard
                    documentId={selectedDoc._id}
                    documentName={selectedDoc.name}
                    hasPendingRequest={selectedDoc.hasPendingRequest}
                />
            ) : (
                <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
                    {documents.length === 0 && (
                        <p className="px-5 py-8 text-center text-sm text-black/40 dark:text-white/40">No documents uploaded yet.</p>
                    )}
                    {documents.map((doc) => (
                        <div
                            key={doc._id}
                            className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <FileText size={16} className="text-black/40 dark:text-white/40 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm text-black/80 dark:text-white/80 font-medium truncate">{doc.name}</p>
                                    <p className="text-[11px] text-black/40 dark:text-white/40">
                                        {doc.uploadedBy?.name} • {new Date(doc.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {doc.hasAccess ? (
                                    <a
                                        href={doc.cloudinaryUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-semibold text-black dark:text-white hover:underline"
                                    >
                                        Open
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => setSelectedDoc(doc)}
                                        className="text-xs font-semibold text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white cursor-pointer"
                                    >
                                        Locked — request access
                                    </button>
                                )}
                                {doc.canEditAccess && (
                                    <button
                                        onClick={() => setEditingDocId(doc._id)}
                                        className="text-xs font-medium text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
                                    >
                                        Edit Access
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingDocId && (
                <EditAccessModal
                    documentId={editingDocId}
                    folderMembers={folder.allowedUsers || []}
                    onClose={() => setEditingDocId(null)}
                    onSaved={load}
                />
            )}
        </div>
    );
}