const { SubCategory } = require('../models/SubCategory');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'subcategory-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const createSubCategory = async (req, res) => {
  try {
    const { parent_id, name } = req.body;
    const image = req.file ? req.file.filename : null;
    
    const subCategory = await SubCategory.create({
      parent_id,
      name,
      image,
      status: 'active'
    });
    
    res.status(201).json(subCategory);
  } catch (error) {
    console.error('Error creating sub category:', error);
    res.status(500).json({ error: 'Failed to create sub category' });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll();
    res.json(subCategories);
  } catch (error) {
    console.error('Error fetching sub categories:', error);
    res.status(500).json({ error: 'Failed to fetch sub categories' });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);
    
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }
    
    res.json(subCategory);
  } catch (error) {
    console.error('Error fetching sub category:', error);
    res.status(500).json({ error: 'Failed to fetch sub category' });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? req.file.filename : undefined;
    
    const existingSubCategory = await SubCategory.findById(id);
    if (!existingSubCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }
    
    const updateData = {
      name,
      image: image || existingSubCategory.image,
      status: existingSubCategory.status
    };
    
    const subCategory = await SubCategory.update(id, updateData);
    res.json(subCategory);
  } catch (error) {
    console.error('Error updating sub category:', error);
    res.status(500).json({ error: 'Failed to update sub category' });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.delete(id);
    
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }
    
    res.json({ message: 'Sub category deleted successfully' });
  } catch (error) {
    console.error('Error deleting sub category:', error);
    res.status(500).json({ error: 'Failed to delete sub category' });
  }
};

const updateSubCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const subCategory = await SubCategory.updateStatus(id, status);
    
    if (!subCategory) {
      return res.status(404).json({ error: 'Sub category not found' });
    }
    
    res.json(subCategory);
  } catch (error) {
    console.error('Error updating sub category status:', error);
    res.status(500).json({ error: 'Failed to update sub category status' });
  }
};

module.exports = {
  upload,
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus
};