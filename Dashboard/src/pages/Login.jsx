/* eslint-disable no-unused-vars */
// File: Frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username); // Store username
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A2A] to-[#1E1E4A] flex items-center justify-center px-4">
      <motion.div
        className="bg-[#0A0A2A]/80 holographic p-8 rounded-xl glow max-w-md w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-orbitron text-[#00F5FF] mb-6 text-center">Login to FocusForge</h2>
        {error && (
          <p className="text-[#FF00FF] mb-4 text-center" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 font-montserrat">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 bg-[#1E1E4A] text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F5FF]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 font-montserrat">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 bg-[#1E1E4A] text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00F5FF]"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 bg-[#3B82F6] text-white rounded-lg font-semibold hover:bg-[#22D3EE] glow transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
        <p className="mt-6 text-gray-300 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00F5FF] hover:text-[#FF00FF]">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;