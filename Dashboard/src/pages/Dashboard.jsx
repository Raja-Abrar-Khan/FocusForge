/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// File: Frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import TodaysFocus from '../components/dashboard/TodaysFocus';
import ProductivityCharts from '../components/dashboard/ProductivityCharts';
import TopHours from '../components/dashboard/TopHours';
import YearlyActivity from '../components/dashboard/YearlyActivity';
import Achievements from '../components/dashboard/Achievements';
import GoalSetterModal from '../components/dashboard/GoalSetterModal';
import DataExportButton from '../components/dashboard/DataExportButton';
import MotivationalQuote from '../components/dashboard/MotivationalQuote';
import ProductivityInsights from '../components/dashboard/ProductivityInsights';
import ProductivityScore from '../components/dashboard/ProductivityScore';
import { Bars3Icon } from '@heroicons/react/24/outline';
import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-[#FF00FF] text-center" role="alert">
          Something went wrong. Please try refreshing the page.
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard() {
  const [todayData, setTodayData] = useState({ productiveTime: 0, unproductiveTime: 0, hourlyData: [] });
  const [weeklyData, setWeeklyData] = useState({ productiveTime: 0, unproductiveTime: 0, dailyBreakdown: [] });
  const [monthlyData, setMonthlyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [yearlyData, setYearlyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [heatmapData, setHeatmapData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyHourlyData, setWeeklyHourlyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required. Please log in.');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Sending Authorization header:', config.headers.Authorization); // Debug log

        const [
          todayRes,
          weekRes,
          monthRes,
          yearRes,
          heatmapRes,
          hourlyRes,
          weeklyHourlyRes,
          streakRes,
          userRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/time/today', config),
          axios.get('http://localhost:5000/api/time/week', config),
          axios.get('http://localhost:5000/api/time/month', config),
          axios.get('http://localhost:5000/api/time/year', config),
          axios.get('http://localhost:5000/api/time/heatmap', config),
          axios.get('http://localhost:5000/api/time/hours', config),
          axios.get('http://localhost:5000/api/time/weekly-hours', config),
          axios.get('http://localhost:5000/api/time/streak', config),
          axios.get('http://localhost:5000/api/auth/user', config).catch(() => ({ data: { username: localStorage.getItem('username') || 'User' } }))
        ]);

        setTodayData(todayRes.data);
        setWeeklyData(weekRes.data);
        setMonthlyData(monthRes.data);
        setYearlyData(yearRes.data);
        setHeatmapData(heatmapRes.data);
        setHourlyData(hourlyRes.data || []);
        setWeeklyHourlyData(weeklyHourlyRes.data);
        setStreak(streakRes.data.streak);
        setUsername(userRes.data.username || localStorage.getItem('username') || 'User');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message || 'Failed to load data. Please check your connection or log in again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const calculateScore = (productive, unproductive) => {
    const total = productive + unproductive + 1;
    return Math.round((productive / total) * 100);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0A0A2A] to-[#1E1E4A]' : 'bg-gradient-to-br from-gray-100 to-blue-100'} text-${theme === 'dark' ? 'gray-100' : 'gray-900'} font-montserrat relative overflow-hidden`}>
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse"></div>
      </div>
      <ErrorBoundary>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          theme={theme}
          toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onSetGoal={() => setIsGoalModalOpen(true)}
          todayData={todayData}
          formatTime={formatTime}
        />
      </ErrorBoundary>
      <div className="flex-1 flex flex-col">
        <Header />
        {/* Floating Sidebar Toggle */}
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-32 left-4 p-3 rounded-full ${theme === 'dark' ? 'bg-[#1E1E4A] text-[#00F5FF]' : 'bg-gray-200 text-blue-900'} hover:bg-opacity-80 glow z-50`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.button>
        <main className="flex-grow px-4 py-12 pt-32 relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
              <motion.div
                className="w-16 h-16 border-4 border-[#00F5FF] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                aria-label="Loading"
              />
            </div>
          ) : error ? (
            <div className="text-[#FF00FF] text-center text-xl" role="alert">
              {error}
            </div>
          ) : (
            <>
              {/* Enhanced Productivity Score */}
              <div className="max-w-6xl mx-auto mb-12">
                <ErrorBoundary>
                  <ProductivityScore
                    score={calculateScore(todayData.productiveTime, todayData.unproductiveTime)}
                    theme={theme}
                    username={username}
                    productiveTime={todayData.productiveTime}
                    streak={streak}
                    formatTime={formatTime}
                  />
                </ErrorBoundary>
              </div>
              {/* Main Grid */}
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  <ErrorBoundary>
                    <TodaysFocus
                      todayData={todayData}
                      streak={streak}
                      dailyGoal={dailyGoal}
                      formatTime={formatTime}
                      calculateScore={calculateScore}
                      theme={theme}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <ProductivityInsights todayData={todayData} hourlyData={hourlyData} theme={theme} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <MotivationalQuote theme={theme} />
                  </ErrorBoundary>
                </div>
                {/* Right Column */}
                <div className="space-y-8">
                  <ErrorBoundary>
                    <ProductivityCharts
                      todayData={todayData}
                      weeklyData={weeklyData}
                      monthlyData={monthlyData}
                      yearlyData={yearlyData}
                      hourlyData={hourlyData}
                      theme={theme}
                    />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <TopHours weeklyHourlyData={weeklyHourlyData} theme={theme} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <Achievements theme={theme} />
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <DataExportButton todayData={todayData} formatTime={formatTime} theme={theme} />
                  </ErrorBoundary>
                </div>
                {/* Full-Width Yearly Activity */}
                <div className="lg:col-span-2 mt-8">
                  <ErrorBoundary>
                    <YearlyActivity heatmapData={heatmapData} theme={theme} />
                  </ErrorBoundary>
                </div>
              </div>
            </>
          )}
        </main>
        <GoalSetterModal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          onSave={(hours) => setDailyGoal(hours)}
          currentGoal={dailyGoal}
          theme={theme}
        />
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;