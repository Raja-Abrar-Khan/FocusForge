// File: Frontend/src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { XMarkIcon, MoonIcon, SunIcon, SparklesIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function Sidebar({ isOpen, onClose, theme, toggleTheme, onSetGoal, todayData, formatTime }) {
  const exportToCSV = () => {
    if (!todayData || !formatTime) {
      console.warn('Cannot export: todayData or formatTime is missing');
      return;
    }
    const csvContent = [
      'Type,Time (seconds),Formatted Time',
      `Productive,${todayData.productiveTime},${formatTime(todayData.productiveTime)}`,
      `Unproductive,${todayData.unproductiveTime},${formatTime(todayData.unproductiveTime)}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `productivity_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className={`fixed inset-y-0 left-0 w-64 ${theme === 'dark' ? 'bg-[#0A0A2A]/90' : 'bg-gray-100/90'} holographic z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-[#00F5FF]/20">
        <h2 className="text-lg font-orbitron text-[#00F5FF]">Menu</h2>
        <button onClick={onClose} className="text-[#00F5FF] hover:text-[#FF00FF]" aria-label="Close sidebar">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4 pt-8 space-y-4"> {/* Added pt-8 for top padding */}
        <button
          onClick={onSetGoal}
          className="flex items-center gap-2 w-full text-left text-[#00F5FF] hover:text-[#FF00FF] font-montserrat"
          aria-label="Set goal"
        >
          <SparklesIcon className="w-5 h-5" /> Set Goal
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 w-full text-left text-[#00F5FF] hover:text-[#FF00FF] font-montserrat"
          aria-label="Export data"
        >
          <ArrowDownTrayIcon className="w-5 h-5" /> Export Data
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 w-full text-left text-[#00F5FF] hover:text-[#FF00FF] font-montserrat"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
    </motion.div>
  );
}

export default Sidebar;