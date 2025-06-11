import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/outline';

function Achievements({ theme, score, streak, todayData }) {
  const achievements = [];
  if (streak >= 7) achievements.push({ title: 'Week Warrior', desc: '7+ day streak!' });
  if (score >= 80) achievements.push({ title: 'Top Performer', desc: 'Score 80%+ today!' });
  if ((todayData.productiveTime || 0) >= 6 * 3600) achievements.push({ title: 'Marathon', desc: '6+ productive hours!' });

  return (
    <motion.div
      className={`p-4 sm:p-6 rounded-xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full flex flex-col bg-opacity-80 backdrop-blur-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className={`text-lg sm:text-xl font-roboto font-bold text-primary mb-4 sm:mb-6`}>
        Achievements
      </h2>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {achievements.length === 0 ? (
          <p className={`text-sm font-medium text-secondary`}>
            No achievements yet. Keep pushing!
          </p>
        ) : (
          <div className="space-y-4">
            {achievements.map((ach, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 bg-primary/10 p-3 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ ease: 'easeOut' }}
              >
                <TrophyIcon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-primary">{ach.title}</p>
                  <p className="text-sm font-medium text-secondary">{ach.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Achievements;