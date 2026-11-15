
import { Router } from 'express';
import pool from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET ALL MOVIES - Public
router.get('/', async (req, res) => {
  try {
    const { search = '', genre = '' } = req.query;

    let sql = `
      SELECT
        id, title, genre, language,
        duration_minutes AS duration,
        rating,
        release_year AS releaseYear,
        certificate,
        poster_url AS posterUrl,
        backdrop_url AS bannerUrl,
        synopsis AS description,
        cast_json AS cast,
        director,
        base_price AS price,
        status
      FROM movies
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      sql += ` AND (
        title LIKE ? OR genre LIKE ?
        OR language LIKE ? OR director LIKE ?
      )`;

      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    if (genre && genre !== 'All') {
      sql += ' AND genre LIKE ?';
      params.push(`%${genre}%`);
    }

    sql += ' ORDER BY rating DESC, title ASC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);

  } catch (error) {
    console.error('Movies Error:', error);
    res.status(500).json({ message: 'Could not load movies.' });
  }
});


// GET SINGLE MOVIE - Public
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        id, title, genre, language,
        duration_minutes AS duration,
        rating,
        release_year AS releaseYear,
        certificate,
        poster_url AS posterUrl,
        backdrop_url AS bannerUrl,
        synopsis AS description,
        cast_json AS cast,
        director,
        base_price AS price,
        status
      FROM movies
      WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Movie not found.' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Single Movie Error:', error);
    res.status(500).json({ message: 'Could not load movie.' });
  }
});


// ADD MOVIE - Admin Only
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title, genre, language, duration,
      rating, releaseYear, certificate,
      posterUrl, bannerUrl, description,
      cast, director, price, status
    } = req.body;

    if (
      !title?.trim() ||
      !genre?.trim() ||
      !language?.trim() ||
      !Number.isInteger(Number(duration)) ||
      Number(duration) <= 0 ||
      !Number.isInteger(Number(releaseYear))
    ) {
      return res.status(400).json({
        message: 'Please provide valid movie details.'
      });
    }

    if (
      status &&
      !['Now Showing', 'Coming Soon'].includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid movie status.'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO movies (
        title, genre, language, duration_minutes,
        rating, release_year, certificate,
        poster_url, backdrop_url, synopsis,
        cast_json, director, base_price, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        genre.trim(),
        language.trim(),
        Number(duration),
        rating ?? null,
        Number(releaseYear),
        certificate || null,
        posterUrl || null,
        bannerUrl || null,
        description || null,
        cast == null ? null : JSON.stringify(cast),
        director || null,
        price ?? 200,
        status || 'Now Showing'
      ]
    );

    res.status(201).json({
      message: 'Movie added successfully.',
      movieId: result.insertId
    });

  } catch (error) {
    console.error('Add Movie Error:', error);
    res.status(500).json({ message: 'Could not add movie.' });
  }
});


// UPDATE MOVIE - Admin Only
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title, genre, language, duration,
      rating, releaseYear, certificate,
      posterUrl, bannerUrl, description,
      cast, director, price, status
    } = req.body;

    if (
      !title?.trim() ||
      !genre?.trim() ||
      !language?.trim() ||
      !Number.isInteger(Number(duration)) ||
      Number(duration) <= 0 ||
      !Number.isInteger(Number(releaseYear))
    ) {
      return res.status(400).json({
        message: 'Please provide valid movie details.'
      });
    }

    if (
      status &&
      !['Now Showing', 'Coming Soon'].includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid movie status.'
      });
    }

    const [result] = await pool.execute(
      `UPDATE movies SET
        title = ?,
        genre = ?,
        language = ?,
        duration_minutes = ?,
        rating = ?,
        release_year = ?,
        certificate = ?,
        poster_url = ?,
        backdrop_url = ?,
        synopsis = ?,
        cast_json = ?,
        director = ?,
        base_price = ?,
        status = ?
      WHERE id = ?`,
      [
        title.trim(),
        genre.trim(),
        language.trim(),
        Number(duration),
        rating ?? null,
        Number(releaseYear),
        certificate || null,
        posterUrl || null,
        bannerUrl || null,
        description || null,
        cast == null ? null : JSON.stringify(cast),
        director || null,
        price ?? 200,
        status || 'Now Showing',
        req.params.id
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: 'Movie not found.'
      });
    }

    res.json({ message: 'Movie updated successfully.' });

  } catch (error) {
    console.error('Update Movie Error:', error);
    res.status(500).json({ message: 'Could not update movie.' });
  }
});


// DELETE MOVIE - Admin Only
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM movies WHERE id = ?',
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: 'Movie not found.'
      });
    }

    res.json({ message: 'Movie deleted successfully.' });

  } catch (error) {
    console.error('Delete Movie Error:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: 'This movie is linked to existing shows or bookings and cannot be deleted.'
      });
    }

    res.status(500).json({ message: 'Could not delete movie.' });
  }
});

export default router;
