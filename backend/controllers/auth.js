// File: Backend/controllers/auth.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const authenticateToken = (req, res, next) => {
  // Try both 'authorization' and 'Authorization'
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log('Auth Header:', authHeader); // Debug log

  let token;
  if (authHeader) {
    // Handle 'Bearer <token>' or raw token
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader; // Assume raw token
    }
  }

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Debug log
    req.user = decoded; // { id: "6815dc3d39e6b17af2a23fc4" }
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};