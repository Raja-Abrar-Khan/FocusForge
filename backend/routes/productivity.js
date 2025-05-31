import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  addProductiveTime,
  addUnproductiveTime,
  updateTime,
  TodayTimeasync,
  getWeeklyTime,
  getMonthlyTime,
  getYearlyTime,
  getHeatmapData,
  getHourlyData,
  getWeeklyHours,
  getCategories,
  getStreak,
} from '../controllers/productivity.js';

const router = express.Router();

// Add productive time
router.post('/productive', authenticate, addProductiveTime);

// Add unproductive time
router.post('/unproductive', authenticate, addUnproductiveTime);

// Update time with activity type and history
router.post('/update-time', authenticate, updateTime);

// Get today's productivity data
router.get('/today', authenticate, TodayTimeasync);

// Get weekly productivity data
router.get('/week', authenticate, getWeeklyTime);

// Get monthly productivity data
router.get('/month', authenticate, getMonthlyTime);

// Get yearly productivity data
router.get('/year', authenticate, getYearlyTime);

// Get heatmap data for productive time
router.get('/heatmap', authenticate, getHeatmapData);

// Get hourly productivity data
router.get('/hours', authenticate, getHourlyData);

// Get weekly hourly breakdown
router.get('/weekly-hours', authenticate, getWeeklyHours);

// Get category-wise productive time
router.get('/categories', authenticate, getCategories);

// Get productivity streak
router.get('/streak', authenticate, getStreak);

export default router;