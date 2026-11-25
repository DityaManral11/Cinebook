
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all available cities
router.get('/cities', async (_req, res) => {
  try {
    const [cities] = await pool.query(
      'SELECT DISTINCT city FROM theatres ORDER BY city ASC'
    );

    res.json(cities.map(item => item.city));
  } catch (error) {
    console.error('Cities error:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
});

// Get theatres, optionally filtered by city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;

    let sql = `
      SELECT id, name, address, city, amenities, latitude, longitude
      FROM theatres
    `;

    const params = [];

    if (city) {
      sql += ' WHERE LOWER(city) = LOWER(?)';
      params.push(city.trim());
    }

    sql += ' ORDER BY name ASC';

    const [theatres] = await pool.query(sql, params);

    res.json(theatres);
  } catch (error) {
    console.error('Theatres error:', error);
    res.status(500).json({ message: 'Failed to fetch theatres' });
  }
});

export default router;
