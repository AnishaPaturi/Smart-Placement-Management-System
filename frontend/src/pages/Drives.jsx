import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Edit2, Calendar, Building } from 'lucide-react';
import api from '../api/axios';
import './TablePage.css';

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [formData, setFormData] = useState({
    companyId: '',
    role: '',
    packageLpa: '',
    minCgpa: '',
    allowedBranches: '',
    driveDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drivesRes, companiesRes] = await Promise.all([
        api.get('/drives'),
        api.get('/companies')
      ]);
      setDrives(drivesRes.data);
      setCompanies(companiesRes.data);
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
        companyId: parseInt(formData.companyId),
        role: formData.role,
        packageLpa: parseFloat(formData.packageLpa) || null,
        minCgpa: parseFloat(formData.minCgpa) || null,
        allowedBranches: formData.allowedBranches,
        driveDate: formData.driveDate
      };

      if (editingDrive) {
        await api.put(`/drives/${editingDrive.id}`, payload);
      } else {
        await api.post('/drives', payload);
      }

      fetchData();
      setShowModal(false);
      setEditingDrive(null);
      setFormData({ companyId: '', role: '', packageLpa: '', minCgpa: '', allowedBranches: '', driveDate: '' });
    } catch (error) {
      console.error("Error saving drive", error);
      alert('Failed to save drive: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      companyId: drive.companyId?.toString() || '',
      role: drive.role || '',
      packageLpa: drive.packageLpa?.toString() || '',
      minCgpa: drive.minCgpa?.toString() || '',
      allowedBranches: drive.allowedBranches || '',
      driveDate: drive.driveDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;

    try {
      await api.delete(`/drives/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting drive", error);
      alert('Failed to delete drive: ' + (error.response?.data || error.message));
    }
  };

  const handleRunEngine = async (driveId) => {
    try {
      const res = await api.post(`/drives/${driveId}/shortlist`);
      alert(`Engine Run Complete! ${res.data.length} students matched and were shortlisted.`);
    } catch (error) {
      alert('Failed to run engine.');
    }
  };

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Placement Drives</h1>
          <p>Manage placement drives and run eligibility engine.</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingDrive(null);
          setFormData({ companyId: '', role: '', packageLpa: '', minCgpa: '', allowedBranches: '', driveDate: '' });
          setShowModal(true);
        }}>
          <Plus size={18} />
          Add Drive
        </button>
      </div>

      <div className="glass-panel table-container">
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package (LPA)</th>
                <th>Min CGPA</th>
                <th>Drive Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--brand-primary)' }}>
                        <Building size={16} />
                      </div>
                      <span className="font-medium">{drive.companyName || 'Company ID: ' + drive.companyId}</span>
                    </div>
                  </td>
                  <td>{drive.role}</td>
                  <td>{drive.packageLpa ? drive.packageLpa + ' LPA' : 'N/A'}</td>
                  <td>{drive.minCgpa || 'N/A'}</td>
                  <td>{drive.driveDate || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleRunEngine(drive.id)}>
                        Run Engine
                      </button>
                      <button className="icon-btn-sm" onClick={() => handleEdit(drive)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(drive.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {drives.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No drives found.
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
              <h2>{editingDrive ? 'Edit Drive' : 'Add New Drive'}</h2>
              <button className="icon-btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="input-group">
                <label>Company</label>
                <select
                  name="companyId"
                  className="input-control"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  className="input-control"
                  placeholder="e.g. Software Engineer"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Package (LPA)</label>
                  <input
                    type="number"
                    name="packageLpa"
                    step="0.1"
                    className="input-control"
                    placeholder="e.g. 12.5"
                    value={formData.packageLpa}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>Min CGPA</label>
                  <input
                    type="number"
                    name="minCgpa"
                    step="0.1"
                    min="0"
                    max="10"
                    className="input-control"
                    placeholder="e.g. 7.5"
                    value={formData.minCgpa}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Allowed Branches</label>
                <input
                  type="text"
                  name="allowedBranches"
                  className="input-control"
                  placeholder="e.g. CSE, ECE, IT (comma-separated)"
                  value={formData.allowedBranches}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Drive Date</label>
                <input
                  type="date"
                  name="driveDate"
                  className="input-control"
                  value={formData.driveDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingDrive ? 'Update Drive' : 'Add Drive')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drives;
