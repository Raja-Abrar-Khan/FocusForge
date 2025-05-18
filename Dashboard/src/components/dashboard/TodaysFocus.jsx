/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/TodaysFocus.jsx
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import 'react-circular-progressbar/dist/styles.css';
import Tilt from 'react-parallax-tilt';

function TodaysFocus({ todayData, streak, dailyGoal, formatTime, calculateScore, theme }) {
  const goalProgress = Math.min((todayData.productiveTime / 3600 / dailyGoal) * 100, 100);

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Today's Focus"
      >
        <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-6`}>
          Today's Focus
        </h2>
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            <CircularProgressbar
              value={calculateScore(todayData.productiveTime, todayData.unproductiveTime)}
              text={`${calculateScore(todayData.productiveTime, todayData.unproductiveTime)}%`}
              styles={buildStyles({
                pathColor: '#00F5FF',
                textColor: theme === 'dark' ? '#E5E7EB' : '#1F2937',
                trailColor: '#FF00FF',
                textSize: '20px'
              })}
              aria-label="Productivity score"
            />
          </div>
        </div>
        <div className="text-center space-y-3">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-[#00F5FF]">Productive:</span> {formatTime(todayData.productiveTime)}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-[#FF00FF]">Unproductive:</span> {formatTime(todayData.unproductiveTime)}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-[#00F5FF]' : 'text-blue-600'} flex items-center justify-center gap-1`}>
            <FireIcon className="w-5 h-5" /> Streak: {streak} days
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {calculateScore(todayData.productiveTime, todayData.unproductiveTime) > 70 ? 'Epic Performance! 🌌' : 'Keep Pushing! 🚀'}
          </p>
        </div>
        <div className="mt-6">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Goal: {dailyGoal}h</p>
          <div className="h-3 bg-[#1E1E4A] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00F5FF] to-[#FF00FF]"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              aria-label={`Goal progress: ${Math.round(goalProgress)}%`}
            />
          </div>
          <p className="text-sm text-[#00F5FF] mt-1">{Math.round(goalProgress)}% Complete</p>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default TodaysFocus;