import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token' });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.post('/auth/reset-password', { token, password });
      setMessage({ type: 'success', text: response.data || 'Password reset successful!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  if (!token && message.type === 'error') {
    return (
      <div className="auth-container animate-fade-in">
        <div className="auth-card glass-panel" style={{ maxWidth: '500px' }}>
          <div className="auth-header">
            <div className="logo-icon-lg">SP</div>
            <h2>Invalid Token</h2>
            <p>The reset link is invalid or has expired.</p>
          </div>
          <div className="auth-footer">
            <Link to="/forgot-password">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass-panel" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="logo-icon-lg">SP</div>
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
        </div>

        {message.text && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            fontSize: '0.9rem'
          }}>
            {message.type === 'success' && <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />}
            {message.text}
          </div>
        )}

        {message.type !== 'success' && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
              <Lock size={18} />
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {message.type === 'success' && (
          <Link to="/login" className="btn btn-primary w-full mt-4" style={{ textAlign: 'center' }}>
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
