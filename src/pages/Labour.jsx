import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useToast } from '../context/ToastContext';
import { fetchLabourData } from '../data/mockLabourData';
import Button from '../components/Button';
import { 
  Users, 
  Clock, 
  IndianRupee, 
  Check, 
  X, 
  Minus, 
  Calendar, 
  History, 
  UserPlus, 
  Wallet,
  Plus,
  Lock,
  CalendarCheck
} from 'lucide-react';

export default function Labour() {
  const { dashboardData } = useProject();
  const { showToast } = useToast();

  const [activeMainTab, setActiveMainTab] = useState('attendance'); // 'attendance' | 'wages'
  const [attendanceSubTab, setAttendanceSubTab] = useState('today'); // 'today' | 'history'

  const [workers, setWorkers] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Attendance Lock & Request Edit Workflow State
  const [isAttendanceLocked, setIsAttendanceLocked] = useState(false);
  const [submittedTime, setSubmittedTime] = useState('7:10 PM');
  const [showEditRequestBox, setShowEditRequestBox] = useState(false);
  const [editReasonText, setEditReasonText] = useState('');

  // Form State for New Worker
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Mason');
  const [newDailyWage, setNewDailyWage] = useState('');

  useEffect(() => {
    fetchLabourData().then((data) => {
      setWorkers(data.workers);
      setHistoryLogs(data.history);
      setIsLoading(false);
    });
  }, []);

  // Handler: Register New Worker
  const handleRegisterWorker = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newDailyWage) return;

    const wage = parseFloat(newDailyWage) || 1000;
    const newWorker = {
      id: `w-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      dailyWage: wage,
      status: 'present',
      daysPresent: 1,
      wageEarned: wage,
      amountPaid: 0,
      isPaid: false
    };

    setWorkers((prev) => [newWorker, ...prev]);
    showToast(`New worker registered: ${newName.trim()}`);

    setNewName('');
    setNewDailyWage('');
  };

  // Handler: Toggle Attendance Status
  const handleStatusChange = (id, newStatus) => {
    if (isAttendanceLocked) return;
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
    );
  };

  // Handler: Mark Wage as Paid
  const handleMarkAsPaid = (worker) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === worker.id
          ? { ...w, isPaid: true, amountPaid: w.wageEarned }
          : w
      )
    );
    showToast(`${worker.name} marked as paid`);
  };

  // Handler: Submit Today's Attendance
  const handleSubmitTodayAttendance = () => {
    const presentCount = workers.filter((w) => w.status === 'present').length;
    const absentCount = workers.filter((w) => w.status === 'absent').length;
    const halfCount = workers.filter((w) => w.status === 'half').length;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const newLog = {
      id: `h-${Date.now()}`,
      date: dateString,
      summary: `${presentCount} present · ${absentCount} absent${halfCount > 0 ? ` · ${halfCount} half day` : ''}`,
      submittedAt: `Submitted at ${timeString}`
    };

    setHistoryLogs((prev) => [newLog, ...prev]);
    setIsAttendanceLocked(true);
    setSubmittedTime(timeString);
    showToast('Attendance submitted for today');
  };

  // Handler: Submit Request Edit
  const handleSubmitEditRequest = (e) => {
    e.preventDefault();
    setIsAttendanceLocked(false);
    setShowEditRequestBox(false);
    setEditReasonText('');
    showToast('Attendance unlocked for edits');
  };

  // Calculated Summaries for Today
  const presentWorkers = workers.filter((w) => w.status === 'present');
  const halfWorkers = workers.filter((w) => w.status === 'half');

  const presentCount = presentWorkers.length;
  const halfCount = halfWorkers.length;

  const totalTodayWage = workers.reduce((acc, w) => {
    if (w.status === 'present') return acc + w.dailyWage;
    if (w.status === 'half') return acc + w.dailyWage * 0.5;
    return acc;
  }, 0);

  // Calculated Summaries for Wages
  const totalPayroll = workers.reduce((acc, w) => acc + w.wageEarned, 0);
  const totalPaid = workers.reduce((acc, w) => acc + w.amountPaid, 0);
  const totalPending = totalPayroll - totalPaid;

  const formatCurrency = (val) =>
    '₹' + val.toLocaleString('en-IN');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Labour
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Select a status for every worker, then submit for the day.
          </p>
        </div>

        {activeMainTab === 'wages' && (
          <Button
            variant="primary"
            onClick={() => setActiveMainTab('attendance')}
            className="text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={15} />
            <span>Add Worker</span>
          </Button>
        )}
      </div>

      {/* Main Navigation Sub-Tabs: [Attendance] vs [Wages] */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeMainTab === 'attendance'
              ? 'bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/30 font-semibold'
              : 'bg-[#090e1a] text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Calendar size={14} />
          <span>Attendance</span>
        </button>
        <button
          onClick={() => setActiveMainTab('wages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeMainTab === 'wages'
              ? 'bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/30 font-semibold'
              : 'bg-[#090e1a] text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Wallet size={14} />
          <span>Wages</span>
        </button>
      </div>

      {/* VIEW A: ATTENDANCE MANAGEMENT */}
      {activeMainTab === 'attendance' && (
        <div className="space-y-6">
          {/* Secondary Sub-Tabs: [Today] vs [View History] */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAttendanceSubTab('today')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                attendanceSubTab === 'today'
                  ? 'bg-[#ea580c] text-white shadow-sm font-semibold'
                  : 'bg-[#090e1a] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Calendar size={13} />
              <span>Today</span>
            </button>
            <button
              onClick={() => setAttendanceSubTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                attendanceSubTab === 'history'
                  ? 'bg-[#ea580c] text-white shadow-sm font-semibold'
                  : 'bg-[#090e1a] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <History size={13} />
              <span>View History</span>
            </button>
          </div>

          {/* Register Worker Input Form */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c]">
                <UserPlus size={16} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Register Worker</h3>
                <p className="text-slate-400 text-xs">Add a new worker to your team.</p>
              </div>
            </div>

            <form onSubmit={handleRegisterWorker} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ravi Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="Mason">Mason</option>
                  <option value="Helper">Helper</option>
                  <option value="Foreman">Foreman</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Daily Wage (₹)
                </label>
                <input
                  type="number"
                  placeholder="1200"
                  value={newDailyWage}
                  onChange={(e) => setNewDailyWage(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div>
                <Button variant="primary" type="submit" className="w-full py-2 text-xs font-semibold">
                  Register Worker
                </Button>
              </div>
            </form>
          </div>

          {/* SUB-VIEW 1: TODAY'S ATTENDANCE */}
          {attendanceSubTab === 'today' && (
            <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
              {/* Card Header & Dynamic Summary Pills */}
              <div className="p-5 md:p-6 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c]">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">Today's Attendance</h2>
                    <p className="text-slate-400 text-xs">Yesterday: 18 present, 2 absent</p>
                  </div>
                </div>

                {/* Summary Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Users size={13} />
                    {presentCount} present
                  </span>
                  <span className="bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock size={13} />
                    {halfCount} half day
                  </span>
                  <span className="bg-[#141a2a] text-slate-300 border border-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <IndianRupee size={13} />
                    {formatCurrency(totalTodayWage)} due
                  </span>
                </div>
              </div>

              {/* ATTENDANCE LOCKED BANNER & REQUEST EDIT WORKFLOW */}
              {isAttendanceLocked && (
                <div className="m-4 md:m-6 p-4 rounded-xl bg-[#041a15] border border-emerald-800/80 space-y-3">
                  {/* Status Banner Header */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Lock size={14} />
                      <span>Submitted at {submittedTime}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <button
                      onClick={() => setShowEditRequestBox(!showEditRequestBox)}
                      className="text-[#ea580c] hover:text-orange-400 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Request Edit
                    </button>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Rows are locked for today.</span>
                  </div>

                  {/* Inline Request Edit Box */}
                  {showEditRequestBox && (
                    <form onSubmit={handleSubmitEditRequest} className="mt-3 pt-3 border-t border-emerald-900/60 space-y-3">
                      <label className="block text-xs font-semibold text-slate-200">
                        Reason for editing
                      </label>
                      <textarea
                        rows={2}
                        value={editReasonText}
                        onChange={(e) => setEditReasonText(e.target.value)}
                        placeholder="e.g. Marked Deepak absent by mistake, he worked a half day."
                        className="w-full bg-[#040711] border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ea580c]"
                        required
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setShowEditRequestBox(false)}
                          className="text-xs px-3 py-1.5"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          className="text-xs px-4 py-1.5"
                        >
                          Submit Request
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Workers Row List */}
              <div className="divide-y divide-slate-800/50">
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className={`p-4 px-4 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/30 transition-colors ${
                      isAttendanceLocked ? 'opacity-80' : ''
                    }`}
                  >
                    <div>
                      <h4 className="text-white font-bold text-sm">{worker.name}</h4>
                      <p className="text-slate-400 text-xs">
                        {worker.role} · ₹{worker.dailyWage}/day
                      </p>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className={`flex items-center gap-2 ${isAttendanceLocked ? 'pointer-events-none opacity-60' : ''}`}>
                      {/* Present Button */}
                      <button
                        disabled={isAttendanceLocked}
                        onClick={() => handleStatusChange(worker.id, 'present')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          worker.status === 'present'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-600 shadow-sm'
                            : 'bg-[#040711] text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Check size={13} />
                        Present
                      </button>

                      {/* Absent Button */}
                      <button
                        disabled={isAttendanceLocked}
                        onClick={() => handleStatusChange(worker.id, 'absent')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          worker.status === 'absent'
                            ? 'bg-rose-950 text-rose-400 border border-rose-600 shadow-sm'
                            : 'bg-[#040711] text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <X size={13} />
                        Absent
                      </button>

                      {/* Half Button */}
                      <button
                        disabled={isAttendanceLocked}
                        onClick={() => handleStatusChange(worker.id, 'half')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          worker.status === 'half'
                            ? 'bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/50 shadow-sm'
                            : 'bg-[#040711] text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Minus size={13} />
                        Half
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Footer Line & Submit CTA */}
              <div className="p-4 px-4 md:px-6 bg-[#060a14] border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <CalendarCheck size={14} className="text-[#ea580c]" />
                  <span>Monthly wages so far: <strong className="text-slate-200">₹64,000</strong></span>
                </div>

                {!isAttendanceLocked && (
                  <Button variant="primary" onClick={handleSubmitTodayAttendance} className="text-xs px-5 py-2 w-full sm:w-auto">
                    Submit Today's Attendance
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: ATTENDANCE HISTORY */}
          {attendanceSubTab === 'history' && (
            <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c]">
                  <History size={16} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Attendance History</h2>
                  <p className="text-slate-400 text-xs">Previously submitted days.</p>
                </div>
              </div>

              <div className="space-y-3">
                {historyLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-[#040711] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <h4 className="text-white font-bold text-sm mb-0.5">{log.date}</h4>
                      <p className="text-slate-400 text-xs">{log.summary}</p>
                    </div>

                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                      <Check size={13} />
                      {log.submittedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: WORKER WAGES */}
      {activeMainTab === 'wages' && (
        <div className="space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Total Payroll */}
            <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-[#ea580c] text-xs font-semibold mb-2">
                <IndianRupee size={14} />
                <span>Total Payroll This Month</span>
              </div>
              <span className="text-white font-extrabold text-2xl tracking-tight">
                {formatCurrency(totalPayroll)}
              </span>
            </div>

            {/* Total Paid */}
            <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
                <Check size={14} />
                <span>Total Paid</span>
              </div>
              <span className="text-emerald-400 font-extrabold text-2xl tracking-tight">
                {formatCurrency(totalPaid)}
              </span>
            </div>

            {/* Total Pending */}
            <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-[#ea580c] text-xs font-semibold mb-2">
                <Clock size={14} />
                <span>Total Pending</span>
              </div>
              <span className="text-[#ea580c] font-extrabold text-2xl tracking-tight">
                {formatCurrency(totalPending)}
              </span>
            </div>
          </div>

          {/* Payroll Table Container */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="p-5 md:p-6 border-b border-slate-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c]">
                <Wallet size={16} />
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Worker Wages</h2>
                <p className="text-slate-400 text-xs">This month's payroll by worker.</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                    <th className="py-3.5 px-4 md:px-6">Name</th>
                    <th className="py-3.5 px-4 md:px-6">Days Present</th>
                    <th className="py-3.5 px-4 md:px-6">Wage Earned</th>
                    <th className="py-3.5 px-4 md:px-6">Amount Paid</th>
                    <th className="py-3.5 px-4 md:px-6">Amount Pending</th>
                    <th className="py-3.5 px-4 md:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-4 md:px-6">
                        <span className="text-white font-bold block">{w.name}</span>
                        <span className="text-slate-500 text-[11px]">{w.role}</span>
                      </td>
                      <td className="py-4 px-4 md:px-6 font-medium text-slate-300">
                        {w.daysPresent}
                      </td>
                      <td className="py-4 px-4 md:px-6 font-bold text-white">
                        {formatCurrency(w.wageEarned)}
                      </td>
                      <td className="py-4 px-4 md:px-6 font-semibold text-emerald-400">
                        {formatCurrency(w.amountPaid)}
                      </td>
                      <td className="py-4 px-4 md:px-6 font-semibold text-[#ea580c]">
                        {formatCurrency(w.wageEarned - w.amountPaid)}
                      </td>
                      <td className="py-4 px-4 md:px-6 text-right">
                        {w.isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-600 px-3 py-1 rounded-lg text-[11px] font-semibold">
                            <Check size={12} />
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(w)}
                            className="bg-transparent hover:bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/80 hover:border-[#ea580c] px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
