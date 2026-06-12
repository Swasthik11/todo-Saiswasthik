import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api';
import './TodosPage.css';

const PRIORITIES = ['low', 'medium', 'high'];
const PRIORITY_COLOR = { low: '#3DD68C', medium: '#FFD166', high: '#FF5C5C' };
const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

function priorityOrder(p) { return { high: 0, medium: 1, low: 2 }[p] ?? 1; }

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadTodos(); }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (e) {
      setError('Could not load todos. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const created = await createTodo({ ...form, tags, dueDate: form.dueDate || null });
      setTodos(prev => [...prev, created]);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' });
      setShowForm(false);
    } catch (e) {
      alert('Failed to create todo: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleComplete(todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!window.confirm('Delete this todo?')) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  }

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tags?.some(tag => tag.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') return priorityOrder(a.priority) - priorityOrder(b.priority);
      if (sortBy === 'due') return (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1;
      return 0;
    });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    done: todos.filter(t => t.completed).length
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">✦</span>
            <span className="brand-name">Taskly</span>
          </div>
          <div className="stats-bar">
            <span className="stat"><b>{stats.active}</b> active</span>
            <span className="stat-div">·</span>
            <span className="stat"><b>{stats.done}</b> done</span>
            <span className="stat-div">·</span>
            <span className="stat"><b>{stats.total}</b> total</span>
          </div>
          <button className="btn-new" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-wrap">
          <form className="todo-form" onSubmit={handleCreate}>
            <h2 className="form-title">New task</h2>
            <div className="form-row">
              <input
                className="form-input"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div className="form-row">
              <textarea
                className="form-input form-textarea"
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Priority</label>
                <select
                  className="form-input form-select"
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Due date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
              <div className="form-field form-field-wide">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  className="form-input"
                  placeholder="work, personal, urgent..."
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                />
              </div>
            </div>
            <button className="btn-submit" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create task'}
            </button>
          </form>
        </div>
      )}

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="filter-group">
          {['all', 'active', 'completed'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">By priority</option>
          <option value="due">By due date</option>
        </select>
      </div>

      <main className="main">
        {loading && <div className="state-msg">Loading tasks...</div>}
        {error && <div className="state-msg error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <p>{searchQuery ? 'No tasks match your search.' : filter === 'completed' ? 'No completed tasks yet.' : filter === 'active' ? 'No active tasks — you\'re all caught up!' : 'No tasks yet. Create your first one!'}</p>
          </div>
        )}
        <div className="todo-list">
          {filtered.map(todo => (
            <div
              key={todo.id}
              className={`todo-card ${todo.completed ? 'completed' : ''}`}
              onClick={() => navigate(`/todo?id=${todo.id}`)}
            >
              <button
                className={`check-btn ${todo.completed ? 'checked' : ''}`}
                onClick={e => { e.stopPropagation(); toggleComplete(todo); }}
                title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {todo.completed ? '✓' : ''}
              </button>
              <div className="todo-body">
                <div className="todo-title">{todo.title}</div>
                {todo.description && <div className="todo-desc">{todo.description}</div>}
                <div className="todo-meta">
                  <span className="priority-badge" style={{ color: PRIORITY_COLOR[todo.priority] }}>
                    ● {PRIORITY_LABEL[todo.priority]}
                  </span>
                  {todo.dueDate && (
                    <span className={`due-badge ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'overdue' : ''}`}>
                      📅 {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {todo.tags?.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="todo-actions">
                <span className="view-hint">View →</span>
                <button className="delete-btn" onClick={e => handleDelete(todo.id, e)} title="Delete">✕</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
