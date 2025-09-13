const pool = require('../config/database');

class SubCategory {
  static async create(subCategoryData) {
    const { parent_id, name, image, status = 'active' } = subCategoryData;
    
    // Generate sub category ID
    const existingSubsQuery = 'SELECT id FROM sub_categories WHERE parent_id = $1 ORDER BY id';
    const existingSubs = await pool.query(existingSubsQuery, [parent_id]);
    const nextLetter = String.fromCharCode(97 + existingSubs.rows.length); // a, b, c...
    const subCategoryId = `${parent_id}-${nextLetter}`;
    
    const query = `
      INSERT INTO sub_categories (id, parent_id, name, image, status, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [subCategoryId, parent_id, name, image, status]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT sc.*, c.name as parent_name 
      FROM sub_categories sc
      LEFT JOIN categories c ON sc.parent_id = c.id
      ORDER BY sc.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT sc.*, c.name as parent_name 
      FROM sub_categories sc
      LEFT JOIN categories c ON sc.parent_id = c.id
      WHERE sc.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, subCategoryData) {
    const { name, image, status } = subCategoryData;
    const query = `
      UPDATE sub_categories 
      SET name = $1, image = $2, status = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [name, image, status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM sub_categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE sub_categories SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
}

module.exports = SubCategory;