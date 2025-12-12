require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'medify-secret-key-2024';

// Database setup - use Neon connection
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// ==================== AUTHENTICATION MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== ADMIN LOGIN ====================
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== DOCTORS ENDPOINTS ====================
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

app.post('/api/admin/doctors', authenticateToken, async (req, res) => {
  try {
    const { name, specialty, hospital, experience, rating, consultation_fee, image } = req.body;
    
    if (!name || !specialty) {
      return res.status(400).json({ error: 'Name and specialty are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO doctors (name, specialty, hospital, experience, rating, consultation_fee, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, specialty, hospital, experience || 0, rating || 4.5, consultation_fee || 500, image]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// ==================== SLOTS ENDPOINTS ====================
app.get('/api/doctors/:doctorId/slots', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    let query = 'SELECT * FROM slots WHERE doctor_id = $1';
    const params = [doctorId];
    
    if (date) {
      query += ' AND slot_date = $2';
      params.push(date);
    }
    
    query += ' ORDER BY slot_time';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

app.post('/api/admin/slots', authenticateToken, async (req, res) => {
  try {
    const { doctor_id, slot_date, slot_time } = req.body;
    
    if (!doctor_id || !slot_date || !slot_time) {
      return res.status(400).json({ error: 'doctor_id, slot_date, and slot_time are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO slots (doctor_id, slot_date, slot_time, is_available) VALUES ($1, $2, $3, true) ON CONFLICT DO NOTHING RETURNING *',
      [doctor_id, slot_date, slot_time]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Slot already exists' });
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

app.post('/api/admin/slots/bulk', authenticateToken, async (req, res) => {
  try {
    const { doctor_id, start_date, end_date, times } = req.body;
    
    if (!doctor_id || !start_date || !end_date || !times || times.length === 0) {
      return res.status(400).json({ error: 'doctor_id, start_date, end_date, and times are required' });
    }
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const insertedSlots = [];
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      for (const time of times) {
        try {
          const result = await pool.query(
            'INSERT INTO slots (doctor_id, slot_date, slot_time, is_available) VALUES ($1, $2, $3, true) ON CONFLICT DO NOTHING RETURNING *',
            [doctor_id, dateStr, time]
          );
          
          if (result.rows.length > 0) {
            insertedSlots.push(result.rows[0]);
          }
        } catch (err) {
          console.error(`Error inserting slot for ${dateStr} ${time}:`, err);
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.status(201).json({ inserted: insertedSlots.length, slots: insertedSlots });
  } catch (error) {
    console.error('Error creating bulk slots:', error);
    res.status(500).json({ error: 'Failed to create bulk slots' });
  }
});

// ==================== BOOKINGS ENDPOINTS ====================
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      slot_id,
      doctor_id,
      patient_first_name,
      patient_last_name,
      patient_email,
      patient_phone,
      appointment_type,
      reason,
      notes,
      booking_date,
      booking_time,
    } = req.body;
    
    if (!doctor_id || !patient_first_name || !patient_last_name || !patient_email || !booking_date || !booking_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
      `INSERT INTO bookings (
        slot_id, doctor_id, patient_first_name, patient_last_name, 
        patient_email, patient_phone, appointment_type, reason, notes, 
        booking_date, booking_time, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING') RETURNING *`,
      [
        slot_id || null, doctor_id, patient_first_name, patient_last_name,
        patient_email, patient_phone || null, appointment_type || 'video',
        reason || null, notes || null, booking_date, booking_time
      ]
    );
    
    if (slot_id) {
      await pool.query('UPDATE slots SET is_available = false WHERE id = $1', [slot_id]);
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }
    
    const result = await pool.query(
      `SELECT b.*, d.id as doctor_id, d.name, d.specialty, d.image, d.rating, d.consultation_fee, s.slot_time 
       FROM bookings b
       LEFT JOIN doctors d ON b.doctor_id = d.id
       LEFT JOIN slots s ON b.slot_id = s.id
       WHERE b.patient_email = $1
       ORDER BY b.created_at DESC`,
      [email]
    );
    
    // Transform to match frontend expectations
    const bookings = result.rows.map(row => ({
      id: row.id,
      slot_id: row.slot_id,
      doctor_id: row.doctor_id,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      date: row.booking_date,
      time: row.booking_time,
      type: row.appointment_type === 'video' ? 'Video Consultation' : 'In-Person Consultation',
      doctor: {
        id: row.doctor_id,
        name: row.name,
        specialty: row.specialty,
        image: row.image,
        rating: row.rating,
        consultation_fee: row.consultation_fee
      },
      patientInfo: {
        firstName: row.patient_first_name,
        lastName: row.patient_last_name,
        email: row.patient_email,
        phone: row.patient_phone,
        reason: row.reason,
        notes: row.notes
      }
    }));
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.patch('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await pool.query('SELECT slot_id FROM bookings WHERE id = $1', [id]);
    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['CANCELLED', id]
    );
    
    if (booking.rows[0].slot_id) {
      await pool.query('UPDATE slots SET is_available = true WHERE id = $1', [booking.rows[0].slot_id]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, d.id as doctor_id, d.name, d.specialty, d.image, d.rating, d.consultation_fee, s.slot_time 
       FROM bookings b
       LEFT JOIN doctors d ON b.doctor_id = d.id
       LEFT JOIN slots s ON b.slot_id = s.id
       ORDER BY b.created_at DESC`
    );
    
    // Transform to match frontend expectations
    const bookings = result.rows.map(row => ({
      id: row.id,
      slot_id: row.slot_id,
      doctor_id: row.doctor_id,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      date: row.booking_date,
      time: row.booking_time,
      type: row.appointment_type === 'video' ? 'Video Consultation' : 'In-Person Consultation',
      doctor: {
        id: row.doctor_id,
        name: row.name,
        specialty: row.specialty,
        image: row.image,
        rating: row.rating,
        consultation_fee: row.consultation_fee
      },
      patientInfo: {
        firstName: row.patient_first_name,
        lastName: row.patient_last_name,
        email: row.patient_email,
        phone: row.patient_phone,
        reason: row.reason,
        notes: row.notes
      }
    }));
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
