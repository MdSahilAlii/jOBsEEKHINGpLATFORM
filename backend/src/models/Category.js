import pool from '../config/database.js';

export const createCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};

export const getAllCategories = async () => {
  const query = 'SELECT * FROM categories ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

export const createCategory = async (name, description) => {
  const query = 'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *';
  const result = await pool.query(query, [name, description]);
  return result.rows[0];
};

export const updateCategory = async (id, name, description) => {
  const query = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *';
  const result = await pool.query(query, [name, description, id]);
  return result.rows[0];
};

export const deleteCategory = async (id) => {
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};