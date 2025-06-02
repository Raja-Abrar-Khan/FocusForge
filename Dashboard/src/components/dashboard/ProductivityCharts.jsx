import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Tilt from 'react-parallax-tilt';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ProductivityCharts({ todayData, weeklyData, monthlyData, yearlyData, hourlyData, theme }) {
  const [view, setView] = useState('daily');

  const dailyChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Productive',
        data: hourlyData.map(h => h.productiveTime / 3600),
        borderColor: '#00F5FF',
        backgroundColor: 'rgba(0, 245, 255, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00F5FF',
        pointBorderColor: theme === 'dark' ? '#0A0A2A' : '#F3F4F6',
        pointHoverBackgroundColor: '#FF00FF'
      },
      {
        label: 'Unproductive',
        data: hourlyData.map(h => (h.unproductiveTime || 0) / 3600),
        borderColor: '#FF00FF',
        backgroundColor: 'rgba(255, 0, 255, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF00FF',
        pointBorderColor: theme === 'dark' ? '#0A0A2A' : '#F3F4F6',
        pointHoverBackgroundColor: '#00F5FF'
      }
    ]
  };

  const weeklyChartData = {
    labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Productive',
        data: weeklyData.dailyBreakdown?.map(d => d.productiveTime / 3600) || Array(7).fill(0),
        borderColor: '#00F5FF',
        backgroundColor: 'rgba(0, 245, 255, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Unproductive',
        data: weeklyData.dailyBreakdown?.map(d => d.unproductiveTime / 3600) || Array(7).fill(0),
        borderColor: '#FF00FF',
        backgroundColor: 'rgba(255, 0, 255, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const monthlyChartData = {
    labels: ['4 weeks ago', '3 weeks ago', '2 weeks ago', 'Last Week', 'This Week'],
    datasets: [
      {
        label: 'Productive',
        data: Array(5).fill(monthlyData.productiveTime / 3600 / 5),
        borderColor: '#00F5FF',
        backgroundColor: 'rgba(0, 245, 255, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Unproductive',
        data: Array(5).fill(monthlyData.unproductiveTime / 3600 / 5),
        borderColor: '#FF00FF',
        backgroundColor: 'rgba(255, 0, 255, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const yearlyChartData = {
    labels: ['12 months ago', '9 months ago', '6 months ago', '3 months ago', 'This Month'],
    datasets: [
      {
        label: 'Productive',
        data: Array(5).fill(yearlyData.productiveTime / 3600 / 5),
        borderColor: '#00F5FF',
        backgroundColor: 'rgba(0, 245, 255, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Unproductive',
        data: Array(5).fill(yearlyData.unproductiveTime / 3600 / 5),
        borderColor: '#FF00FF',
        backgroundColor: 'rgba(255, 0, 255, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: theme === 'dark' ? '#E5E7EB' : '#1F2937', font: { size: 12 } } },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1E1E4A' : '#F3F4F6',
        titleColor: theme === 'dark' ? '#00F5FF' : '#1F2937',
        bodyColor: theme === 'dark' ? '#E5E7EB' : '#1F2937'
      }
    },
    scales: {
      x: { ticks: { color: theme === 'dark' ? '#E5E7EB' : '#1F2937', font: { size: 10 } }, grid: { color: theme === 'dark' ? '#374151' : '#D1D5DB' } },
      y: {
        ticks: { color: theme === 'dark' ? '#E5E7EB' : '#1F2937', font: { size: 10 } },
        title: { display: true, text: 'Hours', color: theme === 'dark' ? '#E5E7EB' : '#1F2937', font: { size: 12 } },
        grid: { color: theme === 'dark' ? '#374151' : '#D1D5DB' }
      }
    }
  };

  const views = [
    { id: 'daily', label: 'Daily', data: dailyChartData },
    { id: 'weekly', label: 'Weekly', data: weeklyChartData },
    { id: 'monthly', label: 'Monthly', data: monthlyChartData },
    { id: 'yearly', label: 'Yearly', data: yearlyChartData }
  ];

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
      <motion.div
        className={`p-4 sm:p-6 rounded-2xl holographic glow text-${theme === 'dark' ? 'gray-100' : 'gray-900'} h-full`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="region"
        aria-label="Productivity Charts"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-orbitron gold-gradient">Productivity Trends</h2>
          <div className="flex gap-2">
            {views.map(v => (
              <motion.button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm font-montserrat ${view === v.id ? 'bg-primary text-white' : 'bg-secondary text-primary'} hover:bg-primary hover:text-white transition glow`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Show ${v.label} productivity`}
              >
                {v.label}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="h-full">
          <Line
            data={views.find(v => v.id === view).data}
            options={chartOptions}
            aria-label={`${view} productivity chart`}
          />
        </div>
      </motion.div>
    </Tilt>
  );
}

export default ProductivityCharts;