import React from 'react';
import './Dashboard.css';

const Settings = () => {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure application settings and preferences.</p>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3>Account Settings</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Settings module coming soon. Here you will be able to change your password, update notification preferences, and manage your account.
        </p>
      </div>
    </div>
  );
};

export default Settings;
