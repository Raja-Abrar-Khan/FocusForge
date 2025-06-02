/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/outline';
import logo from '../assets/logo.png';

function DashboardHeader({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1E2A44] text-white py-6 min-h-20 shadow-lg z-60">
      <div className="container mx-auto flex justify-between items-center px-4 pt-1">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-[#1E1E4A] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-[#0A0A2A] transition shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6" />
          </motion.button>
          <img src={logo} alt="FocusForge Logo" className="h-12" />
          <h1 className="text-2xl font-bold font-orbitron">FocusForge</h1>
        </motion.div>
        <nav className="flex items-center gap-6">
          <Link
            to="/showcase"
            className="text-base font-medium text-[#D1D5DB] hover:text-[#22D3EE] transition"
          >
            Explore
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-[#3B82F6] text-white rounded-full font-semibold hover:bg-[#22D3EE] glow transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default DashboardHeader;