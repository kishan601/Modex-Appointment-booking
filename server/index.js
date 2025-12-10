require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'medify-secret-key-2024';

app.use(cors());
app.use(express.json());

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

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
    const result = await pool.query(
      `INSERT INTO doctors (name, specialty, hospital, experience, rating, consultation_fee, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, specialty, hospital, experience || 0, rating || 4.5, consultation_fee || 500, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

app.get('/api/doctors/:doctorId/slots', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    let query = `SELECT * FROM slots WHERE doctor_id = $1 AND is_available = true`;
    let params = [doctorId];
    
    if (date) {
      query += ` AND slot_date = $2`;
      params.push(date);
    } else {
      query += ` AND slot_date >= CURRENT_DATE`;
    }
    
    query += ` ORDER BY slot_date, slot_time`;
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
    const result = await pool.query(
      `INSERT INTO slots (doctor_id, slot_date, slot_time) 
       VALUES ($1, $2, $3) RETURNING *`,
      [doctor_id, slot_date, slot_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'This slot already exists' });
    }
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

app.post('/api/admin/slots/bulk', authenticateToken, async (req, res) => {
  try {
    const { doctor_id, dates, times } = req.body;
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const insertedSlots = [];
      
      for (const date of dates) {
        for (const time of times) {
          try {
            const result = await client.query(
              `INSERT INTO slots (doctor_id, slot_date, slot_time) 
               VALUES ($1, $2, $3) 
               ON CONFLICT (doctor_id, slot_date, slot_time) DO NOTHING
               RETURNING *`,
              [doctor_id, date, time]
            );
            if (result.rows.length > 0) {
              insertedSlots.push(result.rows[0]);
            }
          } catch (err) {
            console.error('Slot insert error:', err);
          }
        }
      }
      
      await client.query('COMMIT');
      res.status(201).json({ created: insertedSlots.length, slots: insertedSlots });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating bulk slots:', error);
    res.status(500).json({ error: 'Failed to create slots' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      doctor_id,
      slot_id,
      patient_first_name,
      patient_last_name,
      patient_email,
      patient_phone,
      appointment_type,
      reason,
      notes,
      booking_date,
      booking_time
    } = req.body;

    await client.query('BEGIN');

    if (slot_id) {
      const slotCheck = await client.query(
        `SELECT * FROM slots WHERE id = $1 AND is_available = true FOR UPDATE`,
        [slot_id]
      );

      if (slotCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ 
          error: 'This slot is no longer available. Please select another time.',
          status: 'FAILED'
        });
      }

      await client.query(
        `UPDATE slots SET is_available = false WHERE id = $1`,
        [slot_id]
      );
    }

    const bookingResult = await client.query(
      `INSERT INTO bookings (
        doctor_id, slot_id, patient_first_name, patient_last_name,
        patient_email, patient_phone, appointment_type, reason, notes,
        booking_date, booking_time, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'CONFIRMED')
      RETURNING *`,
      [
        doctor_id, slot_id, patient_first_name, patient_last_name,
        patient_email, patient_phone, appointment_type || 'video',
        reason, notes, booking_date, booking_time
      ]
    );

    await client.query('COMMIT');

    const doctorResult = await pool.query('SELECT * FROM doctors WHERE id = $1', [doctor_id]);
    const booking = {
      ...bookingResult.rows[0],
      doctor: doctorResult.rows[0] || null
    };

    res.status(201).json({ booking, status: 'CONFIRMED' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking', status: 'FAILED' });
  } finally {
    client.release();
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await pool.query(
      `SELECT b.*, d.name as doctor_name, d.specialty, d.hospital, d.image as doctor_image
       FROM bookings b
       LEFT JOIN doctors d ON b.doctor_id = d.id
       WHERE b.patient_email = $1
       ORDER BY b.booking_date DESC, b.booking_time DESC`,
      [email]
    );

    const bookings = result.rows.map(row => ({
      id: row.id,
      date: row.booking_date,
      time: row.booking_time,
      type: row.appointment_type === 'video' ? 'Video Consultation' : 'In-Person Visit',
      status: row.status,
      doctor: {
        id: row.doctor_id,
        name: row.doctor_name,
        specialty: row.specialty,
        hospital: row.hospital,
        image: row.doctor_image
      },
      patientInfo: {
        firstName: row.patient_first_name,
        lastName: row.patient_last_name,
        email: row.patient_email,
        phone: row.patient_phone,
        reason: row.reason,
        notes: row.notes
      },
      createdAt: row.created_at
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.patch('/api/bookings/:id/cancel', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');

    const bookingResult = await client.query(
      `UPDATE bookings SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    if (booking.slot_id) {
      await client.query(
        `UPDATE slots SET is_available = true WHERE id = $1`,
        [booking.slot_id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  } finally {
    client.release();
  }
});

app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, d.name as doctor_name, d.specialty
       FROM bookings b
       LEFT JOIN doctors d ON b.doctor_id = d.id
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});
