require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'medify-secret-key-2024';

// For development - allow all origins
app.use(cors());
app.use(express.json());

// ==================== SWAGGER SETUP ====================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medify - Doctor Appointment Booking System',
      version: '1.0.0',
      description: 'API documentation for Medify healthcare appointment booking platform',
      contact: {
        name: 'Medify Support',
        email: 'support@medify.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Doctor: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            specialty: { type: 'string' },
            hospital: { type: 'string' },
            experience: { type: 'integer' },
            rating: { type: 'number' },
            consultation_fee: { type: 'integer' },
            image: { type: 'string' }
          }
        },
        Slot: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            doctor_id: { type: 'integer' },
            slot_date: { type: 'string', format: 'date' },
            slot_time: { type: 'string' },
            is_available: { type: 'boolean' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            doctor_id: { type: 'integer' },
            slot_id: { type: 'integer' },
            patient_first_name: { type: 'string' },
            patient_last_name: { type: 'string' },
            patient_email: { type: 'string' },
            patient_phone: { type: 'string' },
            appointment_type: { type: 'string', enum: ['video', 'in-person'] },
            reason: { type: 'string' },
            notes: { type: 'string' },
            booking_date: { type: 'string', format: 'date' },
            booking_time: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: [__filename]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==================== DATABASE INITIALIZATION ====================
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

// ==================== BOOKING EXPIRY JOB ====================
// Automatically mark PENDING bookings as FAILED after 2 minutes
async function expireOldPendingBookings() {
  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP
       WHERE status = 'PENDING' 
       AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) > 120
       RETURNING id, patient_email`
    );

    if (result.rows.length > 0) {
      console.log(`Expired ${result.rows.length} pending bookings older than 2 minutes`);
      result.rows.forEach(booking => {
        console.log(`  - Booking ID: ${booking.id}, Email: ${booking.patient_email}`);
      });
    }
  } catch (error) {
    console.error('Error expiring pending bookings:', error);
  }
}

// Run expiry job every 1 minute
setInterval(expireOldPendingBookings, 60000);

// Run once on startup
expireOldPendingBookings();

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
/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin user and return JWT token
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 username:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
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
/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Retrieve a list of all available doctors
 *     tags:
 *       - Doctors
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 */
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     description: Retrieve details of a specific doctor
 *     tags:
 *       - Doctors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 */
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

/**
 * @swagger
 * /api/admin/doctors:
 *   post:
 *     summary: Create a new doctor
 *     description: Add a new doctor to the system (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialty:
 *                 type: string
 *               hospital:
 *                 type: string
 *               experience:
 *                 type: integer
 *               rating:
 *                 type: number
 *               consultation_fee:
 *                 type: integer
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       401:
 *         description: Unauthorized
 */
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

// ==================== SLOTS ENDPOINTS ====================
/**
 * @swagger
 * /api/doctors/{doctorId}/slots:
 *   get:
 *     summary: Get available slots for a doctor
 *     description: Retrieve all available time slots for a specific doctor
 *     tags:
 *       - Slots
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional filter by date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slot'
 */
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

/**
 * @swagger
 * /api/admin/slots:
 *   post:
 *     summary: Create a single slot
 *     description: Add a new time slot for a doctor (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *               slot_date:
 *                 type: string
 *                 format: date
 *               slot_time:
 *                 type: string
 *             required:
 *               - doctor_id
 *               - slot_date
 *               - slot_time
 *     responses:
 *       201:
 *         description: Slot created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slot'
 *       400:
 *         description: Slot already exists
 */
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

/**
 * @swagger
 * /api/admin/slots/bulk:
 *   post:
 *     summary: Create multiple slots in bulk
 *     description: Add multiple time slots for a doctor at once (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *               dates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *               times:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - doctor_id
 *               - dates
 *               - times
 *     responses:
 *       201:
 *         description: Slots created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: integer
 *                 slots:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Slot'
 */
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

// ==================== BOOKINGS ENDPOINTS ====================
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Book an appointment with a doctor. Uses transaction with row-level locks to prevent overbooking.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: integer
 *               slot_id:
 *                 type: integer
 *               patient_first_name:
 *                 type: string
 *               patient_last_name:
 *                 type: string
 *               patient_email:
 *                 type: string
 *               patient_phone:
 *                 type: string
 *               appointment_type:
 *                 type: string
 *                 enum: ['video', 'in-person']
 *               reason:
 *                 type: string
 *               notes:
 *                 type: string
 *               booking_date:
 *                 type: string
 *                 format: date
 *               booking_time:
 *                 type: string
 *             required:
 *               - doctor_id
 *               - patient_first_name
 *               - patient_last_name
 *               - patient_email
 *               - booking_date
 *               - booking_time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *                 status:
 *                   type: string
 *                   enum: ['CONFIRMED', 'PENDING', 'FAILED']
 *       409:
 *         description: Slot not available (conflict)
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get user bookings
 *     description: Retrieve all bookings for a specific patient email
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient email address
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Email is required
 */
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

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     description: Cancel an existing booking and release the slot back to availability
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 */
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

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve all bookings in the system (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 */
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

// ==================== HEALTH CHECK ====================
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== SERVER STARTUP ====================
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
});
