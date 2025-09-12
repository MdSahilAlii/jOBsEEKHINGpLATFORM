import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from './src/config/database.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Test connection first
    const testResult = await pool.query('SELECT NOW()');
    console.log('Database connected:', testResult.rows[0].now);
    
    // Create table first
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log('Admin table created/verified');
    
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = 'INSERT INTO admins (username, password) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password = $2';
    const result = await pool.query(query, [username, hashedPassword]);
    console.log('Insert result:', result.rowCount);
    
    // Verify data was inserted
    const verifyQuery = 'SELECT * FROM admins WHERE username = $1';
    const verifyResult = await pool.query(verifyQuery, [username]);
    console.log('Admin exists in DB:', verifyResult.rows.length > 0);
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();