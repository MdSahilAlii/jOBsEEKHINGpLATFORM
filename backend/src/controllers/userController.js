import { findUserByEmail } from '../models/InMemoryUser.js';

export const getProfile = async (req, res) => {
  try {
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Import users array from InMemoryUser
    const { getAllUsers: getUsers } = await import('../models/InMemoryUser.js');
    const users = getUsers();
    
    const userList = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name
    }));
    
    res.json(userList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};