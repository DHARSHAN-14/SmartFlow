import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Zap, Menu, X, Flame, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export default function Sidebar({ activeTab, setActiveTab, streak, open, setOpen }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, display: 'none' }} onClick={() => setOpen(false)} />}

      <aside style={{
        width: open ? 240 : 68,
        minWidth: open ? 240 : 68,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 10px',
        transition: 'width 0.3s, min-width 0.3s',
        overflow: 'hidden',
        zIndex: 50,
      }}>
        {/* Logo + Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingLeft: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            {open && <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>SmartFlow</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>TASK INTELLIGENCE</div>
            </div>}
          </div>
          <button className="btn-ghost" style={{ padding: '6px', border: 'none', background: 'transparent' }} onClick={() => setOpen(o => !o)}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${activeTab === id ? 'active' : ''}`}
              style={{ justifyContent: open ? 'flex-start' : 'center', padding: open ? '10px 14px' : '10px', border: '1px solid transparent' }}
              onClick={() => setActiveTab(id)} title={!open ? label : ''}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {open && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Streak badge */}
        {streak && (
          <div style={{
            marginTop: 16,
            padding: open ? '12px 14px' : '10px',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: open ? 'flex-start' : 'center',
          }}>
            <Flame size={18} color="#f59e0b" />
            {open && <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f59e0b' }}>{streak.currentStreak} Day Streak</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best: {streak.longestStreak} days</div>
            </div>}
          </div>
        )}

        {/* User info + Logout */}
        <div style={{
          marginTop: 12,
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: open ? 'space-between' : 'center',
        }}>
          {open && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={14} color="#fff" />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 110 }}>{user?.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 110 }}>{user?.email}</div>
              </div>
            </div>
          )}
          <button
            id="btn-logout"
            title="Logout"
            onClick={logout}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Footer */}
        {open && <div style={{ marginTop: 10, padding: '0 4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          SmartFlow v1.0.0
        </div>}
      </aside>
    </>
  );
}
