import express from 'express';
import multer from 'multer';
import { getCategories, addCategory, editCategory, removeCategory } from '../controllers/categoryController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', getCategories);
router.post('/', upload.single('image'), addCategory);
router.put('/:id', upload.single('image'), editCategory);
router.delete('/:id', removeCategory);

export default router;