import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Showcase from './pages/Showcase'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token')

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/showcase" element={<Showcase />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  )
}

export default App