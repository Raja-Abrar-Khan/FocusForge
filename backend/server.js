import express from 'express';
import { connectDB } from './config/db.js'; // Fixed path
import colors from 'colors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import classifyRouter from './routes/classify.js';
import productivityRoutes from './routes/productivity.js';
import classifierRouter from './routes/classify.js';
// 1. Configure environment variables
dotenv.config();

// 2. Create Express app
const app = express();

// 3. Connect to MongoDB
connectDB();

// 4. Middleware
app.use(express.json());

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/time', productivityRoutes);
app.use('/api/classify', classifierRouter);
app.use('/api/classify', classifyRouter);
// 6. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgWhite.blue.bold);
});