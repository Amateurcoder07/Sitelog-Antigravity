// Mock Database for Materials & Inventory Module

export const INITIAL_MATERIAL_TOTALS = [
  {
    id: 'mat-1',
    name: 'Cement',
    ordered: 500,
    used: 460,
    wasted: 40,
    unit: 'bags',
    cost: 144000,
    supplier: 'Raj Cement Co.',
    date: '2026-06-25'
  },
  {
    id: 'mat-2',
    name: 'Steel Rods',
    ordered: 2000,
    used: 1940,
    wasted: 60,
    unit: 'kg',
    cost: 180000,
    supplier: 'Singh Steel Ltd.',
    date: '2026-06-24'
  },
  {
    id: 'mat-3',
    name: 'Bricks',
    ordered: 10000,
    used: 9600,
    wasted: 400,
    unit: 'units',
    cost: 98000,
    supplier: 'Kumar Traders',
    date: '2026-06-23'
  },
  {
    id: 'mat-4',
    name: 'Sand',
    ordered: 15,
    used: 14,
    wasted: 1,
    unit: 'tonnes',
    cost: 45000,
    supplier: 'Goa Sand Suppliers',
    date: '2026-06-22'
  }
];

export const INITIAL_LOGGED_ENTRIES = [];

export async function fetchMaterialsData() {
  return {
    totals: INITIAL_MATERIAL_TOTALS,
    entries: INITIAL_LOGGED_ENTRIES,
    summary: {
      spent: 840000,
      deliveriesCount: 12,
      bagsWastedCount: 40
    }
  };
}
