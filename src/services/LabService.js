import API from '../api';

const BASE = '/lab-management';
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

function toFormData(fields = {}, files = {}) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    fd.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });
  Object.entries(files).forEach(([field, list]) => {
    [].concat(list || []).filter(Boolean).forEach((file) => fd.append(field, file));
  });
  return fd;
}

// ---- reads
export const fetchStandards = () => API.get(`${BASE}/standards`).then((r) => r.data);
export const fetchLabData = (projectId) => API.get(`${BASE}/${projectId}`).then((r) => r.data);
export const fetchEngineers = (projectId) => API.get(`${BASE}/${projectId}/engineers`).then((r) => r.data);

export async function downloadRegister(projectId, type = 'samples') {
  const res = await API.get(`${BASE}/${projectId}/export`, { params: { type }, responseType: 'blob' });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lab-${type}-register.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- samples
export const createSample = (projectId, { photoFile, ...fields }) =>
  API.post(`${BASE}/${projectId}/samples`, toFormData(fields, { photo: photoFile }), multipart).then((r) => r.data);

export const recordResult = (sampleId, payload) =>
  API.patch(`${BASE}/samples/${sampleId}/result`, payload).then((r) => r.data);

// ---- NCRs
export const createNcr = (projectId, fields, photoFiles) =>
  API.post(`${BASE}/${projectId}/ncrs`, toFormData(fields, { photos: photoFiles }), multipart).then((r) => r.data);

export const updateNcrStatus = (ncrId, status) =>
  API.patch(`${BASE}/ncrs/${ncrId}/status`, { status }).then((r) => r.data);

export const uploadConsultantReport = (ncrId, file) =>
  API.post(`${BASE}/ncrs/${ncrId}/consultant-report`, toFormData({}, { file }), multipart).then((r) => r.data);

// ---- equipment
export const createEquipment = (projectId, payload) =>
  API.post(`${BASE}/${projectId}/equipment`, payload).then((r) => r.data);

export const recalibrateEquipment = (equipmentId, nextCalibrationDue, photoFile) =>
  API.patch(`${BASE}/equipment/${equipmentId}/recalibrate`, toFormData({ nextCalibrationDue }, { photo: photoFile }), multipart).then((r) => r.data);

// ---- certificates
export const uploadCertificate = (projectId, fields, file) =>
  API.post(`${BASE}/${projectId}/certificates`, toFormData(fields, { file }), multipart).then((r) => r.data);

export const shareCertificate = (certId, channel) =>
  API.post(`${BASE}/certificates/${certId}/share`, { channel }).then((r) => r.data);

// ---- concrete cube register
export const createCubePour = (projectId, payload) =>
  API.post(`${BASE}/${projectId}/cube-pours`, payload).then((r) => r.data);

export const saveCubeReadings = (pourId, payload) =>
  API.patch(`${BASE}/cube-pours/${pourId}/readings`, payload).then((r) => r.data);

export const saveCubePourDetails = (pourId, payload) =>
  API.patch(`${BASE}/cube-pours/${pourId}`, payload).then((r) => r.data);

export const verifyCubePour = (pourId) =>
  API.post(`${BASE}/cube-pours/${pourId}/verify`).then((r) => r.data);