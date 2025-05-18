// File: Backend/routes/time.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  addProductiveTime,
  addUnproductiveTime,
  TodayTimeasync,
  updateTime,
  getWeeklyTime,
  getMonthlyTime,
  getYearlyTime,
  getHeatmapData,
  getHourlyData,
  getWeeklyHours,
  getCategories,
  getStreak
} from '../controllers/Productivity.js';

const router = express.Router();
router.post('/productive', authenticate, addProductiveTime);
router.post('/unproductive', authenticate, addUnproductiveTime);
router.post('/update-time', authenticate, updateTime);
router.get('/today', authenticate, TodayTimeasync);
router.get('/week', authenticate, getWeeklyTime);
router.get('/month', authenticate, getMonthlyTime);
router.get('/year', authenticate, getYearlyTime);
router.get('/heatmap', authenticate, getHeatmapData);
router.get('/hours', authenticate, getHourlyData);
router.get('/weekly-hours', authenticate, getWeeklyHours);
router.get('/categories', authenticate, getCategories);
router.get('/streak', authenticate, getStreak);

export default router;