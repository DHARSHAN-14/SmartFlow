import { TrendingUp, PieChart, BarChart2, Award, Zap } from 'lucide-react';

function BarRow({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-primary)' }}>{value}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width:`${pct}%`, background:color }} />
      </div>
    </div>
  );
}

export default function InsightPage({ insights, tasks }) {
  if (!insights) return <div style={{ padding:40, color:'var(--text-muted)', textAlign:'center' }}>Loading insights…</div>;

  const { total, completed, inProgress, pending, overdue, productivity, byCategory, byPriority, byEnergy } = insights;

  const catColors   = { Work:'#60a5fa', Study:'#a78bfa', Personal:'#f472b6', Urgent:'#f87171' };
  const priColors   = { High:'#f87171', Medium:'#fbbf24', Low:'#34d399' };
  const enerColors  = { 'High Energy':'#f87171', 'Medium Energy':'#fbbf24', 'Low Energy':'#34d399' };

  const maxCat  = Math.max(...Object.values(byCategory || {}), 1);
  const maxPri  = Math.max(...Object.values(byPriority || {}), 1);
  const maxEner = Math.max(...Object.values(byEnergy   || {}), 1);

  // Completion rate for status cards
  const cards = [
    { label:'Productivity Score', value:`${productivity}%`, icon:TrendingUp, color:'#a78bfa', desc:'Tasks completed vs total' },
    { label:'Total Tasks',        value:total,              icon:BarChart2,  color:'#60a5fa', desc:'All tasks in system' },
    { label:'Completed',          value:completed,          icon:Award,      color:'#34d399', desc:'Successfully finished' },
    { label:'Overdue',            value:overdue,            icon:Zap,        color:'#f87171', desc:'Past due date' },
  ];

  // Recent completions (last 7 days, simulated)
  const recentDone = tasks.filter(t => t.completedAt && (Date.now() - new Date(t.completedAt)) < 7*86400000);

  return (
    <div style={{ padding:'28px 32px', maxWidth:1100 }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>Productivity Insights</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginTop:2 }}>Understand your task patterns & performance</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:24 }}>
        {cards.map(c => (
          <div key={c.label} className="card" style={{ padding:'20px 22px', display:'flex', gap:16, alignItems:'center' }}>
            <div style={{ width:48, height:48, borderRadius:12, background:`${c.color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <c.icon size={22} color={c.color} />
            </div>
            <div>
              <div style={{ fontSize:'1.6rem', fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
              <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)', marginTop:2 }}>{c.label}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bars grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>

        {/* By Category */}
        <div className="card" style={{ padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <PieChart size={16} color="#60a5fa" />
            <span style={{ fontWeight:700, fontSize:'0.9rem' }}>By Category</span>
          </div>
          {Object.entries(byCategory || {}).map(([k, v]) => (
            <BarRow key={k} label={k} value={v} max={maxCat} color={catColors[k] || '#888'} />
          ))}
          {!Object.keys(byCategory || {}).length && <p style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>No data yet.</p>}
        </div>

        {/* By Priority */}
        <div className="card" style={{ padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <BarChart2 size={16} color="#fbbf24" />
            <span style={{ fontWeight:700, fontSize:'0.9rem' }}>By Priority</span>
          </div>
          {Object.entries(byPriority || {}).map(([k, v]) => (
            <BarRow key={k} label={k} value={v} max={maxPri} color={priColors[k] || '#888'} />
          ))}
        </div>

        {/* By Energy */}
        <div className="card" style={{ padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <Zap size={16} color="#34d399" />
            <span style={{ fontWeight:700, fontSize:'0.9rem' }}>By Energy Level</span>
          </div>
          {Object.entries(byEnergy || {}).map(([k, v]) => (
            <BarRow key={k} label={k} value={v} max={maxEner} color={enerColors[k] || '#888'} />
          ))}
        </div>

        {/* Status breakdown */}
        <div className="card" style={{ padding:'20px 22px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <TrendingUp size={16} color="#a78bfa" />
            <span style={{ fontWeight:700, fontSize:'0.9rem' }}>Status Breakdown</span>
          </div>
          <BarRow label="Pending"     value={pending}    max={total} color="#9ca3af" />
          <BarRow label="In Progress" value={inProgress} max={total} color="#22d3ee" />
          <BarRow label="Completed"   value={completed}  max={total} color="#34d399" />
          <div style={{ marginTop:14, padding:'10px 12px', background:'rgba(16,185,129,0.08)', borderRadius:8, border:'1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:2 }}>Completion Rate</div>
            <div style={{ fontSize:'1.4rem', fontWeight:800, color:'#34d399' }}>{productivity}%</div>
          </div>
        </div>

      </div>

      {/* Recently completed */}
      {recentDone.length > 0 && (
        <div className="card" style={{ padding:'20px 22px', marginTop:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <Award size={16} color="#f59e0b" />
            <span style={{ fontWeight:700, fontSize:'0.9rem' }}>Completed This Week 🎉</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {recentDone.slice(0,5).map(t => (
              <div key={t._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'var(--bg-elevated)', borderRadius:8 }}>
                <span style={{ fontSize:'1rem' }}>✅</span>
                <span style={{ flex:1, fontSize:'0.85rem', color:'var(--text-primary)' }}>{t.title}</span>
                <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>
                  {new Date(t.completedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
