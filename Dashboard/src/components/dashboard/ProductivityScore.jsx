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
      className={`p-4 sm:p-6 md:p-8 holographic glow rounded-xl bg-${theme === 'dark' ? '[#0A0A2A]/80' : 'gray-100/80'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8">
        <div className="w-32 h-32 sm:w-40 sm:h-40">
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
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-orbitron gold-gradient">
            {username}'s Productivity Hub
          </h2>
          <p className="text-sm sm:text-lg text-secondary mt-2">{message}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <FireIcon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              <span className="font-montserrat text-sm sm:text-base">
                Productive: {formatTime(productiveTime)}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <TrophyIcon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              <span className="font-montserrat text-sm sm:text-base">Streak: {streak} days</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-montserrat text-sm sm:text-base text-primary">
                Goal: {score >= 80 ? '🔥 Exceeded!' : `${score}/100%`}
              </span>
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <p className="text-sm text-secondary">Recent Achievements:</p>
            <div className="flex gap-2 mt-2 justify-center md:justify-start flex-wrap">
              {streak > 0 && (
                <motion.span
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  🔥 {streak}-Day Streak
                </motion.span>
              )}
              {score >= 80 && (
                <motion.span
                  className="px-3 py-1 bg-danger/20 text-danger rounded-full text-sm"
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