import React, { useState, useEffect } from 'react';
import { X, Truck, Clock, Fuel, AlertTriangle, Pencil, Trash2, Wrench, History } from 'lucide-react';
import { StatusBadge } from './DeploymentMatrixTable';
import { fieldCls, labelCls } from './Modalshell';
import * as machineryService from '../../services/Machineryservice';

const boxCls = 'p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl space-y-2';
const actionBtn =
  'py-2 px-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer';

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-3 text-xs">
    <span className="text-black/50 dark:text-white/50 shrink-0">{label}</span>
    <span className="font-semibold text-black dark:text-white text-right">{children || '—'}</span>
  </div>
);

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function MachineDetailPanel({
  machine,
  onClose,
  onLogHours,
  onLogFuel,
  onReportIssue,
  onEdit,
  onDelete,
  onUpdateStatus,
}) {
  const [logs, setLogs] = useState({ shifts: [], fuel: [] });
  const [status, setStatus] = useState('STANDBY');
  const [activity, setActivity] = useState('');
  const [saving, setSaving] = useState(false);

  // Reload recent activity whenever the machine's readings change (after a log/top-up)
  useEffect(() => {
    let cancelled = false;
    machineryService
      .fetchMachineLogs(machine._id)
      .then((data) => !cancelled && setLogs(data))
      .catch(() => {});
    return () => { cancelled = true; };
  }, [machine._id, machine.hmrCurrent, machine.fuelLevel]);

  useEffect(() => {
    setStatus(machine.status === 'BREAKDOWN' ? 'STANDBY' : machine.status);
    setActivity(machine.status === 'BREAKDOWN' ? '' : machine.currentActivity);
  }, [machine._id, machine.status, machine.currentActivity]);

  const isRented = machine.classType.startsWith('Rented');
  const service = machine.hoursToService;

  const submitStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateStatus(machine, { status, currentActivity: activity });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#0a0f1d] border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col">
        <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <Truck size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-black dark:text-white truncate">{machine.name}</h3>
              <span className="text-xs font-mono text-black/50 dark:text-white/50">{machine.id} | {machine.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white rounded-lg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-black/10 dark:border-white/10 grid grid-cols-3 gap-2">
          <button onClick={() => onLogHours(machine)} className={actionBtn}><Clock size={14} className="text-orange-500" /> Hours</button>
          <button onClick={() => onLogFuel(machine)} className={actionBtn}><Fuel size={14} className="text-orange-500" /> Fuel</button>
          <button
            onClick={() => onReportIssue(machine)}
            className="py-2 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle size={14} /> Breakdown
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className={boxCls}>
            <Row label="Status"><StatusBadge status={machine.status} /></Row>
            <Row label="Current activity">{machine.currentActivity}</Row>
            <Row label="Ownership">{machine.classType}</Row>
            <Row label="Location">{machine.location}</Row>
            <Row label="Subcontractor">{machine.subcontractor}</Row>
            <Row label="Operator">{machine.assignedOperator}</Row>
            <Row label="Serial no.">{machine.serialNumber}</Row>
            {isRented && (
              <Row label="Contract">
                {machine.contractStartDate || machine.contractEndDate
                  ? `${fmtDate(machine.contractStartDate) || '…'} – ${fmtDate(machine.contractEndDate) || '…'}`
                  : ''}
              </Row>
            )}
          </div>

          {machine.status === 'BREAKDOWN' && machine.lastIssue && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-1">
              <p className="font-bold text-red-600 dark:text-red-400">{machine.lastIssue.issueType}</p>
              <p className="text-red-700 dark:text-red-300">{machine.lastIssue.description}</p>
              <p className="text-[10px] text-red-600/70 dark:text-red-300/70">
                Reported by {machine.lastIssue.reportedBy} · {fmtDateTime(machine.lastIssue.reportedAt)}
              </p>
            </div>
          )}

          <form onSubmit={submitStatus} className={boxCls}>
            <p className="text-xs font-bold text-black dark:text-white">
              {machine.status === 'BREAKDOWN' ? 'Mark as repaired' : 'Update status'}
            </p>
            <div>
              <label className={labelCls}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldCls}>
                <option value="PRODUCTIVE">Productive</option>
                <option value="IDLE">Idle (engine on)</option>
                <option value="STANDBY">Standby (engine off)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>What is it doing?</label>
              <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="e.g. Lifting rebar to 14th floor" className={fieldCls} />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving…' : machine.status === 'BREAKDOWN' ? 'Mark Repaired' : 'Save Status'}
            </button>
          </form>

          <div className={boxCls}>
            <span className="text-xs font-semibold text-black/50 dark:text-white/50">HMR Counter</span>
            <div className="text-xl font-black text-black dark:text-white font-mono">{machine.hmrCurrent} hrs</div>
            <span className="text-[11px] text-black/50 dark:text-white/50">Logged this month: {machine.loggedHoursThisMonth} hrs</span>
          </div>

          <div className={boxCls}>
            <span className="text-xs font-semibold text-black/50 dark:text-white/50">Fuel Tank</span>
            {machine.fuelCapacity > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${machine.fuelLevel < 20 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${machine.fuelLevel}%` }} />
                  </div>
                  <span className="font-mono font-bold text-xs text-black dark:text-white">{machine.fuelLevel}%</span>
                </div>
                <span className="text-[11px] text-black/50 dark:text-white/50">
                  Capacity {machine.fuelCapacity} L · filled today {machine.fuelFilledToday} L
                </span>
              </>
            ) : (
              <p className="text-xs text-black/50 dark:text-white/50">No tank capacity set — edit the machine to track fuel.</p>
            )}
          </div>

          <div className={boxCls}>
            <span className="text-xs font-semibold text-black/50 dark:text-white/50 flex items-center gap-1.5"><Wrench size={13} /> Service</span>
            <Row label="Last serviced">{fmtDate(machine.lastServiceDate)}</Row>
            <Row label="Next service at">{machine.nextServiceHmr != null ? `${machine.nextServiceHmr} HMR` : ''}</Row>
            {service != null && (
              <p className={`text-xs font-bold ${service <= 0 ? 'text-red-600 dark:text-red-400' : service <= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {service <= 0 ? `Service overdue by ${Math.abs(service)} hrs` : `Due in ${service} operating hours`}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5"><History size={13} className="text-orange-500" /> Recent activity</p>
            {logs.shifts.length === 0 && logs.fuel.length === 0 && (
              <p className="text-xs text-black/50 dark:text-white/50">No shifts or fuel top-ups logged yet.</p>
            )}
            {logs.shifts.map((s) => (
              <div key={s.id} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-black dark:text-white">{s.hoursLogged} h · {s.shift} shift</p>
                  <p className="text-black/50 dark:text-white/50">{s.by} · {s.source === 'LOGBOOK' ? 'PIN-verified logbook' : 'Quick log'}</p>
                  {s.notes && <p className="text-black/60 dark:text-white/60">{s.notes}</p>}
                </div>
                <span className="text-black/40 dark:text-white/40 whitespace-nowrap">{fmtDateTime(s.at)}</span>
              </div>
            ))}
            {logs.fuel.map((f) => (
              <div key={f.id} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-black dark:text-white">{f.litres} L diesel · slip {f.slipNo}</p>
                  <p className="text-black/50 dark:text-white/50">{f.by}{f.source ? ` · ${f.source}` : ''}</p>
                </div>
                <span className="text-black/40 dark:text-white/40 whitespace-nowrap">{fmtDateTime(f.at)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-2">
          <button onClick={() => onEdit(machine)} className={actionBtn}><Pencil size={14} /> Edit Details</button>
          {machine.canManage ? (
            <button
              onClick={() => onDelete(machine)}
              className="py-2 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} /> Remove
            </button>
          ) : (
            <span className="py-2 px-2 text-[11px] text-black/40 dark:text-white/40 text-center self-center">Only its creator can remove it</span>
          )}
        </div>
      </div>
    </>
  );
}