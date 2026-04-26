import { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    setFile(selectedFile);
    setError('');
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setUploading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Bulk Student Upload</h1>
        <p>Upload a CSV file to register multiple students at once.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          border: '2px dashed var(--glass-border)',
          borderRadius: '12px',
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: file ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          borderColor: file ? 'var(--brand-primary)' : 'var(--glass-border)',
          transition: 'all 0.3s',
          position: 'relative',
          cursor: 'pointer'
        }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer'
            }}
          />
          <Upload size={48} color={file ? 'var(--brand-primary)' : 'var(--text-tertiary)'} style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h4 style={{ color: file ? 'var(--brand-primary)' : 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {file ? file.name : 'Click or Drag CSV File Here'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            CSV format: Name, Email, Password, Branch, CGPA, ActiveBacklogs
          </p>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            borderRadius: '8px',
            marginTop: '1rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload & Register Students'}
        </button>

        {results && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} color="var(--success)" /> Upload Complete
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Successful</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{results.successCount || 0}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Failed</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>{results.failureCount || 0}</p>
              </div>
            </div>
            {results.errors && results.errors.length > 0 && (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Errors:</p>
                <ul style={{ listStyleType: 'none', padding: 0, fontSize: '0.8rem', color: 'var(--danger)' }}>
                  {results.errors.map((err, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
