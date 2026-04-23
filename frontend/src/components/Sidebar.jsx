import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Briefcase, FileText, Settings } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/companies', label: 'Companies', icon: Briefcase },
  { path: '/applications', label: 'Applications', icon: FileText },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">SP</div>
        <h2>SmartPlace</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
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
        <button className="nav-item">
          <Settings className="nav-icon" size={20} />
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
