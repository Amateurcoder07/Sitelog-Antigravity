import React, { useState, useEffect } from 'react';
import { X, FlaskConical, Camera, Calendar, Building2, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import Button from '../Button';

export default function NewSampleModal({ isOpen, onClose, onSave }) {
  // Material Category Segmented Toggle: 'Concrete' | 'Steel Rebar' | 'Aggregates' | 'Soil'
  const [materialCategory, setMaterialCategory] = useState('Concrete');

  // Concrete Grade Dropdown
  const [concreteGrade, setConcreteGrade] = useState('M25');
  const [customGrade, setCustomGrade] = useState('');

  // Specimen Type (Auto-defaults)
  const [specimenType, setSpecimenType] = useState('150mm Cubes (Set of 3)');

  // Cascading Location Picker
  const [towerBlock, setTowerBlock] = useState('Tower A');
  const [floorLevel, setFloorLevel] = useState('Floor 3');
  const [structuralElement, setStructuralElement] = useState('Column');

  // Casting Date & Auto-Calculated Test Dates
  const [castingDate, setCastingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [date7Day, setDate7Day] = useState('');
  const [date28Day, setDate28Day] = useState('');

  // Photo Capture State
  const [photoCaptured, setPhotoCaptured] = useState(null);

  // Auto-calculate 7-day and 28-day dates whenever castingDate changes
  useEffect(() => {
    if (!castingDate) return;
    const cast = new Date(castingDate);

    const d7 = new Date(cast);
    d7.setDate(d7.getDate() + 7);

    const d28 = new Date(cast);
    d28.setDate(d28.getDate() + 28);

    setDate7Day(d7.toISOString().split('T')[0]);
    setDate28Day(d28.toISOString().split('T')[0]);
  }, [castingDate]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoCaptured(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedGrade = concreteGrade === 'Custom' ? customGrade || 'M25' : concreteGrade;
    const fullLocation = `${towerBlock} - ${floorLevel} (${structuralElement})`;
    const targetSpec = materialCategory === 'Concrete' ? `${selectedGrade.replace('M', '')}.0 N/mm²` : '500 N/mm²';

    const newSample = {
      id: `TS-2026-${Math.floor(100 + Math.random() * 900)}`,
      materialCategory,
      gradeBadge: `${selectedGrade} ${materialCategory === 'Concrete' ? 'Concrete Cubes' : materialCategory}`,
      sampleName: `${selectedGrade} ${specimenType}`,
      structureLocation: fullLocation,
      castingDate,
      testingDueDate: date7Day,
      testType: '7-Day Compressive Strength',
      targetStrength: targetSpec,
      achievedStrength: 'Pending Test',
      ageStatus: 'Day 7 Due Soon',
      status: 'Due Today',
      labTechnician: 'Site QC In-Charge',
      reportNo: `TR-NABL-${Math.floor(8000 + Math.random() * 1000)}`
    };

    onSave(newSample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Responsive Sheet (Bottom Sheet on Mobile, Modal on Desktop) */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border-t md:border border-black/15 dark:border-white/15 rounded-t-3xl md:rounded-3xl p-5 md:p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto my-0 md:my-6">
        
        {/* Mobile Grab Handle Bar */}
        <div className="w-12 h-1.5 bg-black/20 dark:bg-white/20 rounded-full mx-auto mb-4 md:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <FlaskConical size={20} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-black dark:text-white">Step 1: Register New Sample</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Record site material pouring & specimen casting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. SEGMENTED MATERIAL SELECTOR TOGGLE BUTTONS */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              Material Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl">
              {['Concrete', 'Steel Rebar', 'Aggregates', 'Soil'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMaterialCategory(cat)}
                  className={`py-2.5 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    materialCategory === cat
                      ? 'bg-orange-600 text-white shadow-md scale-[1.02]'
                      : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* CONCRETE SPECIFIC CONTROLS */}
          {materialCategory === 'Concrete' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Concrete Grade Selector */}
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
                    Concrete Mix Grade
                  </label>
                  <select
                    value={concreteGrade}
                    onChange={(e) => setConcreteGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
                  >
                    <option value="M15" className="bg-white dark:bg-[#0a0f1d]">M15 (15 N/mm²)</option>
                    <option value="M20" className="bg-white dark:bg-[#0a0f1d]">M20 (20 N/mm²)</option>
                    <option value="M25" className="bg-white dark:bg-[#0a0f1d]">M25 (25 N/mm²)</option>
                    <option value="M30" className="bg-white dark:bg-[#0a0f1d]">M30 (30 N/mm²)</option>
                    <option value="M35" className="bg-white dark:bg-[#0a0f1d]">M35 (35 N/mm²)</option>
                    <option value="M40" className="bg-white dark:bg-[#0a0f1d]">M40 (40 N/mm²)</option>
                    <option value="Custom" className="bg-white dark:bg-[#0a0f1d]">Custom Spec</option>
                  </select>

                  {concreteGrade === 'Custom' && (
                    <input
                      type="text"
                      placeholder="e.g. M50 High Strength"
                      value={customGrade}
                      onChange={(e) => setCustomGrade(e.target.value)}
                      className="mt-2 w-full px-3 py-2 text-xs bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white focus:outline-none"
                    />
                  )}
                </div>

                {/* Specimen Type (Auto-defaults) */}
                <div>
                  <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1">
                    Specimen Type
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={specimenType}
                    className="w-full px-3 py-2.5 text-xs font-semibold bg-black/10 dark:bg-white/10 border border-black/15 dark:border-white/15 rounded-xl text-black/70 dark:text-white/70 cursor-not-allowed min-h-[44px]"
                  />
                </div>
              </div>

              {/* 2. CASCADING LOCATION PICKER */}
              <div>
                <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5 flex items-center gap-1">
                  <Building2 size={14} className="text-orange-500" />
                  Cascading Location Selector
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Tower / Block */}
                  <div>
                    <span className="block text-[10px] text-black/40 dark:text-white/40 mb-0.5">Tower / Block</span>
                    <select
                      value={towerBlock}
                      onChange={(e) => setTowerBlock(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs font-semibold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Tower A" className="bg-white dark:bg-[#0a0f1d]">Tower A</option>
                      <option value="Tower B" className="bg-white dark:bg-[#0a0f1d]">Tower B</option>
                      <option value="Block C" className="bg-white dark:bg-[#0a0f1d]">Block C</option>
                      <option value="Podium" className="bg-white dark:bg-[#0a0f1d]">Podium</option>
                    </select>
                  </div>

                  {/* Floor Level */}
                  <div>
                    <span className="block text-[10px] text-black/40 dark:text-white/40 mb-0.5">Floor Level</span>
                    <select
                      value={floorLevel}
                      onChange={(e) => setFloorLevel(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs font-semibold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Basement 1" className="bg-white dark:bg-[#0a0f1d]">Basement 1</option>
                      <option value="Ground Floor" className="bg-white dark:bg-[#0a0f1d]">Ground Floor</option>
                      <option value="Floor 1" className="bg-white dark:bg-[#0a0f1d]">Floor 1</option>
                      <option value="Floor 2" className="bg-white dark:bg-[#0a0f1d]">Floor 2</option>
                      <option value="Floor 3" className="bg-white dark:bg-[#0a0f1d]">Floor 3</option>
                      <option value="Floor 4" className="bg-white dark:bg-[#0a0f1d]">Floor 4</option>
                      <option value="Roof Slab" className="bg-white dark:bg-[#0a0f1d]">Roof Slab</option>
                    </select>
                  </div>

                  {/* Structural Element */}
                  <div>
                    <span className="block text-[10px] text-black/40 dark:text-white/40 mb-0.5">Element</span>
                    <select
                      value={structuralElement}
                      onChange={(e) => setStructuralElement(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs font-semibold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Column" className="bg-white dark:bg-[#0a0f1d]">Column</option>
                      <option value="Beam" className="bg-white dark:bg-[#0a0f1d]">Beam</option>
                      <option value="Slab" className="bg-white dark:bg-[#0a0f1d]">Slab</option>
                      <option value="Footing" className="bg-white dark:bg-[#0a0f1d]">Footing</option>
                      <option value="Shear Wall" className="bg-white dark:bg-[#0a0f1d]">Shear Wall</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. CASTING DATE & AUTO-CALCULATED TEST DATES */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1 flex items-center justify-between">
              <span>Casting Date</span>
              <span className="text-[10px] text-black/40 dark:text-white/40">Tap to override</span>
            </label>
            <input
              type="date"
              value={castingDate}
              onChange={(e) => setCastingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-black/5 dark:bg-white/5 border border-black/15 dark:border-white/15 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[44px]"
            />

            {/* Auto-Calculated Test Date Cards */}
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

          {/* 4. TAKE PHOTO OF BATCH SLIP / POUR */}
          <div>
            <label className="block text-xs font-bold text-black/70 dark:text-white/70 mb-1.5">
              Batch Slip / Concrete Pour Photo
            </label>

            <label className="flex items-center justify-center gap-2 w-full min-h-[48px] p-3 bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 hover:border-orange-500 rounded-xl text-xs font-bold text-black/70 dark:text-white/70 cursor-pointer transition-colors">
              <Camera size={18} className="text-orange-500" />
              <span>{photoCaptured ? 'Photo Attached ✓ (Tap to retake)' : 'Take Photo of Batch Slip / Pour'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {photoCaptured && (
              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                <img src={photoCaptured} alt="Batch Slip" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/70 text-white px-2 py-0.5 rounded">
                  Captured
                </span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            <Button variant="secondary" onClick={onClose} type="button" className="!py-3 flex-1 min-h-[48px]">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="!py-3 flex-1 min-h-[48px]">
              Register & Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
