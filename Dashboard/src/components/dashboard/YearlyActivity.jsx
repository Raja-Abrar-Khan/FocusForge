/* eslint-disable no-unused-vars */
// File: Frontend/src/components/dashboard/YearlyActivity.jsx
import { motion } from 'framer-motion';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Tilt from 'react-parallax-tilt';

function YearlyActivity({ heatmapData, theme }) {
  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-6 rounded-2xl holographic glow ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Yearly Activity Heatmap"
      >
        <h2 className={`text-xl font-orbitron ${theme === 'dark' ? 'bg-gradient-to-r from-[#00F5FF] to-[#FF00FF] bg-clip-text text-transparent' : 'text-blue-900'} mb-4`}>
          Yearly Activity
        </h2>
        <div className="overflow-hidden">
          <CalendarHeatmap
            startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return `color-scale-${Math.min(Math.floor(value.count / 2) + 1, 4)}`;
            }}
            tooltipDataAttrs={(value) => ({
              'data-tip': value ? `${value.date}: ${value.count}h` : 'No data'
            })}
            aria-label="Yearly activity heatmap"
          />
          <style>{`
            .color-empty { fill: ${theme === 'dark' ? '#1E1E4A' : '#E5E7EB'}; }
            .color-scale-1 { fill: rgba(0, 245, 255, 0.2); }
            .color-scale-2 { fill: rgba(0, 245, 255, 0.4); }
            .color-scale-3 { fill: rgba(0, 245, 255, 0.6); }
            .color-scale-4 { fill: #00F5FF; }
          `}</style>
        </div>
      </motion.div>
    </Tilt>
  );
}

export default YearlyActivity;