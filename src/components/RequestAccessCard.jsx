import React, { useState } from 'react';
import { Lock, Send } from 'lucide-react';
import API from '../api';

export default function RequestAccessCard({ documentId, documentName, hasPendingRequest }) {
  const [status, setStatus] = useState(hasPendingRequest ? 'pending' : 'idle'); // 'idle' | 'sending' | 'pending' | 'error'
  const [error, setError] = useState('');

  const handleRequest = async () => {
    setStatus('sending');
    setError('');
    try {
      await API.post(`/documents/${documentId}/request-access`);
      setStatus('pending');
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not send request.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
      <div className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center mb-4">
        <Lock size={18} className="text-black/50 dark:text-white/50" />
      </div>
      <h3 className="text-black dark:text-white font-semibold text-sm mb-1">You don't have access to this document</h3>
      <p className="text-black/50 dark:text-white/50 text-xs max-w-xs mb-5">
        "{documentName}" is restricted. Send a request and the person who uploaded it can grant you access.
      </p>

      {status === 'pending' ? (
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Request sent — awaiting approval.</span>
      ) : (
        <button
          onClick={handleRequest}
          disabled={status === 'sending'}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <Send size={13} />
          {status === 'sending' ? 'Sending…' : 'Ask for Access'}
        </button>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>}
    </div>
  );
}