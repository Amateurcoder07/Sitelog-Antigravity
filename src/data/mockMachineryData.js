// Mock data for Heavy Machinery & Equipment Utilization Module

export const INITIAL_FLEET_DATA = [
  {
    id: 'CR-01',
    name: 'Liebherr 280 EC-H Tower Crane',
    classType: 'Owned',
    category: 'Cranes & Lifting',
    location: 'Tower A (Block 2)',
    subcontractor: 'L&T Civil Structure',
    status: 'PRODUCTIVE', // PRODUCTIVE, IDLE, STANDBY, BREAKDOWN
    currentActivity: 'Lifting Rebar Bundles to 14th Floor',
    hmrOpening: 3420.5,
    hmrCurrent: 3426.8,
    fuelLevel: 84, // %
    fuelCapacity: 350, // Liters
    fuelConsumedToday: 68,
    baselineFuelRate: 10.5, // L/hr
    fuelTheftAlert: false,
    hourlyRentalRate: 3500, // ₹/hr internal rate
    monthlyCommitment: 240, // min commitment hours
    loggedHoursThisMonth: 215,
    daysRemainingInMonth: 8,
    contractStartDate: '2026-09-01',
    contractEndDate: '2026-09-30',
    assignedOperator: 'Rajesh Kumar (OP-101)',
    lastServiceDate: '2026-08-15',
    nextMaintenanceHours: 3500,
    serialNumber: 'LTC-88902-IN'
  },
  {
    id: 'EX-04',
    name: 'JCB 220LC Hydraulic Excavator',
    classType: 'Rented (Hr)',
    category: 'Earthmoving',
    location: 'North Boundary Wall',
    subcontractor: 'ABC Earthmovers',
    status: 'IDLE',
    currentActivity: 'Engine Idling - Waiting for Dumper Tipper',
    hmrOpening: 1845.0,
    hmrCurrent: 1849.2,
    fuelLevel: 32,
    fuelCapacity: 220,
    fuelConsumedToday: 54,
    baselineFuelRate: 11.0,
    fuelTheftAlert: true,
    fuelTheftDetail: '18 Liters fuel drop detected between 02:00 - 04:00 AM while engine was OFF',
    hourlyRentalRate: 1800,
    monthlyCommitment: 200,
    loggedHoursThisMonth: 118,
    daysRemainingInMonth: 12,
    contractStartDate: '2026-09-01',
    contractEndDate: '2026-09-30',
    assignedOperator: 'Sunil Sharma (OP-102)',
    lastServiceDate: '2026-08-28',
    nextMaintenanceHours: 1900,
    serialNumber: 'JCB-EX220-4091'
  },
  {
    id: 'CP-02',
    name: 'Putzmeister BSF 36 Concrete Pump',
    classType: 'Rented (Mth)',
    category: 'Concrete Equipment',
    location: 'Podium Slab 3',
    subcontractor: 'Star Concreting',
    status: 'BREAKDOWN',
    currentActivity: 'Main Hydraulic Piston Seal Rupture',
    hmrOpening: 940.0,
    hmrCurrent: 940.0,
    fuelLevel: 65,
    fuelCapacity: 280,
    fuelConsumedToday: 0,
    baselineFuelRate: 14.0,
    fuelTheftAlert: false,
    hourlyRentalRate: 3200,
    monthlyCommitment: 180,
    loggedHoursThisMonth: 82,
    daysRemainingInMonth: 10,
    contractStartDate: '2026-09-01',
    contractEndDate: '2026-09-30',
    assignedOperator: 'Vikram Singh (OP-103)',
    lastServiceDate: '2026-07-20',
    nextMaintenanceHours: 950,
    serialNumber: 'PM-BSF36-1122'
  },
  {
    id: 'DG-01',
    name: 'Cummins 500 kVA Silent DG Set',
    classType: 'Owned',
    category: 'Power Generators',
    location: 'Central Utility Yard',
    subcontractor: 'Self / Main Contractor',
    status: 'PRODUCTIVE',
    currentActivity: 'Powering Tower Crane & Batching Plant',
    hmrOpening: 5120.0,
    hmrCurrent: 5131.5,
    fuelLevel: 92,
    fuelCapacity: 600,
    fuelConsumedToday: 185,
    baselineFuelRate: 16.0,
    fuelTheftAlert: false,
    hourlyRentalRate: 2200,
    monthlyCommitment: 300,
    loggedHoursThisMonth: 275,
    daysRemainingInMonth: 8,
    contractStartDate: '2026-09-01',
    contractEndDate: '2026-09-30',
    assignedOperator: 'Amit Patel (OP-104)',
    lastServiceDate: '2026-09-05',
    nextMaintenanceHours: 5200,
    serialNumber: 'CUM-DG500-7710'
  },
  {
    id: 'TL-03',
    name: 'Manitou MXT 840 Telescopic Handler',
    classType: 'Rented (Hr)',
    category: 'Material Handling',
    location: 'Substructure B2 Yard',
    subcontractor: 'Shiva MEP Tech',
    status: 'STANDBY',
    currentActivity: 'Engine Off - Staged for Ducting Delivery',
    hmrOpening: 620.0,
    hmrCurrent: 622.5,
    fuelLevel: 75,
    fuelCapacity: 120,
    fuelConsumedToday: 18,
    baselineFuelRate: 7.0,
    fuelTheftAlert: false,
    hourlyRentalRate: 1650,
    monthlyCommitment: 150,
    loggedHoursThisMonth: 64,
    daysRemainingInMonth: 12,
    contractStartDate: '2026-09-01',
    contractEndDate: '2026-09-30',
    assignedOperator: 'Rajesh Kumar (OP-101)',
    lastServiceDate: '2026-08-10',
    nextMaintenanceHours: 700,
    serialNumber: 'MAN-TH840-0033'
  },
  {
    id: 'BC-02',
    name: 'Schwing Stetter CP18 Batching Plant',
    classType: 'Owned',
    category: 'Concrete Equipment',
    location: 'Batching Plant Zone C',
    subcontractor: 'Self / Main Contractor',
    status: 'PRODUCTIVE',
    currentActivity: 'Mixing M30 Grade Concrete Pour #104',
    hmrOpening: 4100.0,
    hmrCurrent: 4108.0,
    fuelLevel: 58,
    fuelCapacity: 500,
    fuelConsumedToday: 120,
    baselineFuelRate: 15.0,
    fuelTheftAlert: false,
    hourlyRentalRate: 4500,
    monthlyCommitment: 250,
    loggedHoursThisMonth: 238,
    daysRemainingInMonth: 8,
    contractStartDate: '2026-09-01',
    contractEndDate: '2026-09-30',
    assignedOperator: 'Vikram Singh (OP-103)',
    lastServiceDate: '2026-09-12',
    nextMaintenanceHours: 4250,
    serialNumber: 'SS-CP18-9921'
  }
];

