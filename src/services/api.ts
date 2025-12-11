import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  Doctor,
  Slot,
  Booking,
  LoginCredentials,
  LoginResponse,
  BookingPayload,
} from '../types/index';

const API_BASE_URL = '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Clear token if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
    }
    return Promise.reject(error);
  }
);

// ==================== DOCTORS API ====================
export const doctorsApi = {
  getAll: async () => {
    const response = await api.get<Doctor[]>('/doctors');
    return response;
  },

  getById: async (id: number) => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response;
  },

  create: async (data: Partial<Doctor>) => {
    const response = await api.post<Doctor>('/admin/doctors', data);
    return response;
  },

  getSlots: async (doctorId: number, date?: string) => {
    const response = await api.get<Slot[]>(`/doctors/${doctorId}/slots`, {
      params: { date },
    });
    return response;
  },
};

// ==================== SLOTS API ====================
export const slotsApi = {
  create: async (data: {
    doctor_id: number;
    slot_date: string;
    slot_time: string;
  }) => {
    const response = await api.post<Slot>('/admin/slots', data);
    return response;
  },

  createBulk: async (data: {
    doctor_id: number;
    dates: string[];
    times: string[];
  }) => {
    const response = await api.post<{ created: number; slots: Slot[] }>(
      '/admin/slots/bulk',
      data
    );
    return response;
  },
};

// ==================== BOOKINGS API ====================
export const bookingsApi = {
  create: async (data: BookingPayload) => {
    const response = await api.post<{
      booking: Booking;
      status: 'CONFIRMED' | 'PENDING' | 'FAILED';
    }>('/bookings', data);
    return response;
  },

  getByEmail: async (email: string) => {
    const response = await api.get<Booking[]>('/bookings', {
      params: { email },
    });
    return response;
  },

  cancel: async (id: number) => {
    const response = await api.patch<{
      message: string;
      booking: Booking;
    }>(`/bookings/${id}/cancel`);
    return response;
  },

  getAll: async () => {
    const response = await api.get<Booking[]>('/admin/bookings');
    return response;
  },
};

// ==================== AUTH API ====================
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>('/admin/login', credentials);
    return response;
  },
};

// ==================== HEALTH CHECK ====================
export const healthApi = {
  check: async () => {
    const response = await api.get<{ status: string; timestamp: string }>(
      '/health'
    );
    return response;
  },
};

export default api;
