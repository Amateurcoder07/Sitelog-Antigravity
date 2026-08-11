// Mock Database for SiteLog Multi-Project System

export const MOCK_PROJECTS = [
  { id: 'arconia-towers', name: 'Arconia Towers' },
  { id: 'ganesh-towers', name: 'Ganesh Towers' },
  { id: 'nh-566', name: 'NH 566 Highway Project' }
];

export const MOCK_DASHBOARD_DATA = {
  'arconia-towers': {
    projectId: 'arconia-towers',
    projectName: 'Arconia Towers',
    userName: 'Tanmay',
    lastUpdated: 'Today at 9:41 AM',
    metrics: {
      labourCost: '₹3,20,000',
      materialsSpend: '₹8,40,000',
      activeWorkers: 23,
      openSafetyIssues: 2
    },
    progress: {
      overallPercent: 58,
      behindSchedulePercent: 12,
      milestones: [
        { name: 'Foundation', planned: 100, actual: 100 },
        { name: 'Shuttering', planned: 90, actual: 75 },
        { name: 'Structure/RCC', planned: 70, actual: 55 },
        { name: 'Brickwork', planned: 50, actual: 30 },
        { name: 'Electrical & Plumbing', planned: 30, actual: 15 },
        { name: 'Finishing', planned: 10, actual: 0 }
      ]
    },
    riskAlert: {
      highlight: 'Brickwork is 20% behind schedule',
      text: '— biggest risk to timeline'
    },
    healthScore: {
      score: 78,
      maxScore: 100,
      label: 'Good'
    }
  },
  'ganesh-towers': {
    projectId: 'ganesh-towers',
    projectName: 'Ganesh Towers',
    userName: 'Tanmay',
    lastUpdated: 'Today at 10:15 AM',
    metrics: {
      labourCost: '₹5,75,000',
      materialsSpend: '₹14,20,000',
      activeWorkers: 42,
      openSafetyIssues: 0
    },
    progress: {
      overallPercent: 82,
      behindSchedulePercent: 0,
      milestones: [
        { name: 'Foundation', planned: 100, actual: 100 },
        { name: 'Shuttering', planned: 100, actual: 95 },
        { name: 'Structure/RCC', planned: 90, actual: 88 },
        { name: 'Brickwork', planned: 80, actual: 78 },
        { name: 'Electrical & Plumbing', planned: 65, actual: 60 },
        { name: 'Finishing', planned: 40, actual: 35 }
      ]
    },
    riskAlert: {
      highlight: 'Material delivery for Finishing delayed by 2 days',
      text: '— monitor vendor dispatch'
    },
    healthScore: {
      score: 92,
      maxScore: 100,
      label: 'Excellent'
    }
  },
  'nh-566': {
    projectId: 'nh-566',
    projectName: 'NH 566 Highway Project',
    userName: 'Tanmay',
    lastUpdated: 'Today at 8:30 AM',
    metrics: {
      labourCost: '₹12,40,000',
      materialsSpend: '₹34,50,000',
      activeWorkers: 68,
      openSafetyIssues: 5
    },
    progress: {
      overallPercent: 41,
      behindSchedulePercent: 18,
      milestones: [
        { name: 'Foundation', planned: 90, actual: 70 },
        { name: 'Shuttering', planned: 70, actual: 45 },
        { name: 'Structure/RCC', planned: 50, actual: 30 },
        { name: 'Brickwork', planned: 30, actual: 10 },
        { name: 'Electrical & Plumbing', planned: 20, actual: 5 },
        { name: 'Finishing', planned: 0, actual: 0 }
      ]
    },
    riskAlert: {
      highlight: 'Safety audit required for Sector 4 Earthwork',
      text: '— 5 open safety issues pending'
    },
    healthScore: {
      score: 64,
      maxScore: 100,
      label: 'Needs Attention'
    }
  }
};

/**
 * Async API abstraction method.
 * In production, replace the internal return statement with an Express API call e.g.:
 * return (await axios.get(`/api/projects/${projectId}/dashboard`)).data;
 */
export async function fetchDashboardData(projectId = 'arconia-towers') {
  // Simulate minor API latency if desired, or return directly
  return MOCK_DASHBOARD_DATA[projectId] || MOCK_DASHBOARD_DATA['arconia-towers'];
}

export async function fetchProjectsList() {
  return MOCK_PROJECTS;
}
