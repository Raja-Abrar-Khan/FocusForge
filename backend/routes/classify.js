// File: Backend/routes/classify.js
import express from 'express';
import { classifyText, classifyImage, classifyCombined } from '../controllers/classify.js';
import { authenticateToken } from '../controllers/auth.js';

const router = express.Router();
router.post('/text', authenticateToken, classifyText);
router.post('/image', authenticateToken, classifyImage);
router.post('/', authenticateToken, classifyCombined);

export default router;