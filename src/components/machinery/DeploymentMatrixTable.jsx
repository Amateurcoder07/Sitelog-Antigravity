import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  ChevronRight, 
  FileText,
  Activity,
  Plus,
  CheckCircle2
} from 'lucide-react';

export default function DeploymentMatrixTable({ 
  fleetData = [], 
  onSelectMachine, 
  onLogHours, 
  onLogFuel, 
  onReportIssue 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  const filteredFleet = fleetData.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.subcontractor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || machine.status === statusFilter;
    const matchesClass = classFilter === 'ALL' || machine.classType.startsWith(classFilter);

    return matchesSearch && matchesStatus && matchesClass;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRODUCTIVE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Productive
          </span>
        );
      case 'IDLE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Idle (Engine On)
          </span>
        );
      case 'STANDBY':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Standby (Engine Off)
          </span>
        );
      case 'BREAKDOWN':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 inline-flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Breakdown
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-sm overflow-hidden space-y-0">
      {/* Header & Filter Controls */}
      <div className="p-4 md:p-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <span>Section 2: Machinery Live Deployment Matrix</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {filteredFleet.length} Active Machines
            </span>
          </h3>
          <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
            Real-time equipment location mapping, subcontractor assignments, and instant field action triggers.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search ID, name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Live Statuses</option>
            <option value="PRODUCTIVE">?? Productive</option>
            <option value="IDLE">?? Idle</option>
            <option value="STANDBY">? Standby</option>
            <option value="BREAKDOWN">?? Breakdown</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Class Ownerships</option>
            <option value="Owned">Owned Fleet</option>
            <option value="Rented">Rented Fleet</option>
          </select>
        </div>
      </div>

      {/* Scannable Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10 bg-slate-100/70 dark:bg-slate-800/60 text-[11px] uppercase font-bold text-black/60 dark:text-white/60 tracking-wider">
              <th className="py-3 px-4">Asset ID / Machine Name</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Current Location</th>
              <th className="py-3 px-4">Assigned Subcontractor</th>
              <th className="py-3 px-4">Live Status & Activity</th>
              <th className="py-3 px-4 text-center">HMR / Fuel</th>
              <th className="py-3 px-4 text-center">Quick Actions Inline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs text-black dark:text-white">
            {filteredFleet.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-black/50 dark:text-white/50">
                  No machinery deployment records match your filter query.
                </td>
              </tr>
            ) : (
              filteredFleet.map((machine) => (
                <tr 
                  key={machine.id}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => onSelectMachine(machine)}
                >
                  {/* Asset ID / Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs">
                        {machine.id}
                      </span>
                      <span className="font-bold text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {machine.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-black/50 dark:text-white/50 mt-0.5">
                      Operator: {machine.assignedOperator}
                    </div>
                  </td>

                  {/* Class */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/10">
                      {machine.classType}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin size={14} className="text-red-500 shrink-0" />
                      <span>{machine.location}</span>
                    </div>
                  </td>

                  {/* Assigned Subcontractor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                      <Building2 size={14} className="shrink-0" />
                      <span>{machine.subcontractor}</span>
                    </div>
                  </td>

                  {/* Live Status & Activity */}
                  <td className="py-3.5 px-4">
                    <div className="mb-1">{getStatusBadge(machine.status)}</div>
                    <div className="text-[11px] text-black/60 dark:text-white/60 truncate max-w-xs">
                      {machine.currentActivity}
                    </div>
                  </td>

                  {/* HMR / Fuel Level */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="font-bold">{machine.hmrCurrent} hrs</div>
                    <div className="text-[10px] text-black/50 dark:text-white/50 flex items-center justify-center gap-1 mt-0.5">
                      <Fuel size={11} className="text-orange-500" />
                      <span>{machine.fuelLevel}% Fuel</span>
                    </div>
                  </td>

                  {/* Quick Actions Inline */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {/* 1. Log Hours Button */}
                      <button
                        onClick={() => onLogHours(machine)}
                        title="Log Shift Hours"
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold text-xs transition-colors border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Clock size={13} />
                        <span>Log Hours</span>
                      </button>

                      {/* 2. Log Fuel Button */}
                      <button
                        onClick={() => onLogFuel(machine)}
                        title="Record Diesel Top-Up"
                        className="px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-300 font-semibold text-xs transition-colors border border-orange-200 dark:border-orange-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Fuel size={13} />
                        <span>Log Fuel</span>
                      </button>

                      {/* 3. Report Issue Button */}
                      <button
                        onClick={() => onReportIssue(machine)}
                        title="Report Breakdown Alert"
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-300 font-semibold text-xs transition-colors border border-red-200 dark:border-red-800 flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle size={13} />
                        <span>Issue</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
