// Mock Database for Labour & Wages Module

export const INITIAL_WORKERS = [
  {
    id: 'w-1',
    name: 'Ramesh Kumar',
    role: 'Mason',
    dailyWage: 1200,
    status: 'present', // 'present', 'absent', 'half'
    daysPresent: 24,
    wageEarned: 28800,
    amountPaid: 28800,
    isPaid: true
  },
  {
    id: 'w-2',
    name: 'Suresh Patel',
    role: 'Helper',
    dailyWage: 800,
    status: 'present',
    daysPresent: 22,
    wageEarned: 17600,
    amountPaid: 0,
    isPaid: false
  },
  {
    id: 'w-3',
    name: 'Amit Singh',
    role: 'Foreman',
    dailyWage: 1600,
    status: 'present',
    daysPresent: 26,
    wageEarned: 41600,
    amountPaid: 41600,
    isPaid: true
  },
  {
    id: 'w-4',
    name: 'Deepak Yadav',
    role: 'Mason',
    dailyWage: 1200,
    status: 'absent',
    daysPresent: 19,
    wageEarned: 22800,
    amountPaid: 0,
    isPaid: false
  },
  {
    id: 'w-5',
    name: 'Priya Sharma',
    role: 'Electrician',
    dailyWage: 1400,
    status: 'present',
    daysPresent: 21,
    wageEarned: 29400,
    amountPaid: 0,
    isPaid: false
  }
];

export const INITIAL_ATTENDANCE_HISTORY = [
  {
    id: 'h-1',
    date: '31 July 2026',
    summary: '18 present · 2 absent · 1 half day',
    submittedAt: 'Submitted at 6:42 PM'
  },
  {
    id: 'h-2',
    date: '30 July 2026',
    summary: '19 present · 1 absent · 1 half day',
    submittedAt: 'Submitted at 6:55 PM'
  },
  {
    id: 'h-3',
    date: '29 July 2026',
    summary: '17 present · 3 absent · 1 half day',
    submittedAt: 'Submitted at 7:10 PM'
  },
  {
    id: 'h-4',
    date: '28 July 2026',
    summary: '20 present · 1 absent',
    submittedAt: 'Submitted at 6:38 PM'
  }
];

/**
 * Async API abstraction function ready for Express API routes e.g. axios.get('/api/labour')
 */
export async function fetchLabourData() {
  return {
    workers: INITIAL_WORKERS,
    history: INITIAL_ATTENDANCE_HISTORY
  };
}
