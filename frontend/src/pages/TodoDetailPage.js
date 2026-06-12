import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchTodo, updateTodo, deleteTodo } from '../api';
import './TodoDetailPage.css';

const PRIORITY_COLOR = { low: '#3DD68C', medium: '#FFD166', high: '#FF5C5C' };
const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

export default function TodoDetailPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) { setError('No todo ID provided.'); setLoading(false); return; }
    fetchTodo(id)
      .then(data => { setTodo(data); setForm({ ...data, tags: data.tags?.join(', ') || '', dueDate: data.dueDate || '' }); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggle() {
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    setTodo(updated);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const updated = await updateTodo(todo.id, { ...form, tags, dueDate: form.dueDate || null });
      setTodo(updated);
      setForm({ ...updated, tags: updated.tags?.join(', ') || '', dueDate: updated.dueDate || '' });
      setEditing(false);
    } catch (e) {
      alert('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this task permanently?')) return;
    await deleteTodo(todo.id);
    navigate('/');
  }

  if (loading) return <div className="detail-center"><div className="spinner" /></div>;
  if (error || !todo) return (
    <div className="detail-center">
      <p className="detail-error">{error || 'Todo not found.'}</p>
      <button className="back-btn" onClick={() => navigate('/')}>← Back to tasks</button>
    </div>
  );

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <nav className="detail-nav">
          <button className="back-btn" onClick={() => navigate('/')}>← All tasks</button>
          <div className="nav-actions">
            {!editing && <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>}
            <button className="del-btn" onClick={handleDelete}>Delete</button>
          </div>
        </nav>

        <div className="detail-card">
          {editing ? (
            <div className="edit-form">
              <h2 className="section-label">Editing task</h2>
              <div className="ef-row">
                <label className="ef-label">Title</label>
                <input className="ef-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="ef-row">
                <label className="ef-label">Description</label>
                <textarea className="ef-input ef-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} />
              </div>
              <div className="ef-grid">
                <div className="ef-row">
                  <label className="ef-label">Priority</label>
                  <select className="ef-input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="ef-row">
                  <label className="ef-label">Due date</label>
                  <input type="date" className="ef-input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
              <div className="ef-row">
                <label className="ef-label">Tags (comma-separated)</label>
                <input className="ef-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="work, personal..." />
              </div>
              <div className="ef-actions">
                <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
                <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="detail-header">
                <button className={`big-check ${todo.completed ? 'done' : ''}`} onClick={handleToggle} title="Toggle complete">
                  {todo.completed ? '✓' : ''}
                </button>
                <div>
                  <h1 className={`detail-title ${todo.completed ? 'struck' : ''}`}>{todo.title}</h1>
                  <div className="detail-status">{todo.completed ? '✓ Completed' : '○ In progress'}</div>
                </div>
              </div>

              {todo.description && (
                <div className="detail-section">
                  <div className="section-label">Description</div>
                  <p className="detail-desc">{todo.description}</p>
                </div>
              )}

              <div className="detail-meta-grid">
                <div className="meta-block">
                  <div className="meta-key">Priority</div>
                  <div className="meta-val" style={{ color: PRIORITY_COLOR[todo.priority] }}>
                    ● {PRIORITY_LABEL[todo.priority]}
                  </div>
                </div>
                <div className="meta-block">
                  <div className="meta-key">Due date</div>
                  <div className={`meta-val ${isOverdue ? 'overdue' : ''}`}>
                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No due date'}
                    {isOverdue && <span className="overdue-tag"> Overdue</span>}
                  </div>
                </div>
                <div className="meta-block">
                  <div className="meta-key">Created</div>
                  <div className="meta-val">{new Date(todo.createdAt).toLocaleString()}</div>
                </div>
                <div className="meta-block">
                  <div className="meta-key">Last updated</div>
                  <div className="meta-val">{new Date(todo.updatedAt).toLocaleString()}</div>
                </div>
                <div className="meta-block">
                  <div className="meta-key">Task ID</div>
                  <div className="meta-val meta-id">{todo.id}</div>
                </div>
              </div>

              {todo.tags?.length > 0 && (
                <div className="detail-section">
                  <div className="section-label">Tags</div>
                  <div className="tags-list">
                    {todo.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
