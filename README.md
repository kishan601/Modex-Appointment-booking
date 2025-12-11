# Medify - Doctor Appointment Booking System

A healthcare appointment booking platform built with **React**, **Node.js/Express**, and **PostgreSQL**. The system handles high concurrency scenarios to prevent race conditions and overbooking.

## 🚀 Features

### User Features
- Browse available doctors by specialty
- View doctor details and ratings
- Book appointments with date/time selection
- Track booking status (CONFIRMED, PENDING, FAILED, CANCELLED)
- View personal booking history
- Cancel bookings and free up slots

### Admin Features
- Create and manage doctors
- Create individual or bulk time slots
- View all system bookings
- Manage doctor information (specialty, experience, fees)

### Technical Features
- **Concurrency Control**: PostgreSQL row-level locks prevent double-booking
- **Booking Expiry**: Automatic PENDING → FAILED after 2 minutes
- **Transaction Safety**: ACID-compliant booking operations
- **API Documentation**: Interactive Swagger UI
- **Authentication**: JWT-based admin authentication

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Material-UI, Bootstrap |
| **Backend** | Node.js, Express.js, Swagger |
| **Database** | PostgreSQL (Neon) |
| **Authentication** | JWT (jsonwebtoken) |
| **Security** | bcryptjs for password hashing |

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (Neon connection string)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
NEON_DATABASE_URL=postgresql://user:password@host/database

# Backend
BACKEND_PORT=3001
JWT_SECRET=medify-secret-key-2024

# Frontend (if needed)
VITE_API_URL=http://localhost:3001
```

### Installation

```bash
# Install dependencies
npm install

# Start frontend dev server (port 5000)
npm run dev

# Start backend server (port 3001) - in separate terminal
node server/index.js
```

### Database Setup

The database schema is automatically initialized on backend startup. The schema includes:
- `doctors` - Doctor profiles
- `slots` - Available appointment time slots
- `bookings` - Patient appointments
- `admin_users` - Admin authentication

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

---

## 📚 API Documentation

### Interactive Swagger UI
Once the backend is running, visit the **interactive API documentation**:

```
http://localhost:3001/api-docs
```

The Swagger UI allows you to:
- View all available endpoints
- Test API calls directly
- See request/response schemas
- Check authentication requirements

### Main Endpoints

#### Authentication (Admin)
- `POST /api/admin/login` - Admin login (returns JWT token)

#### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/admin/doctors` - Create new doctor (admin only)

#### Slots
- `GET /api/doctors/:doctorId/slots` - Get available slots for a doctor
- `POST /api/admin/slots` - Create single slot (admin only)
- `POST /api/admin/slots/bulk` - Create multiple slots (admin only)

#### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings?email=...` - Get user bookings
- `PATCH /api/bookings/:id/cancel` - Cancel a booking
- `GET /api/admin/bookings` - View all bookings (admin only)

#### Health
- `GET /api/health` - API health check

---

## 🔒 Authentication

### Admin Login Flow
```bash
# 1. Get JWT token
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Response:
# {"token":"eyJhbGc...","username":"admin"}

# 2. Use token for protected endpoints
curl http://localhost:3001/api/admin/doctors \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## ⚙️ Concurrency & Data Safety

### How Booking Works (Prevents Overbooking)

```sql
BEGIN TRANSACTION
  1. Lock slot row (FOR UPDATE)
  2. Check if slot is available
  3. Mark slot as unavailable
  4. Create booking entry
COMMIT or ROLLBACK
```

**Result**: Only one user can successfully book a slot. Others get:
- `409 Conflict` - Slot taken by another user
- `FAILED` booking status

### Booking Expiry

Bookings with `PENDING` status automatically transition to `FAILED` after 2 minutes:

```javascript
// Runs every minute
UPDATE bookings 
  SET status = 'FAILED' 
  WHERE status = 'PENDING' 
  AND created_at < NOW() - INTERVAL 2 MINUTES
```

---

## 🏗️ Project Structure

```
├── server/
│   ├── index.js              # Express server with all API endpoints
│   ├── db.js                 # PostgreSQL connection pool
│   └── schema.sql            # Database schema (auto-initialized)
├── src/
│   ├── components/           # React components
│   │   ├── BookAppointment/
│   │   ├── BookingModal/
│   │   ├── NavBar/
│   │   └── ...
│   ├── services/
│   │   └── api.js            # API client (axios)
│   ├── App.jsx
│   └── index.jsx
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
└── SYSTEM_DESIGN.md          # Architecture documentation
```

---

## 📊 API Request Examples

### 1. Get All Doctors
```bash
curl http://localhost:3001/api/doctors
```

### 2. Book an Appointment
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "slot_id": 5,
    "patient_first_name": "John",
    "patient_last_name": "Doe",
    "patient_email": "john@example.com",
    "patient_phone": "9876543210",
    "appointment_type": "video",
    "reason": "Checkup",
    "booking_date": "2025-12-20",
    "booking_time": "14:00"
  }'
```

### 3. Get My Bookings
```bash
curl "http://localhost:3001/api/bookings?email=john@example.com"
```

### 4. Create Doctor (Admin)
```bash
curl -X POST http://localhost:3001/api/admin/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Dr. John Smith",
    "specialty": "Cardiology",
    "hospital": "City Hospital",
    "experience": 15,
    "rating": 4.8,
    "consultation_fee": 500
  }'
```

---

## 🧪 Testing

### Manual Testing via Swagger UI
Visit `http://localhost:3001/api-docs` to test all endpoints interactively.

### Testing with Postman
1. Get JWT token from `/api/admin/login`
2. Set `Authorization: Bearer {token}` header for admin endpoints
3. Test endpoints with sample data

---

## 🔄 Database Migrations

The schema is automatically applied on server startup via `schema.sql`. No manual migrations needed.

---

## 📝 Important Notes

1. **Slot Availability**: Booked slots are immediately marked as unavailable
2. **Transaction Safety**: All booking operations use database transactions
3. **Concurrency**: Multiple simultaneous booking requests are handled safely
4. **Expiry Logic**: PENDING bookings auto-fail after 2 minutes
5. **JWT Expiry**: Admin tokens expire after 24 hours

---

## 📄 System Design Documentation

For detailed information about:
- **Scaling architecture** (horizontal scaling, load balancing)
- **Database sharding** (range-based sharding strategy)
- **Concurrency control** (transactions, locking mechanisms)
- **Caching strategies** (Redis, performance optimization)
- **Disaster recovery** (backups, failover, business continuity)

See: **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)**

---

## 🚀 Deployment

The application is configured for deployment with:
- **Build**: `npm run build`
- **Start**: `node server/index.js`
- **Frontend**: Served via Vite (build to `dist/`)
- **Backend**: Express.js on port 3001
- **Database**: Neon PostgreSQL (connection via `NEON_DATABASE_URL`)

---

## 📞 Support

For issues, feature requests, or improvements, please contact support@medify.com

---

**Last Updated**: December 2025  
**Version**: 1.0.0
