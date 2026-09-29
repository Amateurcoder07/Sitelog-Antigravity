// Mock Database for Concrete Cube Test Register (Set of 3 Cubes per Pour)

// Helper to add days to a YYYY-MM-DD date string
export function addDaysToDate(dateStr, days) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Helper to format YYYY-MM-DD into DD-MMM-YYYY (e.g. 02-Sep-2026)
export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper to evaluate testing status: 'PENDING' | 'READY_TODAY' | 'OVERDUE' | 'COMPLETED'
export function evaluateTestingStatus(pourDate, targetDays, actualDate, hasCompletedResults) {
  if (hasCompletedResults) {
    return { status: 'COMPLETED', badgeText: 'Completed', daysDiff: 0 };
  }

  const targetDateStr = addDaysToDate(pourDate, targetDays);
  if (!targetDateStr) return { status: 'PENDING', badgeText: 'Pending', daysDiff: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - target.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays < 0) {
    return { status: 'PENDING', badgeText: `Pending (Due ${formatDateDisplay(targetDateStr)})`, daysDiff: diffDays, targetDateStr };
  } else if (diffDays === 0) {
    return { status: 'READY_TODAY', badgeText: 'Test Due Today', daysDiff: 0, targetDateStr };
  } else {
    return { status: 'OVERDUE', badgeText: `Overdue by ${diffDays} Day${diffDays > 1 ? 's' : ''}`, daysDiff: diffDays, targetDateStr };
  }
}

