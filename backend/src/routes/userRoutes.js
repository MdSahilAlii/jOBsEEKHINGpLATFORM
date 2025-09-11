import express from 'express';
import { getProfile, getAllUsers } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/all', authenticateToken, getAllUsers);

export default router;