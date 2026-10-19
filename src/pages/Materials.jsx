import React, { useState, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { 
  Package, 
  Boxes, 
  Plus, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  ShieldAlert,
  FileCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

// ==========================================
// 1. MATERIAL RATES & SPECIFICATIONS CONFIG
// (Structured clean constants for Supabase lead)
// ==========================================
export const MATERIAL_SPECS = [
  { id: 'cement', name: 'Cement (bags)', rawName: 'Cement', unit: 'bags', unitRate: 360, defaultSupplier: 'Raj Cement Co.' },
  { id: 'steel', name: 'Steel Rods (kg)', rawName: 'Steel Rods', unit: 'kg', unitRate: 65, defaultSupplier: 'Singh Steel Ltd.' },
  { id: 'bricks', name: 'Bricks (units)', rawName: 'Bricks', unit: 'units', unitRate: 9, defaultSupplier: 'Kumar Traders' },
  { id: 'sand', name: 'Sand (tonnes)', rawName: 'Sand', unit: 'tonnes', unitRate: 1200, defaultSupplier: 'Goa Sand Suppliers' },
];

export const STRUCTURAL_ELEMENTS = [
  { 
    id: 'col-m25', 
    name: 'RCC Column (M25)', 
    defaultCount: 1, 
    defaultL: 0.45, 
    defaultB: 0.60, 
    defaultH: 3.00 
  },
  { 
    id: 'foot-m25', 
    name: 'RCC Footing (M25)', 
    defaultCount: 1, 
    defaultL: 1.50, 
    defaultB: 1.50, 
    defaultH: 0.45 
  },
  { 
    id: 'slab-m20', 
    name: 'Slab Panel (M20)', 
    defaultCount: 1, 
    defaultL: 5.00, 
    defaultB: 4.00, 
    defaultH: 0.15 
  },
  { 
    id: 'wall-230', 
    name: 'Brick Wall (230mm)', 
    defaultCount: 1, 
    defaultL: 4.00, 
    defaultB: 0.23, 
    defaultH: 3.00 
  },
];

export const THEORETICAL_NORM_MULTIPLIERS = {
  'Cement (bags)': {
    'RCC Column (M25)': 8.0,
    'RCC Footing (M25)': 8.0,
    'Slab Panel (M20)': 7.5,
    'Brick Wall (230mm)': 1.8,
  },
  'Steel Rods (kg)': {
    'RCC Column (M25)': 130,
    'RCC Footing (M25)': 90,
    'Slab Panel (M20)': 90,
    'Brick Wall (230mm)': 0,
  },
  'Bricks (units)': {
    'RCC Column (M25)': 0,
    'RCC Footing (M25)': 0,
    'Slab Panel (M20)': 0,
    'Brick Wall (230mm)': 500,
  },
  'Sand (tonnes)': {
    'RCC Column (M25)': 0.45,
    'RCC Footing (M25)': 0.45,
    'Slab Panel (M20)': 0.45,
    'Brick Wall (230mm)': 0.45,
  },
};

export const CLARIFICATION_REASONS = [
  'Formwork Bulging / Leakage',
  'Sub-contractor Over-mix',
  'Damaged / Wet Stock',
  'Excavation Over-break',
  'Other',
];

// ==========================================
// 2. INITIAL REALISTIC MOCK DATA
// ==========================================
export const INITIAL_LOGGED_ENTRIES = [
  {
    id: 'log-101',
    materialName: 'Cement (bags)',
    type: 'Usage',
    element: 'RCC Column (M25)',
    count: 4,
    length: 0.45,
    breadth: 0.60,
    height: 3.00,
    volume: 3.24,
    dimensionBadge: '4x RCC Column (0.45×0.6×3.0m) • 3.24 m³',
    theoretical: 26.0,
    actual: 31.0,
    unit: 'bags',
    variance: 5.0,
    variancePercent: 19.2,
    status: 'Unclarified',
    clarificationReason: '',
    clarificationNote: '',
    date: '2026-10-14',
  },
  {
    id: 'log-102',
    materialName: 'Steel Rods (kg)',
    type: 'Usage',
    element: 'Slab Panel (M20)',
    count: 1,
    length: 5.00,
    breadth: 4.00,
    height: 0.15,
    volume: 3.00,
    dimensionBadge: '1x Slab Panel (5.0×4.0×0.15m) • 3.00 m³',
    theoretical: 270.0,
    actual: 275.0,
    unit: 'kg',
    variance: 5.0,
    variancePercent: 1.9,
    status: 'Within Norm',
    clarificationReason: '',
    clarificationNote: '',
    date: '2026-10-14',
  },
  {
    id: 'log-103',
    materialName: 'Cement (bags)',
    type: 'Delivery',
    quantity: '+150 bags',
    actual: 150,
    unit: 'bags',
    supplier: 'Raj Cement Co.',
    date: '2026-10-13',
  },
];

export const INITIAL_MATERIAL_BASE = [
  {
    id: 'mat-1',
    name: 'Cement (bags)',
    rawName: 'Cement',
    unit: 'bags',
    unitRate: 360,
    received: 500,
    baseTheoretical: 435.0,
    baseActual: 440.0,
    supplier: 'Raj Cement Co.',
  },
  {
    id: 'mat-2',
    name: 'Steel Rods (kg)',
    rawName: 'Steel Rods',
    unit: 'kg',
    unitRate: 65,
    received: 2500,
    baseTheoretical: 1670.0,
    baseActual: 1670.0,
    supplier: 'Singh Steel Ltd.',
  },
  {
    id: 'mat-3',
    name: 'Bricks (units)',
    rawName: 'Bricks',
    unit: 'units',
    unitRate: 9,
    received: 10000,
    baseTheoretical: 7500.0,
    baseActual: 7500.0,
    supplier: 'Kumar Traders',
  },
  {
    id: 'mat-4',
    name: 'Sand (tonnes)',
    rawName: 'Sand',
    unit: 'tonnes',
    unitRate: 1200,
    received: 20,
    baseTheoretical: 14.2,
    baseActual: 14.2,
    supplier: 'Goa Sand Suppliers',
  },
];

export default function Materials() {
  const { showToast } = useToast();

  // State: Materials Totals Base & Logged Entries
  const [materialTotals, setMaterialTotals] = useState(INITIAL_MATERIAL_BASE);
  const [entries, setEntries] = useState(INITIAL_LOGGED_ENTRIES);

  // Sub-Tabs: 'delivery' | 'usage'
  const [activeActionTab, setActiveActionTab] = useState('usage');
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);

  // Register New Material Form State
  const [matName, setMatName] = useState('');
  const [matUnit, setMatUnit] = useState('bags');
  const [matOpeningQty, setMatOpeningQty] = useState('');
  const [matRate, setMatRate] = useState('');
  const [matSupplier, setMatSupplier] = useState('');

  // Log Delivery Form State
  const [selectedDeliveryMatName, setSelectedDeliveryMatName] = useState('Cement (bags)');
  const [deliveryQty, setDeliveryQty] = useState('');

  // Log Usage Form State
  const [usageMaterial, setUsageMaterial] = useState('Cement (bags)');
  const [selectedElement, setSelectedElement] = useState('RCC Column (M25)');
  const [count, setCount] = useState(1);
  const [length, setLength] = useState(0.45);
  const [breadth, setBreadth] = useState(0.60);
  const [height, setHeight] = useState(3.00);
  const [actualUsedInput, setActualUsedInput] = useState('');

  // Inline Clarification Form State
  const [clarifyingEntryId, setClarifyingEntryId] = useState(null);
  const [clarifyReason, setClarifyReason] = useState(CLARIFICATION_REASONS[0]);
  const [clarifyNote, setClarifyNote] = useState('');

  // Handle Structural Element change: Auto-fill default dimensions
  const handleElementChange = (elemName) => {
    setSelectedElement(elemName);
    const matched = STRUCTURAL_ELEMENTS.find(el => el.name === elemName);
    if (matched) {
      setCount(matched.defaultCount);
      setLength(matched.defaultL);
      setBreadth(matched.defaultB);
      setHeight(matched.defaultH);
    }
  };

  // Live Auto-Calculations for Log Usage Form
  const volume = useMemo(() => {
    const c = parseFloat(count) || 0;
    const l = parseFloat(length) || 0;
    const b = parseFloat(breadth) || 0;
    const h = parseFloat(height) || 0;
    return parseFloat((c * l * b * h).toFixed(3));
  }, [count, length, breadth, height]);

  const theoreticalRequired = useMemo(() => {
    const multiplierMap = THEORETICAL_NORM_MULTIPLIERS[usageMaterial] || {};
    const multiplier = multiplierMap[selectedElement] !== undefined ? multiplierMap[selectedElement] : 0;
    return parseFloat((volume * multiplier).toFixed(1));
  }, [volume, usageMaterial, selectedElement]);

  const actualNum = parseFloat(actualUsedInput) || 0;

  const { variance, variancePercent, isWithinNorm, hasActualInput } = useMemo(() => {
    if (!actualUsedInput || isNaN(actualNum) || actualNum <= 0) {
      return { variance: 0, variancePercent: 0, isWithinNorm: true, hasActualInput: false };
    }
    const diff = actualNum - theoreticalRequired;
    const pct = theoreticalRequired > 0 ? (diff / theoreticalRequired) * 100 : 0;
    return {
      variance: parseFloat(diff.toFixed(1)),
      variancePercent: parseFloat(pct.toFixed(1)),
      isWithinNorm: pct <= 5.0,
      hasActualInput: true
    };
  }, [actualNum, actualUsedInput, theoreticalRequired]);

  // Currency Formatter
  const formatCurrency = (val) => '₹' + Math.round(val || 0).toLocaleString('en-IN');

  // Submit Handler: Log Delivery
  const handleLogDelivery = (e) => {
    e.preventDefault();
    const qty = parseFloat(deliveryQty);
    if (isNaN(qty) || qty <= 0) return;

    const targetMat = materialTotals.find(m => m.name === selectedDeliveryMatName);
    const unit = targetMat ? targetMat.unit : 'units';

    setMaterialTotals(prev => prev.map(m => {
      if (m.name === selectedDeliveryMatName) {
        return { ...m, received: m.received + qty };
      }
      return m;
    }));

    const newDeliveryEntry = {
      id: `log-${Date.now()}`,
      materialName: selectedDeliveryMatName,
      type: 'Delivery',
      quantity: `+${qty} ${unit}`,
      actual: qty,
      unit: unit,
      supplier: targetMat?.supplier || 'Site Direct',
      date: new Date().toISOString().split('T')[0]
    };

    setEntries(prev => [newDeliveryEntry, ...prev]);
    showToast('Delivery logged successfully');
    setDeliveryQty('');
  };

  // Submit Handler: Log Usage
  const handleLogUsage = (e) => {
    e.preventDefault();
    if (!actualUsedInput || isNaN(actualNum) || actualNum <= 0) {
      alert('Please enter a valid actual quantity used.');
      return;
    }

    const targetMat = materialTotals.find(m => m.name === usageMaterial);
    const unit = targetMat ? targetMat.unit : 'units';
    const isFlagged = variancePercent > 5.0;

    const shortElemName = selectedElement.split(' (')[0];
    const dimBadge = `${count}x ${shortElemName} (${length}×${breadth}×${height}m) • ${volume.toFixed(2)} m³`;

    const newUsageEntry = {
      id: `log-${Date.now()}`,
      materialName: usageMaterial,
      type: 'Usage',
      element: selectedElement,
      count: Number(count),
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      volume: volume,
      dimensionBadge: dimBadge,
      theoretical: theoreticalRequired,
      actual: actualNum,
      unit: unit,
      variance: variance,
      variancePercent: variancePercent,
      status: isFlagged ? 'Unclarified' : 'Within Norm',
      clarificationReason: '',
      clarificationNote: '',
      date: new Date().toISOString().split('T')[0]
    };

    // Prepend to entries
    setEntries(prev => [newUsageEntry, ...prev]);

    // Update Totals
    setMaterialTotals(prev => prev.map(m => {
      if (m.name === usageMaterial) {
        return {
          ...m,
          baseActual: m.baseActual + actualNum,
          baseTheoretical: m.baseTheoretical + theoreticalRequired
        };
      }
      return m;
    }));

    showToast(isFlagged ? 'Usage logged — Discrepancy flagged for review' : 'Usage logged within normal tolerance');
    setActualUsedInput('');
  };

  // Handler: Save Clarification for Discrepancy
  const handleSaveClarification = (entryId) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          status: 'Clarified',
          clarificationReason: clarifyReason,
          clarificationNote: clarifyNote.trim()
        };
      }
      return entry;
    }));

    setClarifyingEntryId(null);
    setClarifyNote('');
    showToast('Discrepancy clarified and saved to site audit log');
  };

  // Handler: Register New Material
  const handleSaveMaterial = (e) => {
    e.preventDefault();
    if (!matName.trim()) return;

    const openingQty = parseFloat(matOpeningQty) || 0;
    const rateNum = parseFloat(matRate) || 100;
    const fullName = `${matName.trim()} (${matUnit})`;

    const newMat = {
      id: `mat-${Date.now()}`,
      name: fullName,
      rawName: matName.trim(),
      unit: matUnit,
      unitRate: rateNum,
      received: openingQty,
      baseTheoretical: 0,
      baseActual: 0,
      supplier: matSupplier.trim() || 'Direct Supplier'
    };

    setMaterialTotals(prev => [...prev, newMat]);
    showToast('New material registered');
    setMatName('');
    setMatOpeningQty('');
    setMatRate('');
    setMatSupplier('');
    setIsRegisterFormOpen(false);
  };

  // Calculated Reconciliation Totals
  const reconciledTotals = useMemo(() => {
    return materialTotals.map(mat => {
      const matEntries = entries.filter(e => e.materialName === mat.name && e.type === 'Usage');
      const unclarifiedEntries = matEntries.filter(e => e.status === 'Unclarified');

      const theoreticalSum = mat.baseTheoretical;
      const actualUsedSum = mat.baseActual;
      const inStock = Math.max(0, mat.received - actualUsedSum);
      const unaccounted = parseFloat((actualUsedSum - theoreticalSum).toFixed(1));
      const leakageCost = unaccounted > 0 ? Math.round(unaccounted * mat.unitRate) : 0;
      const hasUnclarified = unclarifiedEntries.length > 0;

      return {
        ...mat,
        inStock,
        theoreticalReq: theoreticalSum,
        actualUsed: actualUsedSum,
        unaccounted,
        leakageCost,
        auditStatus: hasUnclarified ? `${unclarifiedEntries.length} Flagged` : 'Verified',
        isFlagged: hasUnclarified
      };
    });
  }, [materialTotals, entries]);

  // Top Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalReceivedCost = reconciledTotals.reduce((sum, m) => sum + (m.received * m.unitRate), 0);
    const totalInStockCost = reconciledTotals.reduce((sum, m) => sum + (m.inStock * m.unitRate), 0);
    const totalLeakageCost = reconciledTotals.reduce((sum, m) => sum + m.leakageCost, 0);
    const flaggedDiscrepancies = entries.filter(e => e.status === 'Unclarified').length;

    return {
      totalReceivedCost,
      totalInStockCost,
      totalLeakageCost,
      flaggedDiscrepancies
    };
  }, [reconciledTotals, entries]);

  // Current Unit for Usage dropdown
  const currentUsageUnit = useMemo(() => {
    const m = materialTotals.find(mat => mat.name === usageMaterial);
    return m ? m.unit : 'units';
  }, [usageMaterial, materialTotals]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Materials
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            This month: {formatCurrency(summaryMetrics.totalReceivedCost)} received stock • {formatCurrency(summaryMetrics.totalInStockCost)} in stock • <span className={summaryMetrics.totalLeakageCost > 0 ? 'text-[#f97316] font-semibold' : 'text-slate-300'}>{formatCurrency(summaryMetrics.totalLeakageCost)} est. leakage cost</span> ({summaryMetrics.flaggedDiscrepancies > 0 ? `${summaryMetrics.flaggedDiscrepancies} flagged discrepancy` : 'All reconciled'}).
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsRegisterFormOpen(!isRegisterFormOpen)}
          className="text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
        >
          {isRegisterFormOpen ? (
            <>
              <X size={15} />
              <span>Close</span>
            </>
          ) : (
            <>
              <Plus size={15} />
              <span>Add New Material</span>
            </>
          )}
        </Button>
      </div>

      {/* COLLAPSIBLE REGISTER NEW MATERIAL FORM */}
      {isRegisterFormOpen && (
        <div className="bg-[#0f1523] border border-slate-800 rounded-xl p-5 md:p-6 animate-fade-in shadow-xl">
          <h3 className="text-white font-bold text-sm mb-4">Register New Material</h3>
          <form onSubmit={handleSaveMaterial} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Material Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coarse Aggregate"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f97316]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Unit
                </label>
                <select
                  value={matUnit}
                  onChange={(e) => setMatUnit(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                >
                  <option value="bags">bags</option>
                  <option value="kg">kg</option>
                  <option value="units">units</option>
                  <option value="tonnes">tonnes</option>
                  <option value="cum">m³ (cum)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Opening Received Quantity
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={matOpeningQty}
                  onChange={(e) => setMatOpeningQty(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Unit Rate (₹ / unit)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 360"
                  value={matRate}
                  onChange={(e) => setMatRate(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f97316]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsRegisterFormOpen(false)}
                className="text-xs px-4 py-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="text-xs px-5 py-2 font-semibold">
                Save Material
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* DELIVERY VS USAGE ACTION SUB-TABS */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveActionTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeActionTab === 'delivery'
              ? 'bg-[#1c1615] text-[#f97316] border border-[#f97316]/40 shadow-sm'
              : 'bg-[#0f1523] text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Package size={14} />
          <span>Log Delivery</span>
        </button>
        <button
          onClick={() => setActiveActionTab('usage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeActionTab === 'usage'
              ? 'bg-[#1c1615] text-[#f97316] border border-[#f97316]/40 shadow-sm'
              : 'bg-[#0f1523] text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Boxes size={14} />
          <span>Log Usage (Smart Calculator)</span>
        </button>
      </div>

      {/* ACTION FORM: LOG DELIVERY (Kept exactly as requested) */}
      {activeActionTab === 'delivery' && (
        <div className="bg-[#0f1523] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl">
          <form onSubmit={handleLogDelivery} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Material
              </label>
              <select
                value={selectedDeliveryMatName}
                onChange={(e) => setSelectedDeliveryMatName(e.target.value)}
                className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                required
              >
                {materialTotals.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Quantity Received
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={deliveryQty}
                onChange={(e) => setDeliveryQty(e.target.value)}
                className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f97316]"
                required
              />
            </div>

            <div>
              <Button variant="primary" type="submit" className="w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2">
                <Package size={15} />
                <span>Log Delivery</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ACTION FORM: UPGRADED LOG USAGE TAB (2-Row Streamlined Form With L x B x H Calculator) */}
      {activeActionTab === 'usage' && (
        <div className="bg-[#0f1523] border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-5">
          <form onSubmit={handleLogUsage} className="space-y-4">
            {/* ROW 1: CORE SELECTION & COMPACT DIMENSIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Material Dropdown */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Material
                </label>
                <select
                  value={usageMaterial}
                  onChange={(e) => setUsageMaterial(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                  required
                >
                  <option value="Cement (bags)">Cement (bags)</option>
                  <option value="Steel Rods (kg)">Steel Rods (kg)</option>
                  <option value="Bricks (units)">Bricks (units)</option>
                  <option value="Sand (tonnes)">Sand (tonnes)</option>
                </select>
              </div>

              {/* Structural Element Dropdown */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Structural Element (Auto-fills Dimensions)
                </label>
                <select
                  value={selectedElement}
                  onChange={(e) => handleElementChange(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f97316]"
                  required
                >
                  {STRUCTURAL_ELEMENTS.map((el) => (
                    <option key={el.id} value={el.name}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Compact Dimension Strip (Qty x L x B x H) */}
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Dimension Strip (Count × L × B × H)
                  </label>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-orange-950/40 text-[#f97316] border border-orange-500/30">
                    Vol: {volume.toFixed(2)} m³
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <div>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-2 py-2 text-center text-xs font-mono text-white focus:outline-none focus:border-[#f97316]"
                      title="Number of units"
                      required
                    />
                    <span className="block text-[10px] text-slate-500 text-center mt-0.5">Count</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-2 py-2 text-center text-xs font-mono text-white focus:outline-none focus:border-[#f97316]"
                      title="Length in meters"
                      required
                    />
                    <span className="block text-[10px] text-slate-500 text-center mt-0.5">L (m)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={breadth}
                      onChange={(e) => setBreadth(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-2 py-2 text-center text-xs font-mono text-white focus:outline-none focus:border-[#f97316]"
                      title="Breadth in meters"
                      required
                    />
                    <span className="block text-[10px] text-slate-500 text-center mt-0.5">B (m)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-2 py-2 text-center text-xs font-mono text-white focus:outline-none focus:border-[#f97316]"
                      title="Height / Depth in meters"
                      required
                    />
                    <span className="block text-[10px] text-slate-500 text-center mt-0.5">H (m)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: ACTUAL USAGE VS. THEORETICAL AUTO-CHECK */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-3 border-t border-slate-800/60">
              {/* Theoretical Required (Read-Only Box) */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Theoretical Required (Auto)
                </label>
                <div className="w-full bg-[#040711]/90 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs font-mono font-bold text-slate-200 flex items-center justify-between">
                  <span>{theoreticalRequired} {currentUsageUnit}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-medium">Norm Check</span>
                </div>
              </div>

              {/* Actual Quantity Used */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Actual Quantity Used
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder={`e.g. ${theoreticalRequired || 25}`}
                  value={actualUsedInput}
                  onChange={(e) => setActualUsedInput(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f97316]"
                  required
                />
              </div>

              {/* Live Variance Status Pill & Submit Button */}
              <div className="md:col-span-6 flex flex-wrap items-center justify-between md:justify-end gap-3">
                {/* Live Variance Indicator */}
                {hasActualInput && (
                  <div className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isWithinNorm
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-400'
                      : 'bg-orange-950/50 border-[#f97316]/60 text-[#f97316]'
                  }`}>
                    {isWithinNorm ? (
                      <>
                        <CheckCircle2 size={14} className="shrink-0" />
                        <span>Within Norm (Variance: {variance >= 0 ? `+${variance}` : variance} {currentUsageUnit})</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} className="shrink-0 text-[#f97316]" />
                        <span>Discrepancy: +{variance} {currentUsageUnit} (+{variancePercent}%)</span>
                      </>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="py-2.5 px-6 text-xs font-bold flex items-center gap-2">
                  <Boxes size={15} />
                  <span>Log Usage</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* LOGGED ENTRIES SECTION (With One-Click Discrepancy Clarification) */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 md:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <span>Logged Entries</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {entries.length} records
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Live consumption trail with instant variance auditing and supervisor clarification.
            </p>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No entries logged yet. Use the tabs above to log a delivery or usage.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#0a0d14]">
                  <th className="py-3 px-6">Material</th>
                  <th className="py-3 px-6">Type / Structure Element</th>
                  <th className="py-3 px-6">Theoretical Norm</th>
                  <th className="py-3 px-6">Actual Consumed</th>
                  <th className="py-3 px-6">Variance</th>
                  <th className="py-3 px-6 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {entries.map((entry) => {
                  const isUsage = entry.type === 'Usage';
                  const isFlagged = isUsage && entry.variancePercent > 5.0;
                  const isClarifying = clarifyingEntryId === entry.id;

                  return (
                    <React.Fragment key={entry.id}>
                      <tr className="hover:bg-slate-900/40 transition-colors">
                        {/* Material Name */}
                        <td className="py-3.5 px-6 font-bold text-white align-top">
                          <div>{entry.materialName}</div>
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5 font-mono">{entry.date}</div>
                        </td>

                        {/* Type & Dimension Badge */}
                        <td className="py-3.5 px-6 align-top">
                          {isUsage ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-950/60 text-[#f97316] border border-orange-800/60">
                                <ArrowUpRight size={11} />
                                Usage
                              </span>
                              <div className="text-[11px] text-slate-300 font-medium">
                                {entry.dimensionBadge}
                              </div>
                              {entry.status === 'Clarified' && (
                                <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded px-2 py-1 mt-1 flex items-start gap-1">
                                  <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Clarified ({entry.clarificationReason})</strong>: {entry.clarificationNote || 'Supervisor acknowledged'}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                <ArrowDownLeft size={11} />
                                Delivery
                              </span>
                              <div className="text-[11px] text-slate-400">
                                Source: {entry.supplier || 'Site Direct'}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Theoretical Norm */}
                        <td className="py-3.5 px-6 font-mono align-top text-slate-300">
                          {isUsage ? (
                            <span>{entry.theoretical} {entry.unit}</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        {/* Actual Consumed / Received */}
                        <td className="py-3.5 px-6 font-bold align-top">
                          {isUsage ? (
                            <span className="text-white font-mono">{entry.actual} {entry.unit}</span>
                          ) : (
                            <span className="text-emerald-400 font-mono">{entry.quantity}</span>
                          )}
                        </td>

                        {/* Variance */}
                        <td className="py-3.5 px-6 font-mono align-top">
                          {isUsage ? (
                            <div>
                              <span className={`font-semibold ${
                                isFlagged ? 'text-[#f97316]' : 'text-emerald-400'
                              }`}>
                                {entry.variance >= 0 ? `+${entry.variance}` : entry.variance} {entry.unit}
                              </span>
                              <span className={`block text-[10px] ${
                                isFlagged ? 'text-orange-400/80 font-bold' : 'text-slate-500'
                              }`}>
                                ({entry.variancePercent >= 0 ? `+${entry.variancePercent}` : entry.variancePercent}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>

                        {/* Audit Action / Status */}
                        <td className="py-3.5 px-6 text-right align-top">
                          {isUsage ? (
                            entry.status === 'Unclarified' ? (
                              <button
                                type="button"
                                onClick={() => setClarifyingEntryId(isClarifying ? null : entry.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/50 hover:bg-[#f97316] hover:text-white transition-all cursor-pointer shadow-sm"
                              >
                                <AlertTriangle size={12} />
                                <span>{isClarifying ? 'Close' : 'Clarify Discrepancy'}</span>
                              </button>
                            ) : entry.status === 'Clarified' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                                <CheckCircle2 size={12} />
                                Clarified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                                <CheckCircle2 size={12} className="text-emerald-400" />
                                Within Norm
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-950/30 text-emerald-400 border border-emerald-800/30">
                              Received
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* INLINE CLARIFICATION EXPANSION ROW */}
                      {isClarifying && (
                        <tr className="bg-[#090e1a] border-b border-slate-800">
                          <td colSpan={6} className="p-4 md:p-5">
                            <div className="bg-[#040711] border border-orange-500/40 rounded-xl p-4 space-y-3.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#f97316]">
                                  <MessageSquare size={14} />
                                  <span>Supervisor Discrepancy Clarification ({entry.materialName})</span>
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  Variance: +{entry.variance} {entry.unit} (+{entry.variancePercent}%)
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                {/* 1. Reason Select */}
                                <div className="md:col-span-4">
                                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Discrepancy Reason
                                  </label>
                                  <select
                                    value={clarifyReason}
                                    onChange={(e) => setClarifyReason(e.target.value)}
                                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f97316]"
                                  >
                                    {CLARIFICATION_REASONS.map((r) => (
                                      <option key={r} value={r}>
                                        {r}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* 2. Short Note Input */}
                                <div className="md:col-span-5">
                                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Site Note
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Add quick site note (e.g., Column C4 shuttering gave way)..."
                                    value={clarifyNote}
                                    onChange={(e) => setClarifyNote(e.target.value)}
                                    className="w-full bg-[#0a0d14] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f97316]"
                                  />
                                </div>

                                {/* 3. Action Buttons */}
                                <div className="md:col-span-3 flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setClarifyingEntryId(null)}
                                    className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveClarification(entry.id)}
                                    className="px-4 py-2 text-xs font-bold bg-[#f97316] hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer shadow-md"
                                  >
                                    Save Clarification
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MATERIAL TOTALS INVENTORY TABLE (True Reconciliation View) */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 md:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <span>Material Totals & Reconciliation</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                Audit Active
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Reconciles total deliveries vs actual site consumption, calculating theoretical norms, unaccounted wastage, and financial leakage.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#0a0d14]">
                <th className="py-3.5 px-6">Material Name</th>
                <th className="py-3.5 px-6 font-mono">Received</th>
                <th className="py-3.5 px-6 font-mono">In Stock</th>
                <th className="py-3.5 px-6 font-mono">Theoretical Req.</th>
                <th className="py-3.5 px-6 font-mono">Actual Used</th>
                <th className="py-3.5 px-6 font-mono">Unaccounted / Wasted</th>
                <th className="py-3.5 px-6 font-mono">Est. Leakage Cost</th>
                <th className="py-3.5 px-6 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {reconciledTotals.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* 1. Material Name */}
                  <td className="py-4 px-6 font-bold text-white">
                    <div>{m.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">@ {formatCurrency(m.unitRate)} / {m.unit}</div>
                  </td>

                  {/* 2. Received */}
                  <td className="py-4 px-6 font-semibold text-slate-200 font-mono">
                    {m.received} <span className="text-[10px] text-slate-500">{m.unit}</span>
                  </td>

                  {/* 3. In Stock (Received - Actual Used) */}
                  <td className="py-4 px-6 font-bold text-slate-200 font-mono">
                    {m.inStock} <span className="text-[10px] text-slate-500">{m.unit}</span>
                  </td>

                  {/* 4. Theoretical Req. */}
                  <td className="py-4 px-6 text-slate-300 font-mono">
                    {m.theoreticalReq} <span className="text-[10px] text-slate-500">{m.unit}</span>
                  </td>

                  {/* 5. Actual Used */}
                  <td className="py-4 px-6 font-semibold text-white font-mono">
                    {m.actualUsed} <span className="text-[10px] text-slate-500">{m.unit}</span>
                  </td>

                  {/* 6. Unaccounted / Wasted (Actual Used - Theoretical Req.) */}
                  <td className="py-4 px-6 font-mono font-bold">
                    <span className={m.unaccounted > 0 ? 'text-[#f97316]' : 'text-slate-400'}>
                      {m.unaccounted > 0 ? `+${m.unaccounted}` : m.unaccounted} {m.unit}
                    </span>
                  </td>

                  {/* 7. Est. Leakage Cost */}
                  <td className="py-4 px-6 font-bold font-mono">
                    <span className={m.leakageCost > 0 ? 'text-[#f97316]' : 'text-slate-500'}>
                      {formatCurrency(m.leakageCost)}
                    </span>
                  </td>

                  {/* 8. Audit Status Badge */}
                  <td className="py-4 px-6 text-right">
                    {m.isFlagged ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-950/60 text-[#f97316] border border-orange-700/60 shadow-sm">
                        <AlertTriangle size={12} />
                        {m.auditStatus}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-sm">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
