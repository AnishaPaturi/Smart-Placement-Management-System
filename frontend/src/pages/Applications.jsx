import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Download } from 'lucide-react';
import api from '../api/axios';
import './TablePage.css';

const statusFlow = {
  'APPLIED': 'SHORTLISTED',
  'SHORTLISTED': 'TECHNICAL',
  'TECHNICAL': 'HR',
  'HR': 'SELECTED'
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(null); // Track which app is being updated
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const filteredApplications = applications.filter(app => {
    return searchQuery === '' ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePromote = async (app) => {
    const nextStatus = statusFlow[app.status];
    if (!nextStatus) {
      alert('No further promotion available for this application status.');
      return;
    }

    setLoading(app.id);
    try {
      await api.put(`/applications/${app.id}/status`, { status: nextStatus });
      // Refresh applications
      const response = await api.get('/applications');
      const fetchedApps = response.data.map(a => ({
        id: a.id,
        studentName: a.studentName || 'Unknown Student',
        usn: `USR-${a.studentId}`,
        company: a.companyName || 'Unknown Company',
        role: a.role || 'Unknown Role',
        round: getRoundFromStatus(nextStatus),
        status: a.status || 'APPLIED'
      }));
      setApplications(fetchedApps);
    } catch (error) {
      console.error("Error promoting application", error);
      alert('Failed to promote application: ' + (error.response?.data || error.message));
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (app) => {
    setLoading(app.id);
    try {
      await api.put(`/applications/${app.id}/status`, { status: 'REJECTED' });
      // Refresh applications
      const response = await api.get('/applications');
      const fetchedApps = response.data.map(a => ({
        id: a.id,
        studentName: a.studentName || 'Unknown Student',
        usn: `USR-${a.studentId}`,
        company: a.companyName || 'Unknown Company',
        role: a.role || 'Unknown Role',
        round: getRoundFromStatus('REJECTED'),
        status: a.status || 'APPLIED'
      }));
      setApplications(fetchedApps);
    } catch (error) {
      console.error("Error rejecting application", error);
      alert('Failed to reject application: ' + (error.response?.data || error.message));
    } finally {
      setLoading(null);
    }
  };

  const getRoundFromStatus = (status) => {
    switch(status) {
      case 'APPLIED': return 'Initial';
      case 'SHORTLISTED': return 'Shortlisted';
      case 'TECHNICAL': return 'Technical';
      case 'HR': return 'HR';
      case 'SELECTED': return 'Selected';
      case 'REJECTED': return 'Rejected';
      default: return 'Initial';
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) {
      alert("No data to export");
      return;
    }
    
    const headers = ['ID', 'Student Name', 'USN', 'Company', 'Role', 'Status'];
    const csvRows = [headers.join(',')];
    
    applications.forEach(app => {
      const row = [
        app.id,
        `"${app.studentName}"`,
        `"${app.usn}"`,
        `"${app.company}"`,
        `"${app.role}"`,
        `"${app.status}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'applications_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <input
              type="text"
              placeholder="Search applications..."
              className="input-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={exportToCSV}>
              <Download size={18} />
              Export CSV
            </button>
            <button className="btn btn-secondary">
              <Filter size={18} />
              Filters
            </button>
          </div>
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
              {currentApplications.map((app) => (
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
                      {app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                        <button
                          className="icon-btn-sm"
                          style={{ color: 'var(--success)' }}
                          title="Promote to Next Round"
                          onClick={() => handlePromote(app)}
                          disabled={loading === app.id}
                        >
                          {loading === app.id ? '...' : <CheckCircle size={18} />}
                        </button>
                      )}
                      {app.status !== 'REJECTED' && app.status !== 'SELECTED' && (
                        <button
                          className="icon-btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Reject"
                          onClick={() => handleReject(app)}
                          disabled={loading === app.id}
                        >
                          {loading === app.id ? '...' : <XCircle size={18} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentApplications.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => goToPage(i + 1)}
                style={{ minWidth: '40px' }}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <select
              className="input-control"
              style={{ width: 'auto', marginLeft: '1rem' }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
