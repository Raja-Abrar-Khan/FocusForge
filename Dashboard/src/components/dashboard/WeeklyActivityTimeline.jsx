import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function WeeklyActivityTimeline({ weeklyData, theme, showFull, toggleFull }) {
  const [expandedDays, setExpandedDays] = useState({});
  const activityColors = {
    Studying: '#F59E0B',
    Coding: '#10B981',
    Gaming: '#6B7280',
    Meeting: '#8B5CF6',
    Research: '#3B82F6',
  };

  const toggleDay = (index) => {
    setExpandedDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const displayedDays = showFull ? weeklyData.dailyBreakdown : weeklyData.dailyBreakdown?.slice(0, 2) || [];

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      tiltEnable={!showFull} // Disable tilt in full-screen
      scale={1} // Prevent scaling on hover
      className={showFull ? 'tilt-disabled' : ''}
    >
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} ${showFull ? 'h-auto' : 'h-64'} flex flex-col no-hover-scale`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={e => e.stopPropagation()} // Prevent clicks inside from closing modal
      >
        <style>{`
          .no-hover-scale:hover {
            transform: none !important;
          }
        `}</style>
        <h2 className={`text-lg font-orbitron font-extrabold ${theme === 'dark' ? 'gold-gradient' : 'text-blue-900'} mb-4`}>
          Weekly Activities
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {displayedDays.length === 0 ? (
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No activities.</p>
          ) : (
            <div className="space-y-3">
              {displayedDays.map((day, index) => (
                <div key={index}>
                  <motion.button
                    onClick={() => toggleDay(index)}
                    className={`w-full text-left flex justify-between items-center text-sm font-montserrat font-bold ${
                      theme === 'dark' ? 'text-[#FFD700]' : 'text-blue-600'
                    } cursor-pointer`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span>
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>{expandedDays[index] ? '−' : '+'}</span>
                  </motion.button>
                  {expandedDays[index] && (
                    <motion.div
                      className="ml-4 mt-2 relative"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute left-2 top-0 bottom-0 w-1 bg-[#FFD700]/30" />
                      {(day.history || []).slice(0, showFull ? 10 : 3).map((entry, i) => (
                        <motion.div
                          key={i}
                          className="ml-6 mb-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-[#FFD700] absolute left-1" />
                            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {new Date(entry.startTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span
                              className="px-2 py-1 rounded text-sm font-semibold"
                              style={{
                                backgroundColor: activityColors[entry.activityType] || '#6B7280',
                                color: '#FFF',
                              }}
                            >
                              {entry.activityType || 'Unknown'}
                            </span>
                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate max-w-[80%]`}>
                              {entry.url || 'N/A'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {!showFull && weeklyData.dailyBreakdown?.length > 2 ? (
          <motion.button
            onClick={toggleFull}
            className="mt-3 px-4 py-2 bg-[#1E1E4A] text-white rounded-lg glow text-sm font-bold w-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Show Full Week
          </motion.button>
        ) : showFull && (
          <motion.button
            onClick={toggleFull}
            className="mt-3 px-4 py-2 bg-danger text-white rounded-lg glow text-sm font-bold w-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            Close
          </motion.button>
        )}
      </motion.div>
    </Tilt>
  );
}

export default WeeklyActivityTimeline;