# 🏥 Medify - Doctor Appointment Booking System

> ✨ **Stop playing phone tag with doctors!** Book your appointment faster than you can say "I have an itch"

A healthcare appointment booking platform built with **React**, **Node.js/Express**, and **PostgreSQL**. The system handles high concurrency scenarios to prevent race conditions and overbooking — because two people shouldn't be in the same room at the same time (even at a doctor's office). 😄

---

## 🚀 Features (aka The Good Stuff)

### 👥 User Features
✅ Browse doctors by specialty (find your perfect doc!)  
✅ View doctor ratings and details (no catfish doctors here)  
✅ Book appointments with date/time selection (pick a slot before someone else takes it!)  
✅ Track booking status: CONFIRMED ✓, PENDING ⏳, FAILED ❌, CANCELLED 🚫  
✅ View your booking history (your personal medical diary)  
✅ Cancel bookings and free up slots for others (be a good human)  

### 🔐 Admin Features
🛠️ Create and manage doctors (hire your dream team)  
🛠️ Create individual or bulk time slots (productivity boost!)  
🛠️ View all system bookings (be the boss)  
🛠️ Manage doctor info: specialty, experience, fees (play god, but nicely)  

### 🧠 Technical Features (The Nerdy Stuff)
⚡ **Concurrency Control**: PostgreSQL row-level locks prevent double-booking (sorry, no overbooking!)  
⚡ **Booking Expiry**: PENDING bookings auto-fail after 2 minutes (commitments matter)  
⚡ **Transaction Safety**: ACID-compliant booking operations (your data is safe with us)  
⚡ **API Docs**: Interactive Swagger UI (test APIs like a boss)  
⚡ **JWT Auth**: Secure token-based authentication (hackers stay out!)  

---

## 📋 Tech Stack (What We're Made Of)

```
┌─────────────────────────────────────┐
│          MEDIFY STACK 🏗️            │
├─────────────────────────────────────┤
│ Frontend  → React 18, Vite, Material-UI
│ Backend   → Node.js, Express.js
│ Database  → PostgreSQL (Neon)
│ Auth      → JWT + bcryptjs
└─────────────────────────────────────┘
```

---

## 🔧 Setup Instructions (Let's Get Rolling)

### 📦 Prerequisites
- ✅ Node.js v16+ (or your favorite Node version)
- ✅ PostgreSQL database (Neon connection string)
- ✅ npm or yarn (whichever you vibe with)

### 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# 🗄️ Database
DATABASE_URL=postgresql://user:password@host/database

# 🔐 Backend
JWT_SECRET=medify-secret-key-2024
BACKEND_PORT=3001

# 🎨 Frontend (if needed)
VITE_API_URL=http://localhost:3001
```

### 💻 Installation & Running

```bash
# Step 1: Install dependencies
npm install

# Step 2: Start frontend dev server (port 5000) 🎨
npm run dev

# Step 3: Start backend server (port 3001) ⚡ [in separate terminal]
node server/index.js
```

✨ **Boom!** Your app is running. Visit `http://localhost:5000` and start booking! 🎉

### 🗄️ Database Setup

The database schema auto-initializes on backend startup. Here's what we create:

| Table | Purpose |
|-------|---------|
| `doctors` 👨‍⚕️ | Doctor profiles (the A-team) |
| `slots` ⏰ | Available appointment times (finite resources) |
| `bookings` 📅 | Patient appointments (the actual work) |
| `admin_users` 🔑 | Admin authentication (the gatekeepers) |

**🔓 Default Admin Credentials:**
```
Username: admin
Password: admin123
```
⚠️ *Change these in production, you wild animal!*

---

## 📚 API Documentation (The Menu)

### 🎯 Interactive Swagger UI

Once the backend is running, visit the **interactive API docs**:

```
🌐 http://localhost:3001/api-docs
```

**What you can do there:**
- 👀 View all endpoints (no hiding!)
- 🧪 Test API calls live (try before you buy!)
- 📋 See request/response schemas (know what to expect)
- 🔐 Check auth requirements (stay secure!)

### 🔌 Main Endpoints at a Glance

#### 🔐 Authentication (Admin Only)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/login` | Get JWT token (the keys to the kingdom) |

#### 👨‍⚕️ Doctors
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/doctors` | List all doctors (browse the talent) |
| GET | `/api/doctors/:id` | Get doctor details (know before you go) |
| POST | `/api/admin/doctors` | Create new doctor (admin only) |

#### ⏰ Slots
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/doctors/:doctorId/slots` | Get available slots (find your time!) |
| POST | `/api/admin/slots` | Create single slot (one at a time) |
| POST | `/api/admin/slots/bulk` | Create multiple slots (bulk add FTW!) |

#### 📅 Bookings
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/bookings` | Create booking (make it official!) |
| GET | `/api/bookings?email=...` | Get your bookings (your history) |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking (change of plans?) |
| GET | `/api/admin/bookings` | View all bookings (admin god mode) |

#### ❤️ Health
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Is the API alive? (check the pulse) |

---

## 🔒 Authentication (Stay Secure, Friend)

### Admin Login Flow
```bash
# 1️⃣ Get JWT token
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Response: 
# {"token":"eyJhbGc...","username":"admin"}

# 2️⃣ Use token for protected endpoints
curl http://localhost:3001/api/admin/doctors \
  -H "Authorization: Bearer eyJhbGc..."
