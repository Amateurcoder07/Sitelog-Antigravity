import React, { useState } from 'react';
import Button from '../Button';
import NewCubePourModal from './NewCubePourModal';
import { calculateCompressiveStrength, evaluateCubeGroup } from '../../data/mockCubeRegisterData';
import {
  Calendar,
  Layers,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  ShieldCheck,
  UserCheck,
  Scale,
  Activity,
  Sparkles,
  Info,
  Clock,
  Printer
} from 'lucide-react';

export default function ConcreteCubeRegister({ pours: initialPours, onUpdatePours, showToast }) {
  const [pours, setPours] = useState(initialPours);
  const [testPeriod, setTestPeriod] = useState('day28'); // 'day7' | 'day28'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMobileIds, setExpandedMobileIds] = useState({});

  // Toggle mobile accordion
  const toggleAccordion = (id) => {
    setExpandedMobileIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handler: Save New Pour Entry
  const handleSaveNewPour = (newPour) => {
    const updated = [newPour, ...pours];
    setPours(updated);
    if (onUpdatePours) onUpdatePours(updated);
    if (showToast) showToast(`Concrete pour entry logged: ${newPour.id} (Set of 3 Cubes)`);
  };

  // Handler: Inline Cube Data Update (Weight or Crushing Load)
  const handleCubeUpdate = (pourId, cubeIndex, field, value) => {
    const updated = pours.map((pour) => {
      if (pour.id !== pourId) return pour;

      const newCubes = [...pour.cubes];
      const targetCube = { ...newCubes[cubeIndex] };

      if (field === 'weight') {
        targetCube.weight = parseFloat(value) || 0;
      } else if (field === 'crushingLoad') {
        const loadVal = parseFloat(value) || 0;
        const calcStrength = calculateCompressiveStrength(loadVal);

        targetCube[testPeriod] = {
          ...targetCube[testPeriod],
          testingDate: loadVal > 0 ? (targetCube[testPeriod]?.testingDate || new Date().toISOString().split('T')[0]) : '',
          crushingLoad: loadVal,
          compressiveStrength: calcStrength
        };
      }

      newCubes[cubeIndex] = targetCube;
      return { ...pour, cubes: newCubes };
    });

    setPours(updated);
    if (onUpdatePours) onUpdatePours(updated);
  };

  // Handler: Parent Remarks Update
  const handleRemarksChange = (pourId, text) => {
    const updated = pours.map((p) => (p.id === pourId ? { ...p, remarks: text } : p));
    setPours(updated);
    if (onUpdatePours) onUpdatePours(updated);
  };

  // Handler: Digital Verification Sign-off
  const handleDigitalSignOff = (pourId) => {
    const now = new Date();
    const timeStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = pours.map((p) => {
      if (p.id !== pourId) return p;
      return {
        ...p,
        digitallyVerifiedBy: {
          name: 'Er. K.B. (Contractor QC) & EIL',
          timestamp: timeStr,
          role: 'Verified by KB (Contractor) / EIL'
        }
      };
    });

    setPours(updated);
    if (onUpdatePours) onUpdatePours(updated);
    if (showToast) showToast(`Digitally verified & stamped pour ${pourId} ✓`);
  };

  // Filtered pours based on search
  const filteredPours = pours.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.location.toLowerCase().includes(q) ||
      p.grade.toLowerCase().includes(q) ||
      p.mixDesignNo.toLowerCase().includes(q) ||
      p.pourCardNo.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Controls & Testing Timelines Switch (7-Day vs 28-Day) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Layers size={22} />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-black dark:text-white tracking-tight flex items-center gap-2">
              Concrete Cube Test Register
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                IS:456 / IS:516 Format
              </span>
            </h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Set of 3 cubes per pour with auto-calculated mean strength & IS Code ±15% deviation check.
            </p>
          </div>
        </div>

        {/* Controls: Timeline Toggle & Add Pour */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 7-Day vs 28-Day Toggle Switch */}
          <div className="flex items-center p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
            <button
              onClick={() => setTestPeriod('day7')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                testPeriod === 'day7'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
              }`}
            >
              <Clock size={14} />
              7-Day Testing
            </button>
            <button
              onClick={() => setTestPeriod('day28')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                testPeriod === 'day28'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              28-Day Testing
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="!text-xs gap-1.5 bg-orange-600 hover:bg-orange-700 text-white min-h-[38px]"
          >
            <Plus size={14} />
            + Register New Pour (Set of 3)
          </Button>
        </div>
      </div>

      {/* 2. Search & Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40" />
          <input
            type="text"
            placeholder="Search location, grade, mix, card #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/5">
          <Info size={14} className="text-orange-500 flex-shrink-0" />
          <span>Active Timeline: <strong className="text-black dark:text-white uppercase font-bold">{testPeriod === 'day7' ? '7-Day Compressive Strength' : '28-Day Compressive Strength'}</strong></span>
        </div>
      </div>

      {/* 3. DESKTOP VIEW (>768px): Grouped Data Grid replicating handwritten site logbook */}
      <div className="hidden md:block bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 border-r border-black/10 dark:border-white/10 w-16">Sr No</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10 w-16">Cube ID</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10">Mix / Grade</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10">Date & Card #</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10">Structure Location</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10 w-24">Weight (kg)</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10 w-28">{testPeriod === 'day7' ? '7-Day' : '28-Day'} Load (kN)</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10 w-32">Strength (N/mm²)</th>
                <th className="p-3 border-r border-black/10 dark:border-white/10 w-36 text-center">Mean Strength</th>
                <th className="p-3">Remarks & Digital Sign-off</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filteredPours.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-black/50 dark:text-white/50">
                    No concrete cube pour entries match your search query.
                  </td>
                </tr>
              ) : (
                filteredPours.map((pour) => {
                  const evalResult = evaluateCubeGroup(pour.cubes, testPeriod);
                  const { meanStrength, hasDeviationWarning, cubeDeviations } = evalResult;

                  return (
                    <React.Fragment key={pour.id}>
                      {pour.cubes.map((cube, idx) => {
                        const testData = cube[testPeriod] || {};
                        const isDeviated = cubeDeviations[idx];

                        return (
                          <tr
                            key={`${pour.id}-${cube.cubeId}`}
                            className={`transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02] ${
                              isDeviated
                                ? 'bg-red-500/10 dark:bg-red-500/10 border-l-4 border-l-red-500'
                                : idx === 0
                                ? 'border-t-2 border-t-black/10 dark:border-t-white/10'
                                : ''
                            }`}
                          >
                            {/* Sr No */}
                            <td className="p-2.5 border-r border-black/10 dark:border-white/10 font-mono text-black/70 dark:text-white/70">
                              {cube.srNo}
                            </td>

                            {/* Cube ID */}
                            <td className="p-2.5 border-r border-black/10 dark:border-white/10 font-mono font-bold text-orange-600 dark:text-orange-400">
                              {cube.cubeId}
                            </td>

                            {/* Mix & Grade (Merged visually on first row) */}
                            {idx === 0 ? (
                              <td
                                rowSpan="3"
                                className="p-3 border-r border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] align-top"
                              >
                                <span className="font-bold text-black dark:text-white block">{pour.grade}</span>
                                <span className="text-[10px] font-mono text-black/50 dark:text-white/50">Mix: {pour.mixDesignNo}</span>
                              </td>
                            ) : null}

                            {/* Date & Card # (Merged on first row) */}
                            {idx === 0 ? (
                              <td
                                rowSpan="3"
                                className="p-3 border-r border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] align-top"
                              >
                                <span className="font-medium text-black dark:text-white block">{pour.pourDate}</span>
                                <span className="text-[10px] font-semibold text-black/50 dark:text-white/50">Card #{pour.pourCardNo}</span>
                              </td>
                            ) : null}

                            {/* Location (Merged on first row) */}
                            {idx === 0 ? (
                              <td
                                rowSpan="3"
                                className="p-3 border-r border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] align-top font-medium text-black dark:text-white"
                              >
                                {pour.location}
                              </td>
                            ) : null}

                            {/* Weight (kg) */}
                            <td className="p-2 border-r border-black/10 dark:border-white/10">
                              <input
                                type="number"
                                step="0.001"
                                value={cube.weight || ''}
                                onChange={(e) => handleCubeUpdate(pour.id, idx, 'weight', e.target.value)}
                                className="w-full px-2 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded font-mono text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </td>

                            {/* Crushing Load (kN) */}
                            <td className="p-2 border-r border-black/10 dark:border-white/10">
                              <input
                                type="number"
                                step="1"
                                value={testData.crushingLoad || ''}
                                onChange={(e) => handleCubeUpdate(pour.id, idx, 'crushingLoad', e.target.value)}
                                placeholder="kN"
                                className="w-full px-2 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded font-mono text-xs font-bold text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </td>

                            {/* Auto-Calculated Compressive Strength (N/mm²) - Readonly Field */}
                            <td className="p-2.5 border-r border-black/10 dark:border-white/10 font-mono">
                              <div className="flex items-center justify-between">
                                <span className={`font-black text-xs ${testData.compressiveStrength > 0 ? (isDeviated ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400') : 'text-black/30 dark:text-white/30'}`}>
                                  {testData.compressiveStrength > 0 ? `${testData.compressiveStrength.toFixed(2)}` : '0.00'}
                                </span>
                                <span className="text-[10px] text-black/40 dark:text-white/40 font-sans">N/mm²</span>
                              </div>
                              {isDeviated && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-1 py-0.2 rounded mt-0.5">
                                  <AlertTriangle size={10} /> &gt;15% IS Dev
                                </span>
                              )}
                            </td>

                            {/* Mean Compressive Strength (Merged Bracket spanning 3 rows) */}
                            {idx === 0 ? (
                              <td
                                rowSpan="3"
                                className={`p-3 border-r border-black/10 dark:border-white/10 align-middle text-center relative ${
                                  hasDeviationWarning
                                    ? 'bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400'
                                    : 'bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center space-y-1">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-black/50 dark:text-white/50">
                                    Mean (3 Cubes)
                                  </span>
                                  <span className="text-base font-black font-mono tracking-tight">
                                    {meanStrength > 0 ? `${meanStrength.toFixed(2)} N/mm²` : 'Pending'}
                                  </span>

                                  {hasDeviationWarning ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-500/20 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                                      <AlertTriangle size={12} /> IS 456 Warning
                                    </span>
                                  ) : meanStrength > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 size={12} /> Verified Pass
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                            ) : null}

                            {/* Remarks & Digital Sign-off (Merged on first row) */}
                            {idx === 0 ? (
                              <td
                                rowSpan="3"
                                className="p-3 align-top bg-black/[0.01] dark:bg-white/[0.01] space-y-2"
                              >
                                <input
                                  type="text"
                                  value={pour.remarks || ''}
                                  onChange={(e) => handleRemarksChange(pour.id, e.target.value)}
                                  placeholder="Add site remarks..."
                                  className="w-full px-2.5 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />

                                <div>
                                  {pour.digitallyVerifiedBy ? (
                                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                                      <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                                      <div>
                                        <p className="leading-tight font-bold">{pour.digitallyVerifiedBy.name}</p>
                                        <p className="text-[9px] opacity-80">{pour.digitallyVerifiedBy.timestamp}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleDigitalSignOff(pour.id)}
                                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[11px] font-bold transition-all cursor-pointer"
                                    >
                                      <UserCheck size={14} />
                                      Digitally Verify
                                    </button>
                                  )}
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MOBILE VIEW (<=768px): Expandable Card Accordion (PWA Optimized) */}
      <div className="block md:hidden space-y-4">
        {filteredPours.length === 0 ? (
          <div className="p-8 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-2xl text-center text-black/50 dark:text-white/50 text-xs">
            No concrete cube pours found.
          </div>
        ) : (
          filteredPours.map((pour) => {
            const isExpanded = expandedMobileIds[pour.id] || false;
            const evalResult = evaluateCubeGroup(pour.cubes, testPeriod);
            const { meanStrength, hasDeviationWarning } = evalResult;

            return (
              <div
                key={pour.id}
                className={`bg-white dark:bg-[#0a0f1d] border rounded-2xl overflow-hidden shadow-sm transition-all ${
                  hasDeviationWarning
                    ? 'border-red-500/40 bg-red-500/[0.02]'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                {/* Parent Card Header */}
                <div
                  onClick={() => toggleAccordion(pour.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer bg-black/5 dark:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-black dark:text-white">
                        {pour.location}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        {pour.grade}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-black/60 dark:text-white/60">
                      <span>Card #{pour.pourCardNo}</span>
                      <span>•</span>
                      <span>{pour.pourDate}</span>
                      <span>•</span>
                      <span className="font-mono text-black/70 dark:text-white/70">Mix: {pour.mixDesignNo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-black/40 dark:text-white/40 block">
                        Mean Str
                      </span>
                      <span className={`text-xs font-black font-mono ${meanStrength > 0 ? (hasDeviationWarning ? 'text-red-600' : 'text-emerald-600') : 'text-black/40'}`}>
                        {meanStrength > 0 ? `${meanStrength.toFixed(1)} N/mm²` : 'Pending'}
                      </span>
                    </div>

                    <div className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Status Badge Ribbon */}
                <div className="px-4 py-2 border-t border-b border-black/5 dark:border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-black/60 dark:text-white/60">
                    Cubes Range: <strong className="font-mono text-black dark:text-white">{pour.srNoRange}</strong>
                  </span>

                  {hasDeviationWarning ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={12} /> IS 456 Warning (&gt;15%)
                    </span>
                  ) : meanStrength > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Passed ({testPeriod === 'day7' ? '7-Day' : '28-Day'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Clock size={12} /> Pending Test
                    </span>
                  )}
                </div>

                {/* Expandable Accordion Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-black/70 dark:text-white/70">
                      <span>Enter 3 Cube Test Data:</span>
                      <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono">
                        Formula: (Load × 1000) / 22,500
                      </span>
                    </div>

                    {/* 3 Child Cube Touch Cards */}
                    <div className="space-y-3">
                      {pour.cubes.map((cube, idx) => {
                        const testData = cube[testPeriod] || {};
                        const isDeviated = evalResult.cubeDeviations[idx];

                        return (
                          <div
                            key={cube.cubeId}
                            className={`p-3.5 rounded-xl border space-y-2.5 transition-colors ${
                              isDeviated
                                ? 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400'
                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-black dark:text-white">
                                Cube #{idx + 1}: <span className="font-mono text-orange-600 dark:text-orange-400">{cube.cubeId}</span> (Sr #{cube.srNo})
                              </span>

                              <div className="text-right font-mono">
                                <span className="text-[10px] text-black/40 dark:text-white/40 block">Strength</span>
                                <span className={`text-xs font-black ${testData.compressiveStrength > 0 ? (isDeviated ? 'text-red-600' : 'text-emerald-600') : 'text-black/40'}`}>
                                  {testData.compressiveStrength > 0 ? `${testData.compressiveStrength.toFixed(2)} N/mm²` : '0.00'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-black/50 dark:text-white/50 mb-1">
                                  Weight (kg)
                                </label>
                                <input
                                  type="number"
                                  step="0.001"
                                  value={cube.weight || ''}
                                  onChange={(e) => handleCubeUpdate(pour.id, idx, 'weight', e.target.value)}
                                  placeholder="e.g. 8.774"
                                  className="w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-black dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase text-black/50 dark:text-white/50 mb-1">
                                  Crushing Load (kN)
                                </label>
                                <input
                                  type="number"
                                  step="1"
                                  value={testData.crushingLoad || ''}
                                  onChange={(e) => handleCubeUpdate(pour.id, idx, 'crushingLoad', e.target.value)}
                                  placeholder="kN"
                                  className="w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-black dark:text-white"
                                />
                              </div>
                            </div>

                            {isDeviated && (
                              <p className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 p-1.5 rounded-lg flex items-center gap-1">
                                <AlertTriangle size={12} /> Deviates by &gt;15% from calculated Mean Strength ({meanStrength.toFixed(2)} N/mm²)
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Mean Display & Sign-off on Mobile Card */}
                    <div className="p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-black/50 dark:text-white/50 block">
                            Calculated Mean Strength
                          </span>
                          <span className="text-base font-black font-mono text-black dark:text-white">
                            {meanStrength > 0 ? `${meanStrength.toFixed(2)} N/mm²` : 'Pending'}
                          </span>
                        </div>

                        {hasDeviationWarning ? (
                          <span className="text-[10px] font-bold bg-red-500/20 text-red-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle size={12} /> Rejection Alert
                          </span>
                        ) : meanStrength > 0 ? (
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified Pass
                          </span>
                        ) : null}
                      </div>

                      {/* Remarks */}
                      <input
                        type="text"
                        value={pour.remarks || ''}
                        onChange={(e) => handleRemarksChange(pour.id, e.target.value)}
                        placeholder="Site remarks..."
                        className="w-full px-3 py-2 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 rounded-xl text-xs text-black dark:text-white"
                      />

                      {/* Digital Sign-off Button */}
                      <div>
                        {pour.digitallyVerifiedBy ? (
                          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            <div>
                              <p className="font-bold leading-tight">{pour.digitallyVerifiedBy.name}</p>
                              <p className="text-[10px] opacity-80">{pour.digitallyVerifiedBy.timestamp}</p>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleDigitalSignOff(pour.id)}
                            className="w-full !text-xs gap-2 py-2.5 bg-orange-600 text-white"
                          >
                            <UserCheck size={16} />
                            Digitally Verify & Sign Off
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Cube Pour Entry */}
      <NewCubePourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewPour}
      />
    </div>
  );
}
