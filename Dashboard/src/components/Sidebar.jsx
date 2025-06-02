import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, MoonIcon, SunIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function Sidebar({ isOpen, onClose, theme, toggleTheme, onSetGoal, todayData, formatTime, onLogout, onExport }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <motion.div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 w-72 md:w-80 bg-[#0A0A2A]/95 backdrop-blur-lg text-gray-100 p-8 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 z-50 shadow-2xl holographic glow`}
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
    >
      <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close sidebar">
        <XMarkIcon className="w-8 h-8 text-[#FFD700] hover:text-[#00F5FF] transition" />
      </button>
      <h2 className="text-2xl md:text-3xl font-orbitron font-extrabold gold-gradient mb-10">FocusForge</h2>
      <div className="space-y-8">
        <div className="bg-[#1E1E4A]/50 p-6 rounded-lg">
          <p className="text-lg font-bold text-gray-300 mb-4">Today's Summary</p>
          <p className="text-base font-semibold text-gray-200">Productive: {formatTime(todayData.productiveTime)}</p>
          <p className="text-base font-semibold text-gray-200">Unproductive: {formatTime(todayData.unproductiveTime)}</p>
        </div>
        <motion.button
          onClick={onSetGoal}
          className="w-full py-4 bg-[#1E1E4A] text-[#FFD700] rounded-lg glow text-lg font-bold hover:bg-[#00F5FF] hover:text-[#0A0A2A] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Set daily goal"
        >
          Set Goal
        </motion.button>
        <motion.button
          onClick={onExport}
          className="w-full py-4 bg-[#1E1E4A] text-[#FFD700] rounded-lg glow text-lg font-bold flex items-center justify-center gap-3 hover:bg-[#00F5FF] hover:text-[#0A0A2A] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Export data"
        >
          <ArrowDownTrayIcon className="w-6 h-6" /> Export Data
        </motion.button>
        <motion.button
          onClick={toggleTheme}
          className="w-full py-4 bg-[#1E1E4A] text-[#FFD700] rounded-lg glow text-lg font-bold flex items-center justify-center gap-3 hover:bg-[#00F5FF] hover:text-[#0A0A2A] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />} Toggle Theme
        </motion.button>
        <motion.button
          onClick={onLogout}
          className="w-full py-4 bg-[#FF00FF] text-white rounded-lg glow text-lg font-bold hover:bg-[#FFD700] hover:text-[#0A0A2A] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Logout"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Sidebar;