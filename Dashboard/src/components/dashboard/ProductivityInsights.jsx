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
          className={`p-4 sm:p-6 rounded-2xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          role="region"
          aria-label="Productivity Insights"
        >
          <h2 className="text-lg sm:text-xl font-orbitron gold-gradient mb-4">Insights</h2>
          <p className="text-sm text-secondary">Loading insights...</p>
        </motion.div>
      </Tilt>
    );
  }

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-4 sm:p-6 rounded-2xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Productivity Insights"
      >
        <h2 className="text-lg sm:text-xl font-orbitron gold-gradient mb-4">Insights</h2>
        <div className="flex items-center gap-3">
          <LightBulbIcon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
          <p className="text-sm text-secondary">{insight}</p>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default ProductivityInsights;