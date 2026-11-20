import { Router } from "express";
import pool from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Admin Dashboard Overview
router.get("/overview", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [movieStats] = await pool.execute(
      "SELECT COUNT(*) AS totalMovies FROM movies",
    );

    const [showStats] = await pool.execute(
      "SELECT COUNT(*) AS totalShows FROM shows",
    );

    const [bookingStats] = await pool.execute(
      `SELECT
        COUNT(*) AS totalBookings,
        SUM(status = 'CONFIRMED') AS confirmedBookings,
        SUM(status = 'PENDING') AS pendingBookings,
        SUM(status = 'CANCELLED') AS cancelledBookings,
        COALESCE(
          SUM(CASE WHEN status = 'CONFIRMED' THEN total_amount ELSE 0 END),
          0
        ) AS totalRevenue
       FROM bookings`,
    );

    const [customerStats] = await pool.execute(
      "SELECT COUNT(*) AS totalCustomers FROM customers WHERE role = 'customer'",
    );

    return res.json({
      totalMovies: movieStats[0].totalMovies,
      totalShows: showStats[0].totalShows,
      totalBookings: bookingStats[0].totalBookings,
      confirmedBookings: Number(bookingStats[0].confirmedBookings || 0),
      pendingBookings: Number(bookingStats[0].pendingBookings || 0),
      cancelledBookings: Number(bookingStats[0].cancelledBookings || 0),
      totalCustomers: customerStats[0].totalCustomers,
      totalRevenue: Number(bookingStats[0].totalRevenue),
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return res.status(500).json({
      message: "Could not load admin dashboard overview.",
    });
  }
});

// Get all bookings - Admin Only
router.get("/bookings", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        b.id,
        b.booking_code AS bookingCode,
        c.name AS customerName,
        c.email AS customerEmail,
        m.title AS movieTitle,
        b.show_date AS showDate,
        b.show_time AS showTime,
        b.theatre,
        b.seats,
        b.total_amount AS totalAmount,
        b.status,
        b.created_at AS createdAt,
        DATE_FORMAT(b.show_date, '%Y-%m-%d') AS bookingDate
       FROM bookings b
       JOIN customers c ON c.id = b.customer_id
       JOIN movies m ON m.id = b.movie_id
       ORDER BY b.created_at DESC`,
    );

    return res.json(rows);
  } catch (error) {
    console.error("Admin bookings error:", error);
    return res.status(500).json({
      message: "Could not load bookings.",
    });
  }
});

export default router;
