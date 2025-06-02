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
        className={`p-4 sm:p-6 rounded-2xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full flex flex-col`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Today's Focus"
      >
        <h2 className="text-lg sm:text-xl font-orbitron gold-gradient mb-4 sm:mb-6">
          Today's Focus
        </h2>
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-24 sm:w-32 h-24 sm:h-32">
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
        <div className="text-center space-y-2 sm:space-y-3 flex-1">
          <p className="text-sm text-secondary">
            <span className="text-primary">Productive:</span> {formatTime(todayData.productiveTime)}
          </p>
          <p className="text-sm text-secondary">
            <span className="text-danger">Unproductive:</span> {formatTime(todayData.unproductiveTime)}
          </p>
          <p className="text-sm text-primary flex items-center justify-center gap-1">
            <FireIcon className="w-5 h-5" /> Streak: {streak} days
          </p>
          <p className="text-sm text-secondary">
            {calculateScore(todayData.productiveTime, todayData.unproductiveTime) > 70 ? 'Epic Performance! 🌌' : 'Keep Pushing! 🚀'}
          </p>
        </div>
        <div className="mt-4 sm:mt-6">
          <p className="text-sm text-secondary mb-2">Goal: {dailyGoal}h</p>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              aria-label={`Goal progress: ${Math.round(goalProgress)}%`}
            />
          </div>
          <p className="text-sm text-primary mt-1">{Math.round(goalProgress)}% Complete</p>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default TodaysFocus;