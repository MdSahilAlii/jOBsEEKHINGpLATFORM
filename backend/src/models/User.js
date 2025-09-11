import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};

export const createUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const query = 'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name';
  const result = await pool.query(query, [email, hashedPassword, name]);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};