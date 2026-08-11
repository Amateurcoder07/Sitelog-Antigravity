// Mock Database for BOCW Compliance Module

export const INITIAL_COMPLIANCE_KPIS = {
  projectRegistrationStatus: 'Registered',
  certNumber: 'MH-2024-441',
  cessDueDate: 'Due in 12 days',
  cessAmountOwed: 8400,
  workersRegisteredCount: 18,
  totalWorkersCount: 23,
  safetyTrainingStatus: 'On Track',
  avgSafetyHours: 4.2
};

export const INITIAL_WORKER_COMPLIANCE = [
  {
    id: 'wc-1',
    workerName: 'Ramesh Kumar',
    bocwStatus: 'Done', // 'Done' | 'Missing' | 'Pending'
    safetyHours: 6,
    overallStatus: 'Compliant' // 'Compliant' | 'Incomplete' | 'At Risk'
  },
  {
    id: 'wc-2',
    workerName: 'Suresh Patel',
    bocwStatus: 'Done',
    safetyHours: 6,
    overallStatus: 'Compliant'
  },
  {
    id: 'wc-3',
    workerName: 'Amit Singh',
    bocwStatus: 'Done',
    safetyHours: 2,
    overallStatus: 'Incomplete'
  },
  {
    id: 'wc-4',
    workerName: 'Deepak Yadav',
    bocwStatus: 'Missing',
    safetyHours: 0,
    overallStatus: 'At Risk'
  },
  {
    id: 'wc-5',
    workerName: 'Priya Sharma',
    bocwStatus: 'Done',
    safetyHours: 4,
    overallStatus: 'Compliant'
  }
];

export const INITIAL_CESS_STATS = {
  totalConstructionCost: 4200000,
  cessRatePercent: 1,
  amountOwed: 42000,
  paidToDate: 33600,
  currentlyOwed: 8400
};

export const INITIAL_DEADLINES = [
  {
    id: 'dl-1',
    title: 'BOCW Cess Payment',
    dueDate: 'Due 1 August 2026',
    badgeText: 'Due in 12 days',
    badgeVariant: 'red' // 'red' | 'orange' | 'green'
  },
  {
    id: 'dl-2',
    title: 'Quarterly Safety Report',
    dueDate: 'Due 30 September 2026',
    badgeText: 'Due in 72 days',
    badgeVariant: 'orange'
  },
  {
    id: 'dl-3',
    title: 'Annual Registration Renewal',
    dueDate: 'Due 31 December 2026',
    badgeText: 'On Track',
    badgeVariant: 'green'
  }
];

export async function fetchComplianceData() {
  return {
    kpis: INITIAL_COMPLIANCE_KPIS,
    workers: INITIAL_WORKER_COMPLIANCE,
    cessStats: INITIAL_CESS_STATS,
    deadlines: INITIAL_DEADLINES
  };
}
