/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic input validation
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[#1E2A44] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full bg-[#2A3655] p-8 rounded-xl glow transform perspective-1000"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-[#22D3EE] text-center mb-6">Login to FocusForge</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#D1D5DB]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-[#1E2A44] text-[#D1D5DB] border border-[#3B82F6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#D1D5DB]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Fixed typo
              required
              className="mt-1 block w-full px-4 py-3 bg-[#1E2A44] text-[#D1D5DB] border border-[#3B82F6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22D3EE] transition"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-[#F43F5E] text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#3B82F6] text-white py-3 px-4 rounded-full font-semibold glow hover:bg-[#22D3EE] transition transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#D1D5DB]">
          Don’t have an account?{' '}
          <Link to="/register" className="text-[#22D3EE] hover:underline font-medium">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login