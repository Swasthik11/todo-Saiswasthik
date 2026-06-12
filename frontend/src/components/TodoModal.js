import { useState, useEffect } from 'react';

export default function TodoModal({ todo, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate || '',
        tags: todo.tags ? todo.tags.join(', ') : ''
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    try {
      const data = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      await onSave(data);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-title">
          <span>{todo ? 'Edit Task' : 'New Task'}</span>
          <button onClick={onClose}>✕</button>
        </div>

        {error && <div style={{ color: 'var(--red)', marginBottom: 14, fontSize: '0.85rem' }}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            className="form-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add details (optional)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input filter-select" name="priority" value={form.priority} onChange={handleChange}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              className="form-input"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            className="form-input"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. work, personal, urgent"
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : (todo ? 'Save Changes' : 'Add Task')}
          </button>
        </div>
      </div>
    </div>
  );
}
