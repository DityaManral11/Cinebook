
import { Router } from 'express';
import pool from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Automatically generate shows for a selected date
async function createShowsForDate(date) {
  const [dateCheck] = await pool.execute(
    'SELECT ? >= CURDATE() AS isValid',
    [date]
  );

  if (!dateCheck[0].isValid) return;

  const [screens] = await pool.execute(
    'SELECT id FROM screens ORDER BY id'
  );

  const [movies] = await pool.execute(
    `SELECT id, duration_minutes, base_price, language
     FROM movies
     ORDER BY id`
  );

  if (!screens.length || !movies.length) return;

  const timeSlots = [
    '09:00:00',
    '13:00:00',
    '17:00:00',
    '21:00:00'
  ];

  for (let screenIndex = 0; screenIndex < screens.length; screenIndex++) {
    const screen = screens[screenIndex];

    for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
      const movieIndex = (screenIndex + slotIndex) % movies.length;
      const movie = movies[movieIndex];

      const startAt = `${date} ${timeSlots[slotIndex]}`;
      const duration = Math.max(
        Number(movie.duration_minutes) || 150,
        60
      );

      const price = Number(movie.base_price) || 220;
      const language = movie.language || 'Hindi';

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
          startAt
        ]
      );
    }
  }
}

// ADMIN: Create a new show
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      movieId,
      screenId,
      startsAt,
      price,
      language,
      format = '2D'
    } = req.body;

    if (!movieId || !screenId || !startsAt || !price) {
      return res.status(400).json({
        message: 'Please provide all required show details.'
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: 'Ticket price must be greater than zero.'
      });
    }

    const [movies] = await pool.execute(
      'SELECT duration_minutes, language FROM movies WHERE id = ?',
      [movieId]
    );

    if (!movies.length) {
      return res.status(404).json({
        message: 'Movie not found.'
      });
    }

    const [screens] = await pool.execute(
      'SELECT id FROM screens WHERE id = ?',
      [screenId]
    );

    if (!screens.length) {
      return res.status(404).json({
        message: 'Screen not found.'
      });
    }

    const duration = Math.max(
      Number(movies[0].duration_minutes) || 150,
      60
    );

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
        language || movies[0].language || 'Hindi',
        format,
        screenId,
        startsAt,
        duration,
        startsAt
      ]
    );

    if (!result.affectedRows) {
      return res.status(409).json({
        message: 'This screen already has an overlapping show.'
      });
    }

    res.status(201).json({
      message: 'Show created successfully.',
      showId: result.insertId
    });

  } catch (error) {
    console.error('Create Show Error:', error);

    res.status(500).json({
      message: 'Could not create show.'
    });
  }
});

// GET all shows with filters
router.get('/', async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          message: 'Invalid date format. Use YYYY-MM-DD.'
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
      sql += ' AND s.movie_id = ?';
      params.push(movieId);
    }

    if (theatreId) {
      sql += ' AND t.id = ?';
      params.push(theatreId);
    }

    if (date) {
      sql += ' AND DATE(s.starts_at) = ?';
      params.push(date);
    }

    sql += ' ORDER BY s.starts_at ASC';

    const [rows] = await pool.execute(sql, params);

    res.json(rows);

  } catch (error) {
    console.error('Shows API Error:', error);

    res.status(500).json({
      message: 'Could not load shows.'
    });
  }
});

// GET movies and screens for admin show scheduling
router.get('/options', async (req, res) => {
  try {
    const [movies] = await pool.execute(
      `SELECT id, title, language, duration_minutes, base_price
       FROM movies
       ORDER BY title`
    );

    const [screens] = await pool.execute(
      `SELECT sc.id, sc.name, sc.total_seats,
              t.name AS theatreName
       FROM screens sc
       JOIN theatres t ON sc.theatre_id = t.id
       ORDER BY t.name, sc.name`
    );

    res.json({ movies, screens });
  } catch (error) {
    console.error('Show Options Error:', error);
    res.status(500).json({
      message: 'Could not load movies and screens.'
    });
  }
});

// GET one show by ID
router.get('/:id', async (req, res) => {
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
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'Show not found.'
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Show Details API Error:', error);

    res.status(500).json({
      message: 'Could not load show.'
    });
  }
});

export default router;
