import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, FileText, CheckCircle, Clock, ExternalLink, TrendingUp, Target, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalDrives: 0,
    applied: 0,
    shortlisted: 0,
    selected: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          api.get('/drives'),
          api.get(`/applications/student/${user?.id || 1}`) // fallback for safety
        ]);
        setDrives(drivesRes.data);
        const apps = appsRes.data;
        setApplications(apps);

        // Calculate stats
        setStats({
          totalDrives: drivesRes.data.length,
          applied: apps.filter(a => a.status === 'APPLIED').length,
          shortlisted: apps.filter(a => a.status === 'SHORTLISTED').length,
          selected: apps.filter(a => a.status === 'SELECTED').length
        });
      } catch (error) {
        console.error("Error fetching student dashboard data", error);
      }
    };
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleApply = async (driveId) => {
    try {
      await api.post(`/drives/${driveId}/apply/${user.id}`);
      // Refresh applications
      const appsRes = await api.get(`/applications/student/${user.id}`);
      setApplications(appsRes.data);
      alert('Applied successfully!');
    } catch (error) {
      console.error("Error applying to drive", error);
      alert('Could not apply to drive.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'APPLIED': { color: 'var(--info)', label: 'Applied' },
      'SHORTLISTED': { color: 'var(--warning)', label: 'Shortlisted' },
      'TECHNICAL': { color: 'var(--brand-primary)', label: 'Technical' },
      'HR': { color: 'var(--brand-accent)', label: 'HR Round' },
      'SELECTED': { color: 'var(--success)', label: 'Selected' },
      'REJECTED': { color: 'var(--danger)', label: 'Rejected' }
    };
    return statusMap[status] || { color: 'var(--text-tertiary)', label: status };
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
        <p>Track your placement journey and explore new opportunities.</p>
      </div>

      <div className="stats-grid">
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.applied}</h3>
            <p>Applications</p>
          </div>
          <div className="stat-change" style={{ color: user?.activeBacklogs === 0 ? 'var(--success)' : 'var(--danger)' }}>
            {user?.activeBacklogs === 0 ? '✓ Eligible' : '✗ Not Eligible'}
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--brand-primary)20', color: 'var(--brand-primary)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalDrives}</h3>
            <p>Available Drives</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.shortlisted}</h3>
            <p>Shortlisted</p>
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.selected}</h3>
            <p>Selected</p>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="glass-panel recent-activity">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Your Applications</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{applications.length} Total</span>
          </div>
          <div className="activity-list">
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>No applications yet. Apply to drives to get started!</p>
              </div>
            ) : (
              applications.map((app) => {
                const statusInfo = getStatusBadge(app.status);
                return (
                  <div key={app.id} className="activity-item" style={{ padding: '1rem 1.25rem' }}>
                    <div className="activity-dot" style={{ background: statusInfo.color, boxShadow: `0 0 10px ${statusInfo.color}` }}></div>
                    <div className="activity-details" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h4 style={{ fontSize: '0.95rem' }}>{app.companyName || 'Company'} - {app.role || 'Role'}</h4>
                        <span className={`status-badge status-${app.status.toLowerCase()}`}>{statusInfo.label}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Applied: {app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="glass-panel main-chart">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3><Calendar size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Available Drives</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{drives.length} Active</span>
          </div>

          <div className="activity-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {drives.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>No active drives at the moment.</p>
              </div>
            ) : (
              drives.map((drive) => {
                const hasApplied = applications.some(app => app.driveId === drive.id);
                const isEligible = user?.cgpa >= drive.minCgpa;
                return (
                  <div key={drive.id} className="activity-item" style={{ padding: '1.25rem', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="avatar-sm" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                          <Briefcase size={16} color="var(--brand-primary)" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{drive.companyName || `Company ID: ${drive.companyId}`}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Role: {drive.role} | Package: {drive.packageLpa} LPA | Min CGPA: {drive.minCgpa}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-tertiary)' }}>
                          <Clock size={14} /> {drive.driveDate || 'Date TBD'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: isEligible ? 'var(--success)' : 'var(--danger)' }}>
                          {isEligible ? <CheckCircle size={14} /> : null}
                          {isEligible ? 'Eligible' : 'CGPA Required: ' + drive.minCgpa}
                        </span>
                      </div>
                      <button
                        className={`btn ${hasApplied ? 'btn-secondary' : isEligible ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        disabled={hasApplied || !isEligible}
                        onClick={() => handleApply(drive.id)}
                      >
                        {hasApplied ? '✓ Applied' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                );
              }))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
