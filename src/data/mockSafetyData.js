// Mock Database for Safety & Incident Management Module

export const INITIAL_SAFETY_KPIS = {
  daysWithoutIncident: 14,
  briefingsThisMonth: 6,
  openIssuesCount: 2,
  ppeCompliancePercent: 87
};

export const INITIAL_OPEN_ISSUES = [
  {
    id: 'issue-1',
    issue: 'Loose scaffolding on Floor 4',
    dateReported: '2026-06-20',
    severity: 'High', // 'High' | 'Medium' | 'Low'
    status: 'In Progress' // 'In Progress' | 'Flagged' | 'Resolved'
  },
  {
    id: 'issue-2',
    issue: 'Missing helmets on 3 workers',
    dateReported: '2026-06-22',
    severity: 'Medium',
    status: 'Flagged'
  }
];

export const INITIAL_BRIEFING_LOGS = [
  {
    id: 'briefing-1',
    topic: 'Fire Safety',
    date: '2026-06-15',
    attendees: '21 workers'
  },
  {
    id: 'briefing-2',
    topic: 'Scaffold Safety',
    date: '2026-06-10',
    attendees: '18 workers'
  }
];

export async function fetchSafetyData() {
  return {
    kpis: INITIAL_SAFETY_KPIS,
    openIssues: INITIAL_OPEN_ISSUES,
    briefingLogs: INITIAL_BRIEFING_LOGS
  };
}
