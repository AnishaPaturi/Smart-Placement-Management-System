import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const adminNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/companies', label: 'Companies', icon: Briefcase },
  { path: '/applications', label: 'Applications', icon: FileText },
];

const studentNavItems = [
  { path: '/student-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = user?.role === 'ADMIN' ? adminNavItems : studentNavItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">SP</div>
        <h2>SmartPlace</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="active-indicator"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <Settings className="nav-icon" size={20} />
          <span className="nav-label">Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
