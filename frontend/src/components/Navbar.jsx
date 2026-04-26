import { Bell, Sun, Moon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ toggleTheme, theme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link
            to={user ? (user.role === "ADMIN" ? "/dashboard" : "/student-dashboard") : "/"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>
              SmartPlace
            </h2>
          </Link>
        </div>

        <div className="navbar-right">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="icon-btn" title="Notifications">
            <Bell size={20} />
          </button>

          {user && (
            <>
              <div className="navbar-user">
                <div className="avatar-sm">{user?.name?.charAt(0) || "U"}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)" }}>
                    {user?.name || "User"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {user?.role === "ADMIN" ? "Administrator" : "Student"}
                  </span>
                </div>
              </div>

              <button className="icon-btn" onClick={handleLogout} title="Logout" style={{ marginLeft: "0.5rem" }}>
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
