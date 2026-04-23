import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import './TablePage.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications');
        const fetchedApps = response.data.map(app => ({
          id: app.id,
          studentName: app.studentName || 'Unknown Student',
          usn: `USR-${app.studentId}`, // Mock USN if missing
          company: app.companyName || 'Unknown Company',
          role: app.role || 'Unknown Role',
          round: 'Initial',
          status: app.status || 'APPLIED'
        }));
        setApplications(fetchedApps);
      } catch (error) {
        console.error("Error fetching applications", error);
      }
    };
    
    fetchApplications();
  }, []);

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Applications & Shortlisting</h1>
          <p>Track student applications across different interview rounds.</p>
        </div>
      </div>

      <div className="glass-panel table-container">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search applications..." className="input-control" />
          </div>
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>USN</th>
                <th>Company</th>
                <th>Role</th>
                <th>Current Round</th>
                <th>Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm">{app.studentName.charAt(0)}</div>
                      <span className="font-medium">{app.studentName}</span>
                    </div>
                  </td>
                  <td>{app.usn}</td>
                  <td><span className="font-medium">{app.company}</span></td>
                  <td>{app.role}</td>
                  <td>{app.round}</td>
                  <td>
                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn-sm" style={{ color: 'var(--success)' }} title="Promote to Next Round">
                        <CheckCircle size={18} />
                      </button>
                      <button className="icon-btn-sm" style={{ color: 'var(--danger)' }} title="Reject">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
