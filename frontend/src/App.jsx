import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Companies from './pages/Companies';
import Applications from './pages/Applications';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import { useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/student-dashboard'} replace />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const { user } = useAuth();

  if (isAuthPage) {
    if (user) {
      return <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/student-dashboard'} replace />;
    }
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute allowedRoles={['ADMIN']}><Students /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute allowedRoles={['ADMIN']}><Companies /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute allowedRoles={['ADMIN']}><Applications /></ProtectedRoute>} />
        
        {/* Student Routes */}
        <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
        
        {/* Shared Routes */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><Notifications /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
