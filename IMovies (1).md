# IMovies – Build Spec (for Antigravity)

Online cinema platform: browse movies, pick showtimes, reserve seats with real-time availability. Keep the codebase **small and simple**; no unnecessary features or files.

## Stack
HTML, CSS, JavaScript (async/await), React.js, Bootstrap, Node.js ≥16, Express.js, MongoDB (Mongoose), JWT. Test APIs with Postman. Editor: VS Code.

## Structure
```
imovies/
├─ server/  (models/ routes/ middleware/ server.js .env)
└─ client/  (React: pages/ components/ api.js)
```
Client–server REST architecture. Server `.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`.

## Epics & Tasks (6 epics, 19 tasks)

**E1 Setup**
1. Init repo, folders, npm deps (express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken; react, react-router-dom, bootstrap, axios).
2. Express server + MongoDB connection.
3. React app with Bootstrap, router, navbar.

**E2 Authentication**
4. `User` model (name, email, hashed password).
5. `POST /api/auth/register` and `/login` → JWT.
6. Auth middleware (verify JWT) + React login/register pages, token stored client-side.

**E3 Movies**
7. `Movie` model (title, description, genre, duration, poster) + seed script.
8. `GET /api/movies`, `GET /api/movies/:id`.
9. Movie list + detail pages (Bootstrap cards).

**E4 Showtimes & Seats**
10. `Showtime` model (movie, date/time, screen, seats[] with booked flag).
11. `GET /api/movies/:id/showtimes`, `GET /api/showtimes/:id`.
12. Real-time seat availability (poll every few seconds; no sockets).
13. Seat-selection UI (available / selected / booked).

**E5 Booking**
14. `Booking` model (user, showtime, seats, status).
15. `POST /api/bookings` (auth): atomically reject already-booked seats, then mark seats booked.
16. `GET /api/bookings/me`, `DELETE /api/bookings/:id` (cancel → free seats).
17. Booking confirmation + "My Bookings" pages.

**E6 Finish**
18. Error handling, input validation, Postman collection.
19. Responsive check + short README (setup/run steps).

## Rules
- Protected routes: bookings only for logged-in users.
- Never store plain-text passwords; never commit `.env`.
- Return JSON `{message}` on errors with proper status codes.
- Work task by task, in order; run and verify each before moving on.

## Run
`cd server && npm i && npm run dev` · `cd client && npm i && npm start` (MongoDB running locally).
