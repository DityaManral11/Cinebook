<<<<<<< HEAD
import { Router } from "express";
import pool from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
=======

import { Router } from 'express';
import pool from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
>>>>>>> origin/main

const router = Router();

// Automatically generate shows for a selected date
async function createShowsForDate(date) {
<<<<<<< HEAD
  const [dateCheck] = await pool.execute("SELECT ? >= CURDATE() AS isValid", [
    date,
  ]);

  if (!dateCheck[0].isValid) return;

  const [screens] = await pool.execute("SELECT id FROM screens ORDER BY id");
=======
  const [dateCheck] = await pool.execute(
    'SELECT ? >= CURDATE() AS isValid',
    [date]
  );

  if (!dateCheck[0].isValid) return;

  const [screens] = await pool.execute(
    'SELECT id FROM screens ORDER BY id'
  );
>>>>>>> origin/main

  const [movies] = await pool.execute(
    `SELECT id, duration_minutes, base_price, language
     FROM movies
<<<<<<< HEAD
     ORDER BY id`,
=======
     ORDER BY id`
>>>>>>> origin/main
  );

  if (!screens.length || !movies.length) return;

<<<<<<< HEAD
  const timeSlots = ["09:00:00", "13:00:00", "17:00:00", "21:00:00"];
=======
  const timeSlots = [
    '09:00:00',
    '13:00:00',
    '17:00:00',
    '21:00:00'
  ];
>>>>>>> origin/main

  for (let screenIndex = 0; screenIndex < screens.length; screenIndex++) {
    const screen = screens[screenIndex];

    for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
      const movieIndex = (screenIndex + slotIndex) % movies.length;
      const movie = movies[movieIndex];

      const startAt = `${date} ${timeSlots[slotIndex]}`;
<<<<<<< HEAD
      const duration = Math.max(Number(movie.duration_minutes) || 150, 60);

      const price = Number(movie.base_price) || 220;
      const language = movie.language || "Hindi";
=======
      const duration = Math.max(
        Number(movie.duration_minutes) || 150,
        60
      );

      const price = Number(movie.base_price) || 220;
      const language = movie.language || 'Hindi';
>>>>>>> origin/main

      await pool.execute(
        `INSERT INTO shows
          (movie_id, screen_id, starts_at, ends_at, price, language, format)
         SELECT ?, ?, ?, DATE_ADD(?, INTERVAL ? MINUTE), ?, ?, '2D'
         WHERE NOT EXISTS (
           SELECT 1
           FROM shows
           WHERE screen_id = ?
           AND starts_at < DATE_ADD(?, INTERVAL ? MINUTE)
           AND ends_at > ?
         )`,
        [
          movie.id,
          screen.id,
          startAt,
          startAt,
          duration,
          price,
          language,
          screen.id,
          startAt,
          duration,
<<<<<<< HEAD
          startAt,
        ],
=======
          startAt
        ]
>>>>>>> origin/main
      );
    }
  }
}

// ADMIN: Create a new show
<<<<<<< HEAD
router.post("/", requireAuth, requireAdmin, async (req, res) => {
=======
router.post('/', requireAuth, requireAdmin, async (req, res) => {
>>>>>>> origin/main
  try {
    const {
      movieId,
      screenId,
      startsAt,
      price,
      language,
<<<<<<< HEAD
      format = "2D",
=======
      format = '2D'
>>>>>>> origin/main
    } = req.body;

    if (!movieId || !screenId || !startsAt || !price) {
      return res.status(400).json({
<<<<<<< HEAD
        message: "Please provide all required show details.",
=======
        message: 'Please provide all required show details.'
>>>>>>> origin/main
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
<<<<<<< HEAD
        message: "Ticket price must be greater than zero.",
=======
        message: 'Ticket price must be greater than zero.'
>>>>>>> origin/main
      });
    }

    const [movies] = await pool.execute(
<<<<<<< HEAD
      "SELECT duration_minutes, language FROM movies WHERE id = ?",
      [movieId],
=======
      'SELECT duration_minutes, language FROM movies WHERE id = ?',
      [movieId]
>>>>>>> origin/main
    );

    if (!movies.length) {
      return res.status(404).json({
<<<<<<< HEAD
        message: "Movie not found.",
=======
        message: 'Movie not found.'
>>>>>>> origin/main
      });
    }

    const [screens] = await pool.execute(
<<<<<<< HEAD
      "SELECT id FROM screens WHERE id = ?",
      [screenId],
=======
      'SELECT id FROM screens WHERE id = ?',
      [screenId]
>>>>>>> origin/main
    );

    if (!screens.length) {
      return res.status(404).json({
<<<<<<< HEAD
        message: "Screen not found.",
      });
    }

    const duration = Math.max(Number(movies[0].duration_minutes) || 150, 60);
=======
        message: 'Screen not found.'
      });
    }

    const duration = Math.max(
      Number(movies[0].duration_minutes) || 150,
      60
    );
>>>>>>> origin/main

    const [result] = await pool.execute(
      `INSERT INTO shows
       (movie_id, screen_id, starts_at, ends_at, price, language, format)
       SELECT ?, ?, ?, DATE_ADD(?, INTERVAL ? MINUTE), ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM shows
         WHERE screen_id = ?
         AND starts_at < DATE_ADD(?, INTERVAL ? MINUTE)
         AND ends_at > ?
       )`,
      [
        movieId,
        screenId,
        startsAt,
        startsAt,
        duration,
        price,
<<<<<<< HEAD
        language || movies[0].language || "Hindi",
=======
        language || movies[0].language || 'Hindi',
>>>>>>> origin/main
        format,
        screenId,
        startsAt,
        duration,
<<<<<<< HEAD
        startsAt,
      ],
=======
        startsAt
      ]
>>>>>>> origin/main
    );

    if (!result.affectedRows) {
      return res.status(409).json({
<<<<<<< HEAD
        message: "This screen already has an overlapping show.",
=======
        message: 'This screen already has an overlapping show.'
>>>>>>> origin/main
      });
    }

    res.status(201).json({
<<<<<<< HEAD
      message: "Show created successfully.",
      showId: result.insertId,
    });
  } catch (error) {
    console.error("Create Show Error:", error);

    res.status(500).json({
      message: "Could not create show.",
=======
      message: 'Show created successfully.',
      showId: result.insertId
    });

  } catch (error) {
    console.error('Create Show Error:', error);

    res.status(500).json({
      message: 'Could not create show.'
>>>>>>> origin/main
    });
  }
});

// GET all shows with filters
<<<<<<< HEAD
router.get("/", async (req, res) => {
=======
router.get('/', async (req, res) => {
>>>>>>> origin/main
  try {
    const { movieId, theatreId, date } = req.query;

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
<<<<<<< HEAD
          message: "Invalid date format. Use YYYY-MM-DD.",
=======
          message: 'Invalid date format. Use YYYY-MM-DD.'
>>>>>>> origin/main
        });
      }
    }

    let sql = `
      SELECT
        s.id,
        s.movie_id AS movieId,
        m.title AS movieTitle,
        m.poster_url AS posterUrl,
        s.screen_id AS screenId,
        sc.name AS screenName,
        sc.total_seats AS totalSeats,
        t.id AS theatreId,
        t.name AS theatreName,
        t.address,
        t.city,
        t.amenities,
        s.starts_at AS startsAt,
        s.ends_at AS endsAt,
        s.price,
        s.language,
        s.format
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN theatres t ON sc.theatre_id = t.id
      WHERE 1=1
    `;

    const params = [];

    if (movieId) {
<<<<<<< HEAD
      sql += " AND s.movie_id = ?";
=======
      sql += ' AND s.movie_id = ?';
>>>>>>> origin/main
      params.push(movieId);
    }

    if (theatreId) {
<<<<<<< HEAD
      sql += " AND t.id = ?";
=======
      sql += ' AND t.id = ?';
>>>>>>> origin/main
      params.push(theatreId);
    }

    if (date) {
<<<<<<< HEAD
      sql += " AND DATE(s.starts_at) = ?";
      params.push(date);
    }

    sql += " ORDER BY s.starts_at ASC";
=======
      sql += ' AND DATE(s.starts_at) = ?';
      params.push(date);
    }

    sql += ' ORDER BY s.starts_at ASC';
>>>>>>> origin/main

    const [rows] = await pool.execute(sql, params);

    res.json(rows);
<<<<<<< HEAD
  } catch (error) {
    console.error("Shows API Error:", error);

    res.status(500).json({
      message: "Could not load shows.",
=======

  } catch (error) {
    console.error('Shows API Error:', error);

    res.status(500).json({
      message: 'Could not load shows.'
>>>>>>> origin/main
    });
  }
});

// GET movies and screens for admin show scheduling
<<<<<<< HEAD
router.get("/options", async (req, res) => {
=======
router.get('/options', async (req, res) => {
>>>>>>> origin/main
  try {
    const [movies] = await pool.execute(
      `SELECT id, title, language, duration_minutes, base_price
       FROM movies
<<<<<<< HEAD
       ORDER BY title`,
    );

    const [screens] = await pool.execute(
      `SELECT
          sc.id,
          sc.name,
          sc.total_seats,
          t.id AS theatreId,
          t.name AS theatreName
       FROM screens sc
       JOIN theatres t ON sc.theatre_id = t.id
       ORDER BY t.name, sc.name`,
=======
       ORDER BY title`
    );

    const [screens] = await pool.execute(
      `SELECT sc.id, sc.name, sc.total_seats,
              t.name AS theatreName
       FROM screens sc
       JOIN theatres t ON sc.theatre_id = t.id
       ORDER BY t.name, sc.name`
>>>>>>> origin/main
    );

    res.json({ movies, screens });
  } catch (error) {
<<<<<<< HEAD
    console.error("Show Options Error:", error);

    res.status(500).json({
      message: "Could not load movies and screens.",
=======
    console.error('Show Options Error:', error);
    res.status(500).json({
      message: 'Could not load movies and screens.'
>>>>>>> origin/main
    });
  }
});

