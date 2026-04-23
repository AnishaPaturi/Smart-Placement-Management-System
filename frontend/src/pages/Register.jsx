import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, BookOpen } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="logo-icon-lg">SP</div>
          <h2>Create an Account</h2>
          <p>Join the placement portal to start your journey</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input type="text" className="input-control" placeholder="John Doe" required />
              </div>
            </div>

            <div className="input-group">
              <label>USN / Roll Number</label>
              <div className="input-with-icon">
                <BookOpen className="input-icon" size={18} />
                <input type="text" className="input-control" placeholder="1RV20CS001" required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input type="email" className="input-control" placeholder="student@college.edu" required />
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input type="password" className="input-control" placeholder="Create password" required />
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input type="password" className="input-control" placeholder="Confirm password" required />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            <UserPlus size={18} />
            Register Account
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
