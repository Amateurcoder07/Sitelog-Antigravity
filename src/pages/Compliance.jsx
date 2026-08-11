import React, { useState, useEffect } from 'react';
import { fetchComplianceData } from '../data/mockComplianceData';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { 
  FileCheck, 
  IndianRupee, 
  Users, 
  Award, 
  Plus, 
  Download, 
  Landmark, 
  Calendar,
  X 
} from 'lucide-react';

export default function Compliance() {
  const { showToast } = useToast();

  const [kpis, setKpis] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [cessStats, setCessStats] = useState(null);
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [bocwInput, setBocwInput] = useState('Done');
  const [hoursInput, setHoursInput] = useState('');
  const [overallInput, setOverallInput] = useState('Compliant');

  useEffect(() => {
    fetchComplianceData().then((data) => {
      setKpis(data.kpis);
      setWorkers(data.workers);
      setCessStats(data.cessStats);
      setDeadlines(data.deadlines);
      setIsLoading(false);
    });
  }, []);

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

  const handleDownloadReport = () => {
    showToast('Downloading compliance report...');
  };

  const handleSaveWorker = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newWorker = {
      id: `wc-${Date.now()}`,
      workerName: nameInput.trim(),
      bocwStatus: bocwInput,
      safetyHours: parseFloat(hoursInput) || 0,
      overallStatus: overallInput
    };

    setWorkers((prev) => [newWorker, ...prev]);

    if (bocwInput === 'Done' && kpis) {
      setKpis((prev) => ({
        ...prev,
        workersRegisteredCount: prev.workersRegisteredCount + 1,
        totalWorkersCount: prev.totalWorkersCount + 1
      }));
    }

    showToast('Worker compliance record added');
    setNameInput('');
    setHoursInput('');
    setIsAddWorkerOpen(false);
  };

  if (isLoading || !kpis) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Download Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Compliance
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={handleDownloadReport}
          className="text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Download Report</span>
        </Button>
      </div>

      {/* TOP 4 COMPLIANCE KPI CARDS (Image 0) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Project Registration */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <FileCheck size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Project Registration
          </span>
          <span className="text-white text-xl font-bold tracking-tight block">
            {kpis.projectRegistrationStatus}
          </span>
          <span className="text-emerald-400 text-xs font-medium block mt-1">
            Cert No. {kpis.certNumber}
          </span>
        </div>

        {/* Card 2: Cess Payment */}
        <div className="bg-[#090e1a] border border-[#ea580c]/30 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <IndianRupee size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Cess Payment
          </span>
          <span className="text-white text-xl font-bold tracking-tight block">
            {kpis.cessDueDate}
          </span>
          <span className="text-[#ea580c] text-xs font-medium block mt-1">
            {formatCurrency(kpis.cessAmountOwed)} owed
          </span>
        </div>

        {/* Card 3: Workers Registered */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <Users size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Workers Registered
          </span>
          <span className="text-white text-xl font-bold tracking-tight block">
            {kpis.workersRegisteredCount} of {kpis.totalWorkersCount}
          </span>
          <span className="text-[#ea580c] text-xs font-medium block mt-1">
            registered
          </span>
        </div>

        {/* Card 4: Safety Training */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <Award size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Safety Training
          </span>
          <span className="text-white text-xl font-bold tracking-tight block">
            {kpis.safetyTrainingStatus}
          </span>
          <span className="text-emerald-400 text-xs font-medium block mt-1">
            avg {kpis.avgSafetyHours} hrs per worker
          </span>
        </div>
      </div>

      {/* WORKER COMPLIANCE SECTION & COLLAPSIBLE FORM (Image 0 & Image 1) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Worker Compliance</h2>
          <Button
            variant="primary"
            onClick={() => setIsAddWorkerOpen(!isAddWorkerOpen)}
            className="text-xs px-4 py-2 flex items-center gap-1.5"
          >
            {isAddWorkerOpen ? <X size={15} /> : <Plus size={15} />}
            <span>Add Worker</span>
          </Button>
        </div>

        {/* Collapsible Form Card (Image 1) */}
        {isAddWorkerOpen && (
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 animate-fade-in">
            <form onSubmit={handleSaveWorker} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Worker Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Yadav"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    BOCW Card Status
                  </label>
                  <select
                    value={bocwInput}
                    onChange={(e) => setBocwInput(e.target.value)}
                    className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="Done">Done</option>
                    <option value="Missing">Missing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Safety Hours
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={hoursInput}
                    onChange={(e) => setHoursInput(e.target.value)}
                    className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Overall Status
                  </label>
                  <select
                    value={overallInput}
                    onChange={(e) => setOverallInput(e.target.value)}
                    className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="Compliant">Compliant</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="text-xs px-4 py-2"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="text-xs px-5 py-2 font-semibold">
                  Save Worker
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Worker Compliance Table (Image 0) */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                  <th className="py-3.5 px-6">Worker Name</th>
                  <th className="py-3.5 px-6">BOCW Card Status</th>
                  <th className="py-3.5 px-6">Safety Hours</th>
                  <th className="py-3.5 px-6">Overall Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {workers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {worker.workerName}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-block ${
                          worker.bocwStatus === 'Done'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : worker.bocwStatus === 'Missing'
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                            : 'bg-orange-950/80 text-orange-400 border border-orange-800/80'
                        }`}
                      >
                        {worker.bocwStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      {worker.safetyHours}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block ${
                          worker.overallStatus === 'Compliant'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : worker.overallStatus === 'Incomplete'
                            ? 'bg-orange-950/60 text-orange-400 border border-orange-800/60'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                        }`}
                      >
                        {worker.overallStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CESS CALCULATOR CARD (Image 0) */}
      {cessStats && (
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c]">
              <Landmark size={16} />
            </div>
            <h2 className="text-white font-bold text-base">Cess Calculator</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                Total Construction Cost
              </span>
              <span className="text-white font-extrabold text-xl tracking-tight block">
                {formatCurrency(cessStats.totalConstructionCost)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                Cess Rate
              </span>
              <span className="text-white font-extrabold text-xl tracking-tight block">
                {cessStats.cessRatePercent}%
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                Amount Owed
              </span>
              <span className="text-white font-extrabold text-xl tracking-tight block">
                {formatCurrency(cessStats.amountOwed)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                Paid to Date
              </span>
              <span className="text-white font-extrabold text-xl tracking-tight block">
                {formatCurrency(cessStats.paidToDate)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                Currently Owed
              </span>
              <span className="text-[#ea580c] font-extrabold text-2xl tracking-tight block">
                {formatCurrency(cessStats.currentlyOwed)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING DEADLINES CARD (Image 0) */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c]">
            <Calendar size={16} />
          </div>
          <h2 className="text-white font-bold text-base">Upcoming Deadlines</h2>
        </div>

        <div className="divide-y divide-slate-800/50">
          {deadlines.map((dl) => (
            <div
              key={dl.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#040711] border border-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <Calendar size={15} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{dl.title}</h4>
                  <p className="text-slate-400 text-xs">{dl.dueDate}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block self-start sm:self-auto ${
                  dl.badgeVariant === 'red'
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                    : dl.badgeVariant === 'orange'
                    ? 'bg-orange-950/80 text-orange-400 border border-orange-800/80'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                }`}
              >
                {dl.badgeText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
