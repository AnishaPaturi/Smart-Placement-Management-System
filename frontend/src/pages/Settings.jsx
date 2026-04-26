import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Bell, Palette } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      // Mock API call - would need backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure application settings and preferences.</p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
          <button
            className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('password')}
            style={{ borderRadius: '8px 8px 0 0' }}
          >
            <Lock size={16} /> Password
          </button>
          <button
            className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('notifications')}
            style={{ borderRadius: '8px 8px 0 0' }}
          >
            <Bell size={16} /> Notifications
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {activeTab === 'password' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>
              {message.text && (
                <div style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: message.type === 'success' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <div className="input-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="input-control"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="input-control"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input-control"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'fit-content' }}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'email-app', label: 'Application Updates', desc: 'Receive updates when your application status changes' },
                  { id: 'email-drive', label: 'New Drives', desc: 'Get notified when new placement drives are announced' },
                  { id: 'email-interview', label: 'Interview Schedule', desc: 'Receive interview schedule and updates' },
                  { id: 'email-placement', label: 'Placement Results', desc: 'Get notified when placement results are announced' }
                ].map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{item.label}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'var(--bg-tertiary)',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        transition: '0.3s'
                      }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
