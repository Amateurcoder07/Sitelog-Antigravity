// Mock Database for Concrete Cube Test Register (Set of 3 Cubes per Pour)

export const INITIAL_CUBE_POURS = [
  {
    id: 'POUR-2026-0199',
    srNoRange: '0199 - 0201',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-08-05',
    pourCardNo: '9',
    location: 'C Footing',
    remarks: 'Target 28-Day Strength: 30 N/mm². Complies with IS:456 & IS:516.',
    digitallyVerifiedBy: {
      name: 'Er. K.B. (Contractor) & EIL Rep',
      timestamp: '2026-09-02 11:30 AM',
      role: 'Contractor + Consultant QC'
    },
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
    pourCardNo: '9',
    location: 'C Footing (Bay 2)',
    remarks: 'Good compaction & moist sand curing tank.',
    digitallyVerifiedBy: {
      name: 'Er. K.B. (Contractor)',
      timestamp: '2026-09-02 12:15 PM',
      role: 'Contractor QC'
    },
    cubes: [
      {
        cubeId: '50A',
        srNo: '0202',
        weight: 8.778,
        day7: { testingDate: '2026-08-12', crushingLoad: 610, compressiveStrength: 27.11 },
        day28: { testingDate: '2026-09-02', crushingLoad: 835, compressiveStrength: 37.11 }
      },
      {
        cubeId: '50B',
        srNo: '0203',
        weight: 8.658,
        day7: { testingDate: '2026-08-12', crushingLoad: 560, compressiveStrength: 24.89 },
        day28: { testingDate: '2026-09-02', crushingLoad: 759, compressiveStrength: 33.73 }
      },
      {
        cubeId: '50C',
        srNo: '0204',
        weight: 8.894,
        day7: { testingDate: '2026-08-12', crushingLoad: 630, compressiveStrength: 28.0 },
        day28: { testingDate: '2026-09-02', crushingLoad: 865, compressiveStrength: 38.44 }
      }
    ]
  },
  {
    id: 'POUR-2026-0208',
    srNoRange: '0208 - 0210',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-08-05',
    pourCardNo: '10',
    location: 'B Footing',
    remarks: '7-day test completed. 28-day curing in progress.',
    digitallyVerifiedBy: null,
    cubes: [
      {
        cubeId: '52A',
        srNo: '0208',
        weight: 8.976,
        day7: { testingDate: '2026-08-12', crushingLoad: 626, compressiveStrength: 27.82 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '52B',
        srNo: '0209',
        weight: 8.878,
        day7: { testingDate: '2026-08-12', crushingLoad: 541, compressiveStrength: 24.04 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '52C',
        srNo: '0210',
        weight: 8.816,
        day7: { testingDate: '2026-08-12', crushingLoad: 574, compressiveStrength: 25.51 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      }
    ]
  },
  {
    id: 'POUR-2026-0220',
    srNoRange: '0220 - 0222',
    mixDesignNo: 'MD016',
    grade: 'M30',
    pourDate: '2026-08-06',
    pourCardNo: '11',
    location: 'EEB Part A&B Footing',
    remarks: 'Batching plant W/C ratio verified at 0.42.',
    digitallyVerifiedBy: {
      name: 'EIL Consultant Rep',
      timestamp: '2026-08-13 03:00 PM',
      role: 'EIL Consultant'
    },
    cubes: [
      {
        cubeId: '56A',
        srNo: '0220',
        weight: 8.886,
        day7: { testingDate: '2026-08-13', crushingLoad: 807, compressiveStrength: 35.87 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '56B',
        srNo: '0221',
        weight: 9.12,
        day7: { testingDate: '2026-08-13', crushingLoad: 682, compressiveStrength: 30.31 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      },
      {
        cubeId: '56C',
        srNo: '0222',
        weight: 9.14,
        day7: { testingDate: '2026-08-13', crushingLoad: 727, compressiveStrength: 32.31 },
        day28: { testingDate: '', crushingLoad: 0, compressiveStrength: 0 }
      }
    ]
  },
  {
    id: 'POUR-2026-0223',
    srNoRange: '0223 - 0225',
    mixDesignNo: 'MD020',
    grade: 'M25',
    pourDate: '2026-08-10',
    pourCardNo: '14',
    location: 'Column C2 - Floor 2',
    remarks: 'Cube 57C shows >15% strength deviation from Mean (IS Code 456 warning).',
    digitallyVerifiedBy: null,
    cubes: [
      {
        cubeId: '57A',
        srNo: '0223',
        weight: 8.886,
        day7: { testingDate: '2026-08-17', crushingLoad: 450, compressiveStrength: 20.0 },
        day28: { testingDate: '2026-09-07', crushingLoad: 901, compressiveStrength: 40.04 }
      },
      {
        cubeId: '57B',
        srNo: '0224',
        weight: 9.12,
        day7: { testingDate: '2026-08-17', crushingLoad: 460, compressiveStrength: 20.44 },
        day28: { testingDate: '2026-09-07', crushingLoad: 926, compressiveStrength: 41.16 }
      },
      {
        cubeId: '57C',
        srNo: '0225',
        weight: 8.99,
        day7: { testingDate: '2026-08-17', crushingLoad: 315, compressiveStrength: 14.0 },
        day28: { testingDate: '2026-09-07', crushingLoad: 995, compressiveStrength: 44.22 }
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
