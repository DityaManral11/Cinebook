# CineBook — Frontend + Backend + MySQL

This project is separated into two apps:
- `frontend/`: React + TypeScript + Vite + Tailwind CSS and the CineBook responsive UI prototype.
- `backend/`: Node.js + Express REST API, controllers, route modules, auth middleware, service/module layer and MySQL connection.
- `backend/database/schema.sql`: SQL schema for customers, movies, theatres, screens, seats, shows, bookings, booking_seats, tickets and payments.

## Requirements
Node.js 18+, npm and MySQL 8+.

## Database setup
Run `backend/database/schema.sql` in MySQL Workbench or MySQL CLI.

## Start backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, set your MySQL password and a long random `JWT_SECRET`, then:
```bash
npm run dev
```
API: `http://localhost:5000`; health endpoint: `GET /api/health`.

## Start frontend (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Vite typically opens `http://localhost:5173`. Frontend API base URL can be set in `frontend/.env` as `VITE_API_URL=http://localhost:5000/api`.

## Main API routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/movies`, `GET /api/movies/:id`
- Admin-only: `POST /api/movies`, `PATCH /api/movies/:id`, `DELETE /api/movies/:id`
- `GET /api/theatres`; admin-only `POST /api/theatres`
- `GET /api/shows?movieId=1&date=YYYY-MM-DD&city=New%20Delhi`
- Authenticated: `GET /api/bookings/mine`, `POST /api/bookings` with `{ "showId": 1, "seatIds": [1, 2] }`

To promote a registered user to admin, run `UPDATE customers SET role='admin' WHERE email='your-email@example.com';` in MySQL. Then log in again to obtain a JWT containing the updated role.

## Current status and limitations
The frontend prototype currently uses sample movie data and browser storage; the API helper is present but the screens are not yet wired to all backend endpoints. Backend endpoints and schema are a starter implementation and require local integration testing with seeded shows/seats. Payment is simulated; no real payment gateway is included. Keep `.env` private and do not use real customer/payment data until security and testing are complete.
