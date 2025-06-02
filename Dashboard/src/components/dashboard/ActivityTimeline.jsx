import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function ActivityTimeline({ history, theme, showFull, toggleFull }) {
  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className={showFull ? 'tilt-disabled' : ''}>
      <motion.div
        className={`p-4 sm:p-6 rounded-xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full flex flex-col bg-opacity-80 backdrop-blur-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className={`text-lg sm:text-xl font-roboto font-bold text-primary mb-4 sm:mb-6`}>
          Today's Activity
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <p className="text-sm font-medium text-secondary">No activities today.</p>
          ) : (
            <div className="space-y-4">
              {(showFull ? history : history.slice(0, 3)).map((entry, i) => (
                <motion.div
                  key={i}
                  className="ml-4 relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, ease: 'easeOut' }}
                >
                  <div className="absolute left-2 top-0 bottom-0 w-1 bg-primary/30" />
                  <div className="ml-6 mb-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary absolute left-1" />
                      <span className="text-sm font-medium text-secondary">
                        {new Date(entry.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span
                        className="px-2 py-1 rounded text-sm font-semibold bg-primary text-white"
                      >
                        {entry.activityType || 'Unknown'}
                      </span>
                      <p className="text-sm font-medium text-secondary truncate max-w-[80%]">
                        {entry.url || 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        {!showFull && history.length > 3 && (
          <motion.button
            onClick={toggleFull}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg glow text-sm font-semibold w-full"
            whileHover={{ scale: 1.05 }}
            transition={{ ease: 'easeOut' }}
          >
            Show Full Day
          </motion.button>
        )}
      </motion.div>
    </Tilt>
  );
}

export default ActivityTimeline;