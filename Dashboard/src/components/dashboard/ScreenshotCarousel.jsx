import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Tilt from 'react-parallax-tilt';

function ScreenshotCarousel({ screenshots, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const nextScreenshot = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

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
                alt={`Screenshot at ${new Date(screenshots[currentIndex].date).toLocaleTimeString()}`}
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
                {new Date(screenshots[currentIndex].date).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="p-4 bg-[#0A0A2A] rounded-lg glow"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.imageBase64} alt="Full screenshot" className="max-w-full max-h-[80vh] rounded" />
              <p className="text-sm text-primary mt-2">{selected.url}</p>
              <p className="text-xs text-secondary">{new Date(selected.date).toLocaleTimeString()}</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </Tilt>
  );
}

export default ScreenshotCarousel;