import React from 'react';
import { motion } from 'framer-motion';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Tilt from 'react-parallax-tilt';

function YearlyActivity({ heatmapData, theme }) {
  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <motion.div
        className={`p-4 sm:p-6 md:p-8 rounded-2xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-orbitron font-extrabold gold-gradient mb-4 sm:mb-6">
          Yearly Activity
        </h2>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return `color-scale-${Math.min(Math.floor(value.count / 3600) + 1, 4)}`;
            }}
            tooltipDataAttrs={(value) => ({
              'data-tip': value ? `${value.date}: ${(value.count / 3600).toFixed(1)}h` : 'No data',
            })}
            showWeekdayLabels={true}
          />
          <div className="flex gap-2 mt-4 items-center text-sm font-semibold">
            <span className="text-secondary">Low</span>
            {[1, 2, 3, 4].map((level) => (
              <div key={level} className={`w-4 h-4 rounded color-scale-${level}`} />
            ))}
            <span className="text-secondary">High</span>
          </div>
        </div>
        <style>
          {`
            .react-calendar-heatmap text { font-size: 8px; fill: ${theme === 'dark' ? '#E5E7EB' : '#333'}; }
            .react-calendar-heatmap .color-empty { fill: ${theme === 'dark' ? '#1E1E4A' : '#E5E7EB'}; }
            .react-calendar-heatmap .color-scale-1 { fill: rgba(0, 245, 255, 0.2); }
            .react-calendar-heatmap .color-scale-2 { fill: rgba(0, 245, 255, 0.4); }
            .react-calendar-heatmap .color-scale-3 { fill: rgba(0, 245, 255, 0.6); }
            .react-calendar-heatmap .color-scale-4 { fill: #00F5FF; }
          `}
        </style>
      </motion.div>
    </Tilt>
  );
}

export default YearlyActivity;