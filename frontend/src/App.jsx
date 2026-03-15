import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AdminUsers from './pages/AdminUsers';
import AdminTasks from './pages/AdminTasks';
import './index.css';

const AppRoutes = () => {
  const { toasts, toast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login toast={toast} />} />
        <Route path="/register" element={<Register toast={toast} />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks toast={toast} />} />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><AdminUsers toast={toast} /></ProtectedRoute>
          } />
          <Route path="/admin/tasks" element={
            <ProtectedRoute adminOnly><AdminTasks toast={toast} /></ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
