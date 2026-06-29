# MediConnect 🏥

A full-stack healthcare appointment booking platform built with the MERN stack.

## Live Demo
- Frontend: https://mediconnect-chi-five.vercel.app
- Backend API: https://mediconnect-backend-4vgp.onrender.com

## Features

### Patient
- Register and login securely with JWT authentication
- Browse and search doctors by specialization, city, or name
- View doctor profiles with experience, qualifications, and consultation fee
- Book appointments by selecting available time slots
- Pay consultation fee online (Razorpay integration)
- Track appointment status in real-time dashboard

### Doctor
- Register and create medical profile
- Manage available time slots
- View and confirm/complete patient appointments
- Real-time notifications for new bookings (Socket.io)

### Admin
- Approve or reject doctor registrations
- View all doctors and appointments
- Dashboard with key statistics

## Tech Stack

**Frontend**
- React.js (Vite)
- React Router v6
- Axios
- CSS Modules
- Socket.io-client

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- Razorpay Payment Gateway
- Cloudinary (file uploads)

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB

### Installation

1. Clone the repository
git clone https://github.com/akanksha519/mediconnect.git

cd mediconnect
2. Setup Backend
cd backend

npm install

cp .env.example .env
Fill in your environment variables
npm run dev
3. Setup Frontend
cd frontend

npm install

npm run dev
### Test Credentials
- **Patient:** patient@test.com / 123456
- **Doctor:** doctor@test.com / 123456
- **Admin:** admin@test.com / 123456

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/doctors | Get all doctors |
| POST | /api/doctors/profile | Create doctor profile |
| POST | /api/appointments | Book appointment |
| PUT | /api/appointments/:id/confirm | Confirm appointment |
| POST | /api/payments/create-order | Create payment order |
| POST | /api/payments/verify | Verify payment |

## Project Structure

mediconnect/

├── backend/

│   ├── config/         # Database config

│   ├── controllers/    # Route handlers

│   ├── middleware/     # Auth & role guards

│   ├── models/         # MongoDB schemas

│   ├── routes/         # API routes

│   ├── socket/         # Socket.io setup

│   └── server.js       # Entry point

└── frontend/

└── src/

├── context/    # Auth context

├── pages/      # React pages

└── styles/     # CSS modules

## Author
Akanksha - [GitHub](https://github.com/akanksha519)