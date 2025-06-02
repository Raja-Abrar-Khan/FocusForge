import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline';

function Achievements({ theme, score, streak, todayData }) {
  const achievements = [];
  if (streak >= 7) achievements.push({ title: 'Week Warrior', desc: '7+ day streak!', icon: TrophyIcon });
  if (streak >= 30) achievements.push({ title: 'Month Master', desc: '30+ day streak!', icon: StarIcon });
  if (score >= 80) achievements.push({ title: 'Top Performer', desc: 'Score 80%+ today!', icon: TrophyIcon });
  if ((todayData.productiveTime || 0) >= 6 * 3600) achievements.push({ title: 'Marathon', desc: '6+ productive hours!', icon: StarIcon });
  if ((todayData.productiveTime || 0) >= 8 * 3600) achievements.push({ title: 'Ultra Marathon', desc: '8+ productive hours!', icon: TrophyIcon });
  if (score >= 90) achievements.push({ title: 'Elite Focus', desc: 'Score 90%+ today!', icon: StarIcon });

  // Progress to next achievement (e.g., next streak or score milestone)
  const nextStreakGoal = streak < 7 ? 7 : streak < 30 ? 30 : 60;
  const streakProgress = (streak / nextStreakGoal) * 100;
  const nextScoreGoal = score < 80 ? 80 : score < 90 ? 90 : 100;
  const scoreProgress = (score / nextScoreGoal) * 100;

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
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {achievements.length === 0 ? (
          <p className={`text-sm font-medium text-secondary`}>
            No achievements yet. Keep pushing!
          </p>
        ) : (
          achievements.map((ach, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 bg-primary/10 p-3 rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ ease: 'easeOut' }}
            >
              <ach.icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
              <div>
                <p className="text-sm sm:text-base font-semibold text-primary">{ach.title}</p>
                <p className="text-sm font-medium text-secondary">{ach.desc}</p>
              </div>
            </motion.div>
          ))
        )}
        <div className="mt-4">
          <p className="text-sm font-semibold text-primary">Next Goal: {nextStreakGoal}-Day Streak</p>
          <div className="h-2 bg-secondary rounded-full mt-1">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${streakProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs text-secondary mt-1">{Math.round(streakProgress)}% to next streak</p>
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold text-primary">Next Goal: {nextScoreGoal}% Score</p>
          <div className="h-2 bg-secondary rounded-full mt-1">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scoreProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs text-secondary mt-1">{Math.round(scoreProgress)}% to next score</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Achievements;