// Mock Database for Lab Management & Quality Control Module

export const INITIAL_TEST_SAMPLES = [
  {
    id: 'TS-2026-001',
    materialCategory: 'Concrete',
    gradeBadge: 'M25 Concrete Cubes',
    sampleName: 'M25 Concrete Cubes (150mm)',
    structureLocation: 'Column C4 - Floor 3',
    castingDate: '2026-08-01',
    testingDueDate: '2026-08-29',
    testType: '28-Day Compressive Strength',
    targetStrength: '25.0 N/mm²',
    achievedStrength: '28.5 N/mm²',
    ageStatus: 'Completed',
    status: 'Pass',
    labTechnician: 'Ramesh Sharma',
    reportNo: 'TR-NABL-8841'
  },
  {
    id: 'TS-2026-002',
    materialCategory: 'Steel',
    gradeBadge: 'Fe500D TMT Rebar',
    sampleName: '16mm Fe500D TMT Rebar',
    structureLocation: 'Beam B12 - Floor 4',
    castingDate: '2026-08-05',
    testingDueDate: '2026-08-12',
    testType: 'Tensile & Elongation Test',
    targetStrength: '500 N/mm²',
    achievedStrength: '542 N/mm²',
    ageStatus: 'Completed',
    status: 'Pass',
    labTechnician: 'Priya Verma',
    reportNo: 'TR-NABL-8845'
  },
  {
    id: 'TS-2026-003',
    materialCategory: 'Concrete',
    gradeBadge: 'M30 Concrete Cubes',
    sampleName: 'M30 Concrete Cubes (150mm)',
    structureLocation: 'Raft Slab Section B',
    castingDate: '2026-08-15',
    testingDueDate: '2026-08-22',
    testType: '7-Day Compressive Strength',
    targetStrength: '20.0 N/mm²',
    achievedStrength: '17.8 N/mm²',
    ageStatus: 'Failed / NCR',
    status: 'Fail',
    labTechnician: 'Ramesh Sharma',
    reportNo: 'TR-NABL-8890'
  },
  {
    id: 'TS-2026-004',
    materialCategory: 'Soil & Aggregate',
    gradeBadge: 'Coarse Aggregate 20mm',
    sampleName: 'Coarse Aggregate 20mm',
    structureLocation: 'Basement Backfill',
    castingDate: '2026-08-18',
    testingDueDate: '2026-08-25',
    testType: 'Silt & Impact Value Test',
    targetStrength: '< 5.0% Silt',
    achievedStrength: '2.1% Silt',
    ageStatus: 'Completed',
    status: 'Pass',
    labTechnician: 'Amit Patel',
    reportNo: 'TR-NABL-8912'
  },
  {
    id: 'TS-2026-005',
    materialCategory: 'Concrete',
    gradeBadge: 'M25 Ready Mix',
    sampleName: 'M25 Ready Mix Concrete',
    structureLocation: 'Staircase Tower A',
    castingDate: '2026-08-26',
    testingDueDate: '2026-09-02',
    testType: '7-Day Compressive Strength',
    targetStrength: '16.5 N/mm²',
    achievedStrength: 'Pending Test',
    ageStatus: 'Day 7 Due Today',
    status: 'Due Today',
    labTechnician: 'Priya Verma',
    reportNo: 'TR-NABL-8950'
  },
  {
    id: 'TS-2026-006',
    materialCategory: 'Concrete',
    gradeBadge: 'M35 Self-Compacting',
    sampleName: 'M35 SCC Concrete Cubes',
    structureLocation: 'Podium Slab Beam P2',
    castingDate: '2026-08-28',
    testingDueDate: '2026-09-25',
    testType: '28-Day Compressive Strength',
    targetStrength: '35.0 N/mm²',
    achievedStrength: 'In Curing Tank',
    ageStatus: 'Day 28 Pending',
    status: 'Curing',
    labTechnician: 'Ramesh Sharma',
    reportNo: 'TR-NABL-8962'
  }
];

export const INITIAL_QUALITY_NCRS = [
  {
    id: 'NCR-2026-04',
    title: 'Low 7-day cube strength on Raft Slab Section B',
    sampleId: 'TS-2026-003',
    severity: 'High',
    dateReported: '2026-08-22',
    correctiveAction: 'Core testing scheduled & site curing extended by 7 days. Structural consultant informed.',
    status: 'Under Review',
    assignedTo: 'Er. Rajesh Kumar'
  },
  {
    id: 'NCR-2026-03',
    title: 'Excess silt percentage in River Sand batch #4',
    sampleId: 'TS-2026-001',
    severity: 'Medium',
    dateReported: '2026-08-10',
    correctiveAction: 'Batch rejected for structural concrete, redirected for plaster washing.',
    status: 'Closed',
    assignedTo: 'Amit Patel'
  }
];

export const INITIAL_LAB_EQUIPMENT = [
  {
    id: 'EQ-01',
    name: '2000 kN Digital Compression Testing Machine (CTM)',
    model: 'HEICO CTM-200',
    serialNo: 'CTM-2022-901',
    lastCalibrationDate: '2026-03-15',
    nextCalibrationDue: '2027-03-14',
    status: 'Calibrated',
    location: 'Site QC Lab Block A'
  },
  {
    id: 'EQ-02',
    name: 'Slump Test Apparatus & Tamping Rod',
    model: 'Standard IS:7320',
    serialNo: 'SL-2023-11',
    lastCalibrationDate: '2026-01-10',
    nextCalibrationDue: '2026-09-10',
    status: 'Due Soon',
    location: 'Site QC Lab Block A'
  },
  {
    id: 'EQ-03',
    name: 'Motorized Sieve Shaker with IS Sieves',
    model: 'AIMIL SS-40',
    serialNo: 'SS-2021-04',
    lastCalibrationDate: '2025-11-20',
    nextCalibrationDue: '2026-11-19',
    status: 'Calibrated',
    location: 'Soil & Aggregate Lab'
  },
  {
    id: 'EQ-04',
    name: 'Digital Precision Weigh Scale (30kg / 0.1g)',
    model: 'Essae DS-852',
    serialNo: 'ES-2024-88',
    lastCalibrationDate: '2026-06-01',
    nextCalibrationDue: '2026-12-01',
    status: 'Calibrated',
    location: 'Site QC Lab Block A'
  }
];

export const INITIAL_LAB_CERTIFICATES = [
  {
    id: 'CERT-8841',
    title: '28-Day Compressive Strength Test - M25 Cubes',
    nablLabName: 'National Quality Assurance & Testing Lab (NABL)',
    issueDate: '2026-08-29',
    sampleId: 'TS-2026-001',
    fileType: 'PDF',
    fileSize: '1.4 MB'
  },
  {
    id: 'CERT-8845',
    title: 'Steel Rebar Tensile Strength Certificate',
    nablLabName: 'TUV India Metallurgical Testing Lab',
    issueDate: '2026-08-12',
    sampleId: 'TS-2026-002',
    fileType: 'PDF',
    fileSize: '2.1 MB'
  }
];

export async function fetchLabData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        samples: INITIAL_TEST_SAMPLES,
        ncrs: INITIAL_QUALITY_NCRS,
        equipment: INITIAL_LAB_EQUIPMENT,
        certificates: INITIAL_LAB_CERTIFICATES,
        summary: {
          totalSamplesLogged: 52,
          passRatePercentage: 94.2,
          pendingTestsCount: 3,
          openNcrsCount: 1
        }
      });
    }, 150);
  });
}
