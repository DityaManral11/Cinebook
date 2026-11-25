
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import bookingRoutes from './routes/bookings.js';
import showRoutes from './routes/shows.js';
<<<<<<< HEAD
import adminRoutes from './routes/admin.js';
import theatreRoutes from './routes/theatres.js';
=======
>>>>>>> origin/main

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(500).json({
      status: 'error',
      database: 'not connected',
      message: 'Check backend/.env and MySQL.'
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/shows', showRoutes);
<<<<<<< HEAD
app.use('/api/admin', adminRoutes);
app.use('/api/theatres', theatreRoutes);
=======
>>>>>>> origin/main

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`
  });
});

app.listen(PORT, () => {
  console.log(`CineBook API running at http://localhost:${PORT}`);
});