export const SITE_OPERATORS = [
  { id: 'OP-101', name: 'Rajesh Kumar', role: 'Senior Crane Operator', pin: '1234', defaultMachine: 'CR-01' },
  { id: 'OP-102', name: 'Sunil Sharma', role: 'Excavator Operator', pin: '4321', defaultMachine: 'EX-04' },
  { id: 'OP-103', name: 'Vikram Singh', role: 'Concrete Equipment Tech', pin: '8888', defaultMachine: 'CP-02' },
  { id: 'OP-104', name: 'Amit Patel', role: 'P&M Generator Operator', pin: '9999', defaultMachine: 'DG-01' }
];

export const INITIAL_SUBCONTRACTOR_BACKCHARGES = [
  {
    id: 'BC-2026-089',
    subcontractorName: 'ABC Earthmovers',
    machineId: 'EX-04',
    machineName: 'JCB 220LC Hydraulic Excavator',
    date: '2026-09-20',
    hoursUsed: 14.5,
    hourlyRate: 1800,
    totalDeductionAmount: 26100,
    workDescription: 'Excavation for storm drainage pipe trenching at East Perimeter Zone',
    supervisorApproval: 'Eng. Ramesh V. (Site PM)',
    status: 'PENDING_DEDUCTION',
    raBillReference: 'RA-BILL-SEP-04 (Draft)',
    logbookRef: 'LOG-20260920-EX04'
  },
  {
    id: 'BC-2026-084',
    subcontractorName: 'Star Concreting',
    machineId: 'CR-01',
    machineName: 'Liebherr 280 EC-H Tower Crane',
    date: '2026-09-18',
    hoursUsed: 8.0,
    hourlyRate: 3500,
    totalDeductionAmount: 28000,
    workDescription: 'Hoisting prefab slab forms & rebar cages to 12th Floor Podium',
    supervisorApproval: 'Eng. Anil Mehta (P&M In-charge)',
    status: 'DEDUCTED_FROM_RA_BILL',
    raBillReference: 'RA-BILL-SEP-02 (Paid)',
    logbookRef: 'LOG-20260918-CR01'
  },
  {
    id: 'BC-2026-078',
    subcontractorName: 'Shiva MEP Tech',
    machineId: 'TL-03',
    machineName: 'Manitou MXT 840 Telescopic Handler',
    date: '2026-09-15',
    hoursUsed: 6.5,
    hourlyRate: 1650,
    totalDeductionAmount: 10725,
    workDescription: 'Lifting heavy HVAC chillers to Basement B1 mechanical room',
    supervisorApproval: 'Eng. Suresh K.',
    status: 'PENDING_DEDUCTION',
    raBillReference: 'RA-BILL-SEP-05 (Upcoming)',
    logbookRef: 'LOG-20260915-TL03'
  },
  {
    id: 'BC-2026-072',
    subcontractorName: 'L&T Civil Structure',
    machineId: 'DG-01',
    machineName: 'Cummins 500 kVA Silent DG Set',
    date: '2026-09-12',
    hoursUsed: 12.0,
    hourlyRate: 2200,
    totalDeductionAmount: 26400,
    workDescription: 'Dedicated night-shift power supply for continuous raft foundation pour',
    supervisorApproval: 'Eng. Ramesh V. (Site PM)',
    status: 'DEDUCTED_FROM_RA_BILL',
    raBillReference: 'RA-BILL-AUG-28',
    logbookRef: 'LOG-20260912-DG01'
  }
];

