import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Truck, Tablet, Receipt, Layers, Plus, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import * as machineryService from '../services/Machineryservice';

import FleetKpiRibbon from '../components/machinery/FleetKpiRibbon';
import DeploymentMatrixTable from '../components/machinery/DeploymentMatrixTable';
import DigitalOperatorLogbook from '../components/machinery/DigitalOperatorLogbook';
import FinancialReconciliationEngine from '../components/machinery/FinancialReconciliationEngine';
import MachineDetailPanel from '../components/machinery/MachineDetailPanel';

import MachineFormModal from '../components/machinery/Machineformmodal';
import OperatorModal from '../components/machinery/Operatormodal';
import LogHoursModal from '../components/machinery/LogHoursModal';
import LogFuelModal from '../components/machinery/LogFuelModal';
import ReportIssueModal from '../components/machinery/ReportIssueModal';
import NewBackchargeModal from '../components/machinery/NewBackchargeModal';

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

export default function MachineryManagement() {
  const { showToast } = useToast();
  const { projectId } = useParams();
  const hasRealProject = OBJECT_ID_RE.test(projectId || '');

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'logbook' | 'billing'
  const [machines, setMachines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [backcharges, setBackcharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedMachineId, setSelectedMachineId] = useState(null);
  // modal: null | { type: 'ADD_MACHINE' | 'EDIT_MACHINE' | 'LOG_HOURS' | 'LOG_FUEL' | 'REPORT_ISSUE' | 'NEW_BACKCHARGE' | 'ADD_OPERATOR', machineId? }
  const [modal, setModal] = useState(null);

  const failToast = (err, fallback) => showToast(`⚠️ ${err?.response?.data?.msg || fallback}`);

  useEffect(() => {
    if (!hasRealProject) {
      setIsLoading(false);
      return undefined;
    }
    let cancelled = false;
    setIsLoading(true);
    setLoadError('');
    machineryService
      .fetchMachinery(projectId)
      .then((data) => {
        if (cancelled) return;
        setMachines(data.machines);
        setOperators(data.operators);
        setBackcharges(data.backcharges);
      })
      .catch((err) => !cancelled && setLoadError(err.response?.data?.msg || 'Could not load machinery data.'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, [projectId, hasRealProject]);

  const selectedMachine = machines.find((m) => m._id === selectedMachineId) || null;
  const modalMachine = modal?.machineId ? machines.find((m) => m._id === modal.machineId) : null;
  const openModal = (type, machine) => setModal({ type, machineId: machine?._id });
  const closeModal = () => setModal(null);

  const replaceMachine = (machine) => setMachines((prev) => prev.map((m) => (m._id === machine._id ? machine : m)));

  // ---------------------------------------------------------------- machines
  const handleSaveMachine = async (payload) => {
    try {
      if (modal.type === 'EDIT_MACHINE') {
        const { machine } = await machineryService.updateMachine(modal.machineId, payload);
        replaceMachine(machine);
        showToast(`Updated ${machine.name}`);
      } else {
        const { machine } = await machineryService.createMachine(projectId, payload);
        setMachines((prev) => [...prev, machine]);
        showToast(`Added ${machine.name} (${machine.id})`);
      }
      return true;
    } catch (err) {
      failToast(err, 'Could not save the machine.');
      return false;
    }
  };

  const handleDeleteMachine = async (machine) => {
    if (!window.confirm(`Remove ${machine.name} (${machine.id})? Its hour and fuel logs will be deleted too. Back-charges already raised are kept.`)) return;
    try {
      await machineryService.deleteMachine(machine._id);
      setMachines((prev) => prev.filter((m) => m._id !== machine._id));
      setSelectedMachineId(null);
      showToast(`Removed ${machine.name}`);
    } catch (err) {
      failToast(err, 'Could not remove the machine.');
    }
  };

  const handleUpdateStatus = async (machine, payload) => {
    try {
      const { machine: updated } = await machineryService.updateMachineStatus(machine._id, payload);
      replaceMachine(updated);
      showToast(`${updated.name} status updated`);
    } catch (err) {
      failToast(err, 'Could not update the status.');
    }
  };

  // ----------------------------------------------------------------- logging
  const handleLogHours = async (machine, payload) => {
    try {
      const { machine: updated } = await machineryService.logHours(machine._id, payload);
      replaceMachine(updated);
      showToast(`Logged ${Math.round((updated.hmrCurrent - machine.hmrCurrent) * 10) / 10} hrs on ${updated.id}`);
      return true;
    } catch (err) {
      failToast(err, 'Could not log the hours.');
      return false;
    }
  };

  const handleLogbookSubmit = async (machine, payload) => {
    try {
      const { machine: updated } = await machineryService.logShift(machine._id, payload);
      replaceMachine(updated);
      showToast(`Shift logbook recorded for ${updated.id}`);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.msg || 'Could not submit the logbook.' };
    }
  };

  const handleLogFuel = async (machine, payload) => {
    try {
      const { machine: updated } = await machineryService.logFuel(machine._id, payload);
      replaceMachine(updated);
      showToast(`Fuel logged for ${updated.id} — tank now ${updated.fuelLevel}%`);
      return true;
    } catch (err) {
      failToast(err, 'Could not log the fuel.');
      return false;
    }
  };

  const handleReportIssue = async (machine, payload) => {
    try {
      const { machine: updated } = await machineryService.reportIssue(machine._id, payload);
      replaceMachine(updated);
      showToast(`${updated.id} flagged as broken down`);
      return true;
    } catch (err) {
      failToast(err, 'Could not report the breakdown.');
      return false;
    }
  };

  // --------------------------------------------------------------- operators
  const handleAddOperator = async (payload) => {
    try {
      const { operator } = await machineryService.createOperator(projectId, payload);
      setOperators((prev) => [...prev, operator]);
      showToast(`Operator ${operator.name} added (${operator.id})`);
      return true;
    } catch (err) {
      failToast(err, 'Could not add the operator.');
      return false;
    }
  };

  const handleRemoveOperator = async (operator) => {
    if (!window.confirm(`Remove operator ${operator.name}?`)) return;
    try {
      await machineryService.deleteOperator(operator._id);
      setOperators((prev) => prev.filter((o) => o._id !== operator._id));
      setMachines((prev) =>
        prev.map((m) => (m.assignedOperatorId === operator._id ? { ...m, assignedOperatorId: '', assignedOperator: '' } : m))
      );
      showToast(`Removed operator ${operator.name}`);
    } catch (err) {
      failToast(err, 'Could not remove the operator.');
    }
  };

  // ------------------------------------------------------------ back-charges
  const handleAddBackcharge = async (payload) => {
    try {
      const { backcharge } = await machineryService.createBackcharge(projectId, payload);
      setBackcharges((prev) => [backcharge, ...prev]);
      showToast(`Back-charge ${backcharge.id} created`);
      return true;
    } catch (err) {
      failToast(err, 'Could not create the back-charge.');
      return false;
    }
  };

  const handleToggleDeducted = async (backcharge) => {
    const next = backcharge.status === 'PENDING' ? 'DEDUCTED' : 'PENDING';
    try {
      const { backcharge: updated } = await machineryService.updateBackchargeStatus(backcharge._id, { status: next });
      setBackcharges((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
      showToast(next === 'DEDUCTED' ? `${backcharge.id} marked as deducted` : `${backcharge.id} moved back to pending`);
    } catch (err) {
      failToast(err, 'Could not update the back-charge.');
    }
  };

  // ------------------------------------------------------------------- gates
  if (!hasRealProject) {
    return (
      <div className="text-center py-16 border border-dashed border-black/15 dark:border-white/15 rounded-xl">
        <Truck className="mx-auto text-black/20 dark:text-white/20 mb-3" size={32} />
        <p className="text-sm text-black/50 dark:text-white/50 max-w-md mx-auto">
          Machinery & Fleet saves to the server, so it needs a real project. Create or join one from the Dashboard (demo projects are not stored).
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-16 border border-dashed border-red-500/30 rounded-xl">
        <ShieldAlert className="mx-auto text-red-500/60 mb-3" size={32} />
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
      </div>
    );
  }

  const tabs = [
    ['fleet', Layers, `Fleet (${machines.length})`],
    ['logbook', Tablet, 'Operator Logbook'],
    ['billing', Receipt, 'Billing & Back-charges'],
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-[#0a0f1d] border border-black/10 dark:border-white/10 p-5 md:p-6 rounded-2xl shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0">
            <Truck size={28} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-black dark:text-white tracking-tight">Machinery & Fleet</h1>
            <p className="text-xs md:text-sm text-black/60 dark:text-white/60 mt-1 max-w-2xl">
              Track where every machine is, what it's doing, its hours and fuel, rented-machine commitments and subcontractor back-charges.
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal('ADD_MACHINE')}
          className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold px-4 py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer min-h-[44px]"
        >
          <Plus size={15} /> Add Machinery
        </button>
      </div>

      <FleetKpiRibbon machines={machines} />

      <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto">
        {tabs.map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 min-h-[48px] text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === key
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40 dark:text-white/40">Loading machinery…</p>
      ) : (
        <>
          {activeTab === 'fleet' && (
            <DeploymentMatrixTable
              machines={machines}
              onSelectMachine={(m) => setSelectedMachineId(m._id)}
              onLogHours={(m) => openModal('LOG_HOURS', m)}
              onLogFuel={(m) => openModal('LOG_FUEL', m)}
              onReportIssue={(m) => openModal('REPORT_ISSUE', m)}
              onAddMachine={() => openModal('ADD_MACHINE')}
            />
          )}

          {activeTab === 'logbook' && (
            <DigitalOperatorLogbook
              machines={machines}
              operators={operators}
              onSubmitLog={handleLogbookSubmit}
              onAddOperator={() => openModal('ADD_OPERATOR')}
              onRemoveOperator={handleRemoveOperator}
            />
          )}

          {activeTab === 'billing' && (
            <FinancialReconciliationEngine
              machines={machines}
              backcharges={backcharges}
              onOpenBackchargeModal={() => openModal('NEW_BACKCHARGE')}
              onToggleDeducted={handleToggleDeducted}
            />
          )}
        </>
      )}

      {selectedMachine && (
        <MachineDetailPanel
          machine={selectedMachine}
          onClose={() => setSelectedMachineId(null)}
          onLogHours={(m) => openModal('LOG_HOURS', m)}
          onLogFuel={(m) => openModal('LOG_FUEL', m)}
          onReportIssue={(m) => openModal('REPORT_ISSUE', m)}
          onEdit={(m) => openModal('EDIT_MACHINE', m)}
          onDelete={handleDeleteMachine}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {modal?.type === 'ADD_MACHINE' && (
        <MachineFormModal operators={operators} onClose={closeModal} onSubmit={handleSaveMachine} />
      )}
      {modal?.type === 'EDIT_MACHINE' && modalMachine && (
        <MachineFormModal machine={modalMachine} operators={operators} onClose={closeModal} onSubmit={handleSaveMachine} />
      )}
      {modal?.type === 'LOG_HOURS' && modalMachine && (
        <LogHoursModal machine={modalMachine} onClose={closeModal} onSubmit={handleLogHours} />
      )}
      {modal?.type === 'LOG_FUEL' && modalMachine && (
        <LogFuelModal machine={modalMachine} onClose={closeModal} onSubmit={handleLogFuel} />
      )}
      {modal?.type === 'REPORT_ISSUE' && modalMachine && (
        <ReportIssueModal machine={modalMachine} onClose={closeModal} onSubmit={handleReportIssue} />
      )}
      {modal?.type === 'NEW_BACKCHARGE' && (
        <NewBackchargeModal machines={machines} onClose={closeModal} onSubmit={handleAddBackcharge} />
      )}
      {modal?.type === 'ADD_OPERATOR' && (
        <OperatorModal machines={machines} onClose={closeModal} onSubmit={handleAddOperator} />
      )}
    </div>
  );
}