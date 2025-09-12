import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await createCategory(name, description);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await updateCategory(id, name, description);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};