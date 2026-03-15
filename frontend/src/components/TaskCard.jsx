const statusClass = { pending: 'pill-pending', 'in-progress': 'pill-in-progress', completed: 'pill-completed' };
const priorityClass = { low: 'pill-low', medium: 'pill-medium', high: 'pill-high' };

const TaskCard = ({ task, onEdit, onDelete, showOwner = false }) => {
  const due = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="task-card">
      <div className="task-header">
        <span className="task-title">{task.title}</span>
        <div className="task-actions">
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(task)} title="Edit">✎</button>
          <button className="btn btn-danger btn-icon btn-sm" onClick={() => onDelete(task._id)} title="Delete">✕</button>
        </div>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-meta">
        <span className={`pill ${statusClass[task.status]}`}>{task.status}</span>
        <span className={`pill ${priorityClass[task.priority]}`}>{task.priority}</span>
        {due && (
          <span style={{ fontSize: 11, color: isOverdue ? 'var(--red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {isOverdue ? '⚠ ' : ''}Due {due}
          </span>
        )}
        {showOwner && task.owner && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            ◎ {task.owner.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
