
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables.');
  }

  return jwt.sign(
    {
      id: user.id,
      customerId: user.customerId,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Customer registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: 'Name, email and password are required.'
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      message: 'Please enter valid name and email.'
    });
  }

  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({
      message: 'Password must be 8 to 72 bytes long.'
    });
  }

  let connection;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured.');
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check both tables to prevent duplicate accounts
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ? FOR UPDATE',
      [cleanEmail]
    );

    const [existingCustomers] = await connection.execute(
      'SELECT id FROM customers WHERE email = ? FOR UPDATE',
      [cleanEmail]
    );

    if (existingUsers.length || existingCustomers.length) {
      await connection.rollback();

      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [userResult] = await connection.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [cleanName, cleanEmail, passwordHash]
    );

    const [customerResult] = await connection.execute(
      `INSERT INTO customers (name, email, password_hash, role)
       VALUES (?, ?, ?, 'customer')`,
      [cleanName, cleanEmail, passwordHash]
    );

    await connection.commit();

    const user = {
      id: userResult.insertId,
      customerId: customerResult.insertId,
      name: cleanName,
      email: cleanEmail,
      role: 'customer'
    };

    const token = createToken(user);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user
    });

  } catch (error) {
    if (connection) await connection.rollback();

    console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Could not create account.'
    });

  } finally {
    if (connection) connection.release();
  }
});

// Customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = ?`,
      [cleanEmail]
    );

    if (
      !users.length ||
      !(await bcrypt.compare(password, users[0].password_hash))
    ) {
      return res.status(401).json({
        message: 'Incorrect email or password.'
      });
    }

    const loggedInUser = users[0];

    // Create a customer record if an older account is missing one.
    // Existing roles are preserved.
    await pool.execute(
      `INSERT INTO customers (name, email, password_hash, role)
       VALUES (?, ?, ?, 'customer')
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [
        loggedInUser.name,
        loggedInUser.email,
        loggedInUser.password_hash
      ]
    );

    const [customers] = await pool.execute(
      `SELECT id, role
       FROM customers
       WHERE email = ?`,
      [cleanEmail]
    );

    const customer = customers[0];

    if (customer.role !== 'customer') {
      return res.status(403).json({
        message: 'Please use the admin login.'
      });
    }

    const user = {
      id: loggedInUser.id,
      customerId: customer.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      role: customer.role
    };

    const token = createToken(user);

    return res.json({
      message: 'Welcome back!',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Could not log in.'
    });
  }
});

// Separate admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = ?`,
      [cleanEmail]
    );

    if (
      !users.length ||
      !(await bcrypt.compare(password, users[0].password_hash))
    ) {
      return res.status(401).json({
        message: 'Incorrect email or password.'
      });
    }

    const [customers] = await pool.execute(
      `SELECT id, role
       FROM customers
       WHERE email = ?`,
      [cleanEmail]
    );

    if (!customers.length || customers[0].role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access is not allowed for this account.'
      });
    }

    const user = {
      id: users[0].id,
      customerId: customers[0].id,
      name: users[0].name,
      email: users[0].email,
      role: 'admin'
    };

    const token = createToken(user);

    return res.json({
      message: 'Admin login successful.',
      token,
      user
    });

  } catch (error) {
    console.error('Admin login error:', error);

    return res.status(500).json({
      message: 'Could not log in as admin.'
    });
  }
});

export default router;
