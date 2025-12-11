// Doctor Types
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  experience: number;
  rating: number;
  consultation_fee: number;
  image?: string;
  created_at?: string;
}

// Slot Types
export interface Slot {
  id: number;
  doctor_id: number;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  created_at?: string;
}

// Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';

export interface Booking {
  id: number;
  doctor_id: number;
  slot_id: number | null;
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_type: 'video' | 'in-person';
  reason: string;
  notes: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  doctor?: Doctor;
}

export interface BookingPayload {
  doctor_id: number;
  slot_id?: number;
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_type: 'video' | 'in-person';
  reason: string;
  notes: string;
  booking_date: string;
  booking_time: string;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// API Response Types
export interface ApiError {
  message: string;
  status: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  error: ApiError | null;
}

// UI State Types
export interface UIState {
  loading: boolean;
  error: string | null;
  success: string | null;
}
