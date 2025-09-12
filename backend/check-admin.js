import dotenv from 'dotenv';
import pool from './src/config/database.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    const query = 'SELECT id, username, created_at FROM admins';
    const result = await pool.query(query);
    
    console.log('📋 Admin users in database:');
    console.table(result.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkAdmin();