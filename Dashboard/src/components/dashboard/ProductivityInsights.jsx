/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/ProductivityInsights.jsx
import { motion } from 'framer-motion';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import Tilt from 'react-parallax-tilt';

function ProductivityInsights({ todayData, hourlyData, theme }) {
  const getTopHour = () => {
    if (!Array.isArray(hourlyData) || hourlyData.length === 0) return null;
    const top = hourlyData.reduce((max, curr) => curr.productiveTime > max.productiveTime ? curr : max, hourlyData[0]);
    return top.hour;
  };

  const insights = [
    getTopHour() ? `You're most productive around ${getTopHour()}:00 today. Schedule critical tasks then!` : 'No clear peak hour yet. Keep tracking!',
    todayData && todayData.productiveTime > todayData.unproductiveTime
      ? 'Great work! Your productive time exceeds unproductive today.'
      : 'Try minimizing distractions to boost productivity.',
    'Use the Pomodoro technique to maintain focus during peak hours.'
  ];

  const insight = insights[Math.floor(Math.random() * insights.length)];

  if (!todayData && !hourlyData) {
    return (
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
        <motion.div
          className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          role="region"
          aria-label="Productivity Insights"
        >
          <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-4`}>
            Insights
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Loading insights...</p>
        </motion.div>
      </Tilt>
    );
  }

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Productivity Insights"
      >
        <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-4`}>
          Insights
        </h2>
        <div className="flex items-center gap-3">
          <LightBulbIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-[#00F5FF]' : 'text-blue-600'}`} />
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{insight}</p>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default ProductivityInsights;