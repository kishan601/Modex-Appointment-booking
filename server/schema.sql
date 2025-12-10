-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  hospital VARCHAR(255),
  experience INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 4.5,
  consultation_fee INTEGER DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slots table (available time slots for doctors)
CREATE TABLE IF NOT EXISTS slots (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time VARCHAR(20) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, slot_date, slot_time)
);

-- Bookings table with status tracking
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  slot_id INTEGER REFERENCES slots(id) ON DELETE SET NULL,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
  patient_first_name VARCHAR(255) NOT NULL,
  patient_last_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(50),
  appointment_type VARCHAR(50) DEFAULT 'video',
  reason VARCHAR(255),
  notes TEXT,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster slot lookups
CREATE INDEX IF NOT EXISTS idx_slots_doctor_date ON slots(doctor_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_slots_available ON slots(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(patient_email);

-- Insert sample doctors
INSERT INTO doctors (name, specialty, hospital, experience, rating, consultation_fee) VALUES
('Dr. Rahul Sharma', 'General Physician', 'Apollo Hospital', 12, 4.8, 500),
('Dr. Priya Patel', 'Dermatologist', 'Max Healthcare', 8, 4.7, 700),
('Dr. Anil Kumar', 'Cardiologist', 'Fortis Hospital', 15, 4.9, 1000),
('Dr. Sneha Gupta', 'Pediatrician', 'AIIMS', 10, 4.6, 600),
('Dr. Vikram Singh', 'Orthopedic', 'Medanta Hospital', 14, 4.8, 800)
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2a$10$rQnM3Ky.xyIzMvLVZt5tNeJOz.xfM9z8F6xmQxL1p5e6Z1J3k5H9i', 'admin@medify.com')
ON CONFLICT (username) DO NOTHING;
