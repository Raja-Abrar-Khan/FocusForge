/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/TopHours.jsx
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function TopHours({ weeklyHourlyData, theme }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'];

  const getIntensity = (dayIndex, hour) => {
    const dayData = weeklyHourlyData[dayIndex] || { hourly: [] };
    const hourData = dayData.hourly?.find(h => h.hour === hour);
    return hourData ? Math.min(Math.floor(hourData.productiveTime / 3600 * 4) + 1, 4) : 0;
  };

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Weekly Top Hours"
      >
        <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-4`}>
          Weekly Top Hours
        </h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1 min-w-[600px]">
            <div></div>
            {days.map(day => (
              <div key={day} className={`text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{day}</div>
            ))}
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] items-center">
                <div className={`text-xs text-right pr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{`${hour}:00`}</div>
                {days.map((_, dayIndex) => (
                  <motion.div
                    key={`${dayIndex}-${hour}`}
                    className={`h-6 ${theme === 'dark' ? 'border border-[#1E1E4A]' : 'border border-gray-200'} ${
                      getIntensity(dayIndex, hour) === 0 ? (theme === 'dark' ? 'bg-[#1E1E4A]' : 'bg-gray-200') :
                      getIntensity(dayIndex, hour) === 1 ? 'bg-[#00F5FF]/20' :
                      getIntensity(dayIndex, hour) === 2 ? 'bg-[#00F5FF]/40' :
                      getIntensity(dayIndex, hour) === 3 ? 'bg-[#00F5FF]/60' : 'bg-[#00F5FF]'
                    }`}
                    whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(0, 245, 255, 0.8)' }}
                    title={`${hour}:00 on ${days[dayIndex]}: ${(weeklyHourlyData[dayIndex]?.hourly?.find(h => h.hour === hour)?.productiveTime / 3600 || 0).toFixed(1)}h`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default TopHours;