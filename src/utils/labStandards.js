// src/utils/labStandards.js
//
// Client-side mirror of the backend rule tables (backend/utils/labStandards.js).
// Used for populating dropdowns and showing an instant "target / limit" preview
// while a QC engineer fills a form. The AUTHORITATIVE pass/fail calculation
// always happens on the server when a reading is submitted — this file never
// decides pass/fail on its own, it only helps the UI explain the rule.
//
// Standards referenced:
//   Concrete cubes -> IS 516 (Part 1/Sec 1):2021
//   Steel (TMT/rebar) -> IS 1786:2008
//   Aggregates -> IS 2386 (Part IV):1963

export const STANDARD_BY_CATEGORY = {
  Concrete: 'IS 516 (Part 1/Sec 1):2021',
  Steel: 'IS 1786:2008',
  Aggregate: 'IS 2386 (Part IV):1963',
  Soil: 'IS 2720 (Part 28)',
};

export const CONCRETE_GRADES = ['M10', 'M15', 'M20', 'M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60'];

export const CONCRETE_TARGETS = {
  M10: 10, M15: 15, M20: 20, M25: 25, M30: 30, M35: 35,
  M40: 40, M45: 45, M50: 50, M55: 55, M60: 60,
};

export const CONCRETE_SPECIMEN_TYPES = ['Cube (150mm)', 'Cube (100mm)', 'Cylinder'];

// IS 1786:2008 — minimum yield strength, min UTS/Yield ratio, min elongation %
export const STEEL_GRADES = {
  Fe415: { minYield: 415, minUtsYieldRatio: 1.10, minElongation: 14.5 },
  Fe415D: { minYield: 415, minUtsYieldRatio: 1.15, minElongation: 18.0 },
  Fe500: { minYield: 500, minUtsYieldRatio: 1.08, minElongation: 12.0 },
  Fe500D: { minYield: 500, minUtsYieldRatio: 1.10, minElongation: 16.0 },
  Fe550: { minYield: 550, minUtsYieldRatio: 1.06, minElongation: 10.0 },
  Fe550D: { minYield: 550, minUtsYieldRatio: 1.08, minElongation: 14.5 },
  Fe600: { minYield: 600, minUtsYieldRatio: 1.06, minElongation: 10.0 },
};

export const REBAR_DIAMETERS = ['6mm', '8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '28mm', '32mm'];

// IS 2386 (Part IV):1963 — max permissible values by usage
export const AGGREGATE_TEST_TYPES = {
  'Aggregate Crushing Value (ACV)': {
    unit: '%',
    max: { 'Wearing Course': 30, 'Non-Wearing / Base Course': 45 },
  },
  'Aggregate Impact Value (AIV)': {
    unit: '%',
    max: { 'Wearing Course': 30, 'Non-Wearing / Base Course': 45 },
  },
  'Combined Flakiness & Elongation Index': {
    unit: '%',
    max: { 'Wearing Course': 30, 'Non-Wearing / Base Course': 35 },
  },
  'Water Absorption': {
    unit: '%',
    max: { 'Wearing Course': 2, 'Non-Wearing / Base Course': 2 },
  },
  'Specific Gravity': {
    unit: '',
    informationalOnly: true,
    expectedRange: [2.5, 3.0],
  },
};

export const AGGREGATE_USAGE_TYPES = ['Wearing Course', 'Non-Wearing / Base Course'];
export const AGGREGATE_TYPES = ['Coarse Aggregate', 'Fine Aggregate'];

export function getConcreteTarget(grade) {
  return CONCRETE_TARGETS[grade] ?? null;
}

export function getAggregateLimit(testType, usage) {
  const spec = AGGREGATE_TEST_TYPES[testType];
  if (!spec || spec.informationalOnly) return null;
  return spec.max?.[usage] ?? null;
}