import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Tilt from 'react-parallax-tilt';

function ScreenshotCarousel({ screenshots, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const nextScreenshot = () => {
    const nextIndex = (currentIndex + 1) % screenshots.length;
    setCurrentIndex(nextIndex);
    if (selected) {
      setSelected(screenshots[nextIndex]);
    }
  };

  const prevScreenshot = () => {
    const prevIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
    setCurrentIndex(prevIndex);
    if (selected) {
      setSelected(screenshots[prevIndex]);
    }
  };

  // Format timestamp with fallback
  const formatTimestamp = (date) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Invalid date: ${date}`);
        return 'Unknown Time';
      }
      return parsedDate.toLocaleTimeString();
    } catch (error) {
      console.warn(`Error parsing date: ${date}`, error);
      return 'Unknown Time';
    }
  };

  // Log screenshots for debugging
  useEffect(() => {
    if (screenshots.length > 0) {
      console.log('Screenshots data:', screenshots);
    }
  }, [screenshots]);

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-4 sm:p-6 rounded-2xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full flex flex-col`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Screenshots"
      >
        <h2 className="text-lg sm:text-xl font-orbitron gold-gradient mb-4 sm:mb-6">Today's Screenshots</h2>
        <div className="flex-1 relative">
          {screenshots.length === 0 ? (
            <div className="text-center h-full flex flex-col justify-center">
              <CameraIcon className={`w-10 sm:w-12 h-10 sm:h-12 mx-auto text-primary opacity-50`} />
              <p className="text-sm text-secondary mt-2">No screenshots captured today.</p>
              <p className="text-xs text-secondary">Enable in settings to capture.</p>
            </div>
          ) : (
            <div className="relative h-full flex items-center justify-center">
              <motion.img
                key={currentIndex}
                src={screenshots[currentIndex].imageBase64}
                alt={`Screenshot at ${formatTimestamp(screenshots[currentIndex].date)}`}
                className="max-w-full max-h-[80%] object-contain rounded border border-primary cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(screenshots[currentIndex])}
              />
              {screenshots.length > 1 && (
                <>
                  <motion.button
                    onClick={prevScreenshot}
                    className="absolute left-2 p-2 bg-secondary text-primary rounded-full glow"
                    whileHover={{ scale: 1.1 }}
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={nextScreenshot}
                    className="absolute right-2 p-2 bg-secondary text-primary rounded-full glow"
                    whileHover={{ scale: 1.1 }}
                    aria-label="Next screenshot"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </motion.button>
                </>
              )}
              <p className="absolute bottom-2 text-xs text-secondary">
                {formatTimestamp(screenshots[currentIndex].date)}
              </p>
            </div>
          )}
        </div>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelected(null)}
          >
            <div className="relative flex items-center justify-center w-full h-full">
              <motion.img
                src={selected.imageBase64}
                alt={`Full screenshot at ${formatTimestamp(selected.date)}`}
                className="w-full h-full object-contain"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />
              {screenshots.length > 1 && (
                <>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); prevScreenshot(); }}
                    className="absolute left-4 sm:left-8 p-3 bg-secondary text-primary rounded-full glow"
                    whileHover={{ scale: 1.1 }}
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeftIcon className="w-8 sm:w-10 h-8 sm:h-10" />
                  </motion.button>
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); nextScreenshot(); }}
                    className="absolute right-4 sm:right-8 p-3 bg-secondary text-primary rounded-full glow"
                    whileHover={{ scale: 1.1 }}
                    aria-label="Next screenshot"
                  >
                    <ChevronRightIcon className="w-8 sm:w-10 h-8 sm:h-10" />
                  </motion.button>
                </>
              )}
              {/* <div className="absolute bottom-4 sm:bottom-8 flex flex-col items-center gap-2">
                <p className="text-sm sm:text-base font-medium text-primary text-center px-2">{selected.url || 'No URL available'}</p>
                <p className="text-xs sm:text-sm text-secondary text-center">{formatTimestamp(selected.date)}</p>
              </div> */}
            </div>
          </motion.div>
        )}
      </motion.div>
    </Tilt>
  );
}

export default ScreenshotCarousel;