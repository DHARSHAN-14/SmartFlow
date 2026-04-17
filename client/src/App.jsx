import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksPage from './pages/TasksPage';
import TimelinePage from './pages/TimelinePage';
import InsightPage from './pages/InsightPage';
import AuthPage from './pages/AuthPage';
import { getTasks, getStreak, getInsights, getSuggest } from './api/tasks';

export default function App() {
  const { user, ready } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState(null);
  const [insights, setInsights] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [t, s, ins, sug] = await Promise.all([
        getTasks(), getStreak(), getInsights(), getSuggest(),
      ]);
      setTasks(t.data);
      setStreak(s.data);
      setInsights(ins.data);
      setSuggestion(sug.data);
    } catch (err) {
      console.warn('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-fetch whenever the logged-in user changes
  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  // ── Not ready yet (checking localStorage token) ──────────
  if (!ready) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#060b18', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#8892b0', fontSize: '0.875rem' }}>Loading SmartFlow…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Not logged in → show Auth page ───────────────────────
  if (!user) return <AuthPage />;

  // ── Loading user data ─────────────────────────────────────
  if (loading && tasks.length === 0) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#060b18', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#8892b0', fontSize: '0.875rem' }}>Loading your tasks…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const pages = {
    dashboard: <Dashboard tasks={tasks} streak={streak} insights={insights} suggestion={suggestion} refresh={fetchAll} />,
    tasks: <TasksPage tasks={tasks} refresh={fetchAll} />,
    timeline: <TimelinePage tasks={tasks} />,
    insights: <InsightPage insights={insights} tasks={tasks} />,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} streak={streak} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main style={{ flex: 1, overflowY: 'auto', transition: 'all 0.3s' }}>
        {pages[activeTab]}
      </main>
    </div>
  );
}
