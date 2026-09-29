import React, { useState } from 'react';
import { 
  Truck, 
  Gauge, 
  Activity, 
  Tablet, 
  Receipt, 
  Layers, 
  Plus, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  Building2,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

import FleetKpiRibbon from '../components/machinery/FleetKpiRibbon';
import DeploymentMatrixTable from '../components/machinery/DeploymentMatrixTable';
import DigitalOperatorLogbook from '../components/machinery/DigitalOperatorLogbook';
import FinancialReconciliationEngine from '../components/machinery/FinancialReconciliationEngine';
import MachineDetailPanel from '../components/machinery/MachineDetailPanel';

import LogHoursModal from '../components/machinery/LogHoursModal';
import LogFuelModal from '../components/machinery/LogFuelModal';
import ReportIssueModal from '../components/machinery/ReportIssueModal';
import NewBackchargeModal from '../components/machinery/NewBackchargeModal';

import { INITIAL_FLEET_DATA, INITIAL_SUBCONTRACTOR_BACKCHARGES } from '../data/mockMachineryData';

export default function MachineryManagement() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [fleetData, setFleetData] = useState(INITIAL_FLEET_DATA);
  const [backcharges, setBackcharges] = useState(INITIAL_SUBCONTRACTOR_BACKCHARGES);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [activeMachineForModal, setActiveMachineForModal] = useState(null);

  const handleOpenLogHours = (machine) => {
    setActiveMachineForModal(machine);
    setModalType('LOG_HOURS');
  };

  const handleOpenLogFuel = (machine) => {
    setActiveMachineForModal(machine);
    setModalType('LOG_FUEL');
  };

  const handleOpenReportIssue = (machine) => {
    setActiveMachineForModal(machine);
    setModalType('REPORT_ISSUE');
  };

  const handleOpenBackchargeModal = () => {
    setModalType('NEW_BACKCHARGE');
  };

  const handleSaveHoursLog = (logData) => {
    setFleetData(prev => prev.map(m => {
      if (m.id === logData.machineId) {
        return {
          ...m,
          hmrCurrent: logData.closingHmr,
          loggedHoursThisMonth: m.loggedHoursThisMonth + logData.hoursLogged
        };
      }
      return m;
    }));
  };

  const handleSaveFuelLog = (fuelData) => {
    setFleetData(prev => prev.map(m => {
      if (m.id === fuelData.machineId) {
        const newConsumed = (m.fuelConsumedToday || 0) + fuelData.litersFilled;
        return {
          ...m,
          fuelConsumedToday: newConsumed,
          fuelLevel: Math.min(100, (m.fuelLevel || 50) + 25)
        };
      }
      return m;
    }));
  };

  const handleSaveIssueReport = (issueData) => {
    setFleetData(prev => prev.map(m => {
      if (m.id === issueData.machineId) {
        return {
          ...m,
          status: 'BREAKDOWN',
          currentActivity: 'BREAKDOWN: ' + issueData.issueType + ' (' + issueData.description + ')'
        };
      }
      return m;
    }));
  };

  const handleAddBackcharge = (newCharge) => {
    setBackcharges(prev => [newCharge, ...prev]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Truck size={18} />
              <span>P&M & PM VIEW</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Heavy Machinery & Equipment Utilization
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Track fleet availability, engine idling, fuel theft risks, rental cash bleed & daily supervisor HMR logbooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenLogHours(fleetData[0])}
              className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
            >
              <Clock size={16} />
              Log Hours
            </button>
          </div>
        </div>

        {/* 4-Grid Responsive Navigation Bar - Always visible without scroll clipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('SECTION1_2')}
            className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center ${
              activeTab === 'SECTION1_2'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Layers size={16} className="shrink-0" />
            <span>Sec 1 & 2: Fleet & Deployment</span>
          </button>

          <button
            onClick={() => setActiveTab('SECTION3')}
            className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center ${
              activeTab === 'SECTION3'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Tablet size={16} className="shrink-0" />
            <span>Sec 3: Digital Cabin Logbook</span>
          </button>

          <button
            onClick={() => setActiveTab('SECTION4')}
            className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center ${
              activeTab === 'SECTION4'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <DollarSign size={16} className="shrink-0 text-emerald-400" />
            <span>Sec 4: Financial & Billing</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-center ${
              activeTab === 'ALL'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Layers size={16} className="shrink-0" />
            <span>All 4 Sections View</span>
          </button>
        </div>
      </div>

      {/* Render Selected Sections */}
      {(activeTab === 'ALL' || activeTab === 'SECTION1_2') && (
        <section className="space-y-6">
          <FleetKpiRibbon fleetData={fleetData} />
          <DeploymentMatrixTable
            fleetData={fleetData}
            onSelectMachine={(m) => setSelectedMachine(m)}
            onLogHours={handleOpenLogHours}
            onLogFuel={handleOpenLogFuel}
            onReportIssue={handleOpenReportIssue}
          />
        </section>
      )}

      {(activeTab === 'ALL' || activeTab === 'SECTION3') && (
        <section className="space-y-4 pt-2">
          <DigitalOperatorLogbook
            fleetData={fleetData}
            onSubmitLog={handleSaveHoursLog}
          />
        </section>
      )}

      {(activeTab === 'ALL' || activeTab === 'SECTION4') && (
        <section className="space-y-4 pt-2">
          <FinancialReconciliationEngine
            fleetData={fleetData}
            backcharges={backcharges}
            onAddBackcharge={handleAddBackcharge}
            onOpenBackchargeModal={handleOpenBackchargeModal}
          />
        </section>
      )}

      {/* Modals & Detail Panel */}
      {selectedMachine && (
        <MachineDetailPanel
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
          onLogHours={handleOpenLogHours}
          onLogFuel={handleOpenLogFuel}
          onReportIssue={handleOpenReportIssue}
        />
      )}

      {modalType === 'LOG_HOURS' && activeMachineForModal && (
        <LogHoursModal
          machine={activeMachineForModal}
          onClose={() => setModalType(null)}
          onSubmit={handleSaveHoursLog}
        />
      )}

      {modalType === 'LOG_FUEL' && activeMachineForModal && (
        <LogFuelModal
          machine={activeMachineForModal}
          onClose={() => setModalType(null)}
          onSubmit={handleSaveFuelLog}
        />
      )}

      {modalType === 'REPORT_ISSUE' && activeMachineForModal && (
        <ReportIssueModal
          machine={activeMachineForModal}
          onClose={() => setModalType(null)}
          onSubmit={handleSaveIssueReport}
        />
      )}

      {modalType === 'NEW_BACKCHARGE' && (
        <NewBackchargeModal
          fleetData={fleetData}
          onClose={() => setModalType(null)}
          onSubmit={handleAddBackcharge}
        />
      )}
    </div>
  );
}