# CineBook — Movie Ticket Booking Website

A full-stack movie booking starter built with **React + Vite (JSX)**, **Node.js + Express**, and **MySQL**.

## Features
- Responsive dark cinema UI
- Movie search and genre filters
- Movie details and showtime selection
- Interactive seat selection
- Register/login with hashed passwords and JWT
- Booking creation and "My Bookings"
- MySQL schema and sample movie seed data

## Requirements
- Node.js 18+
- MySQL Server and (optionally) MySQL Workbench

## 1. Set up MySQL
Open MySQL Workbench and run the contents of `database/schema.sql`.

This creates the `cinebook` database, tables, and sample movies.

## 2. Configure the backend
Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env` and update the MySQL username/password and JWT secret.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Start the API:
```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 3. Start the frontend
Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Notes
- The frontend uses `.jsx`, not TypeScript.
- The API expects the MySQL database to be running.
- Register an account before booking to associate bookings with your user.
- Movie poster/banner images are loaded from remote image URLs and need an internet connection.
- This is a student project starter, not a production payment system. No real payments are collected.
