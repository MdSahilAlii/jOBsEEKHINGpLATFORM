const express = require('express');
const router = express.Router();
const {
  upload,
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus
} = require('../controllers/subCategoryController');

// Routes
router.post('/', upload.single('image'), createSubCategory);
router.get('/', getAllSubCategories);
router.get('/:id', getSubCategoryById);
router.put('/:id', upload.single('image'), updateSubCategory);
router.delete('/:id', deleteSubCategory);
router.put('/:id/status', updateSubCategoryStatus);

module.exports = router;