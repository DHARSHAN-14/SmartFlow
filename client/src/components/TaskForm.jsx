import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const CATEGORIES   = ['auto', 'Work', 'Study', 'Personal', 'Urgent'];
const PRIORITIES   = ['Low', 'Medium', 'High'];
const STATUSES     = ['Pending', 'In Progress', 'Completed'];
const ENERGY_LEVELS = ['Low Energy', 'Medium Energy', 'High Energy'];

export default function TaskForm({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    title:       task?.title       || '',
    description: task?.description || '',
    note:        task?.note        || '',
    category:    task?.category    || 'auto',
    priority:    task?.priority    || 'Medium',
    status:      task?.status      || 'Pending',
    energyLevel: task?.energyLevel || 'Medium Energy',
    dueDate:     task?.dueDate     ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    isFocusTask: task?.isFocusTask || false,
  });

  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { ...form, dueDate: form.dueDate || null };
    await onSave(payload);
    setSaving(false);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div style={{ padding:'20px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Sparkles size={18} color="#a78bfa" />
            <h2 style={{ fontSize:'1rem', fontWeight:700 }}>{task ? 'Edit Task' : 'Create New Task'}</h2>
          </div>
          <button className="btn-ghost" style={{ padding:6 }} onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding:'20px 24px 24px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Title */}
          <div>
            <label>Task Title *</label>
            <input style={{ marginTop:6 }} value={form.title} onChange={e => upd('title', e.target.value)}
              placeholder="What needs to be done?" required />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea style={{ marginTop:6, resize:'vertical', minHeight:70 }} value={form.description}
              onChange={e => upd('description', e.target.value)} placeholder="Optional details…" />
          </div>

          {/* 2-col grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label>Category</label>
              <select style={{ marginTop:6 }} value={form.category} onChange={e => upd('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c === 'auto' ? '🤖 Auto-detect' : c}</option>)}
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select style={{ marginTop:6 }} value={form.priority} onChange={e => upd('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select style={{ marginTop:6 }} value={form.status} onChange={e => upd('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label>Energy Level</label>
              <select style={{ marginTop:6 }} value={form.energyLevel} onChange={e => upd('energyLevel', e.target.value)}>
                {ENERGY_LEVELS.map(el => <option key={el}>{el}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label>Due Date</label>
            <input type="date" style={{ marginTop:6 }} value={form.dueDate} onChange={e => upd('dueDate', e.target.value)} />
          </div>

          {/* Note */}
          <div>
            <label>Micro Journal / Note</label>
            <textarea style={{ marginTop:6, resize:'vertical', minHeight:60 }} value={form.note}
              onChange={e => upd('note', e.target.value)} placeholder="Add a quick note or thought…" />
          </div>

          {/* Focus toggle */}
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', textTransform:'none', letterSpacing:'normal', fontSize:'0.875rem', fontWeight:500, color:'var(--text-primary)' }}>
            <input type="checkbox" style={{ width:16, height:16 }} checked={form.isFocusTask}
              onChange={e => upd('isFocusTask', e.target.checked)} />
            ⭐ Mark as Focus Task (appears in Daily Focus)
          </label>

          {/* Actions */}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:4 }}>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
