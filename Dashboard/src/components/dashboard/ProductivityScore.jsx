/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/ProductivityScore.jsx
import { motion } from 'framer-motion';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ProductivityScore({ score, theme, username, productiveTime, streak, formatTime }) {
  const motivationalMessages = [
    `Keep the fire burning, ${username}!`,
    `You're unstoppable today, ${username}!`,
    `${username}, your focus is legendary!`,
    `Crushing it, ${username}! Keep it up!`
  ];
  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <motion.div
      className={`p-8 holographic glow rounded-xl ${theme === 'dark' ? 'bg-[#0A0A2A]/80' : 'bg-gray-100/80'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left: Score Circle */}
        <div className="w-40 h-40">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              pathColor: '#00F5FF',
              textColor: theme === 'dark' ? '#00F5FF' : '#1E3A8A',
              trailColor: theme === 'dark' ? '#1E1E4A' : '#D1D5DB',
              textSize: '24px',
              pathTransitionDuration: 1.5
            })}
          />
        </div>
        {/* Right: Personalized Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-orbitron bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent">
            {username}'s Productivity Hub
          </h2>
          <p className="text-lg text-gray-300 mt-2">{message}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <FireIcon className="w-6 h-6 text-[#00F5FF]" />
              <span className="font-montserrat">
                Productive: {formatTime(productiveTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-6 h-6 text-[#00F5FF]" />
              <span className="font-montserrat">Streak: {streak} days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-montserrat text-[#00F5FF]">
                Goal: {score >= 80 ? '🔥 Exceeded!' : `${score}/100%`}
              </span>
            </div>
          </div>
          {/* Mini Achievements */}
          <div className="mt-6">
            <p className="text-sm text-gray-400">Recent Achievements:</p>
            <div className="flex gap-2 mt-2 justify-center md:justify-start">
              {streak > 0 && (
                <motion.span
                  className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded-full text-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  🔥 {streak}-Day Streak
                </motion.span>
              )}
              {score >= 80 && (
                <motion.span
                  className="px-3 py-1 bg-[#FF00FF]/20 text-[#FF00FF] rounded-full text-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  🏆 Top Performer
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductivityScore;