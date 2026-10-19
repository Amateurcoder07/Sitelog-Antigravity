// Instant-preview helpers. They mirror backend/utils/labStandards.js so the user
// sees pass/fail while typing. The backend always re-evaluates on save and is the
// only source of truth for the stored result.

// Local calendar date as YYYY-MM-DD (toISOString alone would use UTC and can be a day off in India).
export function localToday() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
}

// IS 516 cl. 8: a specimen deviating more than ±15% from the mean is discarded;
// if more than one deviates, the set is invalid and must be retested.
export function averageWithOutlierCheck(readings) {
  const nums = (readings || []).map(Number).filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return { average: null, used: [], discarded: [], invalid: true };

  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const outliers = nums.filter((n) => Math.abs(n - mean) > 0.15 * mean);
  if (outliers.length > 1) return { average: null, used: [], discarded: nums, invalid: true };

  const used = outliers.length === 1 ? nums.filter((n) => !outliers.includes(n)) : nums;
  const average = used.reduce((a, b) => a + b, 0) / used.length;
  return { average: +average.toFixed(2), used, discarded: outliers, invalid: false };
}

export function previewSteel({ grade, yieldStrength, ultimateStrength, elongation, bendTest }, standards) {
  const spec = standards?.steelGrades?.[grade];
  const y = Number(yieldStrength);
  if (!spec || !(y > 0)) return null;
  const u = Number(ultimateStrength);
  const e = Number(elongation);
  const ratio = +(u / y).toFixed(2);
  const checks = {
    yield: y >= spec.minYield,
    ratio: ratio >= spec.minUtsYieldRatio,
    elongation: e >= spec.minElongation,
    bend: bendTest === 'Pass',
  };
  return { spec, ratio, checks, passed: Object.values(checks).every(Boolean) };
}

export function previewAggregate({ testType, usage, value }, standards) {
  const spec = standards?.aggregateTests?.[testType];
  const v = Number(value);
  if (!spec || value === '' || !Number.isFinite(v)) return null;
  if (spec.informationalOnly) return { spec, informational: true, passed: true, limit: null };
  const limit = spec.max?.[usage];
  return { spec, limit, passed: limit != null && v <= limit };
}

export function previewSoil({ wetDensity, moisture, targetMdd }) {
  const wet = Number(wetDensity);
  const m = Number(moisture);
  const mdd = Number(targetMdd);
  if (!(wet > 0) || moisture === '' || !Number.isFinite(m) || !(mdd > 0)) return null;
  const dryDensity = +(wet / (1 + m / 100)).toFixed(3);
  const compaction = +((dryDensity / mdd) * 100).toFixed(1);
  return { dryDensity, compaction, passed: compaction >= 95 };
}