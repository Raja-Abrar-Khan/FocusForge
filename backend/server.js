// File: Backend/server.js
import express from 'express';
import { connectDB } from './config/db.js';
import colors from 'colors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import classifyRouter from './routes/classify.js';
import timeRoutes from './routes/productivity.js';
import cors from 'cors';

dotenv.config();
console.log('NODE_ENV:', process.env.NODE_ENV); // Debug

const app = express();
connectDB();

app.use(cors({
  origin: ['chrome-extension://*', 'http://localhost:5000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/classify', classifyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'undefined'} mode on port ${PORT}`.bgWhite.blue.bold);
});