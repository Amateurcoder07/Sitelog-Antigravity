import React from 'react';
import { useProject } from '../context/ProjectContext';
import { HardHat, Package, Users, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { dashboardData, isLoading } = useProject();

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  const { userName, projectName, lastUpdated, metrics, progress, riskAlert, healthScore } = dashboardData;

  const metricCards = [
    {
      label: 'Total Labour Cost',
      value: metrics.labourCost,
      icon: HardHat,
    },
    {
      label: 'Materials Spend',
      value: metrics.materialsSpend,
      icon: Package,
    },
    {
      label: 'Active Workers',
      value: metrics.activeWorkers,
      icon: Users,
    },
    {
      label: 'Open Safety Issues',
      value: metrics.openSafetyIssues,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Greetings, {userName}. Here's your site summary for {projectName}.
        </h1>
        <p className="text-slate-400 text-xs mt-1.5 font-normal">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center mb-4 text-[#ea580c]">
                <Icon size={18} />
              </div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                {card.label}
              </span>
              <span className="text-white text-2xl font-bold tracking-tight block">
                {card.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Project Progress Panel */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-white font-bold text-lg">
            Project Progress — {projectName}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Overall Project Progress: {progress.overallPercent}% Complete,{' '}
            <span className="text-[#ea580c] font-semibold">
              {progress.behindSchedulePercent}% Behind Schedule
            </span>
          </p>
        </div>

        {/* Milestones Dual-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {progress.milestones.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">{item.name}</span>
                <span className="text-slate-400">
                  Planned <span className="text-slate-300 font-medium">{item.planned}%</span>{' '}
                  <span className="text-[#ea580c] font-semibold ml-2">
                    Actual {item.actual}%
                  </span>
                </span>
              </div>
              {/* Dual Progress Bar Track */}
              <div className="h-2.5 bg-slate-800/80 rounded-full w-full relative overflow-hidden">
                {/* Planned Progress Bar */}
                <div
                  className="h-full bg-slate-700/60 rounded-full absolute top-0 left-0"
                  style={{ width: `${item.planned}%` }}
                ></div>
                {/* Actual Progress Bar (Deep Royal Orange) */}
                <div
                  className="h-full bg-[#ea580c] rounded-full absolute top-0 left-0 transition-all duration-500"
                  style={{ width: `${item.actual}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Alert Banner */}
      <div className="bg-[#090e1a] border border-[#ea580c]/30 rounded-xl p-4 flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c] flex-shrink-0">
          <AlertTriangle size={18} />
        </div>
        <p className="text-slate-300 text-xs md:text-sm">
          <span className="text-[#ea580c] font-bold">{riskAlert.highlight}</span>{' '}
          {riskAlert.text}
        </p>
      </div>

      {/* Project Health Score Card */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 flex items-center gap-4">
        {/* Health Score Circular Badge */}
        <div className="w-12 h-12 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg flex-shrink-0">
          {healthScore.score}
        </div>
        <div>
          <span className="text-slate-400 text-xs font-medium block">
            Project Health Score
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white font-bold text-lg">
              {healthScore.score}/{healthScore.maxScore}
            </span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[11px] font-medium px-2 py-0.5 rounded-md">
              {healthScore.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
