import React from 'react';
import { Bell } from 'lucide-react';
import './Dashboard.css';

const Notifications = () => {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated with the latest alerts and announcements.</p>
      </div>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <Bell size={48} color="var(--text-tertiary)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
        <h3>No new notifications</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You're all caught up! Check back later for updates.</p>
      </div>
    </div>
  );
};

export default Notifications;
