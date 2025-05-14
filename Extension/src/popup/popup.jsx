/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Helper to format seconds into hours and minutes
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Sample motivational tips
const motivationalTips = [
  'Focus on one task at a time for maximum efficiency!',
  'Set clear goals to stay on track today!',
  'Take short breaks to boost your productivity!',
  'Organize your workspace for a clearer mind!',
];

// Format current time for "Last Updated"
const formatCurrentTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

function Popup() {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [todayMetrics, setTodayMetrics] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [weekMetrics, setWeekMetrics] = useState({ productiveTime: 0, unproductiveTime: 0 });
  const [showWeekly, setShowWeekly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(formatCurrentTime());

  // Check login status on mount
  useEffect(() => {
    chrome.storage.local.get(['token'], (result) => {
      console.log('Checking stored token:', result.token);
      if (result.token) {
        setToken(result.token);
        setView('home');
        fetchProductivityData(result.token);
      }
    });
  }, []);

  // Periodic refresh of metrics
  useEffect(() => {
    if (view === 'home' && token) {
      const interval = setInterval(() => {
        fetchProductivityData(token, true);
      }, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [view, token]);

  // Fetch productivity data
  const fetchProductivityData = async (token, isPeriodic = false) => {
    if (isPeriodic) setIsRefreshing(true);
    try {
      const todayRes = await fetch('http://localhost:5000/api/time/today', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!todayRes.ok) throw new Error('Failed to fetch today’s metrics');
      const todayData = await todayRes.json();
      setTodayMetrics(todayData || { productiveTime: 0, unproductiveTime: 0 });

      const weekRes = await fetch('http://localhost:5000/api/time/week', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!todayRes.ok) throw new Error('Failed to fetch weekly metrics');
      const weekData = await weekRes.json();
      setWeekMetrics(weekData || { productiveTime: 0, unproductiveTime: 0 });

      setLastUpdated(formatCurrentTime());
    } catch (err) {
      console.error('Error fetching productivity data:', err.message);
      setError('Failed to fetch productivity data');
    } finally {
      if (isPeriodic) setIsRefreshing(false);
    }
  };

  // Handle login/register submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = view === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const payload = view === 'login' ? { email, password } : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Authentication failed');
      const data = await response.json();

      if (view === 'register') {
        setView('login');
        return;
      }

      chrome.storage.local.set({ token: data.token }, () => {
        setToken(data.token);
        setView('home');
        fetchProductivityData(data.token);
      });
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    chrome.storage.local.clear(() => {
      setEmail('');
      setPassword('');
      setUsername('');
      setToken('');
      setView('login');
      setTodayMetrics({ productiveTime: 0, unproductiveTime: 0 });
      setWeekMetrics({ productiveTime: 0, unproductiveTime: 0 });
    });
  };

  // Calculate productivity score
  const productivityScore = todayMetrics.productiveTime + todayMetrics.unproductiveTime > 0
    ? Math.round((todayMetrics.productiveTime / (todayMetrics.productiveTime + todayMetrics.unproductiveTime)) * 100)
    : 0;

  // Get random motivational tip
  const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];

  return (
    <div className="popup-container">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          <span className="header-brand">FocusForge</span>
          <span className="header-tagline">Maximize Your Day</span>
        </div>
        {view === 'home' && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>

      {view === 'home' ? (
        <div className="content">
          {/* Productivity Score */}
          <div className="card animate-fade-in">
            <h2 className="card-title">Today’s Productivity</h2>
            <div className="progress-container">
              <div className="progress-ring">
                <svg className="progress-svg" viewBox="0 0 100 100">
                  <circle className="progress-bg" cx="50" cy="50" r="45" />
                  <circle
                    className="progress-fill"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{
                      strokeDasharray: `${productivityScore * 2.83}, 283`,
                    }}
                  />
                </svg>
                <span className="progress-label">{productivityScore}%</span>
              </div>
              <p className="progress-text">{productivityScore >= 70 ? 'Great job!' : 'Keep pushing!'}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="card animate-fade-in">
            <div className="metrics-header">
              <h2 className="card-title">{showWeekly ? 'This Week' : 'Today'}</h2>
              <button
                onClick={() => setShowWeekly(!showWeekly)}
                className="toggle-button"
              >
                {showWeekly ? 'Daily' : 'Weekly'}
              </button>
            </div>
            <div className="metrics-content">
              <div className="metric">
                <span className="metric-label productive">✅ Productive</span>
                <p className="metric-value">
                  {formatTime(showWeekly ? weekMetrics.productiveTime : todayMetrics.productiveTime)}
                </p>
              </div>
              <div className="metric">
                <span className="metric-label unproductive">❌ Unproductive</span>
                <p className="metric-value">
                  {formatTime(showWeekly ? weekMetrics.unproductiveTime : todayMetrics.unproductiveTime)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchProductivityData(token).finally(() => setIsRefreshing(false));
              }}
              className={`refresh-button ${isRefreshing ? 'pulse' : ''}`}
              disabled={isRefreshing}
            >
              {isRefreshing ? <span className="spinner"></span> : 'Refresh'}
            </button>
            <p className="last-updated">Updated: {lastUpdated}</p>
          </div>

          {/* Motivational Tip */}
          <div className="card tip-card animate-fade-in">
            <p className="tip-title">💡 Productivity Tip</p>
            <p className="tip-text">{randomTip}</p>
          </div>
        </div>
      ) : (
        <div className="auth-container">
          {/* Login/Register Toggle */}
          <div className="auth-toggle">
            <button
              onClick={() => setView('login')}
              className={`toggle-option ${view === 'login' ? 'active' : ''}`}
            >
              Login
            </button>
            <button
              onClick={() => setView('register')}
              className={`toggle-option ${view === 'register' ? 'active' : ''}`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="auth-form">
            {view === 'register' && (
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  required
                />
                <label htmlFor="username" className="input-label">Username</label>
              </div>
            )}
            <div className="input-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
              <label htmlFor="email" className="input-label">Email</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
              <label htmlFor="password" className="input-label">Password</label>
            </div>
            <button onClick={handleSubmit} className="auth-button">
              {view === 'login' ? 'Login' : 'Register'}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </div>
        </div>
      )}

      {/* Vanilla CSS Styles */}
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            letter-spacing: 0.02em;
          }

          .popup-container {
            width: 288px;
            min-height: 450px;
            background: #FAFAF9;
            color: #1C2526;
            overflow-y: auto;
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #115E59 0%, #2DD4BF 100%);
            color: #FFFFFF;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }

          .header-title {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .header-brand {
            font-size: 18px;
            font-weight: 700;
          }

          .header-tagline {
            font-size: 10px;
            font-weight: 400;
            opacity: 0.9;
          }

          .logout-button {
            background: #F43F5E;
            color: #FFFFFF;
            border: none;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: 500;
            border-radius: 4px;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
          }

          .logout-button:hover {
            background: #E11D48;
            transform: scale(1.02);
          }

          /* Content */
          .content {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .card {
            background: #FFFFFF;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            border-top: 2px solid #115E59;
          }

          .card-title {
            font-size: 14px;
            font-weight: 700;
            color: #115E59;
            margin-bottom: 8px;
          }

          /* Productivity Score */
          .progress-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 8px;
          }

          .progress-ring {
            position: relative;
            width: 60px;
            height: 60px;
          }

          .progress-svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
          }

          .progress-bg {
            fill: none;
            stroke: #E5E7EB;
            stroke-width: 10;
          }

          .progress-fill {
            fill: none;
            stroke: #115E59;
            stroke-width: 10;
            stroke-linecap: round;
            transition: stroke-dasharray 0.5s ease-out;
          }

          .progress-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px;
            font-weight: 600;
            color: #115E59;
          }

          .progress-text {
            font-size: 12px;
            font-weight: 500;
            color: #6B7280;
            margin-top: 8px;
            text-align: center;
          }

          /* Metrics */
          .metrics-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .toggle-button {
            background: none;
            border: none;
            color: #115E59;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: underline;
            transition: color 0.2s;
          }

          .toggle-button:hover {
            color: #0A3D3A;
          }

          .metrics-content {
            display: flex;
            justify-content: space-between;
            gap: 8px;
          }

          .metric {
            flex: 1;
            text-align: center;
          }

          .metric-label {
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          }

          .metric-label.productive {
            color: #65A30D;
          }

          .metric-label.unproductive {
            color: #F43F5E;
          }

          .metric-value {
            font-size: 14px;
            font-weight: 600;
            color: #1C2526;
            margin-top: 4px;
          }

          .refresh-button {
            width: 100%;
            background: #115E59;
            color: #FFFFFF;
            border: none;
            padding: 6px;
            font-size: 12px;
            font-weight: 500;
            border-radius: 4px;
            margin-top: 8px;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .refresh-button:hover {
            background: #0A3D3A;
            transform: scale(1.02);
          }

          .refresh-button.pulse {
            animation: pulse 1.5s infinite;
          }

          .refresh-button:disabled {
            background: #6B7280;
            cursor: not-allowed;
          }

          .spinner {
            width: 12px;
            height: 12px;
            border: 2px solid #FFFFFF;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 4px;
          }

          .last-updated {
            font-size: 10px;
            color: #6B7280;
            text-align: center;
            margin-top: 8px;
          }

          /* Motivational Tip */
          .tip-card {
            background: #E6F6F5;
            color: #1C2526;
            text-align: center;
          }

          .tip-title {
            font-size: 12px;
            font-weight: 600;
            color: #115E59;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          }

          .tip-text {
            font-size: 12px;
            line-height: 1.4;
          }

          /* Auth Container */
          .auth-container {
            padding: 16px;
          }

          .auth-toggle {
            display: flex;
            margin-bottom: 12px;
          }

          .toggle-option {
            flex: 1;
            padding: 8px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid #D1D5DB;
            background: #E5E7EB;
            color: #1C2526;
            cursor: pointer;
            transition: all 0.2s;
          }

          .toggle-option:first-child {
            border-right: none;
            border-radius: 4px 0 0 4px;
          }

          .toggle-option:last-child {
            border-radius: 0 4px 4px 0;
          }

          .toggle-option.active {
            background: #115E59;
            color: #FFFFFF;
            border-color: #115E59;
          }

          .toggle-option:hover {
            background: #D1D5DB;
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .input-group {
            position: relative;
          }

          .auth-input {
            width: 100%;
            padding: 8px 8px 8px 8px;
            font-size: 12px;
            border: 1px solid #D1D5DB;
            border-radius: 4px;
            outline: none;
            transition: border 0.2s, box-shadow 0.2s;
            background: #FFFFFF;
            color: #1C2526;
          }

          .auth-input:focus {
            border-color: #115E59;
            box-shadow: 0 0 0 2px rgba(17, 94, 89, 0.2);
          }

          .auth-input:not(:placeholder-shown) + .input-label,
          .auth-input:focus + .input-label {
            transform: translateY(-20px) scale(0.8);
            color: #115E59;
            background: #FAFAF9;
            padding: 0 4px;
          }

          .input-label {
            position: absolute;
            top: 8px;
            left: 8px;
            font-size: 12px;
            color: #6B7280;
            pointer-events: none;
            transition: all 0.2s;
          }

          .auth-button {
            background: #115E59;
            color: #FFFFFF;
            border: none;
            padding: 8px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
          }

          .auth-button:hover {
            background: #0A3D3A;
            transform: scale(1.02);
          }

          .auth-error {
            color: #F43F5E;
            font-size: 12px;
            text-align: center;
            margin-top: 8px;
          }

          /* Animations */
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Scrollbar */
          .popup-container::-webkit-scrollbar {
            width: 6px;
          }

          .popup-container::-webkit-scrollbar-track {
            background: #E5E7EB;
          }

          .popup-container::-webkit-scrollbar-thumb {
            background: #115E59;
            border-radius: 3px;
          }

          .popup-container::-webkit-scrollbar-thumb:hover {
            background: #0A3D3A;
          }
        `}
      </style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Popup />);