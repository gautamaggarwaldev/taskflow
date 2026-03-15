import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">T</div>
        <span className="logo-text">TaskFlow</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Menu</span>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⊞</span>
          Dashboard
        </NavLink>

        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">✓</span>
          My Tasks
        </NavLink>

        {user?.role === 'admin' && (
          <>
            <span className="nav-label">Admin</span>
            <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">◎</span>
              Users
            </NavLink>
            <NavLink to="/admin/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">≡</span>
              All Tasks
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip" style={{ marginBottom: 10 }}>
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <span className={`badge badge-${user?.role}`}>{user?.role}</span>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
          ↪ Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
