# IMovies – Online Cinema Platform

Online cinema booking platform built with the MERN stack (MongoDB, Express, React, Node.js) and Bootstrap. Browse current movies, inspect available showtimes, and reserve seats in real time.

## 🚀 Features
- **User Authentication**: Register and login with secure bcrypt password hashing and JSON Web Tokens (JWT).
- **Movie Catalog**: Browse now-showing movies with genres, durations, descriptions, and posters.
- **Showtimes & Schedules**: Real-time screening information per movie.
- **Interactive Seat Reservation**: Live visual seat map with real-time seat availability polling.
- **Atomic Booking System**: Prevents double-booking of seats.
- **My Bookings & Cancellation**: View confirmed bookings and cancel reservations with instant seat release.

---

## 🛠 Tech Stack
- **Frontend**: React.js 18, React Router v6, Bootstrap 5, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT & bcryptjs
- **API Testing**: Postman Collection included (`postman_collection.json`)

---

## 📁 Project Structure
```
skillwallet/
├── server/
│   ├── models/        # User, Movie, Showtime, Booking
│   ├── routes/        # auth, movies, showtimes, bookings
│   ├── middleware/    # auth.js (JWT verification)
│   ├── seed.js        # Initial database seed script
│   ├── server.js      # Express server entry point
│   ├── .env.example   # Environment template
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Navbar, ProtectedRoute
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # HomePage, MovieDetail, SeatSelection, etc.
│   │   ├── api.js       # Axios instance with auth interceptor
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── postman_collection.json
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (>= 16)
- MongoDB instance running locally on `mongodb://localhost:27017` (or MongoDB Atlas connection URI)

### 1. Server Setup
```bash
cd server
npm install
npm run seed     # Seeds sample movies & showtimes
npm run dev      # Starts backend on http://localhost:5000
```

### 2. Client Setup
In a new terminal window:
```bash
cd client
npm install
npm start        # Starts React frontend on http://localhost:3000
```

---

## 🔐 Environment Variables
In `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/imovies
JWT_SECRET=supersecretjwtkey_imovies_2026
```

---

## 📬 Postman Collection
Import `postman_collection.json` directly into Postman to test all endpoints (`/api/auth`, `/api/movies`, `/api/showtimes`, `/api/bookings`).
