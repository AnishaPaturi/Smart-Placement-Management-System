import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, FileText, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          api.get('/drives'),
          api.get(`/applications/student/${user?.id || 1}`) // fallback for safety
        ]);
        setDrives(drivesRes.data);
        setApplications(appsRes.data);
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

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <p>Track your placement journey and explore new opportunities.</p>
      </div>

      <div className="stats-grid">
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
            <User size={24} />
          </div>
          <div className="stat-info">
            <h3>{user?.activeBacklogs === 0 ? 'Eligible' : 'Not Eligible'}</h3>
            <p>Profile Status</p>
          </div>
          <div className="stat-change" style={{ color: 'var(--info)' }}>
            CGPA: {user?.cgpa || 'N/A'}
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--brand-primary)20', color: 'var(--brand-primary)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <h3>{drives.length}</h3>
            <p>Total Drives</p>
          </div>
          <button className="icon-btn-sm stat-change"><ExternalLink size={16} /></button>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>{applications.length}</h3>
            <p>Active Applications</p>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <div className="glass-panel recent-activity">
          <h3>Your Applications</h3>
          <div className="activity-list">
            {applications.length === 0 ? <p>No applications yet.</p> : applications.map((app) => (
              <div key={app.id} className="activity-item">
                <div className="activity-dot" style={{ background: 'var(--brand-primary)', boxShadow: '0 0 10px var(--brand-primary)' }}></div>
                <div className="activity-details">
                  <h4>{app.companyName || 'Company'} - {app.role || 'Role'}</h4>
                  <p>Status: {app.status}</p>
                </div>
                <span className={`status-badge status-${app.status.toLowerCase()}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel main-chart">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Upcoming Drives</h3>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          
          <div className="activity-list">
            {drives.map((drive) => {
              const hasApplied = applications.some(app => app.driveId === drive.id);
              return (
              <div key={drive.id} className="activity-item" style={{ padding: '1.25rem', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="avatar-sm" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                      <Briefcase size={16} color="var(--brand-primary)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Company ID: {drive.companyId}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role: {drive.role} | Package: {drive.packageLpa} LPA</p>
                    </div>
                  </div>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={14}/> {drive.driveDate}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: user?.cgpa >= drive.minCgpa ? 'var(--success)' : 'var(--danger)' }}>
                      <CheckCircle size={14}/> {user?.cgpa >= drive.minCgpa ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                  <button 
                    className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'} btn-sm`} 
                    disabled={hasApplied}
                    onClick={() => handleApply(drive.id)}
                  >
                    {hasApplied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
