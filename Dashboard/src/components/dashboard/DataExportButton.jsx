import { motion } from 'framer-motion';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function DataExportButton({ todayData, formatTime, theme }) {
  const exportToCSV = () => {
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
    <motion.button
      onClick={exportToCSV}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 rounded-lg bg-secondary text-primary hover:bg-primary hover:text-white transition glow text-sm sm:text-base font-bold`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Export data as CSV"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      Export Data
    </motion.button>
  );
}

export default DataExportButton;