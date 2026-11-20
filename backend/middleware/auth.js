
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// Verify login token and check current user role
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';

  const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: 'Please log in to continue.'
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing in environment variables.');

    return res.status(500).json({
      message: 'Server authentication is not configured.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // New tokens will contain customerId
    if (!decoded.customerId) {
      return res.status(401).json({
        message: 'Invalid session. Please log in again.'
      });
    }

    // Fetch latest role from database
    const [rows] = await pool.execute(
      `SELECT id, name, email, role
       FROM customers
       WHERE id = ?`,
      [decoded.customerId]
    );

    if (!rows.length) {
      return res.status(401).json({
        message: 'Account not found. Please log in again.'
      });
    }

    req.user = {
      id: decoded.id,
      customerId: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role
    };

    next();

  } catch (error) {
    if (error.name !== 'JsonWebTokenError' &&
        error.name !== 'TokenExpiredError') {
      console.error('Authentication error:', error);

      return res.status(500).json({
        message: 'Authentication failed.'
      });
    }

    return res.status(401).json({
      message: 'Session expired. Please log in again.'
    });
  }
}

// Check whether the logged-in user has the required role
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Please log in to continue.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You are not authorized to access this resource.'
      });
    }

    next();
  };
}

// Admin-only access
export const requireAdmin = requireRole('admin');

// Customer-only access
export const requireCustomer = requireRole('customer');
