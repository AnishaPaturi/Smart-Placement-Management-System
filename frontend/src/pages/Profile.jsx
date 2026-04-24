import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/students/${user.id || 1}/parse-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setParsedData(response.data);
      // Optional: Update global user state with new skills if needed
    } catch (error) {
      console.error("Parsing failed", error);
      alert("AI Parsing failed. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account details and preferences.</p>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div className="avatar-sm" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2>{user?.name || 'User'}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.role === 'ADMIN' ? 'Placement Officer' : 'Student'}</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Email Address</label>
            <p style={{ fontWeight: '500' }}>{user?.email || 'N/A'}</p>
          </div>
          {user?.role === 'STUDENT' && (
            <>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>CGPA</label>
                <p style={{ fontWeight: '500' }}>{user?.cgpa || 'N/A'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Branch</label>
                <p style={{ fontWeight: '500' }}>{user?.branch || 'N/A'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Active Backlogs</label>
                <p style={{ fontWeight: '500' }}>{user?.activeBacklogs !== undefined ? user.activeBacklogs : 'N/A'}</p>
              </div>
            </>
          )}
        </div>

        {user?.role === 'STUDENT' && (
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
            <h3>AI Resume Parsing</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Upload your latest resume to automatically extract your skills, certifications, and update your profile for the Eligibility Engine.
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div 
                className="glass-panel" 
                style={{ 
                  flex: 1, 
                  border: '2px dashed var(--brand-primary)', 
                  textAlign: 'center', 
                  padding: '2rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={parsing}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <UploadCloud size={48} color="var(--brand-primary)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                <h4>{parsing ? 'Extracting Data with AI...' : 'Click or Drag Resume to Upload'}</h4>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Supports PDF, DOCX (Max 5MB)</p>
              </div>

              <div className="glass-panel" style={{ flex: 1, minHeight: '180px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Extracted Data</h4>
                {parsing ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid var(--text-tertiary)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </div>
                ) : parsedData ? (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                      <CheckCircle size={16} /> <span style={{ fontSize: '0.9rem' }}>{parsedData.message}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Detected Skills:</span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{parsedData.skills}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Certifications:</span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{parsedData.certifications}</p>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                    Upload a resume to see AI extractions here.
                  </p>
                )}
              </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
