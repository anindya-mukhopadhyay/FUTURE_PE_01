# Newtown Fitness Gym

A premium, production-ready full-stack gym and athletic conditioning website engineered for a high-end international fitness brand. Features glassmorphism designs, responsive layouts, automated test suites, physical metric logs, real-time booking, admin panels, and visual payment gateways.

---

## 🚀 Tech Stack

### Frontend
- **Core:** React + Vite
- **Routing:** React Router DOM (v7)
- **Animations:** Framer Motion (v12)
- **Styling:** Premium Vanilla CSS (No Tailwind) with central variable tokens
- **Icons:** React Icons
- **HTTP Client:** Axios
- **State Management:** React Context API (with cached offline failover fallbacks)

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ORM
- **Security:** Helmet, CORS, Express Rate Limiter, bcryptjs password hashing
- **Authentication:** JSON Web Tokens (JWT)
- **Testing:** Jest + Supertest (Backend), Vitest (Frontend)

---

## 📁 Repository Structure

```text
/
├── frontend/                     # React Single Page Application (Vite)
│   ├── public/                   # Site sitemaps, robots.txt and icons
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Dumbbell Loader, Razorpay Mock
│   │   ├── context/              # Auth, Bookings, and Promotions Context
│   │   ├── pages/                # Home, About, Classes, Trainers, Calculators, Dashboards
│   │   ├── utils/                # BMR, BMI, Water, and Bodyfat math formulas
│   │   ├── index.css             # Main styling, custom variables, and glassmorphism
│   │   └── App.jsx               # Routing tables and protected route checks
│   └── tests/                    # Vitest calculation unit tests
└── backend/                      # Node.js + Express REST API Server
    ├── config/                   # MongoDB connection configuration
    ├── controllers/              # Auth, Schedulers, Bookings, and Invoicing controllers
    ├── middleware/               # Auth guards, error parsers, and rate limiters
    ├── models/                   # Mongoose schemas (User, Class, Booking, Payment)
    ├── routes/                   # Endpoint routers
    ├── seed/                     # Database initialization seeder
    └── tests/                    # Jest API endpoint tests
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/newtown_fitness` or Atlas URI)

### 1. Database & Backend Setup
1. Open the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment parameters inside `.env` (defaults are preconfigured):
   ```ini
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/newtown_fitness
   JWT_SECRET=newtown_gym_super_secret_jwt_key_2026_jwt_token_auth
   NODE_ENV=development
   ```
4. **Seed the database** (crucial for visual dashboard graphics):
   ```bash
   npm run seed
   ```
5. Launch the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run the Vite client:
   ```bash
   npm run dev
   ```
4. Open the browser link (typically `http://localhost:5173`) to view the premium gym application!

---

## 🧪 Running Automated Tests

Our application utilizes distinct modern testing frameworks for backend and frontend.

### Backend Tests (Jest + Supertest)
Runs mock integration tests for register, duplicate filters, login credentials, and public class catalogs:
```bash
cd backend
npm run test
```

### Frontend Tests (Vitest)
Verifies calculations algorithms (BMI, BMR, water targets, Navy fat parameters):
```bash
cd frontend
npm run test
```

---

## 🔑 Mock Sandbox Credentials

The application connects seamlessly to the backend but features **graceful network offline fallbacks**. If the database or backend is not active, you can use these mock credentials to review the dashboard flows flawlessly:

### Member Dashboard Demo
- **Email:** `member@gmail.com`
- **Password:** `memberpassword`
- **Actions:** View schedules, cancel sessions, track weight logs charts, download styled invoices PDF.

### Admin Dashboard Demo
- **Email:** `admin@newtownfitness.com`
- **Password:** `adminpassword`
- **Actions:** CRUD active group classes, publish offers, resolve inquiries tickets.
