// File: Backend/routes/auth.js
import express from 'express';
import { register, login, getUser, authenticateToken } from '../controllers/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser); // New route

export default router;