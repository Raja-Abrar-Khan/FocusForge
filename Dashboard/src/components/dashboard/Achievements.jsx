/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/Achievements.jsx
import { motion } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/outline';
import Tilt from 'react-parallax-tilt';

function Achievements({ theme }) {
  const badges = ['7 Day Streak', '50h Focus', 'Night Owl', 'Early Bird'];

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Achievements"
      >
        <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-4`}>
          Achievements
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge}
              className={`${theme === 'dark' ? 'bg-[#1E1E4A]/50' : 'bg-gray-100/50'} p-3 rounded-lg text-center glow`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <TrophyIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-[#00F5FF]' : 'text-blue-600'} mx-auto mb-1`} />
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{badge}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Tilt>
  );
}

export default Achievements;