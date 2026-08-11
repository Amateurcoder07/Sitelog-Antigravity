import React, { useState, useEffect } from 'react';
import { fetchMaterialsData } from '../data/mockMaterialsData';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { Package, Boxes, Plus, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function Materials() {
  const { showToast } = useToast();

  const [totals, setTotals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ spent: 840000, deliveriesCount: 12, bagsWastedCount: 40 });
  const [isLoading, setIsLoading] = useState(true);

  // Form Visibility & Sub-Tabs
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const [activeActionTab, setActiveActionTab] = useState('delivery'); // 'delivery' | 'usage'

  // Register New Material Form State
  const [matName, setMatName] = useState('');
  const [matUnit, setMatUnit] = useState('bags');
  const [matOpeningQty, setMatOpeningQty] = useState('');
  const [matCost, setMatCost] = useState('');
  const [matSupplier, setMatSupplier] = useState('');
  const [matDate, setMatDate] = useState('2026-08-11');

  // Log Delivery Form State
  const [selectedDeliveryMatId, setSelectedDeliveryMatId] = useState('');
  const [deliveryQty, setDeliveryQty] = useState('');

  // Log Usage Form State
  const [selectedUsageMatId, setSelectedUsageMatId] = useState('');
  const [usageQty, setUsageQty] = useState('');

  useEffect(() => {
    fetchMaterialsData().then((data) => {
      setTotals(data.totals);
      setEntries(data.entries);
      setSummary(data.summary);
      setIsLoading(false);
    });
  }, []);

  const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');

  // Handler: Register New Material
  const handleSaveMaterial = (e) => {
    e.preventDefault();
    if (!matName.trim()) return;

    const openingQtyNum = parseFloat(matOpeningQty) || 0;
    const costNum = parseFloat(matCost) || 0;

    const newMaterialItem = {
      id: `mat-${Date.now()}`,
      name: matName.trim(),
      ordered: openingQtyNum,
      used: 0,
      wasted: 0,
      unit: matUnit,
      cost: costNum,
      supplier: matSupplier.trim() || 'Direct Supplier',
      date: matDate || new Date().toISOString().split('T')[0]
    };

    setTotals((prev) => [...prev, newMaterialItem]);
    showToast('New material added successfully');

    // Reset Form & Close
    setMatName('');
    setMatOpeningQty('');
    setMatCost('');
    setMatSupplier('');
    setIsRegisterFormOpen(false);
  };

  // Handler: Log Delivery
  const handleLogDelivery = (e) => {
    e.preventDefault();
    const targetMat = totals.find((m) => m.id === selectedDeliveryMatId);
    if (!targetMat || !deliveryQty) return;

    const qty = parseFloat(deliveryQty);
    if (isNaN(qty) || qty <= 0) return;

    // Update Totals
    setTotals((prev) =>
      prev.map((m) =>
        m.id === selectedDeliveryMatId ? { ...m, ordered: m.ordered + qty } : m
      )
    );

    // Append to Logged Entries
    const newEntry = {
      id: `log-${Date.now()}`,
      materialName: targetMat.name,
      type: 'Delivery',
      quantity: `+${qty} ${targetMat.unit}`,
      date: new Date().toISOString().split('T')[0]
    };

    setEntries((prev) => [newEntry, ...prev]);
    showToast('Delivery logged');
    setDeliveryQty('');
    setSelectedDeliveryMatId('');
  };

  // Handler: Log Usage
  const handleLogUsage = (e) => {
    e.preventDefault();
    const targetMat = totals.find((m) => m.id === selectedUsageMatId);
    if (!targetMat || !usageQty) return;

    const qty = parseFloat(usageQty);
    if (isNaN(qty) || qty <= 0) return;

    // Update Totals
    setTotals((prev) =>
      prev.map((m) =>
        m.id === selectedUsageMatId ? { ...m, used: m.used + qty } : m
      )
    );

    // Append to Logged Entries
    const newEntry = {
      id: `log-${Date.now()}`,
      materialName: targetMat.name,
      type: 'Usage',
      quantity: `-${qty} ${targetMat.unit}`,
      date: new Date().toISOString().split('T')[0]
    };

    setEntries((prev) => [newEntry, ...prev]);
    showToast('Usage logged');
    setUsageQty('');
    setSelectedUsageMatId('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Materials
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            This month: {formatCurrency(summary.spent)} spent, {summary.deliveriesCount} deliveries, {summary.bagsWastedCount} bags wasted.
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
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6 animate-fade-in">
          <h3 className="text-white font-bold text-sm mb-5">Register New Material</h3>
          <form onSubmit={handleSaveMaterial} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Material Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cement"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
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
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                >
                  <option value="bags">bags</option>
                  <option value="kg">kg</option>
                  <option value="units">units</option>
                  <option value="tonnes">tonnes</option>
                  <option value="litres">litres</option>
                  <option value="sq ft">sq ft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Opening Quantity
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={matOpeningQty}
                  onChange={(e) => setMatOpeningQty(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Cost (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={matCost}
                  onChange={(e) => setMatCost(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Supplier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BuildMart Suppliers"
                  value={matSupplier}
                  onChange={(e) => setMatSupplier(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={matDate}
                  onChange={(e) => setMatDate(e.target.value)}
                  className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
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
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveActionTab('delivery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeActionTab === 'delivery'
              ? 'bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/30'
              : 'bg-[#090e1a] text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Package size={14} />
          <span>Log Delivery</span>
        </button>
        <button
          onClick={() => setActiveActionTab('usage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeActionTab === 'usage'
              ? 'bg-[#1c1615] text-[#ea580c] border border-[#ea580c]/30'
              : 'bg-[#090e1a] text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Boxes size={14} />
          <span>Log Usage</span>
        </button>
      </div>

      {/* ACTION FORM: LOG DELIVERY */}
      {activeActionTab === 'delivery' && (
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6">
          <form onSubmit={handleLogDelivery} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Material
              </label>
              <select
                value={selectedDeliveryMatId}
                onChange={(e) => setSelectedDeliveryMatId(e.target.value)}
                className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                required
              >
                <option value="">Select material</option>
                {totals.map((m) => (
                  <option key={m.id} value={m.id}>
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
                className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
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

      {/* ACTION FORM: LOG USAGE */}
      {activeActionTab === 'usage' && (
        <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl p-5 md:p-6">
          <form onSubmit={handleLogUsage} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Material
              </label>
              <select
                value={selectedUsageMatId}
                onChange={(e) => setSelectedUsageMatId(e.target.value)}
                className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                required
              >
                <option value="">Select material in stock</option>
                {totals.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.ordered - m.used} {m.unit} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Quantity Used Today
              </label>
              <input
                type="number"
                placeholder="e.g. 25"
                value={usageQty}
                onChange={(e) => setUsageQty(e.target.value)}
                className="w-full bg-[#040711] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ea580c]"
                required
              />
            </div>

            <div>
              <Button variant="primary" type="submit" className="w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2">
                <Boxes size={15} />
                <span>Log Usage</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* LOGGED ENTRIES SECTION */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-800/60">
          <h2 className="text-white font-bold text-base">Logged Entries</h2>
          <p className="text-slate-400 text-xs mt-0.5">Every delivery and usage logged today.</p>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No entries logged yet. Use the tabs above to log a delivery or usage.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                  <th className="py-3 px-6">Material</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-white">
                      {entry.materialName}
                    </td>
                    <td className="py-3.5 px-6 font-medium">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] ${
                        entry.type === 'Delivery' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : 'bg-orange-950 text-orange-400 border border-orange-800'
                      }`}>
                        {entry.type === 'Delivery' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {entry.type}
                      </span>
                    </td>
                    <td className={`py-3.5 px-6 font-semibold ${
                      entry.type === 'Delivery' ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {entry.quantity}
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {entry.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MATERIAL TOTALS INVENTORY TABLE (Bottom Section) */}
      <div className="bg-[#090e1a] border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-800/60">
          <h2 className="text-white font-bold text-base">Material Totals</h2>
          <p className="text-slate-400 text-xs mt-0.5">Per-material ordered, used, wasted and cost.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-400 font-semibold bg-[#060a14]">
                <th className="py-3.5 px-6">Material Name</th>
                <th className="py-3.5 px-6">Ordered</th>
                <th className="py-3.5 px-6">Used</th>
                <th className="py-3.5 px-6">Wasted</th>
                <th className="py-3.5 px-6">Unit</th>
                <th className="py-3.5 px-6">Cost</th>
                <th className="py-3.5 px-6">Supplier Name</th>
                <th className="py-3.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {totals.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    {m.name}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {m.ordered}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {m.used}
                  </td>
                  <td className="py-4 px-6 font-semibold text-orange-400">
                    {m.wasted}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-medium">
                    {m.unit}
                  </td>
                  <td className="py-4 px-6 font-bold text-white">
                    {formatCurrency(m.cost)}
                  </td>
                  <td className="py-4 px-6 text-slate-300">
                    {m.supplier}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {m.date}
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
