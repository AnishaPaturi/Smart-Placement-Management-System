import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Companies from './pages/Companies';
import Applications from './pages/Applications';
import Drives from './pages/Drives';
import Rounds from './pages/Rounds';
import InterviewSchedule from './pages/InterviewSchedule';
import BulkUpload from './pages/BulkUpload';
import ExportReports from './pages/ExportReports';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import AiAnalysis from './pages/AiAnalysis';
import Landing from './pages/Landing';
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

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/student-dashboard'} replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/student-dashboard'} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/student-dashboard'} replace /> : <Register />} />
        <Route path="/forgot-password" element={user ? <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/student-dashboard'} replace /> : <ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Students /></Layout></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Companies /></Layout></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Applications /></Layout></ProtectedRoute>} />
        <Route path="/drives" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Drives /></Layout></ProtectedRoute>} />
        <Route path="/rounds" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Rounds /></Layout></ProtectedRoute>} />
        <Route path="/interview-schedule" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><InterviewSchedule /></Layout></ProtectedRoute>} />
        <Route path="/bulk-upload" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><BulkUpload /></Layout></ProtectedRoute>} />
        <Route path="/export-reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><ExportReports /></Layout></ProtectedRoute>} />

        {/* Protected Student Routes */}
        <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
        <Route path="/ai-analysis" element={<ProtectedRoute allowedRoles={['STUDENT']}><Layout><AiAnalysis /></Layout></ProtectedRoute>} />

        {/* Shared Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}><Layout><Notifications /></Layout></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
