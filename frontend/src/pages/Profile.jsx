import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle, Pencil, Save } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cgpa: user?.cgpa || '',
    branch: user?.branch || '',
    activeBacklogs: user?.activeBacklogs || 0,
    skills: user?.skills || '',
    certifications: user?.certifications || '',
    education: user?.education || '',
    experience: user?.experience || '',
    projects: user?.projects || '',
    summary: user?.summary || ''
  });
  const [resumeHistory, setResumeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user?.id && user?.role === 'STUDENT') {
      fetchResumeHistory();
    }
  }, [user?.id]);

  const fetchResumeHistory = async () => {
    try {
      const response = await api.get(`/students/${user.id}/resume-history`);
      setResumeHistory(response.data);
    } catch (error) {
      console.error("Error fetching resume history", error);
    }
  };

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
      if (response.data.success && user) {
        setUser({
          ...user,
          skills: response.data.skills,
          certifications: response.data.certifications,
          cgpa: response.data.cgpa,
          education: response.data.education,
          experience: response.data.experience,
          projects: response.data.projects,
          summary: response.data.summary,
          resumeUrl: response.data.resumeUrl
        });
        setEditData({
          ...editData,
          skills: response.data.skills,
          certifications: response.data.certifications,
          cgpa: response.data.cgpa,
          education: response.data.education,
          experience: response.data.experience,
          projects: response.data.projects,
          summary: response.data.summary
        });
      }
      fetchResumeHistory();
    } catch (error) {
      console.error("Parsing failed", error);
      alert("AI Parsing failed. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditToggle = () => {
    if (editMode) {
      setEditData({
        name: user?.name || '',
        email: user?.email || '',
        cgpa: user?.cgpa || '',
        branch: user?.branch || '',
        activeBacklogs: user?.activeBacklogs || 0,
        skills: user?.skills || '',
        certifications: user?.certifications || '',
        education: user?.education || '',
        experience: user?.experience || '',
        projects: user?.projects || '',
        summary: user?.summary || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/students/${user.id}`, {
        name: editData.name,
        email: editData.email,
        cgpa: parseFloat(editData.cgpa) || null,
        branch: editData.branch,
        activeBacklogs: parseInt(editData.activeBacklogs) || 0,
        skills: editData.skills,
        certifications: editData.certifications,
        education: editData.education,
        experience: editData.experience,
        projects: editData.projects,
        summary: editData.summary
      });

      setUser({
        ...user,
        ...editData,
        cgpa: parseFloat(editData.cgpa) || user.cgpa,
        activeBacklogs: parseInt(editData.activeBacklogs) || user.activeBacklogs
      });

      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Update failed", error);
      alert('Failed to update profile: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account details and preferences.</p>
      </div>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div className="avatar-sm" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div style={{ flex: 1 }}>
            <h2>{user?.name || 'User'}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {user?.role === 'ADMIN' ? 'Placement Officer' : 'Student'}
            </p>
          </div>

          {editMode ? (
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
              <Save size={16} /> Save
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={handleEditToggle}>
              <Pencil size={16} /> Edit
            </button>
          )}
        </div>

        {editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="input-control"
                  value={editData.email}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>CGPA</label>
                <input
                  type="number"
                  name="cgpa"
                  step="0.01"
                  min="0"
                  max="10"
                  className="input-control"
                  value={editData.cgpa}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Branch</label>
                <input
                  type="text"
                  name="branch"
                  className="input-control"
                  value={editData.branch}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Active Backlogs</label>
                <input
                  type="number"
                  name="activeBacklogs"
                  min="0"
                  className="input-control"
                  value={editData.activeBacklogs}
                  onChange={handleEditChange}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="input-control"
                  value={editData.skills}
                  onChange={handleEditChange}
                  placeholder="e.g. Java, React, SQL"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Certifications (comma-separated)</label>
                <input
                  type="text"
                  name="certifications"
                  className="input-control"
                  value={editData.certifications}
                  onChange={handleEditChange}
                  placeholder="e.g. AWS Certified, Oracle Java"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Education</label>
                <input
                  type="text"
                  name="education"
                  className="input-control"
                  value={editData.education}
                  onChange={handleEditChange}
                  placeholder="e.g. B.Tech in Computer Science"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Experience</label>
                <input
                  type="text"
                  name="experience"
                  className="input-control"
                  value={editData.experience}
                  onChange={handleEditChange}
                  placeholder="e.g. Intern at ABC Tech"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Projects (comma-separated)</label>
                <input
                  type="text"
                  name="projects"
                  className="input-control"
                  value={editData.projects}
                  onChange={handleEditChange}
                  placeholder="e.g. Project A, Project B"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Summary</label>
                <textarea
                  name="summary"
                  className="input-control"
                  value={editData.summary}
                  onChange={handleEditChange}
                  rows="3"
                  placeholder="Brief professional summary"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        ) : (
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
                <div>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Skills</label>
                  <p style={{ fontWeight: '500' }}>{user?.skills || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Certifications</label>
                  <p style={{ fontWeight: '500' }}>{user?.certifications || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Resume</label>
                  <p style={{ fontWeight: '500' }}>{user?.resumeUrl || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Education</label>
                  <p style={{ fontWeight: '500' }}>{user?.education || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Experience</label>
                  <p style={{ fontWeight: '500' }}>{user?.experience || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Projects</label>
                  <p style={{ fontWeight: '500' }}>{user?.projects || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>AI Summary</label>
                  <p style={{ fontWeight: '500' }}>{user?.summary || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        )}

        {user?.role === 'STUDENT' && (
          <>
            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
              <h3>AI Resume Parsing</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Upload your latest resume to automatically extract your skills, certifications, and update your profile.
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
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Education:</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{parsedData.education}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Experience:</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{parsedData.experience}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Projects:</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{parsedData.projects}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Summary:</span>
                        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{parsedData.summary}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>
                      Upload a resume to see AI extractions here.
                    </p>
                  )}
                </div>
              </div>
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `
              }} />
            </div>

            {resumeHistory.length > 0 && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Resume Analysis History</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? 'Hide' : 'Show'} History ({resumeHistory.length})
                  </button>
                </div>

                {showHistory && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resumeHistory.map((item, index) => (
                      <div key={item.id || index} className="glass-panel" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Analysis #{resumeHistory.length - index}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            {item.createdAt || 'N/A'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          {item.skills && (
                            <div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Skills:</span>
                              <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.skills}</p>
                            </div>
                          )}
                          {item.cgpa && (
                            <div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CGPA:</span>
                              <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.cgpa}</p>
                            </div>
                          )}
                          {item.certifications && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Certifications:</span>
                              <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.certifications}</p>
                            </div>
                          )}
                          {item.summary && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Summary:</span>
                              <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.summary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
