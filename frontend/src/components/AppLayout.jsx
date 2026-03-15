import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'My Tasks',
  '/admin/users': 'User Management',
  '/admin/tasks': 'All Tasks'
};

const AppLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'TaskFlow';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <span className="page-title">{title}</span>
        </header>
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
