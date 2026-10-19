import React, { useState } from 'react';
import { Search, MapPin, Building2, Clock, Fuel, AlertTriangle, Plus, Truck } from 'lucide-react';

export const STATUS_META = {
  PRODUCTIVE: {
    label: 'Productive',
    cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500 animate-pulse',
  },
  IDLE: {
    label: 'Idle (Engine On)',
    cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  STANDBY: {
    label: 'Standby (Engine Off)',
    cls: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
  },
  BREAKDOWN: {
    label: 'Breakdown',
    cls: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    dot: 'bg-red-500 animate-pulse',
  },
};

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.STANDBY;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${meta.cls}`}>
      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

const actionBtn =
  'px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-semibold text-xs border border-black/10 dark:border-white/10 flex items-center justify-center gap-1 cursor-pointer transition-colors';

function FuelBar({ machine }) {
  if (!(machine.fuelCapacity > 0)) return <span className="text-[10px] text-black/40 dark:text-white/40">No tank set</span>;
  const low = machine.fuelLevel < 20;
  return (
    <div className="flex items-center gap-1.5 justify-center">
      <Fuel size={11} className={low ? 'text-red-500' : 'text-orange-500'} />
      <div className="w-14 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${low ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${machine.fuelLevel}%` }} />
      </div>
      <span className="text-[10px] text-black/50 dark:text-white/50">{machine.fuelLevel}%</span>
    </div>
  );
}

function RowActions({ machine, onLogHours, onLogFuel, onReportIssue }) {
  return (
    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => onLogHours(machine)} title="Log shift hours" className={actionBtn}>
        <Clock size={13} /> <span>Hours</span>
      </button>
      <button onClick={() => onLogFuel(machine)} title="Record a fuel top-up" className={actionBtn}>
        <Fuel size={13} /> <span>Fuel</span>
      </button>
      <button
        onClick={() => onReportIssue(machine)}
        title="Report a breakdown"
        className={`${actionBtn} !bg-red-500/10 !text-red-600 dark:!text-red-400 !border-red-500/20 hover:!bg-red-500/20`}
      >
        <AlertTriangle size={13} /> <span>Issue</span>
      </button>
    </div>
  );
}

export default function DeploymentMatrixTable({
  machines = [],
  onSelectMachine,
  onLogHours,
  onLogFuel,
  onReportIssue,
  onAddMachine,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  const q = searchQuery.toLowerCase();
  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.location || '').toLowerCase().includes(q) ||
      (m.subcontractor || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesClass = classFilter === 'ALL' || m.classType.startsWith(classFilter);
    return matchesSearch && matchesStatus && matchesClass;
  });

  const selectCls =
    'px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer';

  if (machines.length === 0) {
    return (
      <div className="text-center py-14 bg-white dark:bg-[#0a0f1d] border border-dashed border-black/15 dark:border-white/15 rounded-2xl">
        <Truck className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
        <p className="text-sm text-black/60 dark:text-white/60 mb-4">No machinery added to this project yet.</p>
        <button
          onClick={onAddMachine}
          className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={14} /> Add your first machine
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h3 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
          Machinery Deployment
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            {filtered.length} machine{filtered.length === 1 ? '' : 's'}
          </span>
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search ID, name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option value="ALL">All statuses</option>
            <option value="PRODUCTIVE">Productive</option>
            <option value="IDLE">Idle</option>
            <option value="STANDBY">Standby</option>
            <option value="BREAKDOWN">Breakdown</option>
          </select>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className={selectCls}>
            <option value="ALL">Owned & rented</option>
            <option value="Owned">Owned</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-xs text-black/50 dark:text-white/50">No machines match your search or filters.</p>
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-[11px] uppercase font-bold text-black/60 dark:text-white/60 tracking-wider">
                <th className="py-3 px-4">Machine</th>
                <th className="py-3 px-4">Ownership</th>
                <th className="py-3 px-4">Location & Subcontractor</th>
                <th className="py-3 px-4">Status & Activity</th>
                <th className="py-3 px-4 text-center">HMR / Fuel</th>
                <th className="py-3 px-4 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs text-black dark:text-white">
              {filtered.map((m) => (
                <tr
                  key={m._id}
                  onClick={() => onSelectMachine(m)}
                  className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs">{m.id}</span>
                      <span className="font-bold group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{m.name}</span>
                    </div>
                    <div className="text-[10px] text-black/50 dark:text-white/50 mt-0.5">
                      {m.category}{m.assignedOperator ? ` · Operator: ${m.assignedOperator}` : ''}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 border border-black/5 dark:border-white/10">
                      {m.classType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin size={13} className="text-orange-500 shrink-0" />
                      <span>{m.location || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-black/60 dark:text-white/60">
                      <Building2 size={13} className="shrink-0" />
                      <span>{m.subcontractor || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="mb-1"><StatusBadge status={m.status} /></div>
                    <div className="text-[11px] text-black/60 dark:text-white/60 truncate max-w-xs">
                      {m.currentActivity || 'No activity noted'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono space-y-1">
                    <div className="font-bold">{m.hmrCurrent} hrs</div>
                    <FuelBar machine={m} />
                  </td>
                  <td className="py-3.5 px-4">
                    <RowActions machine={m} onLogHours={onLogHours} onLogFuel={onLogFuel} onReportIssue={onReportIssue} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {filtered.length > 0 && (
        <div className="md:hidden p-3 space-y-3">
          {filtered.map((m) => (
            <div
              key={m._id}
              onClick={() => onSelectMachine(m)}
              className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-3 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-xs text-black dark:text-white">{m.id}</span>
                  <p className="font-bold text-sm text-black dark:text-white mt-1.5">{m.name}</p>
                  <p className="text-[11px] text-black/50 dark:text-white/50">{m.classType} · {m.category}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <p className="text-[11px] text-black/60 dark:text-white/60">{m.currentActivity || 'No activity noted'}</p>
              <div className="flex items-center justify-between text-xs text-black dark:text-white">
                <span className="flex items-center gap-1.5"><MapPin size={13} className="text-orange-500" />{m.location || '—'}</span>
                <span className="font-mono font-bold">{m.hmrCurrent} hrs</span>
              </div>
              <FuelBar machine={m} />
              <RowActions machine={m} onLogHours={onLogHours} onLogFuel={onLogFuel} onReportIssue={onReportIssue} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}