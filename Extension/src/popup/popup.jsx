import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const motivationalTips = [
  'Focus on one task at a time!',
  'Set clear goals today!',
  'Take short breaks to boost productivity!',
  'Organize your workspace!',
];

const formatCurrentTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

const formatTimeToHours = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

function Popup() {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [todayMetrics, setTodayMetrics] = useState({ productiveTime: 0, unproductiveTime: 0, activityTime: {} });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(formatCurrentTime());

  useEffect(() => {
    chrome.storage.local.get(['token'], (result) => {
      console.log('Stored token:', result.token ? 'Present' : 'Missing');
      if (result.token) {
        setToken(result.token);
        setView('home');
        fetchProductivityData(result.token);
      }
    });
  }, []);

  useEffect(() => {
    if (view === 'home' && token) {
      const interval = setInterval(() => fetchProductivityData(token, true), 30000);
      return () => clearInterval(interval);
    }
  }, [view, token]);

  const fetchProductivityData = async (token, isPeriodic = false) => {
    if (isPeriodic) setIsRefreshing(true);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const todayRes = await fetch('http://localhost:5000/api/time/today', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!todayRes.ok) throw new Error(`Fetch failed: ${todayRes.status} ${await todayRes.text()}`);
        const todayData = await todayRes.json();
        console.log('Today data:', todayData);
        setTodayMetrics(todayData || { productiveTime: 0, unproductiveTime: 0, activityTime: {} });
        setLastUpdated(formatCurrentTime());
        setError('');
        break;
      } catch (err) {
        console.error(`Fetch attempt ${attempts + 1}/${maxAttempts}:`, err.message);
        attempts++;
        if (attempts === maxAttempts) {
          setError('Failed to fetch data. Try again later.');
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      } finally {
        if (isPeriodic) setIsRefreshing(false);
      }
    }
  };

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
      if (!response.ok) throw new Error(`Auth failed: ${await response.text()}`);
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
      console.error('Auth error:', err.message);
      setError('Authentication failed. Check credentials.');
    }
  };

  const handleLogout = () => {
    chrome.storage.local.clear(() => {
      setEmail('');
      setPassword('');
      setUsername('');
      setToken('');
      setView('login');
      setTodayMetrics({ productiveTime: 0, unproductiveTime: 0, activityTime: {} });
      setLastUpdated(formatCurrentTime());
      setError('');
    });
  };

  const productivityScore = todayMetrics.productiveTime + todayMetrics.unproductiveTime > 0
    ? Math.round((todayMetrics.productiveTime / (todayMetrics.productiveTime + todayMetrics.unproductiveTime)) * 100)
    : 0;

  const totalActivityTime = Object.values(todayMetrics.activityTime).reduce((sum, time) => sum + time, 0);
  const activityPercentages = Object.entries(todayMetrics.activityTime).map(([activity, time]) => ({
    activity,
    percentage: totalActivityTime > 0 ? Math.round((time / totalActivityTime) * 100) : 0,
  })).filter(({ activity }) => activity !== 'Unknown');

  const topActivity = activityPercentages.length > 0
    ? activityPercentages.reduce((max, curr) => curr.percentage > max.percentage ? curr : max)
    : null;

  const activityColors = {
    'Productive AI': '#00F5FF',
    'Meeting': '#8B5CF6',
    'Coding': '#10B981',
    'Studying': '#F59E0B',
    'Database Management': '#3B82F6',
    'Cooking': '#F472B6',
    'Entertainment': '#EF4444',
    'Gaming': '#6B7280',
    'Research': '#6B7280',
  };

  const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];

  return (
    <div style={{
      width: '300px',
      minHeight: '400px',
      background: '#FAFAF9',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      color: '#1C2526',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #115E59 0%, #2DD4BF 100%)',
        color: '#FFF',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: '18px', fontWeight: '700' }}>FocusForge</span>
          <span style={{ fontSize: '10px', opacity: 0.9 }}> Maximize Your Day</span>
        </div>
        {view === 'home' && (
          <button onClick={handleLogout} style={{
            background: '#F43F5E',
            color: '#FFF',
            border: 'none',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>Logout</button>
        )}
      </div>

      {view === 'home' ? (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: '#FFF',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#115E59', marginBottom: '8px' }}>
              Today’s Productivity
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 100">
                  <circle style={{ fill: 'none', stroke: '#E5E7EB', strokeWidth: 10 }} cx="50" cy="50" r="45" />
                  <circle style={{
                    fill: 'none',
                    stroke: '#115E59',
                    strokeWidth: 10,
                    strokeDasharray: `${productivityScore * 2.83}, 283`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                  }} cx="50" cy="50" r="45" />
                </svg>
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#115E59',
                }}>{productivityScore}%</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                {productivityScore >= 70 ? 'Great job!' : 'Keep pushing!'}
              </p>
            </div>
          </div>

          <div style={{
            background: '#FFF',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#115E59', marginBottom: '8px' }}>Today</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#10B981' }}>✅ Productive</span>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: '4px 0 0' }}>
                  {formatTimeToHours(todayMetrics.productiveTime)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#EF4444' }}>❌ Unproductive</span>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: '4px 0 0' }}>
                  {formatTimeToHours(todayMetrics.unproductiveTime)}
                </p>
              </div>
            </div>
            <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#115E59', margin: '8px 0 4px' }}>
              Your Activities
            </h3>
            {activityPercentages.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                No activities logged
              </p>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: '#1C2526', marginBottom: '8px' }}>
                  You worked on: {activityPercentages.map(({ activity }) => activity).join(', ')}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {activityPercentages.map(({ activity, percentage }) => (
                    <li key={activity} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      marginBottom: '4px',
                      borderRadius: '4px',
                      background: activityColors[activity] || '#6B7280',
                      color: '#FFF',
                      fontSize: '12px',
                    }}>
                      <span>{activity}</span>
                      <span>{percentage}%</span>
                    </li>
                  ))}
                </ul>
                {topActivity && (
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#115E59', textAlign: 'center', marginTop: '8px' }}>
                    {topActivity.activity} was your top activity!
                  </p>
                )}
              </>
            )}
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchProductivityData(token).finally(() => setIsRefreshing(false));
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: isRefreshing ? '#6B7280' : '#115E59',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <p style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center', marginTop: '8px' }}>
              Updated: {lastUpdated}
            </p>
          </div>

          <div style={{
            background: '#E6F6F5',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#115E59', marginBottom: '4px' }}>
              💡 Productivity Tip
            </p>
            <p style={{ fontSize: '12px', color: '#1C2526' }}>{randomTip}</p>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setView('login')}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '12px',
                fontWeight: '600',
                background: view === 'login' ? '#115E59' : '#E5E7EB',
                color: view === 'login' ? '#FFF' : '#1C2526',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >Login</button>
            <button
              onClick={() => setView('register')}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '12px',
                fontWeight: '600',
                background: view === 'register' ? '#115E59' : '#E5E7EB',
                color: view === 'register' ? '#FFF' : '#1C2526',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >Register</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {view === 'register' && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{
                  padding: '8px',
                  fontSize: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                }}
                required
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                padding: '8px',
                fontSize: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
              }}
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                padding: '8px',
                fontSize: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
              }}
              required
            />
            <button onClick={handleSubmit} style={{
              padding: '8px',
              background: '#115E59',
              color: '#FFF',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}>
              {view === 'login' ? 'Login' : 'Register'}
            </button>
            {error && <p style={{ color: '#EF4444', fontSize: '12px', textAlign: 'center' }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Popup />);