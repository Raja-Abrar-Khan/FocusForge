import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Showcase from './pages/Showcase'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/showcase" element={<Showcase />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
    </Routes>
  )
}

export default App