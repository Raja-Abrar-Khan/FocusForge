/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/MotivationalQuote.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function MotivationalQuote({ theme }) {
  const quotes = [
    'The future belongs to those who prepare for it today. – Malcolm X',
    'Focus is the key to unlocking your potential. – Unknown',
    'Every moment you waste is a moment you’ll never get back. – Naval Ravikant',
    'Productivity is the art of doing more with less. – Unknown',
    'Start where you are. Use what you have. Do what you can. – Arthur Ashe'
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (quotes.indexOf(currentQuote) + 1) % quotes.length;
      setCurrentQuote(quotes[nextIndex]);
    }, 30000);
    return () => clearInterval(interval);
  }, [currentQuote]);

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Motivational Quote"
      >
        <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-4`}>
          Inspiration
        </h2>
        <motion.p
          className={`text-sm ${theme === 'dark' ? 'text-[#00F5FF]' : 'text-blue-600'} italic`}
          key={currentQuote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          "{currentQuote}"
        </motion.p>
      </motion.div>
    </Tilt>
  );
}

export default MotivationalQuote;