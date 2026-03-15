import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const AdminTasks = ({ toast }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 9;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const res = await tasksAPI.getAll(params);
      setTasks(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleFilterChange = (e) => {
    setFilters(p => ({ ...p, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const handleSubmit = async (data) => {
    if (!editTask?._id) return;
    setSaving(true);
    try {
      await tasksAPI.update(editTask._id, data);
      toast.success('Task updated');
      setModalOpen(false);
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div>
      <div className="filter-bar">
        <select name="status" value={filters.status} onChange={handleFilterChange} className="form-input form-select" style={{ width: 160 }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="form-input form-select" style={{ width: 160 }}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          {total} total task{total !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }}></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No tasks found</div>
          <div className="empty-text">No tasks match the selected filters</div>
        </div>
      ) : (
        <>
          <div className="card-grid">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} showOwner />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <TaskModal task={editTask} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} loading={saving} />
      )}
    </div>
  );
};

export default AdminTasks;
