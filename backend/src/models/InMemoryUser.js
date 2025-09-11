import bcrypt from 'bcryptjs';

// In-memory user storage
let users = [];
let nextId = 1;

export const createUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { id: nextId++, email, password: hashedPassword, name };
  users.push(user);
  return { id: user.id, email: user.email, name: user.name };
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const getAllUsers = () => {
  return users.map(user => ({ id: user.id, email: user.email, name: user.name }));
};