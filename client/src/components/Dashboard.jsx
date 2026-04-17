import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Zap, Target, TrendingUp, AlertCircle, Brain, Star } from 'lucide-react';
import TaskCard   from './TaskCard';
import TaskForm   from './TaskForm';
import { updateTask, deleteTask, createTask } from '../api/tasks';
import { PRIORITY_COLORS, CATEGORY_COLORS, ENERGY_COLORS } from '../utils/colors';

export default function Dashboard({ tasks, streak, insights, suggestion, refresh }) {
  const [showForm, setShowForm] = useState(false);

  const focusTasks    = tasks.filter(t => t.isFocusTask && t.status !== 'Completed').slice(0, 3);
  const recentTasks   = tasks.filter(t => t.status !== 'Completed').slice(0, 4);
  const pct           = insights?.productivity ?? 0;

  const stats = [
    { label:'Total Tasks',    value: insights?.total      ?? 0, icon: Target,       color:'#a78bfa', bg:'rgba(124,58,237,0.15)' },
    { label:'Completed',      value: insights?.completed  ?? 0, icon: CheckCircle2, color:'#10b981', bg:'rgba(16,185,129,0.15)' },
    { label:'In Progress',    value: insights?.inProgress ?? 0, icon: Clock,        color:'#06b6d4', bg:'rgba(6,182,212,0.15)' },
    { label:'Overdue',        value: insights?.overdue    ?? 0, icon: AlertCircle,  color:'#ef4444', bg:'rgba(239,68,68,0.15)' },
  ];

  async function handleCreate(data) {
    await createTask(data);
    setShowForm(false);
    refresh();
  }

  return (
    <div style={{ padding:'28px 32px', maxWidth:1200 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>
            Good day! 👋
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>
            Here's your productivity overview
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <span style={{ fontSize:'1.1rem' }}>+</span> New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize:'1.75rem', fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Productivity Bar */}
      <div className="card" style={{ padding:'20px 24px', marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <TrendingUp size={18} color="#7c3aed" />
            <span style={{ fontWeight:600, fontSize:'0.9rem' }}>Overall Productivity</span>
          </div>
          <span style={{ fontWeight:800, fontSize:'1.4rem', color: pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444' }}>
            {pct}%
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width:`${pct}%`, background: pct >= 70 ? 'linear-gradient(90deg,#10b981,#059669)' : pct >= 40 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#ef4444,#dc2626)' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:'0.75rem', color:'var(--text-muted)' }}>
          <span>{insights?.completed ?? 0} completed</span>
          <span>{(insights?.total ?? 0) - (insights?.completed ?? 0)} remaining</span>
        </div>
      </div>

      {/* 2-col grid: Suggestion + Focus */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>

        {/* Smart Suggestion */}
        <div className="card" style={{ padding:'20px 22px', border:'1px solid rgba(124,58,237,0.3)', background:'rgba(124,58,237,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <Brain size={18} color="#a78bfa" />
            <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#a78bfa' }}>Smart Suggestion</span>
          </div>
          {suggestion ? (
            <>
              <div style={{ fontSize:'0.95rem', fontWeight:600, marginBottom:10, color:'var(--text-primary)', lineHeight:1.4 }}>
                {suggestion.title}
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                <span className="badge" style={{ background: PRIORITY_COLORS[suggestion.priority]?.bg, color: PRIORITY_COLORS[suggestion.priority]?.text }}>
                  {suggestion.priority}
                </span>
                <span className="badge" style={{ background: CATEGORY_COLORS[suggestion.category]?.bg, color: CATEGORY_COLORS[suggestion.category]?.text }}>
                  {suggestion.category}
                </span>
                <span className="badge" style={{ background: ENERGY_COLORS[suggestion.energyLevel]?.bg, color: ENERGY_COLORS[suggestion.energyLevel]?.text }}>
                  ⚡ {suggestion.energyLevel}
                </span>
              </div>
              <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                Recommended based on priority, due date & energy level.
              </p>
            </>
          ) : (
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>No pending tasks – great job! 🎉</p>
          )}
        </div>

        {/* Focus Tasks */}
        <div className="card" style={{ padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <Star size={18} color="#f59e0b" />
            <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#f59e0b' }}>Daily Focus (Top 3)</span>
          </div>
          {focusTasks.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {focusTasks.map((t, i) => (
                <div key={t._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'var(--bg-elevated)', borderRadius:8 }}>
                  <span style={{ width:22, height:22, borderRadius:'50%', background:'rgba(245,158,11,0.2)', color:'#f59e0b', fontSize:'0.75rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
                  <span style={{ fontSize:'0.84rem', flex:1, color:'var(--text-primary)' }}>{t.title}</span>
                  <span className="badge" style={{ background: PRIORITY_COLORS[t.priority]?.bg, color: PRIORITY_COLORS[t.priority]?.text }}>{t.priority}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Mark tasks as focus to see them here.</p>
          )}
        </div>
      </div>

      {/* Recent Active Tasks */}
      <div>
        <h2 style={{ fontSize:'1rem', fontWeight:700, marginBottom:14, color:'var(--text-primary)' }}>Active Tasks</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
          {recentTasks.map(task => (
            <TaskCard key={task._id} task={task} onRefresh={refresh} compact />
          ))}
          {recentTasks.length === 0 && (
            <div className="card" style={{ padding:24, textAlign:'center', color:'var(--text-muted)', gridColumn:'1/-1' }}>
              No active tasks. Add one to get started! 🚀
            </div>
          )}
        </div>
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} onSave={handleCreate} />}
    </div>
  );
}
