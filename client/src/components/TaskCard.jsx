import { useState } from 'react';
import { Trash2, Edit3, ChevronDown, ChevronUp, Star, StarOff, Calendar, StickyNote } from 'lucide-react';
import TaskForm from './TaskForm';
import { updateTask, deleteTask } from '../api/tasks';
import { PRIORITY_COLORS, CATEGORY_COLORS, ENERGY_COLORS, STATUS_COLORS } from '../utils/colors';

const STATUS_NEXT = { 'Pending': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Pending' };
const STATUS_LABEL = { 'Pending': 'Start', 'In Progress': 'Complete', 'Completed': 'Reopen' };

export default function TaskCard({ task, onRefresh, compact = false }) {
  const [expanded,  setExpanded]  = useState(false);
  const [showEdit,  setShowEdit]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  const pc = PRIORITY_COLORS[task.priority] || {};
  const cc = CATEGORY_COLORS[task.category] || {};
  const ec = ENERGY_COLORS[task.energyLevel] || {};
  const sc = STATUS_COLORS[task.status]      || {};

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  async function changeStatus() {
    setLoading(true);
    await updateTask(task._id, { status: STATUS_NEXT[task.status] }).catch(console.warn);
    onRefresh();
    setLoading(false);
  }

  async function toggleFocus() {
    await updateTask(task._id, { isFocusTask: !task.isFocusTask }).catch(console.warn);
    onRefresh();
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return;
    await deleteTask(task._id).catch(console.warn);
    onRefresh();
  }

  async function handleEdit(data) {
    await updateTask(task._id, data).catch(console.warn);
    setShowEdit(false);
    onRefresh();
  }

  const priorityBar = pc.bar || '#555';

  return (
    <>
      <div className="card" style={{
        padding: compact ? '14px 16px' : '16px 18px',
        position:'relative',
        borderLeft: `3px solid ${priorityBar}`,
        opacity: task.status === 'Completed' ? 0.65 : 1,
        transition: 'all 0.2s',
      }}>
        {/* Top row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6, flexWrap:'wrap' }}>
              <span className="badge" style={{ background:cc.bg, color:cc.text }}>{task.category}</span>
              <span className="badge" style={{ background:sc.bg, color:sc.text }}>{task.status}</span>
              {task.isFocusTask && <span className="badge" style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b' }}>★ Focus</span>}
              {isOverdue && <span className="badge" style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444' }}>Overdue</span>}
            </div>

            <div style={{ fontSize: compact ? '0.875rem' : '0.95rem', fontWeight:600, color:'var(--text-primary)', lineHeight:1.4,
              textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
              {task.title}
            </div>

            {task.description && !compact && (
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:4 }}>{task.description}</div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:4, flexShrink:0 }}>
            <button className="btn-ghost" style={{ padding:6 }} onClick={toggleFocus} title={task.isFocusTask ? 'Remove focus' : 'Set as focus'}>
              {task.isFocusTask ? <Star size={14} color="#f59e0b" fill="#f59e0b" /> : <StarOff size={14} />}
            </button>
            <button className="btn-ghost" style={{ padding:6 }} onClick={() => setShowEdit(true)} title="Edit">
              <Edit3 size={14} />
            </button>
            <button className="btn-ghost" style={{ padding:6, color:'#ef4444' }} onClick={handleDelete} title="Delete">
              <Trash2 size={14} />
            </button>
            {!compact && (
              <button className="btn-ghost" style={{ padding:6 }} onClick={() => setExpanded(e => !e)}>
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Bottom row: badges + due date */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, flexWrap:'wrap', gap:6 }}>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            <span className="badge" style={{ background:pc.bg, color:pc.text }}>● {task.priority}</span>
            <span className="badge" style={{ background:ec.bg, color:ec.text }}>⚡ {task.energyLevel?.replace(' Energy','')}</span>
          </div>
          {task.dueDate && (
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.75rem', color: isOverdue ? '#ef4444' : 'var(--text-muted)' }}>
              <Calendar size={11} />
              {new Date(task.dueDate).toLocaleDateString('en-US',{ month:'short', day:'numeric' })}
            </div>
          )}
        </div>

        {/* Expand: note + status btn */}
        {(expanded && !compact) && (
          <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid var(--border)', animation:'fadeIn 0.2s ease' }}>
            {task.note && (
              <div style={{ display:'flex', gap:8, padding:'8px 10px', background:'var(--bg-elevated)', borderRadius:8, marginBottom:10 }}>
                <StickyNote size={14} color="var(--text-muted)" style={{ flexShrink:0, marginTop:1 }} />
                <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{task.note}</span>
              </div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                Created {new Date(task.createdAt).toLocaleDateString()}
              </span>
              <button className="btn-primary" style={{ padding:'6px 14px', fontSize:'0.78rem' }}
                onClick={changeStatus} disabled={loading}>
                {loading ? '…' : STATUS_LABEL[task.status]}
              </button>
            </div>
          </div>
        )}

        {/* Compact: quick status change */}
        {compact && (
          <div style={{ marginTop:10 }}>
            <button className="btn-ghost" style={{ fontSize:'0.75rem', padding:'4px 10px' }}
              onClick={changeStatus} disabled={loading}>
              {loading ? '…' : `→ ${STATUS_NEXT[task.status]}`}
            </button>
          </div>
        )}
      </div>

      {showEdit && <TaskForm task={task} onClose={() => setShowEdit(false)} onSave={handleEdit} />}
    </>
  );
}
