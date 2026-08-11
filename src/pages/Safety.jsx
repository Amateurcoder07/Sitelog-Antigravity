import React, { useState, useEffect } from 'react';
import { fetchSafetyData } from '../data/mockSafetyData';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { Shield, BookOpen, AlertTriangle, HardHat, Plus, Megaphone } from 'lucide-react';

export default function Safety() {
  const { showToast } = useToast();

  const [kpis, setKpis] = useState({
    daysWithoutIncident: 14,
    briefingsThisMonth: 6,
    openIssuesCount: 2,
    ppeCompliancePercent: 87
  });
  const [openIssues, setOpenIssues] = useState([]);
  const [briefingLogs, setBriefingLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Form Panel: null | 'incident' | 'briefing'
  const [activeForm, setActiveForm] = useState(null);

  // Log Incident Form State
  const [incidentIssue, setIncidentIssue] = useState('');
  const [incidentDate, setIncidentDate] = useState('2026-08-11');
  const [incidentSeverity, setIncidentSeverity] = useState('High');
  const [incidentStatus, setIncidentStatus] = useState('In Progress');

  // Log Briefing Form State
  const [briefingTopic, setBriefingTopic] = useState('');
  const [briefingDate, setBriefingDate] = useState('2026-08-11');
  const [briefingAttendees, setBriefingAttendees] = useState('');

  useEffect(() => {
    fetchSafetyData().then((data) => {
      setKpis(data.kpis);
      setOpenIssues(data.openIssues);
      setBriefingLogs(data.briefingLogs);
      setIsLoading(false);
    });
  }, []);

  // Handler: Save Incident
  const handleSaveIncident = (e) => {
    e.preventDefault();
    if (!incidentIssue.trim()) return;

    const newIssue = {
      id: `issue-${Date.now()}`,
      issue: incidentIssue.trim(),
      dateReported: incidentDate || '2026-08-11',
      severity: incidentSeverity,
      status: incidentStatus
    };

    setOpenIssues((prev) => [newIssue, ...prev]);
    setKpis((prev) => ({
      ...prev,
      openIssuesCount: prev.openIssuesCount + 1
    }));

    showToast('Safety incident logged');
    setIncidentIssue('');
    setActiveForm(null);
  };

  // Handler: Save Briefing
  const handleSaveBriefing = (e) => {
    e.preventDefault();
    if (!briefingTopic.trim()) return;

    const newBriefing = {
      id: `briefing-${Date.now()}`,
      topic: briefingTopic.trim(),
      date: briefingDate || '2026-08-11',
      attendees: briefingAttendees.trim() || '15 workers'
    };

    setBriefingLogs((prev) => [newBriefing, ...prev]);
    setKpis((prev) => ({
      ...prev,
      briefingsThisMonth: prev.briefingsThisMonth + 1
    }));

    showToast('Safety briefing saved');
    setBriefingTopic('');
    setBriefingAttendees('');
    setActiveForm(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Safety
        </h1>
      </div>

      {/* TOP 4 KPI SUMMARY CARDS (Source: image_0.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Days Without Incident */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <Shield size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Days Without Incident
          </span>
          <span className="text-white text-2xl font-bold tracking-tight block">
            {kpis.daysWithoutIncident}
          </span>
        </div>

        {/* Card 2: Briefings This Month */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <BookOpen size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Briefings This Month
          </span>
          <span className="text-white text-2xl font-bold tracking-tight block">
            {kpis.briefingsThisMonth}
          </span>
        </div>

        {/* Card 3: Open Issues */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <AlertTriangle size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            Open Issues
          </span>
          <span className="text-white text-2xl font-bold tracking-tight block">
            {kpis.openIssuesCount}
          </span>
        </div>

        {/* Card 4: PPE Compliance */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
            <HardHat size={18} />
          </div>
          <span className="text-slate-400 text-xs font-medium block mb-1">
            PPE Compliance
          </span>
          <span className="text-white text-2xl font-bold tracking-tight block">
            {kpis.ppeCompliancePercent}%
          </span>
        </div>
      </div>

      {/* ACTION FORM TOGGLE BUTTONS (Image 0 Source) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveForm(activeForm === 'incident' ? null : 'incident')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeForm === 'incident'
              ? 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md'
              : 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md'
          }`}
        >
          <Plus size={15} />
          <span>Log Incident</span>
        </button>

        <button
          onClick={() => setActiveForm(activeForm === 'briefing' ? null : 'briefing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeForm === 'briefing'
              ? 'bg-[#ea580c] text-white shadow-md'
              : 'bg-[#090e1a] text-slate-200 border border-slate-800 hover:bg-slate-800/60'
          }`}
        >
          <Megaphone size={15} />
          <span>Log Briefing</span>
        </button>
      </div>

      {/* FORM 1: LOG INCIDENT PANEL (Image 1) */}
      {activeForm === 'incident' && (
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 animate-fade-in">
          <form onSubmit={handleSaveIncident} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Issue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scaffolding instability"
                  value={incidentIssue}
                  onChange={(e) => setIncidentIssue(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Date Reported
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Severity
                </label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Status
                </label>
                <select
                  value={incidentStatus}
                  onChange={(e) => setIncidentStatus(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setActiveForm(null)}
                className="text-xs px-4 py-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="text-xs px-5 py-2 font-semibold">
                Save Incident
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* FORM 2: LOG BRIEFING PANEL (Image 2) */}
      {activeForm === 'briefing' && (
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 animate-fade-in">
          <form onSubmit={handleSaveBriefing} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Briefing Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Working at heights"
                  value={briefingTopic}
                  onChange={(e) => setBriefingTopic(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={briefingDate}
                  onChange={(e) => setBriefingDate(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Attendees
                </label>
                <input
                  type="text"
                  placeholder="e.g. 21 workers"
                  value={briefingAttendees}
                  onChange={(e) => setBriefingAttendees(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setActiveForm(null)}
                className="text-xs px-4 py-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="text-xs px-5 py-2 font-semibold">
                Save Briefing
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* OPEN ISSUES TABLE (Image 0) */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-800/60">
          <h2 className="text-white font-bold text-base">Open Issues</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                <th className="py-3.5 px-6">Issue</th>
                <th className="py-3.5 px-6">Date Reported</th>
                <th className="py-3.5 px-6">Severity</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {openIssues.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    {item.issue}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {item.dateReported}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-block ${
                        item.severity === 'High'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                          : item.severity === 'Medium'
                          ? 'bg-orange-950/80 text-orange-400 border border-orange-800/80'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold inline-block ${
                        item.status === 'In Progress'
                          ? 'bg-orange-950/60 text-orange-400 border border-orange-800/60'
                          : item.status === 'Flagged'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BRIEFING LOG TABLE (Image 0) */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-800/60">
          <h2 className="text-white font-bold text-base">Briefing Log</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                <th className="py-3.5 px-6">Topic</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Attendees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {briefingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    {log.topic}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {log.date}
                  </td>
                  <td className="py-4 px-6 text-slate-200 font-medium">
                    {log.attendees}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
