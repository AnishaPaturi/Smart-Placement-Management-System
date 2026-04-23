import { motion } from 'framer-motion';
import { User, Briefcase, FileText, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import './Dashboard.css';

const StudentDashboard = () => {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Welcome, John Doe!</h1>
        <p>Track your placement journey and explore new opportunities.</p>
      </div>

      <div className="stats-grid">
        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
            <User size={24} />
          </div>
          <div className="stat-info">
            <h3>Eligible</h3>
            <p>Profile Status</p>
          </div>
          <div className="stat-change" style={{ color: 'var(--info)' }}>
            CGPA: 8.5
          </div>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--brand-primary)20', color: 'var(--brand-primary)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <h3>12</h3>
            <p>New Drives</p>
          </div>
          <button className="icon-btn-sm stat-change"><ExternalLink size={16} /></button>
        </motion.div>

        <motion.div className="stat-card glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>4</h3>
            <p>Active Applications</p>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <div className="glass-panel recent-activity">
          <h3>Your Applications</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot" style={{ background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
              <div className="activity-details">
                <h4>Google - Software Development Engineer</h4>
                <p>Status: Shortlisted for Technical Round</p>
              </div>
              <span className="status-badge status-shortlisted">Round 2</span>
            </div>
            
            <div className="activity-item">
              <div className="activity-dot" style={{ background: 'var(--warning)', boxShadow: '0 0 10px var(--warning)' }}></div>
              <div className="activity-details">
                <h4>Amazon - SDE I</h4>
                <p>Status: Application Under Review</p>
              </div>
              <span className="status-badge status-eligible">Applied</span>
            </div>

            <div className="activity-item">
              <div className="activity-dot" style={{ background: 'var(--danger)', boxShadow: '0 0 10px var(--danger)' }}></div>
              <div className="activity-details">
                <h4>Microsoft - Cloud Engineer</h4>
                <p>Status: Not Shortlisted</p>
              </div>
              <span className="status-badge status-rejected">Rejected</span>
            </div>
          </div>
        </div>

        <div className="glass-panel main-chart">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Upcoming Drives (Matches Profile)</h3>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          
          <div className="activity-list">
            {[1, 2].map((item) => (
              <div key={item} className="activity-item" style={{ padding: '1.25rem', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="avatar-sm" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                      <Briefcase size={16} color="var(--brand-primary)" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Goldman Sachs</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role: Analyst | Package: 20 LPA</p>
                    </div>
                  </div>
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={14}/> Closes in 2 days</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle size={14} color="var(--success)"/> Eligible</span>
                  </div>
                  <button className="btn btn-primary btn-sm">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