export function evaluateRentalContractGuardrail(machine) {
  if (!machine.classType || !machine.classType.includes('Rented')) {
    return {
      isRented: false,
      monthlyCommitment: machine.monthlyCommitment || 0,
      loggedHoursThisMonth: machine.loggedHoursThisMonth || 0,
      daysRemaining: machine.daysRemainingInMonth || 0,
      completionPct: 100,
      isUnderUtilizedRisk: false,
      projectedTotalHours: machine.loggedHoursThisMonth || 0,
      projectedShortfallHours: 0,
      financialRiskAmount: 0
    };
  }

  const commitment = machine.monthlyCommitment || 200;
  const logged = machine.loggedHoursThisMonth || 0;
  const daysRemaining = machine.daysRemainingInMonth || 10;
  const totalDaysInCycle = 30;
  const daysElapsed = Math.max(1, totalDaysInCycle - daysRemaining);

  const dailyAvgRate = logged / daysElapsed;
  const projectedTotalHours = Math.round((logged + (dailyAvgRate * daysRemaining)) * 10) / 10;
  const projectedShortfallHours = Math.max(0, Math.round((commitment - projectedTotalHours) * 10) / 10);
  const completionPct = Math.min(100, Math.round((logged / commitment) * 100));
  
  const isUnderUtilizedRisk = projectedTotalHours < commitment;
  const financialRiskAmount = Math.round(projectedShortfallHours * (machine.hourlyRentalRate || 2000));

  return {
    isRented: true,
    monthlyCommitment: commitment,
    loggedHoursThisMonth: logged,
    daysRemaining,
    daysElapsed,
    dailyAvgRate: dailyAvgRate.toFixed(1),
    completionPct,
    isUnderUtilizedRisk,
    projectedTotalHours,
    projectedShortfallHours,
    financialRiskAmount
  };
}