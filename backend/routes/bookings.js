
import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import pool from '../db.js';
import {
  requireAuth,
  requireCustomer
} from '../middleware/auth.js';

const router = Router();

// Get booked seats for a show
router.get('/show/:showId/seats', async (req, res) => {
  const showId = Number(req.params.showId);

  if (!Number.isInteger(showId) || showId <= 0) {
    return res.status(400).json({
      message: 'Invalid show ID.'
    });
  }

  try {
    const [shows] = await pool.execute(
      'SELECT id FROM shows WHERE id = ?',
      [showId]
    );

    if (!shows.length) {
      return res.status(404).json({
        message: 'Show not found.'
      });
    }

    const [rows] = await pool.execute(
      `SELECT seats
       FROM bookings
       WHERE show_id = ?
       AND status = 'CONFIRMED'`,
      [showId]
    );

    const bookedSeats = [
      ...new Set(
        rows.flatMap(row =>
          String(row.seats || '')
            .split(',')
            .map(seat => seat.trim())
            .filter(Boolean)
        )
      )
    ];

    return res.json({ bookedSeats });

  } catch (error) {
    console.error('Load booked seats error:', error);

    return res.status(500).json({
      message: 'Could not load booked seats.'
    });
  }
});

// Get logged-in customer's bookings
router.get('/mine', requireAuth, requireCustomer, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        b.id,
        b.booking_code AS bookingCode,
        b.show_date AS showDate,
        b.show_time AS showTime,
        b.theatre,
        b.seats,
        b.total_amount AS totalAmount,
        b.status,
        b.created_at AS createdAt,
        m.title,
        m.poster_url AS posterUrl,
        m.language,
        m.duration_minutes AS duration
       FROM bookings b
       JOIN movies m ON m.id = b.movie_id
       WHERE b.customer_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.customerId]
    );

    return res.json(rows);

  } catch (error) {
    console.error('Load bookings error:', error);

    return res.status(500).json({
      message: 'Could not load your bookings.'
    });
  }
});

// Cancel a booking
router.patch('/:id/cancel', requireAuth, requireCustomer, async (req, res) => {
  const bookingId = Number(req.params.id);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({
      message: 'Invalid booking ID.'
    });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT b.id, b.status, s.starts_at
       FROM bookings b
       JOIN shows s ON s.id = b.show_id
       WHERE b.id = ? AND b.customer_id = ?`,
      [bookingId, req.user.customerId]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'Booking not found.'
      });
    }

    const booking = rows[0];

    if (booking.status !== 'CONFIRMED') {
      return res.status(400).json({
        message: 'This booking cannot be cancelled.'
      });
    }

    if (new Date(booking.starts_at) <= new Date()) {
      return res.status(400).json({
        message: 'Past shows cannot be cancelled.'
      });
    }

    const [result] = await pool.execute(
      `UPDATE bookings
       SET status = 'CANCELLED'
       WHERE id = ? AND customer_id = ? AND status = 'CONFIRMED'`,
      [bookingId, req.user.customerId]
    );

    if (!result.affectedRows) {
      return res.status(409).json({
        message: 'Booking could not be cancelled. Please try again.'
      });
    }

    return res.json({
      message: 'Booking cancelled successfully!'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);

    return res.status(500).json({
      message: 'Could not cancel booking.'
    });
  }
});

// Create booking
router.post('/', requireAuth, requireCustomer, async (req, res) => {
  const { showId, seats } = req.body;

  if (
    !showId ||
    !Number.isInteger(Number(showId)) ||
    Number(showId) <= 0 ||
    !Array.isArray(seats) ||
    seats.length === 0
  ) {
    return res.status(400).json({
      message: 'Please select a valid show and at least one seat.'
    });
  }

  if (seats.length > 10) {
    return res.status(400).json({
      message: 'You can book up to 10 seats at a time.'
    });
  }

  const cleanSeats = seats.map(seat =>
    typeof seat === 'string' ? seat.trim() : ''
  );

  if (
    cleanSeats.some(seat => !/^[A-F][1-8]$/.test(seat)) ||
    new Set(cleanSeats).size !== cleanSeats.length
  ) {
    return res.status(400).json({
      message: 'Invalid or duplicate seat selection.'
    });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [shows] = await connection.execute(
      `SELECT
        s.id,
        s.movie_id AS movieId,
        DATE_FORMAT(s.starts_at, '%Y-%m-%d') AS showDate,
        DATE_FORMAT(s.starts_at, '%H:%i:%s') AS showTime,
        s.price,
        t.name AS theatre
       FROM shows s
       JOIN screens sc ON sc.id = s.screen_id
       JOIN theatres t ON t.id = sc.theatre_id
       WHERE s.id = ?
       FOR UPDATE`,
      [Number(showId)]
    );

    if (!shows.length) {
      await connection.rollback();

      return res.status(404).json({
        message: 'Selected show was not found.'
      });
    }

    const show = shows[0];

    const [existing] = await connection.execute(
      `SELECT seats
       FROM bookings
       WHERE show_id = ?
       AND status = 'CONFIRMED'`,
      [Number(showId)]
    );

    const alreadyBooked = new Set(
      existing.flatMap(row =>
        String(row.seats || '')
          .split(',')
          .map(seat => seat.trim())
          .filter(Boolean)
      )
    );

    const conflict = cleanSeats.find(seat =>
      alreadyBooked.has(seat)
    );

    if (conflict) {
      await connection.rollback();

      return res.status(409).json({
        message: `Seat ${conflict} has already been booked. Please choose another seat.`
      });
    }

    const price = Number(show.price);

    if (!Number.isFinite(price) || price <= 0) {
      await connection.rollback();

      return res.status(400).json({
        message: 'Invalid show price.'
      });
    }

    const totalAmount = cleanSeats.length * price;

    const bookingCode =
      `CB${randomBytes(4).toString('hex').toUpperCase()}`;

    const [result] = await connection.execute(
      `INSERT INTO bookings (
        booking_code,
        customer_id,
        user_id,
        show_id,
        movie_id,
        show_date,
        show_time,
        theatre,
        seats,
        total_amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
      [
        bookingCode,
        req.user.customerId,
        req.user.id,
        Number(showId),
        show.movieId,
        show.showDate,
        show.showTime,
        show.theatre,
        cleanSeats.join(', '),
        totalAmount
      ]
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Tickets booked successfully!',
      id: result.insertId,
      bookingCode,
      totalAmount,
      showId: Number(showId),
      seats: cleanSeats
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error('Booking error:', error);

    return res.status(500).json({
      message: 'Booking failed. Please try again.'
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export default router;
