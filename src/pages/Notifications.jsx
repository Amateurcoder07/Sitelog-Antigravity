import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, Check, X, Building2, FileText, Inbox } from 'lucide-react';
import API from '../api';

function Avatar({ person }) {
  if (person.profilePicture) {
    return <img src={person.profilePicture} alt={person.name} className="w-11 h-11 rounded-full object-cover shrink-0" />;
  }
  return (
    <div className="w-11 h-11 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-bold shrink-0">
      {person.name ? person.name.charAt(0).toUpperCase() : '?'}
    </div>
  );
}

function NotificationCard({ notification, onResolve }) {
  const [responding, setResponding] = useState(false);
  const { type, person } = notification;

  const respond = async (approve) => {
    setResponding(true);
    try {
      if (type === 'project_join') {
        await API.post(`/projects/${notification.projectId}/join-requests/${notification.requestId}/respond`, { approve });
      } else {
        await API.post(`/documents/${notification.documentId}/access-requests/${notification.requestId}/respond`, { approve });
      }
      onResolve(notification);
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not process this request.');
      setResponding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <Avatar person={person} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-black dark:text-white">{person.name}</p>
          <p className="text-xs text-black/50 dark:text-white/50">
            {person.role}{person.role === 'Engineer' && person.specialization ? ` — ${person.specialization}` : ''}
          </p>
          <div className="flex flex-col gap-0.5 mt-1.5 text-[11px] text-black/40 dark:text-white/40">
            <span className="flex items-center gap-1.5"><Mail size={11} /> {person.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={11} /> {person.phone}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-black/60 dark:text-white/60 mb-4 flex items-center gap-1.5">
        {type === 'project_join' ? (
          <>
            <Building2 size={13} className="shrink-0" />
            Wants to join <span className="font-medium text-black dark:text-white">{notification.projectName}</span>
            <span className="text-black/30 dark:text-white/30">({notification.projectCode})</span>
          </>
        ) : (
          <>
            <FileText size={13} className="shrink-0" />
            Requesting access to <span className="font-medium text-black dark:text-white">{notification.documentName}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => respond(true)}
          disabled={responding}
          className="flex-1 flex items-center justify-center gap-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <Check size={13} />
          Allow
        </button>
        <button
          onClick={() => respond(false)}
          disabled={responding}
          className="flex-1 flex items-center justify-center gap-1.5 border border-black/15 dark:border-white/15 text-black/70 dark:text-white/70 text-xs font-semibold py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={13} />
          Deny
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    API.get('/notifications')
      .then((res) => setNotifications(res.data.notifications))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleResolve = (resolved) => {
    setNotifications((prev) =>
      prev.filter((n) => !(n.type === resolved.type && n.requestId === resolved.requestId))
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight mb-1">Notifications</h1>
      <p className="text-black/50 dark:text-white/50 text-sm mb-6">
        Join requests and document access requests waiting on your response.
      </p>

      {loading ? (
        <p className="text-sm text-black/40 dark:text-white/40">Loading…</p>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
          <Inbox className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
          <p className="text-sm text-black/50 dark:text-white/50">You're all caught up — no pending requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notifications.map((n) => (
            <NotificationCard key={`${n.type}-${n.requestId}`} notification={n} onResolve={handleResolve} />
          ))}
        </div>
      )}
    </div>
  );
}