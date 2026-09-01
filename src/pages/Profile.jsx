import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, Briefcase } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight mb-6">Profile</h1>

      <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">{user?.name}</h2>
            <p className="text-xs text-black/50 dark:text-white/50">{user?.role}{user?.specialization ? ` — ${user.specialization}` : ''}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2.5 text-black/70 dark:text-white/70">
            <Mail size={15} className="text-black/40 dark:text-white/40" />
            {user?.email}
          </div>
          <div className="flex items-center gap-2.5 text-black/70 dark:text-white/70">
            <Phone size={15} className="text-black/40 dark:text-white/40" />
            {user?.phone}
          </div>
          <div className="flex items-center gap-2.5 text-black/70 dark:text-white/70">
            <Briefcase size={15} className="text-black/40 dark:text-white/40" />
            {user?.role}
          </div>
        </div>
      </div>
    </div>
  );
}