import React, { useState, useEffect } from 'react';
import { X, FlaskConical, Camera, Building2 } from 'lucide-react';
import Button from '../Button';
import { localToday } from '../../utils/labEvaluation';

const fieldCls =
  'w-full px-3.5 py-2.5 text-xs font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]';
const smallSelectCls =
  'w-full px-2.5 py-2 text-xs font-extrabold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500';
const labelCls = 'block text-xs font-extrabold text-black dark:text-white mb-1';
const optCls = 'bg-white dark:bg-[#0a0f1d]';

const CATEGORIES = ['Concrete', 'Steel', 'Aggregate', 'Soil'];
const CATEGORY_LABELS = { Concrete: 'Concrete', Steel: 'Steel Rebar', Aggregate: 'Aggregates', Soil: 'Soil' };

const Opts = ({ values, render }) =>
  values.map((v) => (
    <option key={v} value={v} className={optCls}>
      {render ? render(v) : v}
    </option>
  ));

export default function NewSampleModal({ isOpen, onClose, onSave, standards }) {
  const [materialCategory, setMaterialCategory] = useState('Concrete');
  const [saving, setSaving] = useState(false);

  const concreteGrades = Object.keys(standards?.concreteGrades || {});
  const steelGrades = Object.keys(standards?.steelGrades || {});
  const aggregateTests = Object.keys(standards?.aggregateTests || {});

  // CONCRETE
  const [concreteGrade, setConcreteGrade] = useState('M25');
  const specimenType = '150mm Cubes (Set of 3)';
  const [towerBlock, setTowerBlock] = useState('Tower A');
  const [floorLevel, setFloorLevel] = useState('Floor 3');
  const [structuralElement, setStructuralElement] = useState('Column');
  const [castingDate, setCastingDate] = useState(localToday);
  const [date7Day, setDate7Day] = useState('');
  const [date28Day, setDate28Day] = useState('');

  // STEEL
  const [steelGrade, setSteelGrade] = useState('Fe500D');
  const [rebarDiameter, setRebarDiameter] = useState('16mm');
  const [deliveryChallanNo, setDeliveryChallanNo] = useState('');
  const [steelLocation, setSteelLocation] = useState('');

  // AGGREGATE
  const [aggregateType, setAggregateType] = useState('Coarse Aggregates 20mm');
  const [aggregateTest, setAggregateTest] = useState('');
  const [aggregateUsage, setAggregateUsage] = useState('Wearing Course');
  const [quarrySource, setQuarrySource] = useState('');
  const [truckNo, setTruckNo] = useState('');

  // SOIL
  const [soilLocation, setSoilLocation] = useState('');
  const [targetMdd, setTargetMdd] = useState('1.85');
  const [targetOmc, setTargetOmc] = useState('12.5');

  const [testDate, setTestDate] = useState(localToday);
  const [photoCaptured, setPhotoCaptured] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // Default the aggregate test to the first one the backend knows about
  useEffect(() => {
    if (aggregateTests.length && !aggregateTests.includes(aggregateTest)) setAggregateTest(aggregateTests[0]);
  }, [aggregateTests.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto 7-day / 28-day dates for concrete
  useEffect(() => {
    if (!castingDate) return;
    const base = new Date(`${castingDate}T00:00:00`);
    const fmt = (days) => {
      const d = new Date(base);
      d.setDate(d.getDate() + days);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    };
    setDate7Day(fmt(7));
    setDate28Day(fmt(28));
  }, [castingDate]);

  if (!isOpen) return null;

  const aggregateSpec = standards?.aggregateTests?.[aggregateTest];
  const usageOptions = aggregateSpec?.max ? Object.keys(aggregateSpec.max) : [];
  const effectiveUsage = usageOptions.includes(aggregateUsage) ? aggregateUsage : usageOptions[0];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoCaptured(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  const buildPayload = () => {
    if (materialCategory === 'Concrete') {
      return {
        materialCategory,
        grade: concreteGrade,
        sampleName: `${concreteGrade} ${specimenType}`,
        structureLocation: `${towerBlock} - ${floorLevel} (${structuralElement})`,
        castingDate,
        details: { specimenType },
      };
    }
    if (materialCategory === 'Steel') {
      return {
        materialCategory,
        grade: steelGrade,
        sampleName: `TMT Rebar ${steelGrade} ${rebarDiameter}`,
        structureLocation: steelLocation,
        testingDueDate: testDate,
        details: { rebarDiameter, deliveryChallanNo },
      };
    }
    if (materialCategory === 'Aggregate') {
      return {
        materialCategory,
        sampleName: `${aggregateType} (Quarry: ${quarrySource})`,
        structureLocation: `Stockpile / Vehicle: ${truckNo}`,
        testingDueDate: testDate,
        details: {
          aggregateType,
          aggregateTestType: aggregateTest,
          aggregateUsage: effectiveUsage,
          quarrySource,
          truckNo,
        },
      };
    }
    return {
      materialCategory,
      sampleName: `Soil Compaction (${soilLocation})`,
      structureLocation: soilLocation,
      testingDueDate: testDate,
      details: {
        testType: 'Core Cutter Field Density Test',
        targetMdd: parseFloat(targetMdd),
        targetOmc: parseFloat(targetOmc),
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await onSave({ ...buildPayload(), photoFile });
      if (saved) {
        setPhotoCaptured(null);
        setPhotoFile(null);
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const photoLabel = {
    Concrete: 'Batch Slip / Concrete Pour Photo',
    Steel: 'Rebar Bundle Tag Photo',
    Aggregate: 'Vehicle Slip / Stockpile Photo',
    Soil: 'Field Density Test Location Photo',
  }[materialCategory];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border-t md:border border-black/15 dark:border-white/15 rounded-t-3xl md:rounded-3xl p-5 md:p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto my-0 md:my-6">
        <div className="w-12 h-1.5 bg-black/20 dark:bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FlaskConical size={22} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Step 1: Register New Sample</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Conditional entry for {CATEGORY_LABELS[materialCategory]}</p>
            </div>
          </div>
          <button onClick={resetAndClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Material category toggle */}
          <div>
            <label className="block text-xs font-extrabold text-black dark:text-white mb-1.5 uppercase tracking-wider">Material Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMaterialCategory(cat)}
                  className={`py-2.5 px-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    materialCategory === cat ? 'bg-orange-600 text-white shadow-md scale-[1.02]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* ============ CONCRETE ============ */}
          {materialCategory === 'Concrete' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Concrete Mix Grade</label>
                  <select value={concreteGrade} onChange={(e) => setConcreteGrade(e.target.value)} className={fieldCls}>
                    <Opts values={concreteGrades} render={(g) => `${g} (${standards.concreteGrades[g]} N/mm²)`} />
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Specimen Type</label>
                  <input type="text" readOnly value={specimenType} className={`${fieldCls} !bg-black/10 dark:!bg-white/10 !text-black/70 dark:!text-white/70 cursor-not-allowed`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black dark:text-white mb-1.5 flex items-center gap-1">
                  <Building2 size={14} className="text-orange-500" />
                  Cascading Location Selector
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[10px] font-bold text-black/50 dark:text-white/50 mb-0.5">Tower / Block</span>
                    <select value={towerBlock} onChange={(e) => setTowerBlock(e.target.value)} className={smallSelectCls}>
                      <Opts values={['Tower A', 'Tower B', 'Block C', 'Podium']} />
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-black/50 dark:text-white/50 mb-0.5">Floor Level</span>
                    <select value={floorLevel} onChange={(e) => setFloorLevel(e.target.value)} className={smallSelectCls}>
                      <Opts values={['Basement 1', 'Ground Floor', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Roof Slab']} />
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-black/50 dark:text-white/50 mb-0.5">Element</span>
                    <select value={structuralElement} onChange={(e) => setStructuralElement(e.target.value)} className={smallSelectCls}>
                      <Opts values={['Column', 'Beam', 'Slab', 'Footing', 'Shear Wall']} />
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black dark:text-white mb-1 flex items-center justify-between">
                  <span>Casting Date</span>
                  <span className="text-[10px] text-black/50 dark:text-white/50">Tap to override</span>
                </label>
                <input type="date" required value={castingDate} onChange={(e) => setCastingDate(e.target.value)} className={fieldCls} />
                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-2.5 rounded-xl text-xs">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 block uppercase">Auto 7-Day Test</span>
                    <span className="font-extrabold text-black dark:text-white">{date7Day}</span>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-2.5 rounded-xl text-xs">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 block uppercase">Auto 28-Day Test</span>
                    <span className="font-extrabold text-black dark:text-white">{date28Day}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ STEEL ============ */}
          {materialCategory === 'Steel' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Steel Grade</label>
                  <select value={steelGrade} onChange={(e) => setSteelGrade(e.target.value)} className={fieldCls}>
                    <Opts values={steelGrades} render={(g) => `${g} (min Fy ${standards.steelGrades[g].minYield})`} />
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Bar Diameter (mm)</label>
                  <select value={rebarDiameter} onChange={(e) => setRebarDiameter(e.target.value)} className={fieldCls}>
                    <Opts values={['8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '28mm', '32mm']} />
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Delivery Challan / Batch No</label>
                <input type="text" required placeholder="e.g. DC-2026-8890" value={deliveryChallanNo} onChange={(e) => setDeliveryChallanNo(e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Structural Location / Usage Area</label>
                <input type="text" required placeholder="e.g. Tower A - Floor 3 (Column C4 Main Steel)" value={steelLocation} onChange={(e) => setSteelLocation(e.target.value)} className={fieldCls} />
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

          {/* ============ AGGREGATE ============ */}
          {materialCategory === 'Aggregate' && (
            <div className="space-y-4 pt-1">
              <div>
                <label className={labelCls}>Aggregate Classification / Type</label>
                <select value={aggregateType} onChange={(e) => setAggregateType(e.target.value)} className={fieldCls}>
                  <Opts values={['Coarse Aggregates 20mm', 'Coarse Aggregates 10mm', 'Fine Sand (River Sand)', 'M-Sand (Manufactured Sand)']} />
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Test to Perform (IS 2386)</label>
                  <select value={aggregateTest} onChange={(e) => setAggregateTest(e.target.value)} className={fieldCls}>
                    <Opts values={aggregateTests} />
                  </select>
                </div>
                {usageOptions.length > 0 && (
                  <div>
                    <label className={labelCls}>Intended Usage</label>
                    <select value={effectiveUsage} onChange={(e) => setAggregateUsage(e.target.value)} className={fieldCls}>
                      <Opts values={usageOptions} render={(u) => `${u} (≤ ${aggregateSpec.max[u]}${aggregateSpec.unit})`} />
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Quarry / Crusher Source Name</label>
                <input type="text" required placeholder="e.g. Vihang Crusher Quarry, Thane" value={quarrySource} onChange={(e) => setQuarrySource(e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Truck / Tipper Vehicle Number</label>
                <input type="text" required placeholder="e.g. MH-04-JK-9912" value={truckNo} onChange={(e) => setTruckNo(e.target.value)} className={fieldCls} />
              </div>
            </div>
          )}

          {/* ============ SOIL ============ */}
          {materialCategory === 'Soil' && (
            <div className="space-y-4 pt-1">
              <div>
                <label className={labelCls}>Subgrade / Backfill Location & Layer</label>
                <input type="text" required placeholder="e.g. Backfill Layer 2, Section B" value={soilLocation} onChange={(e) => setSoilLocation(e.target.value)} className={fieldCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Target MDD (g/cc)</label>
                  <input type="number" step="0.01" inputMode="decimal" required placeholder="e.g. 1.85" value={targetMdd} onChange={(e) => setTargetMdd(e.target.value)} className={fieldCls} />
                </div>
                <div>
                  <label className={labelCls}>Target OMC (%)</label>
                  <input type="number" step="0.1" inputMode="decimal" required placeholder="e.g. 12.5" value={targetOmc} onChange={(e) => setTargetOmc(e.target.value)} className={fieldCls} />
                </div>
              </div>
            </div>
          )}

          {materialCategory !== 'Concrete' && (
            <div>
              <label className={labelCls}>Scheduled Testing Date</label>
              <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} className={fieldCls} />
            </div>
          </div>

          {/* Camera upload */}
          <div>
            <label className="block text-xs font-extrabold text-black dark:text-white mb-1.5">{photoLabel}</label>
            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-orange-500 rounded-xl text-xs font-extrabold text-black dark:text-white cursor-pointer transition-colors">
              <Camera size={18} className="text-orange-500" />
              <span>
                {photoCaptured ? 'Photo Attached ✓ (Tap to retake)' : `Snap Photo of ${materialCategory === 'Steel' ? 'Bundle Tag' : 'Delivery Slip'}`}
              </span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {photoCaptured && (
              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                <img src={photoCaptured} alt="Attachment" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/70 text-white px-2 py-0.5 rounded">Captured</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={resetAndClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <button
              type="submit"
              disabled={saving || !standards}
              className="inline-flex items-center justify-center font-medium text-sm rounded-md bg-black dark:bg-white text-white dark:text-black shadow-md px-5 !py-3 flex-1 min-h-[48px] hover:opacity-90 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Register & Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}