import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const doctorsApi = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/admin/doctors', data),
  getSlots: (doctorId, date) => api.get(`/doctors/${doctorId}/slots`, { params: { date } }),
};

export const slotsApi = {
  create: (data) => api.post('/admin/slots', data),
  createBulk: (data) => api.post('/admin/slots/bulk', data),
};

export const bookingsApi = {
  create: (data) => api.post('/bookings', data),
  getByEmail: (email) => api.get('/bookings', { params: { email } }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getAll: () => api.get('/admin/bookings'),
};

export const authApi = {
  login: (credentials) => api.post('/admin/login', credentials),
};

export default api;