// GET one show by ID
<<<<<<< HEAD
router.get("/:id", async (req, res) => {
=======
router.get('/:id', async (req, res) => {
>>>>>>> origin/main
  try {
    const [rows] = await pool.execute(
      `
      SELECT
        s.id,
        s.movie_id AS movieId,
        m.title AS movieTitle,
        s.screen_id AS screenId,
        sc.name AS screenName,
        sc.total_seats AS totalSeats,
        t.id AS theatreId,
        t.name AS theatreName,
        t.address,
        t.city,
        s.starts_at AS startsAt,
        s.ends_at AS endsAt,
        s.price,
        s.language,
        s.format
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      JOIN screens sc ON s.screen_id = sc.id
      JOIN theatres t ON sc.theatre_id = t.id
      WHERE s.id = ?
      `,
<<<<<<< HEAD
      [req.params.id],
=======
      [req.params.id]
>>>>>>> origin/main
    );

    if (!rows.length) {
      return res.status(404).json({
<<<<<<< HEAD
        message: "Show not found.",
=======
        message: 'Show not found.'
>>>>>>> origin/main
      });
    }

    res.json(rows[0]);
<<<<<<< HEAD
  } catch (error) {
    console.error("Show Details API Error:", error);

    res.status(500).json({
      message: "Could not load show.",
=======

  } catch (error) {
    console.error('Show Details API Error:', error);

    res.status(500).json({
      message: 'Could not load show.'
>>>>>>> origin/main
    });
  }
});

export default router;
