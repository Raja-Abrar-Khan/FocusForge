// backend/routes/screenshots.js
import express from 'express';
import { getTodayScreenshots } from '../controllers/screenshot.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.get('/today', authenticate, getTodayScreenshots);
export default router;