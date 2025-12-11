# Medify - Doctor Appointment Booking System

## Overview
Medify is a healthcare appointment booking platform that allows users to find doctors and book appointments online. The system features a React frontend with a Node.js/Express backend connected to a Neon PostgreSQL database.

## Tech Stack
- **Frontend**: React 18, Vite, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT for admin routes

## Project Structure
```
├── server/                 # Backend server
│   ├── index.js           # Express server with API endpoints
│   ├── db.js              # PostgreSQL connection pool
│   └── schema.sql         # Database schema and seed data
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   │   ├── BookAppointment/   # Appointment booking modal
│   │   ├── BookingModal/      # Booking confirmation modal
│   │   ├── NavBar/            # Navigation bar
│   │   └── ProtectedRoute.jsx # Auth guard for admin routes
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx    # Admin authentication state
│   │   ├── DoctorsContext.jsx # Doctors data and CRUD
│   │   ├── BookingsContext.jsx# Bookings data management
│   │   └── UIContext.jsx      # Notifications and loading
│   ├── pages/Admin/       # Admin Dashboard
│   │   ├── AdminLogin.jsx     # Admin login page
│   │   ├── AdminDashboard.jsx # Main admin layout with tabs
│   │   ├── CreateDoctorForm.jsx # Add new doctors
│   │   ├── CreateSlotsForm.jsx  # Single/bulk slot creation
│   │   └── BookingsTable.jsx    # View all bookings
│   ├── MyBookings/        # User bookings page
│   ├── services/          # API service layer
│   │   └── api.ts         # Axios API client with interceptors
│   └── App.jsx            # Main application component
└── vite.config.ts         # Vite configuration with API proxy
```

## Database Schema
- **doctors**: Doctor profiles (name, specialty, hospital, experience, rating)
- **slots**: Available time slots for doctors (supports concurrency control)
- **bookings**: User appointments with status (PENDING, CONFIRMED, FAILED, CANCELLED)
- **admin_users**: Admin authentication

## API Endpoints

### Public Endpoints
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/:doctorId/slots` - Get available slots for a doctor
- `POST /api/bookings` - Create a new booking (with concurrency handling)
- `GET /api/bookings?email=...` - Get user's bookings by email
- `PATCH /api/bookings/:id/cancel` - Cancel a booking

### Admin Endpoints (JWT required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/doctors` - Create a doctor
- `POST /api/admin/slots` - Create a slot
- `POST /api/admin/slots/bulk` - Create multiple slots
- `GET /api/admin/bookings` - Get all bookings

## Concurrency Handling
The booking system uses PostgreSQL transactions with row-level locks (`FOR UPDATE`) to prevent race conditions and double-booking:
1. Transaction begins
2. Slot availability is checked with `FOR UPDATE` lock
3. If available, slot is marked as unavailable
4. Booking is created with CONFIRMED status
5. Transaction commits

## Environment Variables
- `NEON_DATABASE_URL` - PostgreSQL connection string (stored as secret)

## Running Locally
- Frontend: `npm run dev` (port 5000)
- Backend: `node server/index.js` (port 3001)

## Recent Changes
- Connected to Neon PostgreSQL database
- Implemented full booking system with concurrency handling
- Updated frontend to use backend APIs instead of localStorage
- Added Vite proxy for seamless API calls
- Added Admin Dashboard with protected routes
- Implemented Context API for state management (Auth, Doctors, Bookings, UI)
- Created admin forms for doctor and slot management
- Added API client with JWT token interceptor

## Deployment
Configured for autoscale deployment with:
- Build: `npm run build`
- Run: `node server/index.js`
