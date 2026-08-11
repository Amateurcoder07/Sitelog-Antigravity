// Mock Database for Carbon & Waste Module

export const INITIAL_COST_RECOVERY = {
  recoveredThisMonth: 5400,
  scrapSalesRecovered: 5400,
  materialWasteCost: 22400
};

export const INITIAL_ENV_IMPACT = {
  co2SavedTonnes: 14.2,
  wasteDivertedPercent: 68,
  materialsReusedCount: 3
};

export const INITIAL_CARBON_HISTORY = [
  { label: '3 mo ago', value: 18.4, percent: 85 },
  { label: '2 mo ago', value: 16.1, percent: 74 },
  { label: 'Last mo', value: 15.3, percent: 70 },
  { label: 'This mo', value: 14.2, percent: 65, isHighlight: true }
];

export const INITIAL_WASTE_BREAKDOWN = [
  {
    id: 'wb-1',
    material: 'Cement',
    quantity: '40 bags',
    cost: 6000,
    status: 'Landfill' // 'Landfill' | 'Sold as Scrap' | 'Reused On Site'
  },
  {
    id: 'wb-2',
    material: 'Steel',
    quantity: '60 kg',
    cost: 5400,
    status: 'Sold as Scrap'
  },
  {
    id: 'wb-3',
    material: 'Bricks',
    quantity: '400 units',
    cost: 2000,
    status: 'Reused On Site'
  }
];

export async function fetchCarbonWasteData() {
  return {
    costRecovery: INITIAL_COST_RECOVERY,
    envImpact: INITIAL_ENV_IMPACT,
    carbonHistory: INITIAL_CARBON_HISTORY,
    wasteBreakdown: INITIAL_WASTE_BREAKDOWN
  };
}
