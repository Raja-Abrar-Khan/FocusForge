import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function ActivityTimeline({ history, theme, showFull, toggleFull }) {
  const activityColors = {
    Studying: '#3B82F6',
    Coding: '#10B981',
    Gaming: '#6B7280',
    Meeting: '#8B5CF6',
    Research: '#F59E0B',
  };

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      tiltEnable={!showFull} // Disable tilt in full-screen
      scale={1} // Prevent scaling on hover
      className={showFull ? 'tilt-disabled' : ''}
    >
      <motion.div
        className={`p-8 rounded-xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} ${showFull ? 'h-auto' : 'h-80'} flex flex-col bg-opacity-80 backdrop-blur-lg no-hover-scale`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()} // Prevent clicks inside from closing modal
      >
        <style>{`
          .no-hover-scale:hover {
            transform: none !important;
          }
        `}</style>
        <h2 className={`text-xl font-roboto font-bold ${theme === 'dark' ? 'text-[#60A5FA]' : 'text-[#1E3A8A]'} mb-6`}>
          Today's Activity
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {history.length === 0 ? (
            <p className={`text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No activities today.</p>
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
                  <div className="absolute left-2 top-0 bottom-0 w-1 bg-[#60A5FA]/30" />
                  <div className="ml-6 mb-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-[#60A5FA] absolute left-1" />
                      <span className={`text-base font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(entry.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span
                        className="px-2 py-1 rounded text-base font-semibold"
                        style={{
                          backgroundColor: activityColors[entry.activityType] || '#6B7280',
                          color: '#FFF',
                        }}
                      >
                        {entry.activityType || 'Unknown'}
                      </span>
                      <p className={`text-base font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate max-w-[80%]`}>
                        {entry.url || 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        {!showFull && history.length > 3 ? (
          <motion.button
            onClick={toggleFull}
            className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg glow text-base font-semibold w-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ ease: 'easeOut' }}
          >
            Show Full Day
          </motion.button>
        ) : showFull && (
          <motion.button
            onClick={toggleFull}
            className="mt-4 px-4 py-2 bg-danger text-white rounded-lg glow text-base font-semibold w-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ ease: 'easeOut' }}
          >
            Close
          </motion.button>
        )}
      </motion.div>
    </Tilt>
  );
}

export default ActivityTimeline;