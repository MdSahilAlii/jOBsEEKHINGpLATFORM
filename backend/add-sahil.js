import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from './src/config/database.js';

dotenv.config();

const addSahil = async () => {
  try {
    const username = 'sahil';
    const password = 'sahil123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = 'INSERT INTO admins (username, password) VALUES ($1, $2)';
    await pool.query(query, [username, hashedPassword]);
    
    console.log('✅ Sahil admin added successfully!');
    console.log('Username: sahil');
    console.log('Password: sahil123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sahil:', error);
    process.exit(1);
  }
};

addSahil();