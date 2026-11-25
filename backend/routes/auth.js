<<<<<<< HEAD
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
=======

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
>>>>>>> origin/main

const router = Router();

function createToken(user) {
  if (!process.env.JWT_SECRET) {
<<<<<<< HEAD
    throw new Error("JWT_SECRET is missing from environment variables.");
=======
    throw new Error('JWT_SECRET is missing from environment variables.');
>>>>>>> origin/main
  }

  return jwt.sign(
    {
      id: user.id,
      customerId: user.customerId,
      name: user.name,
      email: user.email,
<<<<<<< HEAD
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: user.role === "admin" ? "1d" : "7d",
    },
=======
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
>>>>>>> origin/main
  );
}

// Customer registration
<<<<<<< HEAD
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
=======
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
>>>>>>> origin/main
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
<<<<<<< HEAD
      message: "Name, email and password are required.",
=======
      message: 'Name, email and password are required.'
>>>>>>> origin/main
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

<<<<<<< HEAD
  if (
    cleanName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
  ) {
    return res.status(400).json({
      message: "Please enter valid name and email.",
    });
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return res.status(400).json({
      message: "Password must be 8 to 72 bytes long.",
=======
  if (cleanName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      message: 'Please enter valid name and email.'
    });
  }

  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({
      message: 'Password must be 8 to 72 bytes long.'
>>>>>>> origin/main
    });
  }

  let connection;

  try {
    if (!process.env.JWT_SECRET) {
<<<<<<< HEAD
      throw new Error("JWT_SECRET is not configured.");
=======
      throw new Error('JWT_SECRET is not configured.');
>>>>>>> origin/main
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check both tables to prevent duplicate accounts
    const [existingUsers] = await connection.execute(
<<<<<<< HEAD
      "SELECT id FROM users WHERE email = ? FOR UPDATE",
      [cleanEmail],
    );

    const [existingCustomers] = await connection.execute(
      "SELECT id FROM customers WHERE email = ? FOR UPDATE",
      [cleanEmail],
=======
      'SELECT id FROM users WHERE email = ? FOR UPDATE',
      [cleanEmail]
    );

    const [existingCustomers] = await connection.execute(
      'SELECT id FROM customers WHERE email = ? FOR UPDATE',
      [cleanEmail]
>>>>>>> origin/main
    );

    if (existingUsers.length || existingCustomers.length) {
      await connection.rollback();

      return res.status(409).json({
<<<<<<< HEAD
        message: "An account with this email already exists.",
=======
        message: 'An account with this email already exists.'
>>>>>>> origin/main
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [userResult] = await connection.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
<<<<<<< HEAD
      [cleanName, cleanEmail, passwordHash],
    );

    const [customerResult] = await connection.execute(
      `INSERT INTO customers (user_id, name, email, password_hash, role)
   VALUES (?, ?, ?, ?, 'customer')`,
      [userResult.insertId, cleanName, cleanEmail, passwordHash],
=======
      [cleanName, cleanEmail, passwordHash]
    );

    const [customerResult] = await connection.execute(
      `INSERT INTO customers (name, email, password_hash, role)
       VALUES (?, ?, ?, 'customer')`,
      [cleanName, cleanEmail, passwordHash]
>>>>>>> origin/main
    );

    await connection.commit();

    const user = {
      id: userResult.insertId,
      customerId: customerResult.insertId,
      name: cleanName,
      email: cleanEmail,
<<<<<<< HEAD
      role: "customer",
=======
      role: 'customer'
>>>>>>> origin/main
    };

    const token = createToken(user);

    return res.status(201).json({
<<<<<<< HEAD
      message: "Account created successfully.",
      token,
      user,
    });
  } catch (error) {
    if (connection) await connection.rollback();

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Could not create account.",
    });
=======
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

>>>>>>> origin/main
  } finally {
    if (connection) connection.release();
  }
});

// Customer login
<<<<<<< HEAD
router.post("/login", async (req, res) => {
=======
router.post('/login', async (req, res) => {
>>>>>>> origin/main
  try {
    const { email, password } = req.body;

    if (
<<<<<<< HEAD
      typeof email !== "string" ||
      typeof password !== "string" ||
=======
      typeof email !== 'string' ||
      typeof password !== 'string' ||
>>>>>>> origin/main
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
<<<<<<< HEAD
        message: "Email and password are required.",
=======
        message: 'Email and password are required.'
>>>>>>> origin/main
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = ?`,
<<<<<<< HEAD
      [cleanEmail],
=======
      [cleanEmail]
>>>>>>> origin/main
    );

    if (
      !users.length ||
      !(await bcrypt.compare(password, users[0].password_hash))
    ) {
      return res.status(401).json({
<<<<<<< HEAD
        message: "Incorrect email or password.",
=======
        message: 'Incorrect email or password.'
>>>>>>> origin/main
      });
    }

    const loggedInUser = users[0];

    // Create a customer record if an older account is missing one.
    // Existing roles are preserved.
    await pool.execute(
<<<<<<< HEAD
      `INSERT INTO customers (user_id, name, email, password_hash, role)
   VALUES (?, ?, ?, ?, 'customer')
   ON DUPLICATE KEY UPDATE
     user_id = COALESCE(user_id, VALUES(user_id)),
     id = LAST_INSERT_ID(id)`,
      [
        loggedInUser.id,
        loggedInUser.name,
        loggedInUser.email,
        loggedInUser.password_hash,
      ],
=======
      `INSERT INTO customers (name, email, password_hash, role)
       VALUES (?, ?, ?, 'customer')
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [
        loggedInUser.name,
        loggedInUser.email,
        loggedInUser.password_hash
      ]
>>>>>>> origin/main
    );

    const [customers] = await pool.execute(
      `SELECT id, role
       FROM customers
       WHERE email = ?`,
<<<<<<< HEAD
      [cleanEmail],
=======
      [cleanEmail]
>>>>>>> origin/main
    );

    const customer = customers[0];

<<<<<<< HEAD
    if (customer.role !== "customer") {
      return res.status(403).json({
        message: "Please use the admin login.",
=======
    if (customer.role !== 'customer') {
      return res.status(403).json({
        message: 'Please use the admin login.'
>>>>>>> origin/main
      });
    }

    const user = {
      id: loggedInUser.id,
      customerId: customer.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
<<<<<<< HEAD
      role: customer.role,
=======
      role: customer.role
>>>>>>> origin/main
    };

    const token = createToken(user);

    return res.json({
<<<<<<< HEAD
      message: "Welcome back!",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Could not log in.",
=======
      message: 'Welcome back!',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Could not log in.'
>>>>>>> origin/main
    });
  }
});

// Separate admin login
<<<<<<< HEAD
router.post("/admin/login", async (req, res) => {
=======
router.post('/admin/login', async (req, res) => {
>>>>>>> origin/main
  try {
    const { email, password } = req.body;

    if (
<<<<<<< HEAD
      typeof email !== "string" ||
      typeof password !== "string" ||
=======
      typeof email !== 'string' ||
      typeof password !== 'string' ||
>>>>>>> origin/main
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
<<<<<<< HEAD
        message: "Email and password are required.",
=======
        message: 'Email and password are required.'
>>>>>>> origin/main
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = ?`,
<<<<<<< HEAD
      [cleanEmail],
=======
      [cleanEmail]
>>>>>>> origin/main
    );

    if (
      !users.length ||
      !(await bcrypt.compare(password, users[0].password_hash))
    ) {
      return res.status(401).json({
<<<<<<< HEAD
        message: "Incorrect email or password.",
=======
        message: 'Incorrect email or password.'
>>>>>>> origin/main
      });
    }

    const [customers] = await pool.execute(
      `SELECT id, role
       FROM customers
       WHERE email = ?`,
<<<<<<< HEAD
      [cleanEmail],
    );

    if (!customers.length || customers[0].role !== "admin") {
      return res.status(403).json({
        message: "Admin access is not allowed for this account.",
=======
      [cleanEmail]
    );

    if (!customers.length || customers[0].role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access is not allowed for this account.'
>>>>>>> origin/main
      });
    }

    const user = {
      id: users[0].id,
      customerId: customers[0].id,
      name: users[0].name,
      email: users[0].email,
<<<<<<< HEAD
      role: "admin",
=======
      role: 'admin'
>>>>>>> origin/main
    };

    const token = createToken(user);

    return res.json({
<<<<<<< HEAD
      message: "Admin login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Could not log in as admin.",
=======
      message: 'Admin login successful.',
      token,
      user
    });

  } catch (error) {
    console.error('Admin login error:', error);

    return res.status(500).json({
      message: 'Could not log in as admin.'
>>>>>>> origin/main
    });
  }
});

export default router;
