import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search students, companies..." />
      </div>

      <div className="navbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Placement Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
