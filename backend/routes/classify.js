import express from 'express';
import { classifyText } from '../controllers/classify.js';

const router = express.Router();
router.post('/', classifyText);
export default router;