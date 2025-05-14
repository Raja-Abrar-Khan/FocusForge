import express from 'express';
import { connectDB } from './config/db.js';
import colors from 'colors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import classifyRouter from './routes/classify.js';
import productivityRoutes from './routes/productivity.js';
import cors from 'cors';

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['chrome-extension://*', 'http://localhost:5000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/time', productivityRoutes);
app.use('/api/classify', classifyRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgWhite.blue.bold);
});