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
      className={`fixed inset-y-0 left-0 w-64 bg-[#0A0A2A]/95 backdrop-blur-lg text-gray-100 p-6 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 z-50`}
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
    >
      <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close sidebar">
        <XMarkIcon className="w-8 h-8 text-[#FFD700]" />
      </button>
      <h2 className="text-2xl font-orbitron font-extrabold gold-gradient mb-8">FocusForge</h2>
      <div className="space-y-6">
        <div>
          <p className="text-base font-bold text-gray-300">Today</p>
          <p className="text-sm font-semibold">Productive: {formatTime(todayData.productiveTime)}</p>
          <p className="text-sm font-semibold">Unproductive: {formatTime(todayData.unproductiveTime)}</p>
        </div>
        <button
          onClick={onSetGoal}
          className="w-full py-3 bg-[#1E1E4A] text-[#FFD700] rounded-lg glow text-base font-bold"
          aria-label="Set daily goal"
        >
          Set Goal
        </button>
        <button
          onClick={onExport}
          className="w-full py-3 bg-[#1E1E4A] text-[#FFD700] rounded-lg glow text-base font-bold flex items-center justify-center gap-2"
          aria-label="Export data"
        >
          <ArrowDownTrayIcon className="w-5 h-5" /> Export Data
        </button>
        <button
          onClick={toggleTheme}
          className="w-full py-3 bg-[#1E1E4A] text-[#FFD700] rounded-lg glow text-base font-bold flex items-center justify-center gap-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />} Toggle Theme
        </button>
        <button
          onClick={onLogout}
          className="w-full py-3 bg-[#FF00FF] text-white rounded-lg glow text-base font-bold"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </motion.div>
  );
}

export default Sidebar;