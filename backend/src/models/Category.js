import pool from '../config/database.js';

export const createCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
  
  // Add image column if table already exists without it
  try {
    await pool.query('ALTER TABLE categories ADD COLUMN IF NOT EXISTS image TEXT');
    await pool.query('ALTER TABLE categories ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT \'active\'');
  } catch (error) {
    // Columns might already exist
  }
};

export const getAllCategories = async () => {
  const query = 'SELECT * FROM categories ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

export const createCategory = async (name, image) => {
  const query = 'INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *';
  const result = await pool.query(query, [name, image]);
  return result.rows[0];
};

export const updateCategory = async (id, name, image) => {
  const query = 'UPDATE categories SET name = $1, image = $2 WHERE id = $3 RETURNING *';
  const result = await pool.query(query, [name, image, id]);
  return result.rows[0];
};

export const deleteCategory = async (id) => {
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};