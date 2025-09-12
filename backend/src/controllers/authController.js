import jwt from 'jsonwebtoken';
import { findAdminByUsername, validateAdminPassword } from '../models/Admin.js';

export const register = async (req, res) => {
  res.status(403).json({ message: 'Registration not allowed. Admin access only.' });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });
    
    const admin = await findAdminByUsername(username);
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // const isValidPassword = await validateAdminPassword(password, admin.password);
    
    // console.log('Password valid:', isValidPassword);

    if (password != admin.password) {
    
    // if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({  user: { id: admin.id, username: admin.username, role: 'admin' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};