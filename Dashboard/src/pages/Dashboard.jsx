import React, { useState, useEffect } from 'react';
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
import InsightsAndInspiration from '../components/dashboard/InsightsAndInspiration';
import ProductivityScore from '../components/dashboard/ProductivityScore';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import ScreenshotCarousel from '../components/dashboard/ScreenshotCarousel';
import WeeklyActivityTimeline from '../components/dashboard/WeeklyActivityTimeline';
import { Bars3Icon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-danger text-center">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

function Dashboard() {
  const [todayData, setTodayData] = useState({ productiveTime: 0, unproductiveTime: 0, hourlyData: [], activityTime: {} });
  const [weeklyData, setWeeklyData] = useState({ productiveTime: 0, unproductiveTime: 0, dailyBreakdown: [] });
  const [monthlyData, setMonthlyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [yearlyData, setYearlyData] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [heatmapData, setHeatmapData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyHourlyData, setWeeklyHourlyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [screenshots, setScreenshots] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [showFullWeekly, setShowFullWeekly] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in.');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [
        todayRes,
        weekRes,
        monthRes,
        yearRes,
        heatmapRes,
        hourlyRes,
        weeklyHourlyRes,
        streakRes,
        screenshotsRes,
        historyRes,
        userRes,
      ] = await Promise.all([
        axios.get('http://localhost:5000/api/time/today', config),
        axios.get('http://localhost:5000/api/time/week', config),
        axios.get('http://localhost:5000/api/time/month', config),
        axios.get('http://localhost:5000/api/time/year', config),
        axios.get('http://localhost:5000/api/time/heatmap', config),
        axios.get('http://localhost:5000/api/time/hours', config),
        axios.get('http://localhost:5000/api/time/weekly-hours', config),
        axios.get('http://localhost:5000/api/time/streak', config),
        axios.get('http://localhost:5000/api/screenshots/today', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/time/history', config),
        axios.get('http://localhost:5000/api/auth/user', config).catch(() => ({ data: { username: 'User' } })),
      ]);

      setTodayData(todayRes.data);
      setWeeklyData(weekRes.data);
      setMonthlyData(monthRes.data);
      setYearlyData(yearRes.data);
      setHeatmapData(heatmapRes.data);
      setHourlyData(hourlyRes.data || []);
      setWeeklyHourlyData(weeklyHourlyRes.data);
      setStreak(streakRes.data.streak);
      setScreenshots(screenshotsRes.data);
      setHistory(historyRes.data);
      setUsername(userRes.data.username);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load data.');
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0A0A2A] to-[#1E1E4A]' : 'bg-gradient-to-br from-gray-100 to-blue-100'} text-${theme === 'dark' ? 'gray-100' : 'gray-900'} font-montserrat`}>
      <style>{`
        .holographic {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          backdrop-filter: blur(12px);
          border: 1px solid ${theme === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
        }
        .glow {
          box-shadow: 0 0 12px rgba(0, 245, 255, 0.4);
        }
        .gold-gradient {
          background: linear-gradient(45deg, #00F5FF, #FFD700);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .text-primary {
          color: ${theme === 'dark' ? '#00F5FF' : '#1E3A8A'};
        }
        .text-secondary {
          color: ${theme === 'dark' ? '#FFD700' : '#DAA520'};
        }
        .text-danger {
          color: #FF00FF;
        }
        .bg-primary {
          background-color: ${theme === 'dark' ? '#00F5FF' : '#1E3A8A'};
        }
        .bg-secondary {
          background-color: ${theme === 'dark' ? '#1E1E4A' : '#E5E7EB'};
        }
        .bg-danger {
          background-color: #FF00FF;
        }
        .border-primary {
          border-color: ${theme === 'dark' ? '#00F5FF' : '#1E3A8A'};
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#1E1E4A' : '#E5E7EB'};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00F5FF;
          border-radius: 3px;
        }
        .row-height {
          height: 20rem;
        }
        .chart-row-height {
          height: 24rem;
          overflow: hidden;
        }
        .chart-row-height canvas {
          max-height: 100%;
        }
        header {
          padding-left: 3rem;
          z-index: 60;
        }
        @media (max-width: 640px) {
          .row-height, .chart-row-height {
            height: auto;
            min-height: 16rem;
          }
          .grid-cols-3 {
            grid-template-columns: 1fr;
          }
          .md\\:col-span-2 {
            grid-column: span 1;
          }
          header {
            padding-left: 2.5rem;
          }
        }
        @media (min-width: 640px) and (max-width: 1024px) {
          .row-height {
            height: 18rem;
          }
          .chart-row-height {
            height: 22rem;
          }
        }
        @media (min-width: 1024px) {
          .grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
      <ErrorBoundary>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          theme={theme}
          toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onSetGoal={() => setIsGoalModalOpen(true)}
          todayData={todayData}
          formatTime={formatTime}
          onLogout={handleLogout}
          onExport={() => {
            const csvContent = [
              'Type,Time (seconds)',
              `Productive,${todayData.productiveTime}`,
              `Unproductive,${todayData.unproductiveTime}`,
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `productivity_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);
          }}
        />
      </ErrorBoundary>
      <div className="flex-1 flex flex-col">
        <Header />
        <motion.button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-4 left-4 p-3 rounded-full bg-secondary text-primary glow z-50 md:top-20 md:left-6`}
          whileHover={{ scale: 1.1 }}
        >
          <Bars3Icon className="w-6 h-6" />
        </motion.button>
        <main className="flex-grow px-4 py-12 pt-32 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <motion.div
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : error ? (
            <div className="text-danger text-center text-lg">{error}</div>
          ) : (
            <>
              <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-orbitron font-extrabold gold-gradient">FocusForge Dashboard</h1>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-secondary text-primary rounded-lg glow text-base font-bold"
                    whileHover={{ scale: 1.05 }}
                  >
                    Refresh
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-danger text-white rounded-lg glow text-base font-bold"
                    whileHover={{ scale: 1.05 }}
                  >
                    Logout
                  </motion.button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                {/* Row 1: ProductivityScore */}
                <ErrorBoundary>
                  <div className="col-span-1 md:col-span-3">
                    <ProductivityScore
                      score={calculateScore(todayData.productiveTime, todayData.unproductiveTime)}
                      theme={theme}
                      username={username}
                      productiveTime={todayData.productiveTime}
                      todayData={todayData}
                      streak={streak}
                      formatTime={formatTime}
                    />
                  </div>
                </ErrorBoundary>
                {/* Row 2: TodaysFocus, ActivityTimeline, WeeklyActivityTimeline */}
                <ErrorBoundary>
                  <div className="col-span-1 row-height">
                    <TodaysFocus 
                      todayData={todayData}
                      streak={streak}
                      dailyGoal={dailyGoal}
                      formatTime={formatTime}
                      calculateScore={calculateScore}
                      theme={theme}
                    />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="col-span-1 row-height">
                    <ActivityTimeline
                      history={history}
                      theme={theme}
                      showFull={showFullTimeline}
                      toggleFull={() => setShowFullTimeline(!showFullTimeline)}
                    />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="col-span-1 row-height">
                    <WeeklyActivityTimeline
                      weeklyData={weeklyData}
                      theme={theme}
                      showFull={showFullWeekly}
                      toggleFull={() => setShowFullWeekly(!showFullWeekly)}
                    />
                  </div>
                </ErrorBoundary>
                {/* Row 3: ScreenshotCarousel, ProductivityCharts */}
                <ErrorBoundary>
                  <div className="col-span-1 md:col-span-1 chart-row-height mt-40">
                    <ScreenshotCarousel screenshots={screenshots} theme={theme} />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="col-span-1 md:col-span-2 chart-row-height mt-40">
                    <ProductivityCharts
                      todayData={todayData}
                      weeklyData={weeklyData}
                      monthlyData={monthlyData}
                      yearlyData={yearlyData}
                      hourlyData={hourlyData}
                      theme={theme}
                    />
                  </div>
                </ErrorBoundary>
                {/* Row 4: Achievements, TopHours, InsightsAndInspiration */}
                <ErrorBoundary>
                  <div className="col-span-1 row-height">
                    <Achievements
                      score={calculateScore(todayData.productiveTime, todayData.unproductiveTime)}
                      streak={streak}
                      todayData={todayData}
                      theme={theme}
                    />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="col-span-1 row-height">
                    <TopHours weeklyHourlyData={weeklyHourlyData} theme={theme} />
                  </div>
                </ErrorBoundary>
                <ErrorBoundary>
                  <div className="col-span-1 row-height">
                    <InsightsAndInspiration theme={theme} todayData={todayData} hourlyData={hourlyData} />
                  </div>
                </ErrorBoundary>
                {/* Row 5: YearlyActivity */}
                <ErrorBoundary>
                  <div className="col-span-1 md:col-span-3">
                    <YearlyActivity heatmapData={heatmapData} theme={theme} />
                  </div>
                </ErrorBoundary>
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
        {showFullTimeline && (
          <motion.div
            className="fixed inset-0 bg-[#0A0A2A]/90 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="p-6 max-w-3xl mx-auto">
              <motion.button
                onClick={() => setShowFullTimeline(false)}
                className="mb-4 px-4 py-2 bg-danger text-white rounded-lg glow text-base font-bold"
                whileHover={{ scale: 1.05 }}
              >
                Close
              </motion.button>
              <ActivityTimeline history={history} theme={theme} showFull={true} />
            </div>
          </motion.div>
        )}
        {showFullWeekly && (
          <motion.div
            className="fixed inset-0 bg-[#0A0A2A]/90 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="p-6 max-w-3xl mx-auto">
              <motion.button
                onClick={() => setShowFullWeekly(false)}
                className="mb-4 px-4 py-2 bg-danger text-white rounded-lg glow text-base font-bold"
                whileHover={{ scale: 1.05 }}
              >
                Close
              </motion.button>
              <WeeklyActivityTimeline weeklyData={weeklyData} theme={theme} showFull={true} />
            </div>
          </motion.div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;