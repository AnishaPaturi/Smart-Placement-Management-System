import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Dashboard.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'Application Shortlisted', message: 'Your application for Google has been shortlisted. Next round: Technical Interview.', time: '2 hours ago', read: false },
    { id: 2, type: 'info', title: 'New Drive Announced', message: 'Microsoft has announced a new placement drive for Software Engineer role. Min CGPA: 8.0', time: '5 hours ago', read: false },
    { id: 3, type: 'warning', title: 'Interview Tomorrow', message: 'You have a Technical Interview scheduled with Amazon tomorrow at 10:00 AM.', time: '1 day ago', read: true },
    { id: 4, type: 'success', title: 'Profile Updated', message: 'Your profile has been successfully updated with new skills and certifications.', time: '2 days ago', read: true },
    { id: 5, type: 'info', title: 'Placement Result', message: 'Congratulations! Placement results for TCS have been announced. Check your application status.', time: '3 days ago', read: true }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle size={20} color="var(--success)" />;
      case 'warning': return <AlertCircle size={20} color="var(--warning)" />;
      case 'info':
      default: return <Info size={20} color="var(--info)" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with the latest alerts and announcements.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`btn btn-sm ${filter === 'read' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredNotifications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <Bell size={48} color="var(--text-tertiary)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
            <h3>No notifications</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {filter === 'unread' ? 'No unread notifications.' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className="glass-panel"
              style={{
                padding: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                opacity: notification.read ? 0.7 : 1,
                borderLeft: notification.read ? 'none' : '3px solid var(--brand-primary)'
              }}
            >
              <div style={{ marginTop: '0.25rem' }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: notification.read ? 500 : 600 }}>
                    {notification.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{notification.time}</span>
                    <button
                      className="icon-btn-sm"
                      onClick={() => deleteNotification(notification.id)}
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{notification.message}</p>
                {!notification.read && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
