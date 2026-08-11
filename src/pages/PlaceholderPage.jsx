import React from 'react';
import { useProject } from '../context/ProjectContext';

export default function PlaceholderPage({ title, description }) {
  const { dashboardData } = useProject();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-slate-400 text-xs mt-1">
          {description || `Managing site data for ${dashboardData?.projectName || 'Active Project'}`}
        </p>
      </div>

      <div className="bg-[#0b101e] border border-slate-800/80 rounded-xl p-12 text-center text-slate-400">
        <p className="text-sm">
          The <span className="text-orange-500 font-semibold">{title}</span> module is active for{' '}
          <span className="text-white font-medium">{dashboardData?.projectName}</span>.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Connect your Express API endpoints to populate real-time site records.
        </p>
      </div>
    </div>
  );
}
