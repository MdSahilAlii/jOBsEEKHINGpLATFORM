import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createAdminTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('Admin table created successfully');
  } catch (error) {
    console.error('Error creating admin table:', error);
    throw error;
  }
};

export const findAdminByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await pool.query(query, [username]);
    console.log('Query result:', result.rows.length > 0 ? 'Found admin' : 'No admin found');
    return result.rows[0];
  } catch (error) {
    console.error('Error finding admin:', error);
    throw error;
  }
};

export const validateAdminPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};