/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// File: Frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CalendarHeatmap from 'react-calendar-heatmap';
import { ClockIcon, TrophyIcon, ChartBarIcon, CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import 'react-calendar-heatmap/dist/styles.css';
import 'react-circular-progressbar/dist/styles.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

function Dashboard() {
  // State for data and UI
  const [view, setView] = useState('daily');
  const [todayData, setTodayData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [weeklyData, setWeeklyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [monthlyData, setMonthlyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [yearlyData, setYearlyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [heatmapData, setHeatmapData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required. Please log in.');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [
          todayRes,
          weekRes,
          monthRes,
          yearRes,
          heatmapRes,
          hourlyRes,
          streakRes,
          sessionsRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/time/today', config),
          axios.get('http://localhost:5000/api/time/week', config),
          axios.get('http://localhost:5000/api/time/month', config),
          axios.get('http://localhost:5000/api/time/year', config),
          axios.get('http://localhost:5000/api/time/heatmap', config),
          axios.get('http://localhost:5000/api/time/hours', config),
          axios.get('http://localhost:5000/api/time/streak', config),
          axios.get('http://localhost:5000/api/time/sessions', config).catch(() => ({ data: [] }))
        ]);

        setTodayData(todayRes.data);
        setWeeklyData(weekRes.data);
        setMonthlyData(monthRes.data);
        setYearlyData(yearRes.data);
        setHeatmapData(heatmapRes.data);
        setHourlyData(hourlyRes.data);
        setStreak(streakRes.data.streak);
        setSessions(sessionsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message || 'Failed to load data. Please check your connection or log in again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Utility functions
  const calculateScore = (productive, unproductive) => {
    const total = productive + unproductive + 1;
    return Math.round((productive / total) * 100);
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  // Chart data
  const timelineChartData = {
    daily: {
      labels: ['Today'],
      datasets: [
        {
          label: 'Productive',
          data: [todayData.productiveTime / 3600],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Unproductive',
          data: [todayData.unproductiveTime / 3600],
          borderColor: '#F43F5E',
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    weekly: {
      labels: ['Last 7 Days'],
      datasets: [
        {
          label: 'Productive',
          data: [weeklyData.productiveTime / 3600],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Unproductive',
          data: [weeklyData.unproductiveTime / 3600],
          borderColor: '#F43F5E',
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    monthly: {
      labels: ['Last 30 Days'],
      datasets: [
        {
          label: 'Productive',
          data: [monthlyData.productiveTime / 3600],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Unproductive',
          data: [monthlyData.unproductiveTime / 3600],
          borderColor: '#F43F5E',
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    yearly: {
      labels: ['Last 365 Days'],
      datasets: [
        {
          label: 'Productive',
          data: [yearlyData.productiveTime / 3600],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Unproductive',
          data: [yearlyData.unproductiveTime / 3600],
          borderColor: '#F43F5E',
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  };

  const hourlyChartData = {
    labels: hourlyData.map(d => `${d.hour}:00`),
    datasets: [
      {
        label: 'Productive Hours',
        data: hourlyData.map(d => d.productiveTime / 3600),
        backgroundColor: 'rgba(34, 211, 238, 0.5)',
        borderColor: '#22D3EE',
        borderWidth: 1
      }
    ]
  };

  const goalProgress = Math.min((todayData.productiveTime / 3600 / 8) * 100, 100); // 8h daily goal

  const productivityTips = [
    'Take short breaks every 25 minutes to boost focus.',
    'Prioritize tasks using the Eisenhower Matrix.',
    'Use the Pomodoro technique for deep work.',
    'Stay hydrated to maintain mental clarity.',
    'Review your progress weekly to stay on track.'
  ];

  const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#0F172A] flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-7rem)]">
            <motion.div
              className="w-16 h-16 border-4 border-[#22D3EE] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              aria-label="Loading"
            />
          </div>
        ) : error ? (
          <div className="text-[#F43F5E] text-center text-xl" role="alert">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 w-full max-w-7xl h-[calc(100vh-7rem)]">
            {/* Today's Focus & Goal Progress */}
            <motion.div
              className="col-span-12 lg:col-span-3 bg-[#1E2A44]/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-between"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', scale: 1.02 }}
              role="region"
              aria-label="Today's Focus"
            >
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent mb-4">
                Today's Focus
              </h2>
              <div className="w-24 h-24 mb-4">
                <CircularProgressbar
                  value={calculateScore(todayData.productiveTime, todayData.unproductiveTime)}
                  text={`${calculateScore(todayData.productiveTime, todayData.unproductiveTime)}%`}
                  styles={buildStyles({
                    pathColor: '#22C55E',
                    textColor: '#D1D5DB',
                    trailColor: '#F43F5E',
                    textSize: '24px'
                  })}
                  aria-label="Productivity score"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-[#D1D5DB]">
                  <span className="text-[#22C55E]">Productive:</span> {formatTime(todayData.productiveTime)}
                </p>
                <p className="text-xs text-[#D1D5DB]">
                  <span className="text-[#F43F5E]">Unproductive:</span> {formatTime(todayData.unproductiveTime)}
                </p>
                <p className="text-xs text-[#22D3EE] font-semibold">Streak: {streak} days 🔥</p>
                <p className="text-xs text-[#22D3EE]">
                  {calculateScore(todayData.productiveTime, todayData.unproductiveTime) > 70 ? 'Excellent! 🌟' : 'Keep Going! 💪'}
                </p>
              </div>
              <div className="w-full mt-4">
                <p className="text-xs text-[#D1D5DB] mb-2">Daily Goal: 8h</p>
                <div className="h-2 bg-[#2A3655] rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    aria-label={`Goal progress: ${Math.round(goalProgress)}%`}
                  />
                </div>
                <p className="text-xs text-[#22C55E] mt-1">{Math.round(goalProgress)}% Complete</p>
              </div>
            </motion.div>

            {/* Productivity Overview */}
            <motion.div
              className="col-span-12 lg:col-span-6 bg-[#1E2A44]/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', scale: 1.02 }}
              role="region"
              aria-label="Productivity Timeline"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent">
                  Productivity Timeline
                </h2>
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly', 'yearly'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        view === v
                          ? 'bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] text-white'
                          : 'bg-[#2A3655]/50 text-[#D1D5DB] hover:bg-[#22D3EE]/50 hover:text-white'
                      } transition`}
                      aria-label={`Switch to ${v} view`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-grow">
                <Line
                  data={timelineChartData[view]}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: '#D1D5DB', font: { size: 10 } } },
                      tooltip: {
                        backgroundColor: '#1E293B',
                        titleColor: '#D1D5DB',
                        bodyColor: '#D1D5DB'
                      }
                    },
                    scales: {
                      x: { ticks: { color: '#D1D5DB', font: { size: 10 } }, grid: { color: '#2A3655' } },
                      y: {
                        ticks: { color: '#D1D5DB', font: { size: 10 } },
                        title: { display: true, text: 'Hours', color: '#D1D5DB', font: { size: 10 } },
                        grid: { color: '#2A3655' }
                      }
                    }
                  }}
                  aria-label="Productivity timeline chart"
                />
              </div>
            </motion.div>

            {/* Top Hours */}
            <motion.div
              className="col-span-12 lg:col-span-3 bg-[#1E2A44]/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', scale: 1.02 }}
              role="region"
              aria-label="Top Productive Hours"
            >
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent mb-4">
                Top Hours
              </h2>
              {hourlyData.every(d => d.productiveTime === 0) ? (
                <p className="text-[#D1D5DB] text-xs text-center flex-grow flex items-center justify-center">
                  No data available
                </p>
              ) : (
                <div className="flex-grow">
                  <Bar
                    data={hourlyChartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { ticks: { color: '#D1D5DB', font: { size: 8 } }, grid: { display: false } },
                        y: {
                          ticks: { color: '#D1D5DB', font: { size: 8 } },
                          title: { display: false },
                          grid: { color: '#2A3655' }
                        }
                      }
                    }}
                    aria-label="Hourly productivity chart"
                  />
                </div>
              )}
            </motion.div>

            {/* Yearly Activity */}
            <motion.div
              className="col-span-12 lg:col-span-6 bg-[#1E2A44]/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', scale: 1.02 }}
              role="region"
              aria-label="Yearly Activity Heatmap"
            >
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent mb-4">
                Yearly Activity
              </h2>
              <div className="flex-grow overflow-hidden">
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
                  .color-empty { fill: #2A3655; }
                  .color-scale-1 { fill: rgba(34, 211, 238, 0.2); }
                  .color-scale-2 { fill: rgba(34, 211, 238, 0.4); }
                  .color-scale-3 { fill: rgba(34, 211, 238, 0.6); }
                  .color-scale-4 { fill: #22D3EE; }
                `}</style>
              </div>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              className="col-span-12 lg:col-span-3 bg-[#1E2A44]/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', scale: 1.02 }}
              role="region"
              aria-label="Recent Focus Sessions"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent">
                  Recent Sessions
                </h2>
                <motion.button
                  onClick={() => {
                    setLoading(true);
                    fetchData();
                  }}
                  className="p-2 rounded-full bg-[#2A3655]/50 hover:bg-[#22D3EE]/50"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  aria-label="Refresh data"
                >
                  <ArrowPathIcon className="w-5 h-5 text-[#D1D5DB]" />
                </motion.button>
              </div>
              <div className="flex-grow space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-[#D1D5DB] text-xs text-center">No recent sessions</p>
                ) : (
                  sessions.slice(0, 5).map((session, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#2A3655]/50 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <p className="text-xs text-[#D1D5DB]">
                          {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-[#22D3EE]">
                          {formatTime(session.duration)} • {session.category || 'General'}
                        </p>
                      </div>
                      <ClockIcon className="w-5 h-5 text-[#22D3EE]" />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Achievements & Productivity Tip */}
            <motion.div
              className="col-span-12 lg:col-span-3 bg-[#1E2A44]/30 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)', scale: 1.02 }}
              role="region"
              aria-label="Achievements and Productivity Tip"
            >
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] bg-clip-text text-transparent mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['7 Day Streak', '50h Focus', 'Night Owl', 'Early Bird'].map((badge, index) => (
                  <motion.div
                    key={badge}
                    className="p-3 bg-[#2A3655]/50 rounded-lg text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrophyIcon className="w-6 h-6 text-[#22D3EE] mx-auto mb-1" />
                    <p className="text-xs text-[#D1D5DB]">{badge}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex-grow flex flex-col justify-end">
                <p className="text-xs text-[#D1D5DB] font-semibold mb-2">Productivity Tip</p>
                <p className="text-xs text-[#22D3EE] italic">"{randomTip}"</p>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;