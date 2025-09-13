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
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;
    const category = await createCategory(name, image);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Get existing category to preserve image if no new image uploaded
    const existingCategory = await getAllCategories();
    const current = existingCategory.find(cat => cat.id == id);
    
    const image = req.file ? req.file.filename : current?.image;
    const category = await updateCategory(id, name, image);
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