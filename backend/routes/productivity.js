import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addProductiveTime, addUnproductiveTime, TodayTimeasync, updateTime, getWeeklyTime } from '../controllers/Productivity.js';

const router = express.Router();
router.post('/productive', authenticate, addProductiveTime);
router.post('/unproductive', authenticate, addUnproductiveTime);
router.post('/update-time', authenticate, updateTime);
router.get('/today', authenticate, TodayTimeasync);
router.get('/week', authenticate, getWeeklyTime); // New endpoint

export default router;