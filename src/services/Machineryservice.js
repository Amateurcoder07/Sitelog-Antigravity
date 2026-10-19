import API from '../api';

const BASE = '/machinery';

// ---- page data
export const fetchMachinery = (projectId) => API.get(`${BASE}/${projectId}`).then((r) => r.data);

// ---- machines
export const createMachine = (projectId, payload) =>
  API.post(`${BASE}/${projectId}/machines`, payload).then((r) => r.data);
export const updateMachine = (id, payload) => API.patch(`${BASE}/machines/${id}`, payload).then((r) => r.data);
export const updateMachineStatus = (id, payload) =>
  API.patch(`${BASE}/machines/${id}/status`, payload).then((r) => r.data);
export const deleteMachine = (id) => API.delete(`${BASE}/machines/${id}`).then((r) => r.data);
export const fetchMachineLogs = (id) => API.get(`${BASE}/machines/${id}/logs`).then((r) => r.data);

// ---- logging
export const logHours = (id, payload) => API.post(`${BASE}/machines/${id}/hours`, payload).then((r) => r.data);
export const logShift = (id, payload) => API.post(`${BASE}/machines/${id}/shift-log`, payload).then((r) => r.data);
export const logFuel = (id, payload) => API.post(`${BASE}/machines/${id}/fuel`, payload).then((r) => r.data);
export const reportIssue = (id, payload) => API.post(`${BASE}/machines/${id}/issue`, payload).then((r) => r.data);

// ---- operators
export const createOperator = (projectId, payload) =>
  API.post(`${BASE}/${projectId}/operators`, payload).then((r) => r.data);
export const deleteOperator = (id) => API.delete(`${BASE}/operators/${id}`).then((r) => r.data);

// ---- back-charges
export const createBackcharge = (projectId, payload) =>
  API.post(`${BASE}/${projectId}/backcharges`, payload).then((r) => r.data);
export const updateBackchargeStatus = (id, payload) =>
  API.patch(`${BASE}/backcharges/${id}/status`, payload).then((r) => r.data);