
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import bookingRoutes from "./routes/bookings.js";
import showRoutes from "./routes/shows.js";
import adminRoutes from "./routes/admin.js";
import theatreRoutes from "./routes/theatres.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://cinebook-dmnm.vercel.app",
  "https://cinebook-rkbp-one.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Backend status
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to CineBook API",
    status: "running",
  });
});

// Database health check
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(500).json({
      status: "error",
      database: "not connected",
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/theatres", theatreRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CineBook API running on port ${PORT}`);
});
