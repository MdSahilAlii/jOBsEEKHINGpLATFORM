// src/controllers/user.controller.js
export const getUsers = (req, res) => {
  res.json([{ name: "John Doe", email: "john@example.com" }]);
};

export const createUser = (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ message: "User created", user: { name, email } });
};
