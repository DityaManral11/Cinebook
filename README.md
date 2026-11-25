# 🎬 CineBook – Movie & Theatre Booking Platform

CineBook is a full-stack movie ticket booking web application developed to make movie discovery and theatre booking easier. Users can explore movies, discover theatres across different NCR cities, view show timings, select seats, and book movie tickets through a simple and interactive interface.

The platform also includes an admin dashboard to manage movies, theatres, screens, shows, and bookings.

## ✨ Features

### 👤 User Features
- Browse currently showing and upcoming movies.
- Search movies by title.
- Filter movies by genre and language.
- View detailed movie information, including cast, duration, rating, and description.
- Select a city and explore available theatres.
- Browse available movie shows and timings.
- View theatre seating layouts.
- Select available seats.
- View booking summary and total ticket amount.
- Complete a demo payment process.
- Receive booking confirmation and ticket details.
- View and manage previous bookings.

### 🛠️ Admin Features
- Admin login and dashboard.
- Add and manage movies.
- Manage theatres across NCR cities.
- Manage screens and seating arrangements.
- Manage movie shows and schedules.
- View and manage customer bookings.

### 📍 Theatre Locations

CineBook supports theatre listings across major NCR cities:

- Delhi
- Noida
- Greater Noida
- Gurugram
- Faridabad
- Ghaziabad

## 💻 Tech Stack

### Frontend
- React.js
- JavaScript
- Vite
- CSS
- React Router
- Lucide React

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcryptjs

### Database
- MySQL
- MySQL Workbench
- mysql2

### Development Tools
- Visual Studio Code
- Git and GitHub
- Postman

## 🗂️ Project Structure

```text
CineBook/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Open the Project

Open the CineBook project folder in Visual Studio Code.

### 2. Backend Setup

Open the terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure the following environment variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=cinebook
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

1. Open MySQL Workbench.
2. Create a database named `cinebook`.
3. Execute the `database/schema.sql` file.
4. Configure your MySQL connection details in the backend `.env` file.
5. Add the required application data to the database.

**Note:** The schema file creates the database tables. Application data such as movies, theatres, screens, seats, and shows must be populated separately.

### 4. Start Backend

Run the following command inside the backend folder:

```bash
npm start
```

Backend runs at:

```text
http://localhost:5000
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## 🔌 API Overview

| Module | Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Movies | `/api/movies` |
| Theatres | `/api/theatres` |
| Shows | `/api/shows` |
| Bookings | `/api/bookings` |
| Admin | `/api/admin` |

## 🗄️ Database Structure

CineBook uses a relational MySQL database consisting of 11 tables:

1. `users` – Stores user account information.
2. `customers` – Stores customer details and roles.
3. `movies` – Stores movie information.
4. `theatres` – Stores theatre details and locations.
5. `screens` – Stores theatre screen information.
6. `seats` – Stores individual seat details.
7. `shows` – Stores movie show schedules and pricing.
8. `bookings` – Stores customer booking information.
9. `booking_seats` – Stores seats associated with bookings.
10. `payments` – Stores payment transaction details.
11. `tickets` – Stores generated ticket information.

## 🔐 Authentication & Security

- User registration and login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based access for customers and administrators.

## 💳 Payment System

CineBook currently includes a demo payment flow to demonstrate the ticket booking process. It does not represent a live payment gateway integration.

## 🚀 Future Improvements

- Live payment gateway integration.
- Enhanced account security.
- Email and booking notifications.
- Improved mobile responsiveness.
- Advanced admin analytics.
- Production deployment and optimization.

## 👨‍💻 Author

**Ditya Manral**

GitHub: [DityaManral11](https://github.com/DityaManral11)

---

⭐ If you find this project interesting, consider giving the repository a star!
