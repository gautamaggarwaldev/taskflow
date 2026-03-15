import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, high: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await tasksAPI.getAll({ limit: 100 });
        const tasks = res.data.data;
        setStats({
          total: res.data.total,
          pending: tasks.filter(t => t.status === 'pending').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          high: tasks.filter(t => t.priority === 'high').length
        });
        setRecent(tasks.slice(0, 5));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const statusClass = { pending: 'pill-pending', 'in-progress': 'pill-in-progress', completed: 'pill-completed' };
  const priorityClass = { low: 'pill-low', medium: 'pill-medium', high: 'pill-high' };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }}></div>
    </div>
  );

  const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Here's a summary of your task progress.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Tasks', value: stats.total, color: 'var(--accent)' },
          { label: 'Pending', value: stats.pending, color: 'var(--yellow)' },
          { label: 'In Progress', value: stats.inProgress, color: 'var(--accent)' },
          { label: 'Completed', value: stats.completed, color: 'var(--green)' },
          { label: 'High Priority', value: stats.high, color: 'var(--red)' }
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Overall Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{pct}%</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>completed</span>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--green)', borderRadius: 4, transition: 'width 0.6s ease' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <span>{stats.completed} done</span>
            <span>{stats.total - stats.completed} remaining</span>
          </div>
        </div>

        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Breakdown</span>
          </div>
          {[
            { label: 'Pending', val: stats.pending, cls: 'pill-pending' },
            { label: 'In Progress', val: stats.inProgress, cls: 'pill-in-progress' },
            { label: 'Completed', val: stats.completed, cls: 'pill-completed' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className={`pill ${item.cls}`}>{item.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15 }}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Recent Tasks</span>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 20px' }}>
            <div className="empty-icon">✓</div>
            <div className="empty-title">No tasks yet</div>
            <div className="empty-text">Go to My Tasks to create your first task</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td><span className={`pill ${statusClass[t.status]}`}>{t.status}</span></td>
                    <td><span className={`pill ${priorityClass[t.priority]}`}>{t.priority}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

export default Dashboard;
