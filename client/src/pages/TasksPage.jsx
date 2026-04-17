import { useState, useMemo } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import TaskCard  from '../components/TaskCard';
import TaskForm  from '../components/TaskForm';
import { createTask } from '../api/tasks';

const ALL = 'All';

export default function TasksPage({ tasks, refresh }) {
  const [showForm,   setShowForm]   = useState(false);
  const [search,     setSearch]     = useState('');
  const [filterStatus,   setFS]     = useState(ALL);
  const [filterCat,      setFC]     = useState(ALL);
  const [filterPri,      setFP]     = useState(ALL);
  const [filterEnergy,   setFE]     = useState(ALL);
  const [sortBy,         setSort]   = useState('newest');

  const statuses    = [ALL, 'Pending', 'In Progress', 'Completed'];
  const categories  = [ALL, 'Work', 'Study', 'Personal', 'Urgent'];
  const priorities  = [ALL, 'High', 'Medium', 'Low'];
  const energies    = [ALL, 'High Energy', 'Medium Energy', 'Low Energy'];

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search)              list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== ALL) list = list.filter(t => t.status      === filterStatus);
    if (filterCat    !== ALL) list = list.filter(t => t.category    === filterCat);
    if (filterPri    !== ALL) list = list.filter(t => t.priority    === filterPri);
    if (filterEnergy !== ALL) list = list.filter(t => t.energyLevel === filterEnergy);
    if (sortBy === 'newest')    list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'oldest')    list.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === 'dueDate')   list.sort((a,b) => (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity));
    if (sortBy === 'priority') {
      const W = { High:3, Medium:2, Low:1 };
      list.sort((a,b) => (W[b.priority]||0) - (W[a.priority]||0));
    }
    return list;
  }, [tasks, search, filterStatus, filterCat, filterPri, filterEnergy, sortBy]);

  async function handleCreate(data) {
    await createTask(data).catch(console.warn);
    setShowForm(false);
    refresh();
  }

  const selStyle = { padding:'6px 10px', fontSize:'0.78rem', minWidth:0 };

  return (
    <div style={{ padding:'28px 32px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>All Tasks</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginTop:2 }}>{filtered.length} of {tasks.length} tasks</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> New Task</button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding:'14px 16px', marginBottom:20, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:'1 1 180px' }}>
          <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input style={{ paddingLeft:32 }} placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={selStyle} value={filterStatus} onChange={e => setFS(e.target.value)}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select style={selStyle} value={filterCat} onChange={e => setFC(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select style={selStyle} value={filterPri} onChange={e => setFP(e.target.value)}>
          {priorities.map(p => <option key={p}>{p}</option>)}
        </select>
        <select style={selStyle} value={filterEnergy} onChange={e => setFE(e.target.value)}>
          {energies.map(e => <option key={e}>{e}</option>)}
        </select>
        <select style={selStyle} value={sortBy} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Task Grid */}
      {filtered.length > 0 ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
          {filtered.map(t => <TaskCard key={t._id} task={t} onRefresh={refresh} />)}
        </div>
      ) : (
        <div className="card" style={{ padding:40, textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🔍</div>
          <p style={{ color:'var(--text-muted)' }}>No tasks match your filters.</p>
        </div>
      )}

      {showForm && <TaskForm onClose={() => setShowForm(false)} onSave={handleCreate} />}
    </div>
  );
}
