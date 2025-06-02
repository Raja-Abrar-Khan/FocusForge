import React from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon } from '@heroicons/react/24/outline';

function InsightsAndInspiration({ theme, todayData, hourlyData }) {
  const quotes = [
    '“Success is the sum of small efforts, repeated daily.”',
    '“Focus on progress, not perfection.”',
    '“Your time is your greatest asset.”',
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const topHour = (hourlyData?.hourlyData || []).reduce(
    (max, curr) => (curr.productiveTime > max.productiveTime ? curr : max),
    { hour: 0, productiveTime: 0 }
  );

  return (
    <motion.div
      className={`p-4 sm:p-6 rounded-xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full flex flex-col bg-opacity-80 backdrop-blur-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="text-lg sm:text-xl font-roboto font-bold text-primary mb-4 sm:mb-6">
        Insights & Inspiration
      </h2>
      <div className="flex-1 space-y-4 sm:space-y-6">
        <div>
          <p className="text-sm sm:text-base font-semibold text-primary flex items-center gap-2">
            <LightBulbIcon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" /> Insight
          </p>
          <p className="text-sm font-medium text-secondary">
            {topHour.productiveTime > 0
              ? `Peak productivity at ${topHour.hour}:00: ${(topHour.productiveTime / 3600).toFixed(1)}h`
              : 'No peak hours yet.'}
          </p>
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-primary">Inspiration</p>
          <p className="text-sm font-medium text-secondary italic">{quote}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default InsightsAndInspiration;