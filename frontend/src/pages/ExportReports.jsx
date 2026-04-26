import { useState } from 'react';
import { Download, FileText, BarChart3, Users, Briefcase } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const ExportReports = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = (data, filename) => {
    if (!data || data.length === 0) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/students');
      exportToCSV(response.data, 'students');
      setMessage('Students exported successfully!');
    } catch (error) {
      setMessage('Failed to export students');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/companies');
      exportToCSV(response.data, 'companies');
      setMessage('Companies exported successfully!');
    } catch (error) {
      setMessage('Failed to export companies');
    } finally {
      setLoading(false);
    }
  };

  const handleExportApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/applications');
      exportToCSV(response.data, 'applications');
      setMessage('Applications exported successfully!');
    } catch (error) {
      setMessage('Failed to export applications');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAnalytics = async () => {
    setLoading(true);
    try {
      const [studentsRes, applicationsRes, analyticsRes] = await Promise.all([
        api.get('/students'),
        api.get('/applications'),
        api.get('/analytics/dashboard')
      ]);

      const summary = {
        totalStudents: studentsRes.data.length,
        totalApplications: applicationsRes.data.length,
        totalPlaced: analyticsRes.data.totalPlaced,
        placementRate: analyticsRes.data.totalPlaced / studentsRes.data.length * 100,
        generatedAt: new Date().toISOString()
      };

      exportToJSON(summary, 'placement_summary');
      setMessage('Analytics exported successfully!');
    } catch (error) {
      setMessage('Failed to export analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Export Reports</h1>
        <p>Download placement data in CSV or JSON format.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Student Export Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
              <Users size={24} />
            </div>
            <div>
              <h3>Student Data</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Export all student information</p>
            </div>
          </div>
          <button className="btn btn-secondary w-full" onClick={handleExportStudents} disabled={loading}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Companies Export Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--brand-primary)20', color: 'var(--brand-primary)' }}>
              <Building size={24} />
            </div>
            <div>
              <h3>Company Data</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Export company and drive info</p>
            </div>
          </div>
          <button className="btn btn-secondary w-full" onClick={handleExportCompanies} disabled={loading}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Applications Export Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3>Applications Data</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Export all application records</p>
            </div>
          </div>
          <button className="btn btn-secondary w-full" onClick={handleExportApplications} disabled={loading}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Analytics Export Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <h3>Analytics Summary</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Export placement statistics</p>
            </div>
          </div>
          <button className="btn btn-secondary w-full" onClick={handleExportAnalytics} disabled={loading}>
            <Download size={16} /> Export JSON
          </button>
        </div>
      </div>

      {message && (
        <div className="glass-panel" style={{ marginTop: '2rem', padding: '1rem', textAlign: 'center', color: 'var(--success)', border: '1px solid var(--success)' }}>
          {message}
        </div>
      )}

      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>About Export Reports</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Export placement data for offline analysis, reporting, or backup purposes. All exports include the latest data from the database.
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <li>CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
          <li>JSON files are suitable for programmatic processing and data analysis</li>
          <li>All exports are generated in real-time with current database state</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportReports;
