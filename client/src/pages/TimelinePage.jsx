import { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS, CATEGORY_COLORS } from '../utils/colors';

function groupByDate(tasks) {
  const groups = {};
  const noDate  = [];
  tasks.forEach(t => {
    if (t.dueDate) {
      const d = new Date(t.dueDate).toDateString();
      if (!groups[d]) groups[d] = [];
      groups[d].push(t);
    } else {
      noDate.push(t);
    }
  });
  const sorted = Object.entries(groups).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  if (noDate.length) sorted.push(['No Due Date', noDate]);
  return sorted;
}

function formatDate(dateStr) {
  if (dateStr === 'No Due Date') return { label: 'No Due Date', sub: 'Someday', past: false };
  const d    = new Date(dateStr);
  const now  = new Date();
  now.setHours(0,0,0,0);
  const diff = Math.round((d - now) / 86400000);
  let label;
  if (diff === 0) label = 'Today';
  else if (diff === 1) label = 'Tomorrow';
  else if (diff === -1) label = 'Yesterday';
  else label = d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  const sub  = d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  return { label, sub, past: diff < 0 };
}

export default function TimelinePage({ tasks }) {
  const groups = useMemo(() => groupByDate(tasks), [tasks]);

  return (
    <div style={{ padding:'28px 32px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>Timeline</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginTop:2 }}>Tasks organised by due date</p>
      </div>

      {groups.length === 0 && (
        <div className="card" style={{ padding:40, textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📅</div>
          <p style={{ color:'var(--text-muted)' }}>No tasks yet. Create some to see the timeline!</p>
        </div>
      )}

      <div style={{ position:'relative', paddingLeft:28 }}>
        {/* Vertical line */}
        <div style={{ position:'absolute', left:9, top:0, bottom:0, width:2, background:'linear-gradient(to bottom,#7c3aed,#06b6d4,transparent)', borderRadius:1 }} />

        {groups.map(([dateKey, dateTasks]) => {
          const { label, sub, past } = formatDate(dateKey);
          return (
            <div key={dateKey} style={{ marginBottom:32, position:'relative' }}>
              {/* Dot */}
              <div style={{ position:'absolute', left:-28+9-6, top:4, width:14, height:14, borderRadius:'50%',
                background: past && dateKey !== 'No Due Date' ? '#ef4444' : '#7c3aed',
                border:'2px solid var(--bg-primary)', boxShadow:`0 0 8px ${past && dateKey !== 'No Due Date' ? 'rgba(239,68,68,0.5)' : 'rgba(124,58,237,0.5)'}` }} />

              {/* Date header */}
              <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:12 }}>
                <span style={{ fontWeight:700, fontSize:'1rem', color: past && dateKey !== 'No Due Date' ? '#f87171' : 'var(--text-primary)' }}>{label}</span>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{sub}</span>
                <span style={{ marginLeft:'auto', fontSize:'0.75rem', color:'var(--text-muted)', background:'var(--bg-elevated)', padding:'2px 8px', borderRadius:20 }}>
                  {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Tasks */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {dateTasks.map(t => {
                  const pc = PRIORITY_COLORS[t.priority] || {};
                  const sc = STATUS_COLORS[t.status]     || {};
                  const cc = CATEGORY_COLORS[t.category] || {};
                  return (
                    <div key={t._id} className="card" style={{ padding:'12px 16px', borderLeft:`3px solid ${pc.bar || '#555'}`, display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text-primary)',
                          textDecoration: t.status === 'Completed' ? 'line-through' : 'none' }}>{t.title}</div>
                        <div style={{ display:'flex', gap:5, marginTop:5, flexWrap:'wrap' }}>
                          <span className="badge" style={{ background:cc.bg, color:cc.text }}>{t.category}</span>
                          <span className="badge" style={{ background:pc.bg, color:pc.text }}>{t.priority}</span>
                          <span className="badge" style={{ background:sc.bg, color:sc.text }}>{t.status}</span>
                        </div>
                      </div>
                      {t.status === 'Completed' && <span style={{ fontSize:'1.2rem' }}>✅</span>}
                      {past && dateKey !== 'No Due Date' && t.status !== 'Completed' && <span style={{ fontSize:'1.2rem' }}>⚠️</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
