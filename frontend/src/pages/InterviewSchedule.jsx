import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Trash2, Edit2 } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const InterviewSchedule = () => {
  const [interviews, setInterviews] = useState([]);
  const [drives, setDrives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [formData, setFormData] = useState({
    driveId: '',
    studentId: '',
    round: '',
    interviewDate: '',
    interviewTime: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [interviewsRes, drivesRes] = await Promise.all([
        api.get('/interviews'), // Need to create this endpoint
        api.get('/drives')
      ]);
      setInterviews(interviewsRes.data || []);
      setDrives(drivesRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        driveId: parseInt(formData.driveId),
        studentId: parseInt(formData.studentId),
        round: formData.round,
        interviewDateTime: `${formData.interviewDate}T${formData.interviewTime}:00`,
        location: formData.location,
        notes: formData.notes
      };

      if (editingInterview) {
        await api.put(`/interviews/${editingInterview.id}`, payload);
      } else {
        await api.post('/interviews', payload);
      }

      fetchData();
      setShowModal(false);
      setEditingInterview(null);
      setFormData({ driveId: '', studentId: '', round: '', interviewDate: '', interviewTime: '', location: '', notes: '' });
    } catch (error) {
      console.error("Error saving interview", error);
      alert('Failed to save interview: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setFormData({
      driveId: interview.driveId?.toString() || '',
      studentId: interview.studentId?.toString() || '',
      round: interview.round || '',
      interviewDate: interview.interviewDate || '',
      interviewTime: interview.interviewTime || '',
      location: interview.location || '',
      notes: interview.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      await api.delete(`/interviews/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting interview", error);
    }
  };

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Interview Schedule</h1>
          <p>Manage and schedule interviews for placement drives.</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingInterview(null);
          setFormData({ driveId: '', studentId: '', round: '', interviewDate: '', interviewTime: '', location: '', notes: '' });
          setShowModal(true);
        }}>
          <Plus size={18} />
          Schedule Interview
        </button>
      </div>

      <div className="glass-panel table-container">
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Drive</th>
                <th>Student</th>
                <th>Round</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id}>
                  <td>{interview.driveName || 'Drive ID: ' + interview.driveId}</td>
                  <td>{interview.studentName || 'Student ID: ' + interview.studentId}</td>
                  <td><span className="font-medium">{interview.round}</span></td>
                  <td>{interview.interviewDateTime || 'TBD'}</td>
                  <td>{interview.location || 'TBD'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn-sm" onClick={() => handleEdit(interview)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(interview.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {interviews.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No interviews scheduled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>{editingInterview ? 'Edit Interview' : 'Schedule Interview'}</h2>
              <button className="icon-btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="input-group">
                <label>Drive</label>
                <select
                  name="driveId"
                  className="input-control"
                  value={formData.driveId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a drive...</option>
                  {drives.map(drive => (
                    <option key={drive.id} value={drive.id}>
                      {drive.companyName || 'Company'} - {drive.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Student ID</label>
                <input
                  type="number"
                  name="studentId"
                  className="input-control"
                  placeholder="Enter student ID"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Round</label>
                <input
                  type="text"
                  name="round"
                  className="input-control"
                  placeholder="e.g. Technical Interview"
                  value={formData.round}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="interviewDate"
                    className="input-control"
                    value={formData.interviewDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <input
                    type="time"
                    name="interviewTime"
                    className="input-control"
                    value={formData.interviewTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  className="input-control"
                  placeholder="e.g. Room 101, Building A"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  className="input-control"
                  rows="3"
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingInterview ? 'Update' : 'Schedule')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSchedule;
