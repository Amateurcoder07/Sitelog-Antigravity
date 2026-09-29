import React, { useState, useMemo } from 'react';
import { X, FlaskConical, Camera, Info } from 'lucide-react';
import Button from '../Button';
import API from '../../api';
import {
  STANDARD_BY_CATEGORY,
  CONCRETE_GRADES,
  CONCRETE_SPECIMEN_TYPES,
  STEEL_GRADES,
  REBAR_DIAMETERS,
  AGGREGATE_TEST_TYPES,
  AGGREGATE_USAGE_TYPES,
  AGGREGATE_TYPES,
  getConcreteTarget,
  getAggregateLimit,
} from '../../utils/labStandards';

const CATEGORIES = ['Concrete', 'Steel', 'Aggregate', 'Soil'];

export default function NewSampleModal({ isOpen, onClose, onSave, projectId }) {
  const [materialCategory, setMaterialCategory] = useState('Concrete');
  const [sampleName, setSampleName] = useState('');
  const [structureLocation, setStructureLocation] = useState('');

  // Concrete
  const [grade, setGrade] = useState(CONCRETE_GRADES[3]); // M25 default
  const [specimenType, setSpecimenType] = useState(CONCRETE_SPECIMEN_TYPES[0]);
  const [castingDate, setCastingDate] = useState(new Date().toISOString().split('T')[0]);

  // Steel
  const [steelGrade, setSteelGrade] = useState('Fe500');
  const [rebarDiameter, setRebarDiameter] = useState(REBAR_DIAMETERS[3]);
  const [millSource, setMillSource] = useState('');
  const [batchNo, setBatchNo] = useState('');

  // Aggregate
  const [aggregateType, setAggregateType] = useState(AGGREGATE_TYPES[0]);
  const [aggregateTestType, setAggregateTestType] = useState(Object.keys(AGGREGATE_TEST_TYPES)[0]);
  const [aggregateUsage, setAggregateUsage] = useState(AGGREGATE_USAGE_TYPES[0]);
  const [quarrySource, setQuarrySource] = useState('');
  const [truckNo, setTruckNo] = useState('');

  // Soil
  const [soilTestType, setSoilTestType] = useState('Proctor Compaction (Standard)');
  const [targetMdd, setTargetMdd] = useState('');
  const [targetOmc, setTargetOmc] = useState('');

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const standardCode = STANDARD_BY_CATEGORY[materialCategory];

  const targetPreview = useMemo(() => {
    if (materialCategory === 'Concrete') {
      const t = getConcreteTarget(grade);
      return t ? `${t} N/mm² @ 28 days` : '—';
    }
    if (materialCategory === 'Steel') {
      const spec = STEEL_GRADES[steelGrade];
      return spec ? `Min Fy ${spec.minYield} N/mm² • UTS/Fy ≥ ${spec.minUtsYieldRatio} • Elong. ≥ ${spec.minElongation}%` : '—';
    }
    if (materialCategory === 'Aggregate') {
      const limit = getAggregateLimit(aggregateTestType, aggregateUsage);
      const unit = AGGREGATE_TEST_TYPES[aggregateTestType]?.unit || '';
      return limit != null ? `≤ ${limit}${unit} for ${aggregateUsage}` : 'Informational (no pass/fail limit)';
    }
    if (materialCategory === 'Soil') {
      return targetMdd ? `≥ 95% of MDD (${targetMdd} g/cc)` : 'Enter target MDD to set the limit';
    }
    return '—';
  }, [materialCategory, grade, steelGrade, aggregateTestType, aggregateUsage, targetMdd]);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const resetAndClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sampleName.trim() || !structureLocation.trim()) {
      setError('Sample name and structure location are required.');
      return;
    }

    setSaving(true);
    setError('');

    const details = {};
    let gradeValue = null;

    if (materialCategory === 'Concrete') {
      gradeValue = grade;
      details.specimenType = specimenType;
    } else if (materialCategory === 'Steel') {
      gradeValue = steelGrade;
      details.rebarDiameter = rebarDiameter;
      details.millSource = millSource;
      details.batchNo = batchNo;
    } else if (materialCategory === 'Aggregate') {
      details.aggregateType = aggregateType;
      details.aggregateTestType = aggregateTestType;
      details.aggregateUsage = aggregateUsage;
      details.quarrySource = quarrySource;
      details.truckNo = truckNo;
    } else if (materialCategory === 'Soil') {
      details.testType = soilTestType;
      details.targetMdd = targetMdd ? Number(targetMdd) : null;
      details.targetOmc = targetOmc ? Number(targetOmc) : null;
    }

    const formData = new FormData();
    formData.append('materialCategory', materialCategory);
    formData.append('sampleName', sampleName.trim());
    formData.append('structureLocation', structureLocation.trim());
    if (gradeValue) formData.append('grade', gradeValue);
    if (materialCategory === 'Concrete') formData.append('castingDate', castingDate);
    formData.append('details', JSON.stringify(details));
    if (photoFile) formData.append('photo', photoFile);

    try {
      const res = await API.post(`/lab-management/${projectId}/samples`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data.sample);
      resetAndClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not register sample.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={resetAndClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-black/15 dark:border-white/15 rounded-3xl p-5 md:p-6 shadow-2xl z-10 my-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FlaskConical size={22} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Register Lab Sample</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Cube, steel, aggregate or soil sample — tested to Indian Standard</p>
            </div>
          </div>
          <button onClick={resetAndClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category selector */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">Material Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMaterialCategory(cat)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    materialCategory === cat
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Sample Name</label>
              <input
                type="text"
                required
                placeholder="e.g. M25 Slab Concrete — Pour 3"
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Structure / Location</label>
              <input
                type="text"
                required
                placeholder="e.g. 3rd Floor Slab, Grid C-4"
                value={structureLocation}
                onChange={(e) => setStructureLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
              />
            </div>
          </div>

          {/* CONCRETE FIELDS */}
          {materialCategory === 'Concrete' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                >
                  {CONCRETE_GRADES.map((g) => <option key={g} value={g} className="bg-white dark:bg-[#0a0f1d]">{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Specimen</label>
                <select
                  value={specimenType}
                  onChange={(e) => setSpecimenType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                >
                  {CONCRETE_SPECIMEN_TYPES.map((s) => <option key={s} value={s} className="bg-white dark:bg-[#0a0f1d]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Casting Date</label>
                <input
                  type="date"
                  required
                  value={castingDate}
                  onChange={(e) => setCastingDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                />
              </div>
            </div>
          )}

          {/* STEEL FIELDS */}
          {materialCategory === 'Steel' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Grade (IS 1786)</label>
                  <select
                    value={steelGrade}
                    onChange={(e) => setSteelGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  >
                    {Object.keys(STEEL_GRADES).map((g) => <option key={g} value={g} className="bg-white dark:bg-[#0a0f1d]">{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Bar Diameter</label>
                  <select
                    value={rebarDiameter}
                    onChange={(e) => setRebarDiameter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  >
                    {REBAR_DIAMETERS.map((d) => <option key={d} value={d} className="bg-white dark:bg-[#0a0f1d]">{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Mill / Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Tiscon, Vizag Plant"
                    value={millSource}
                    onChange={(e) => setMillSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Batch / Lot No.</label>
                  <input
                    type="text"
                    placeholder="e.g. BATCH-2231"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  />
                </div>
              </div>
            </>
          )}

          {/* AGGREGATE FIELDS */}
          {materialCategory === 'Aggregate' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Aggregate Type</label>
                  <select
                    value={aggregateType}
                    onChange={(e) => setAggregateType(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  >
                    {AGGREGATE_TYPES.map((t) => <option key={t} value={t} className="bg-white dark:bg-[#0a0f1d]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Test (IS 2386-IV)</label>
                  <select
                    value={aggregateTestType}
                    onChange={(e) => setAggregateTestType(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  >
                    {Object.keys(AGGREGATE_TEST_TYPES).map((t) => <option key={t} value={t} className="bg-white dark:bg-[#0a0f1d]">{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Usage</label>
                  <select
                    value={aggregateUsage}
                    onChange={(e) => setAggregateUsage(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  >
                    {AGGREGATE_USAGE_TYPES.map((u) => <option key={u} value={u} className="bg-white dark:bg-[#0a0f1d]">{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Quarry Source</label>
                  <input
                    type="text"
                    placeholder="e.g. Karjat Quarry"
                    value={quarrySource}
                    onChange={(e) => setQuarrySource(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Truck / Challan No.</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-04-AB-1234"
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                  />
                </div>
              </div>
            </>
          )}

          {/* SOIL FIELDS */}
          {materialCategory === 'Soil' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Test Type</label>
                <select
                  value={soilTestType}
                  onChange={(e) => setSoilTestType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                >
                  <option className="bg-white dark:bg-[#0a0f1d]">Proctor Compaction (Standard)</option>
                  <option className="bg-white dark:bg-[#0a0f1d]">Proctor Compaction (Modified)</option>
                  <option className="bg-white dark:bg-[#0a0f1d]">CBR (Soaked)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Target MDD (g/cc)</label>
                <input
                  type="number" step="0.01"
                  placeholder="e.g. 1.85"
                  value={targetMdd}
                  onChange={(e) => setTargetMdd(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">Target OMC (%)</label>
                <input
                  type="number" step="0.1"
                  placeholder="e.g. 12.5"
                  value={targetOmc}
                  onChange={(e) => setTargetOmc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px]"
                />
              </div>
            </div>
          )}

          {/* Rule preview banner */}
          <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3.5 py-2.5 text-xs">
            <Info size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">{standardCode}</p>
              <p className="text-black/60 dark:text-white/60">{targetPreview}</p>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">Site Photo (optional)</label>
            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-emerald-500 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 cursor-pointer transition-colors">
              <Camera size={18} className="text-emerald-500" />
              <span>{photoFile ? `Selected: ${photoFile.name}` : 'Attach a photo of the sample / tag'}</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
            </label>
            {photoPreview && (
              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                <img src={photoPreview} alt="Sample" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={resetAndClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="!bg-emerald-600 dark:!bg-emerald-500 hover:!opacity-90 !py-3 flex-1 min-h-[48px]" disabled={saving}>
              {saving ? 'Registering…' : 'Register Sample'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}