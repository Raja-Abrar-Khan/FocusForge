import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addProductiveTime, addUnproductiveTime } from '../controllers/Productivity.js';


const router = express.Router();
router.post('/productive', authenticate, addProductiveTime);
router.post('/unproductive', authenticate, addUnproductiveTime);
export default router;