export const INITIAL_CUBE_POURS = [
  {
    id: 'POUR-2026-0199',
    srNoRange: '0199 - 0201',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-08-05',
    target7DayDate: '2026-08-12',
    target28DayDate: '2026-09-02',
    pourCardNo: '9',
    location: 'C Footing',
    remarks: 'Target 28-Day Strength: 30 N/mm². Complies with IS:456 & IS:516.',
    digitallyVerifiedBy: {
      name: 'Er. K.B. (Contractor) & EIL Rep',
      timestamp: '2026-09-02 11:30 AM',
      role: 'Contractor + Consultant QC'
    },
    deviationReason7Day: null,
    deviationReason28Day: null,
    cubes: [
      {
        cubeId: '49A',
        srNo: '0199',
        weight: 8.774,
        day7: { testingDate: '2026-08-12', crushingLoad: 585, compressiveStrength: 26.0 },
        day28: { testingDate: '2026-09-02', crushingLoad: 777, compressiveStrength: 34.53 }
      },
      {
        cubeId: '49B',
        srNo: '0200',
        weight: 8.658,
        day7: { testingDate: '2026-08-12', crushingLoad: 590, compressiveStrength: 26.22 },
        day28: { testingDate: '2026-09-02', crushingLoad: 784, compressiveStrength: 34.84 }
      },
      {
        cubeId: '49C',
        srNo: '0201',
        weight: 8.738,
        day7: { testingDate: '2026-08-12', crushingLoad: 595, compressiveStrength: 26.44 },
        day28: { testingDate: '2026-09-02', crushingLoad: 791, compressiveStrength: 35.16 }
      }
    ]
  },
  {
    id: 'POUR-2026-0202',
    srNoRange: '0202 - 0204',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-08-05',
    target7DayDate: '2026-08-12',
    target28DayDate: '2026-09-02',
    pourCardNo: '9',
    location: 'C Footing (Bay 2)',
    remarks: 'Tested on Day 29 due to Sunday site closure.',
    digitallyVerifiedBy: {
      name: 'Er. K.B. (Contractor)',
      timestamp: '2026-09-03 12:15 PM',
      role: 'Contractor QC'
    },
    deviationReason7Day: null,
    deviationReason28Day: 'Weekend/Holiday',
    cubes: [
      {
        cubeId: '50A',
        srNo: '0202',
        weight: 8.778,
        day7: { testingDate: '2026-08-12', crushingLoad: 610, compressiveStrength: 27.11 },
        day28: { testingDate: '2026-09-03', crushingLoad: 835, compressiveStrength: 37.11 }
      },
      {
        cubeId: '50B',
        srNo: '0203',
        weight: 8.658,
        day7: { testingDate: '2026-08-12', crushingLoad: 560, compressiveStrength: 24.89 },
        day28: { testingDate: '2026-09-03', crushingLoad: 759, compressiveStrength: 33.73 }
      },
      {
        cubeId: '50C',
        srNo: '0204',
        weight: 8.894,
        day7: { testingDate: '2026-08-12', crushingLoad: 630, compressiveStrength: 28.0 },
        day28: { testingDate: '2026-09-03', crushingLoad: 865, compressiveStrength: 38.44 }
      }
    ]
  },
  {
    id: 'POUR-2026-0208',
    srNoRange: '0208 - 0210',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-08-22',
    target7DayDate: '2026-08-29',
    target28DayDate: '2026-09-19', // Target 28-day is TODAY! (2026-09-19)
    pourCardNo: '10',
    location: 'B Footing (Section 1)',
    remarks: '28-Day Compression Test due today!',
    digitallyVerifiedBy: null,
    deviationReason7Day: null,
    deviationReason28Day: null,
    cubes: [
      {
        cubeId: '52A',
        srNo: '0208',
        weight: 8.976,
        day7: { testingDate: '2026-08-29', crushingLoad: 626, compressiveStrength: 27.82 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '52B',
        srNo: '0209',
        weight: 8.878,
        day7: { testingDate: '2026-08-29', crushingLoad: 541, compressiveStrength: 24.04 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '52C',
        srNo: '0210',
        weight: 8.816,
        day7: { testingDate: '2026-08-29', crushingLoad: 574, compressiveStrength: 25.51 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      }
    ]
  },
  {
    id: 'POUR-2026-0215',
    srNoRange: '0215 - 0217',
    mixDesignNo: 'MD020',
    grade: 'M35',
    pourDate: '2026-08-15',
    target7DayDate: '2026-08-22',
    target28DayDate: '2026-09-12', // Target 28-day was 7 days ago -> OVERDUE!
    pourCardNo: '12',
    location: 'Raft Slab Core Section',
    remarks: 'Overdue by 7 days. CTM machine maintenance delay.',
    digitallyVerifiedBy: null,
    deviationReason7Day: null,
    deviationReason28Day: 'Machine Breakdown',
    cubes: [
      {
        cubeId: '54A',
        srNo: '0215',
        weight: 9.044,
        day7: { testingDate: '2026-08-22', crushingLoad: 720, compressiveStrength: 32.0 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '54B',
        srNo: '0216',
        weight: 9.018,
        day7: { testingDate: '2026-08-22', crushingLoad: 710, compressiveStrength: 31.56 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '54C',
        srNo: '0217',
        weight: 9.104,
        day7: { testingDate: '2026-08-22', crushingLoad: 735, compressiveStrength: 32.67 }
      }
    ]
  },
  {
    id: 'POUR-2026-0220',
    srNoRange: '0220 - 0222',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-09-12',
    target7DayDate: '2026-09-19', // Target 7-day is TODAY!
    target28DayDate: '2026-10-10', // Target 28-day is in future (Pending)
    pourCardNo: '13',
    location: 'EEB Part A&B Footing',
    remarks: 'Batching plant W/C ratio verified at 0.42. 7-Day due today.',
    digitallyVerifiedBy: null,
    deviationReason7Day: null,
    deviationReason28Day: null,
    cubes: [
      {
        cubeId: '56A',
        srNo: '0220',
        weight: 8.886,
        day7: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '56B',
        srNo: '0221',
        weight: 9.12,
        day7: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '56C',
        srNo: '0222',
        weight: 9.14,
        day7: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      }
    ]
  }
];

// Helper formula to compute Compressive Strength (N/mm²) from Crushing Load (kN)
// Standard 150mm x 150mm face area = 22,500 mm²
// Formula: (Load in kN * 1000 N/kN) / 22500 mm²
export function calculateCompressiveStrength(crushingLoadKn) {
  if (!crushingLoadKn || isNaN(crushingLoadKn) || crushingLoadKn <= 0) return 0;
  const strength = (parseFloat(crushingLoadKn) * 1000) / 22500;
  return Math.round(strength * 100) / 100;
}

// Helper to calculate Mean Strength & check IS 456 ±15% deviation
export function evaluateCubeGroup(cubes, testPeriod = 'day28') {
  const validStrengths = cubes
    .map((c) => c[testPeriod]?.compressiveStrength || 0)
    .filter((val) => val > 0);

  if (validStrengths.length === 0) {
    return {
      meanStrength: 0,
      hasDeviationWarning: false,
      cubeDeviations: [false, false, false],
      status: 'Pending Test'
    };
  }

  const sum = validStrengths.reduce((acc, curr) => acc + curr, 0);
  const meanStrength = Math.round((sum / validStrengths.length) * 100) / 100;

  // Check IS 456 clause 15.4: Individual variation should not exceed ±15% of average
  const cubeDeviations = cubes.map((c) => {
    const val = c[testPeriod]?.compressiveStrength || 0;
    if (val === 0 || meanStrength === 0) return false;
    const diffRatio = Math.abs(val - meanStrength) / meanStrength;
    return diffRatio > 0.15; // True if > 15%
  });

  const hasDeviationWarning = cubeDeviations.some((dev) => dev === true);

  return {
    meanStrength,
    hasDeviationWarning,
    cubeDeviations,
    status: hasDeviationWarning ? 'IS Code 15% Warning' : 'Passed'
  };
}