```

💡 **Pro Tip:** Keep your token safe. Don't share it with random people on the internet!

---

## ⚙️ Concurrency & Data Safety (The Boring But Important Stuff)

### 🔄 How Booking Works (Prevents Overbooking)

Think of it like a limited concert ticket sale:

```sql
BEGIN TRANSACTION 🔒
  1. Lock the slot (nobody touches it but you!)
  2. Check if slot is available (is it really free?)
  3. Mark slot as unavailable (MINE!)
  4. Create booking entry (official record)
COMMIT ✅ or ROLLBACK ❌
```

**Result:** Only ONE person gets each slot. Others get:
- `409 Conflict` (someone was faster 🏃)
- `FAILED` booking status (sorry buddy!)

### ⏳ Booking Expiry (Commitment Issues?)

Bookings with `PENDING` status auto-fail after 2 minutes:

```javascript
// Runs every minute
UPDATE bookings 
  SET status = 'FAILED' 
  WHERE status = 'PENDING' 
  AND created_at < NOW() - INTERVAL 2 MINUTES
```

🎯 **Translation:** Make up your mind! You have 2 minutes or the slot goes back up for grabs.

---

## 🏗️ Project Structure (Where Everything Lives)

```
medify/
├── 🎨 src/
│   ├── components/
│   │   ├── BookAppointment/      (The booking wizard)
│   │   ├── NavBar/               (Where you click around)
│   │   ├── BookingModal/         (The pop-up that appears)
│   │   └── ...                   (Other magical components)
│   ├── services/
│   │   └── api.js                (Talks to the backend)
│   ├── App.jsx
│   └── index.jsx
│
├── ⚡ server/
│   ├── index.js                  (The brain of the operation)
│   ├── db.js                     (Database connection magic)
│   └── schema.sql                (Auto-initialized on startup)
│
├── 📦 api/
│   └── index.js                  (Vercel serverless functions)
│
├── 🔧 vite.config.ts             (Frontend build config)
├── vercel.json                   (Deployment config)
└── 📄 package.json               (Dependencies list)
```

---

## 📊 API Request Examples (Copy-Paste Magic)

### 1️⃣ Get All Doctors
```bash
curl http://localhost:3001/api/doctors
```
💡 *Sad? Browse some doctors. They help!* 😄

### 2️⃣ Book an Appointment
```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
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
🎉 *Your appointment is now real!*

### 3️⃣ Get Your Bookings
```bash
curl "http://localhost:3001/api/bookings?email=john@example.com"
```
📋 *See all your future doctor visits!*

### 4️⃣ Create Doctor (Admin)
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
👨‍⚕️ *Welcome to the team, doctor!*

---

## 🧪 Testing (Make Sure It Works!)

### 🎯 Manual Testing via Swagger UI
Visit `http://localhost:3001/api-docs` and test like a pro! 🚀

### 📮 Testing with Postman
1. Login at `/api/admin/login` (get the token)
2. Set `Authorization: Bearer {token}` header (authenticate)
3. Test away with sample data! 🎊

---

## 🔄 Database Migrations

Good news! 🎉 The schema auto-applies on server startup via `schema.sql`.

**Translation:** No manual migrations needed. Plug and play! ⚡

---

## ⚡ Important Notes (Read This!)

| Point | What It Means |
|-------|---------------|
| 📍 Slot Availability | Booked slots are instantly unavailable (no cheating!) |
| 🔒 Transaction Safety | All booking operations use database transactions (ACID-compliant) |
| 🚦 Concurrency | Multiple simultaneous bookings are handled safely (no crashes!) |
| ⏰ Expiry Logic | PENDING bookings auto-fail after 2 minutes (be quick!) |
| 🔐 JWT Expiry | Admin tokens expire after 24 hours (re-login needed) |

---

## 📄 Deep Dive Docs

Want to understand the magic? Check out **[SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)** for:

- 🌍 **Scaling Architecture** (handle millions of users)
- 📊 **Database Sharding** (split the load)
- 🔄 **Concurrency Control** (transactions & locking)
- ⚡ **Caching Strategies** (Redis performance boost)
- 🛡️ **Disaster Recovery** (when things go wrong)

---

## 🚀 Deployment (Go Live!)

The application is ready for production with:

```
Build Command   → npm run build
Start Command   → node server/index.js
Frontend        → Vite-powered (dist/ folder)
Backend         → Express.js (port 3001)
Database        → Neon PostgreSQL
Hosting         → Vercel (serverless magic!)
```

**Live Demo:** 🌐 https://modex-appointment-booking.vercel.app/

---

## 🎯 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| ❌ "Cannot read properties of undefined" | Check API response structure matches frontend expectations |
| 🚫 Port already in use | Change port in `.env` or kill the process using it |
| 🔴 Database connection fails | Check `DATABASE_URL` is correct in `.env` |
| 🔐 Admin login fails | Verify credentials are `admin` / `admin123` |
| 📡 API not responding | Make sure backend is running (`node server/index.js`) |

---

## 💬 Support & Feedback

Have questions? Found a bug? Want to suggest something awesome?

📧 Contact: support@medify.com  
🐛 Issues: Open a GitHub issue (we read them!)  
💡 Features: Tell us your brilliant ideas!  

---

## 📈 Version History

| Version | Release | Highlights |
|---------|---------|------------|
| **1.0.0** | December 2025 | 🎉 Full launch! Bookings, Admin panel, Neon DB |

---

<div align="center">

### 💪 Built with ❤️ by the Medify Team

**Making healthcare appointments boring again (in a good way)** ✨

Give us a ⭐ if you like it!

</div>
