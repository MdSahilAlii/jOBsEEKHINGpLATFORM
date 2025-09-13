import express from 'express';
import multer from 'multer';
import pool from '../config/database.js';
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
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE categories SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;