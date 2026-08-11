import React, { useState, useEffect } from 'react';
import { fetchCarbonWasteData } from '../data/mockCarbonWasteData';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { 
  Wallet, 
  TrendingUp, 
  Trash2, 
  Info, 
  Leaf, 
  RefreshCw, 
  Plus, 
  X, 
  AlertTriangle, 
  CheckSquare, 
  ArrowDown 
} from 'lucide-react';

export default function CarbonWaste() {
  const { showToast } = useToast();

  const [costRecovery, setCostRecovery] = useState(null);
  const [envImpact, setEnvImpact] = useState(null);
  const [carbonHistory, setCarbonHistory] = useState([]);
  const [wasteBreakdown, setWasteBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [materialInput, setMaterialInput] = useState('');
  const [qtyInput, setQtyInput] = useState('');
  const [costInput, setCostInput] = useState('');
  const [statusInput, setStatusInput] = useState('Landfill');

  useEffect(() => {
    fetchCarbonWasteData().then((data) => {
      setCostRecovery(data.costRecovery);
      setEnvImpact(data.envImpact);
      setCarbonHistory(data.carbonHistory);
      setWasteBreakdown(data.wasteBreakdown);
      setIsLoading(false);
    });
  }, []);

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!materialInput.trim() || !qtyInput.trim()) return;

    const costNum = parseFloat(costInput) || 0;

    const newEntry = {
      id: `wb-${Date.now()}`,
      material: materialInput.trim(),
      quantity: qtyInput.trim(),
      cost: costNum,
      status: statusInput
    };

    setWasteBreakdown((prev) => [newEntry, ...prev]);

    // Dynamic metrics update
    if (statusInput === 'Sold as Scrap' && costRecovery) {
      setCostRecovery((prev) => ({
        ...prev,
        recoveredThisMonth: prev.recoveredThisMonth + costNum,
        scrapSalesRecovered: prev.scrapSalesRecovered + costNum
      }));
    } else if (statusInput === 'Landfill' && costRecovery) {
      setCostRecovery((prev) => ({
        ...prev,
        materialWasteCost: prev.materialWasteCost + costNum
      }));
    } else if (statusInput === 'Reused On Site' && envImpact) {
      setEnvImpact((prev) => ({
        ...prev,
        materialsReusedCount: prev.materialsReusedCount + 1
      }));
    }

    showToast('Waste entry logged');
    setMaterialInput('');
    setQtyInput('');
    setCostInput('');
    setIsAddFormOpen(false);
  };

  if (isLoading || !costRecovery || !envImpact) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Carbon & Waste
        </h1>
      </div>

      {/* SECTION 1: COST RECOVERY (Image 0) */}
      <div className="space-y-5">
        <div className="flex items-center">
          <span className="w-1 h-3.5 bg-[#ea580c] rounded-full mr-2"></span>
          <h2 className="text-xs font-bold tracking-widest text-[#ea580c] uppercase">
            COST RECOVERY
          </h2>
        </div>

        {/* Main Metric Banner: Recovered This Month */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#1c1615] border border-[#ea580c]/25 flex items-center justify-center text-[#ea580c] flex-shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <span className="text-[#ea580c] text-xs font-bold tracking-wider uppercase block mb-1">
                RECOVERED THIS MONTH
              </span>
              <span className="text-white text-3xl md:text-4xl font-extrabold tracking-tight block">
                {formatCurrency(costRecovery.recoveredThisMonth)}
              </span>
              <p className="text-slate-400 text-xs mt-1.5 font-normal">
                From scrap sales this month.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scrap Sales Recovered */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-[#10241b] border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <TrendingUp size={16} />
            </div>
            <span className="text-slate-400 text-xs font-medium block mb-1">
              Scrap Sales Recovered
            </span>
            <span className="text-white text-2xl font-bold tracking-tight block">
              {formatCurrency(costRecovery.scrapSalesRecovered)}
            </span>
          </div>

          {/* Material Waste Cost */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-[#241215] border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
              <Trash2 size={16} />
            </div>
            <span className="text-slate-400 text-xs font-medium block mb-1">
              Material Waste Cost
            </span>
            <span className="text-white text-2xl font-bold tracking-tight block">
              {formatCurrency(costRecovery.materialWasteCost)}
            </span>
            <p className="text-slate-500 text-[11px] mt-1">
              Reduce this by better inventory tracking.
            </p>
          </div>
        </div>

        {/* Tax Credit Advisory Note */}
        <div className="bg-[#060a14] border border-slate-800/60 rounded-lg p-3.5 px-4 flex items-center gap-3 text-xs text-slate-400">
          <Info size={16} className="text-slate-500 flex-shrink-0" />
          <span>
            You may be eligible for input tax credit on business material purchases — consult your CA to confirm eligibility based on your project type.
          </span>
        </div>
      </div>

      {/* SECTION 2: ENVIRONMENTAL IMPACT (Image 0 & Image 1) */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center">
          <span className="w-1 h-3.5 bg-emerald-500 rounded-full mr-2"></span>
          <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            ENVIRONMENTAL IMPACT
          </h2>
        </div>

        {/* Main Impact Banner: CO2 Saved This Month */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#10241b] border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Leaf size={20} />
            </div>
            <div>
              <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase block mb-1">
                CO₂ SAVED THIS MONTH
              </span>
              <span className="text-white text-3xl md:text-4xl font-extrabold tracking-tight block">
                {envImpact.co2SavedTonnes} Tonnes
              </span>
              <p className="text-slate-400 text-xs mt-1.5 font-normal">
                Compared to standard construction practices.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Impact Cards (Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Waste Diverted from Landfill (Radial Gauge) */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 flex items-center gap-5">
            {/* SVG Circular Radial Progress Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray="68, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">68%</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs font-medium block mb-1">
                Waste Diverted from Landfill
              </span>
              <span className="text-white text-2xl font-bold tracking-tight block">
                {envImpact.wasteDivertedPercent}%
              </span>
            </div>
          </div>

          {/* Card 2: Materials Reused On Site */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-[#10241b] border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <RefreshCw size={16} />
            </div>
            <span className="text-slate-400 text-xs font-medium block mb-1">
              Materials Reused On Site
            </span>
            <span className="text-white text-2xl font-bold tracking-tight block">
              {envImpact.materialsReusedCount} items
            </span>
            <p className="text-slate-500 text-[11px] mt-1">This month</p>
          </div>
        </div>

        {/* Carbon Estimate Historical Progress Panel (Image 1) */}
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#10241b] border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf size={15} />
              </div>
              <h3 className="text-white font-bold text-sm">
                Carbon Estimate — Last 4 Months
              </h3>
            </div>

            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <ArrowDown size={12} />
              Trending down
            </span>
          </div>

          {/* Horizontal Progress Bars */}
          <div className="space-y-4">
            {carbonHistory.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-xs">
                <span className="w-20 text-slate-400 font-medium flex-shrink-0">
                  {item.label}
                </span>

                <div className="flex-1 h-3 bg-[#040711] rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isHighlight ? 'bg-emerald-400' : 'bg-emerald-900/60'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>

                <span
                  className={`w-12 text-right font-bold flex-shrink-0 ${
                    item.isHighlight ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {item.value} t
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WASTE BREAKDOWN & ADD ENTRY FORM (Image 1) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-base">Waste Breakdown</h2>
            <Button
              variant="primary"
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="text-xs px-4 py-2 flex items-center gap-1.5"
            >
              {isAddFormOpen ? <X size={15} /> : <Plus size={15} />}
              <span>Add Entry</span>
            </Button>
          </div>

          {/* Collapsible Form Card (Image 1) */}
          {isAddFormOpen && (
            <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 animate-fade-in">
              <form onSubmit={handleSaveEntry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Material
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Steel offcuts"
                      value={materialInput}
                      onChange={(e) => setMaterialInput(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Waste Quantity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 25 kg"
                      value={qtyInput}
                      onChange={(e) => setQtyInput(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Waste Cost (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={costInput}
                      onChange={(e) => setCostInput(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Recovery Status
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                    >
                      <option value="Landfill">Landfill</option>
                      <option value="Sold as Scrap">Sold as Scrap</option>
                      <option value="Reused On Site">Reused On Site</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="text-xs px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="text-xs px-5 py-2 font-semibold">
                    Save Entry
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Waste Breakdown Table (Image 1) */}
          <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                    <th className="py-3.5 px-6">Material</th>
                    <th className="py-3.5 px-6">Waste Quantity</th>
                    <th className="py-3.5 px-6">Waste Cost</th>
                    <th className="py-3.5 px-6">Recovery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  {wasteBreakdown.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">
                        {row.material}
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-medium">
                        {row.quantity}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        {formatCurrency(row.cost)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                            row.status === 'Landfill'
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                              : row.status === 'Sold as Scrap'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                              : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          }`}
                        >
                          {row.status}
                          {row.status === 'Landfill' ? (
                            <AlertTriangle size={12} />
                          ) : (
                            <CheckSquare size={12} />
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
