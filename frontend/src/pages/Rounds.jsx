import { useState, useEffect } from 'react';
import { Plus, X, Trash2, Edit2 } from 'lucide-react';
import api from '../api/axios';
import './TablePage.css';

const Rounds = () => {
  const [rounds, setRounds] = useState([]);
  const [drives, setDrives] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [formData, setFormData] = useState({
    driveId: '',
    roundName: '',
    roundDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roundsRes, drivesRes] = await Promise.all([
        api.get('/rounds/drive/1'), // Default to first drive, will improve later
        api.get('/drives')
      ]);
      setRounds(roundsRes.data);
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
      if (editingRound) {
        await api.put(`/rounds/${editingRound.id}`, {
          id: editingRound.id,
          driveId: parseInt(formData.driveId),
          roundName: formData.roundName,
          roundDate: formData.roundDate
        });
      } else {
        await api.post('/rounds', {
          driveId: parseInt(formData.driveId),
          roundName: formData.roundName,
          roundDate: formData.roundDate
        });
      }

      // Refresh rounds for the selected drive
      if (formData.driveId) {
        const response = await api.get(`/rounds/drive/${formData.driveId}`);
        setRounds(response.data);
      }

      setShowModal(false);
      setEditingRound(null);
      setFormData({ driveId: '', roundName: '', roundDate: '' });
    } catch (error) {
      console.error("Error saving round", error);
      alert('Failed to save round: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (round) => {
    setEditingRound(round);
    setFormData({
      driveId: round.driveId.toString(),
      roundName: round.roundName || '',
      roundDate: round.roundDate || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this round?')) return;

    try {
      await api.delete(`/rounds/${id}`);
      setRounds(rounds.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting round", error);
      alert('Failed to delete round: ' + (error.response?.data || error.message));
    }
  };

  const handleDriveChange = async (driveId) => {
    setFormData({ ...formData, driveId });
    if (driveId) {
      try {
        const response = await api.get(`/rounds/drive/${driveId}`);
        setRounds(response.data);
      } catch (error) {
        console.error("Error fetching rounds for drive", error);
      }
    } else {
      setRounds([]);
    }
  };

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Interview Rounds</h1>
          <p>Manage interview rounds for placement drives.</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setEditingRound(null);
          setFormData({ driveId: '', roundName: '', roundDate: '' });
          setShowModal(true);
        }}>
          <Plus size={18} />
          Add Round
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <label style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}>Select Drive:</label>
        <select
          className="input-control"
          style={{ width: '300px' }}
          value={formData.driveId}
          onChange={(e) => handleDriveChange(e.target.value)}
        >
          <option value="">Select a drive...</option>
          {drives.map(drive => (
            <option key={drive.id} value={drive.id}>
              {drive.role} - {drive.driveDate}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-panel table-container">
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Drive</th>
                <th>Round Name</th>
                <th>Round Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round) => (
                <tr key={round.id}>
                  <td>{round.id}</td>
                  <td>{round.driveId}</td>
                  <td>{round.roundName}</td>
                  <td>{round.roundDate || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn-sm" onClick={() => handleEdit(round)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(round.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rounds.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    {formData.driveId ? 'No rounds found for this drive.' : 'Please select a drive to view rounds.'}
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
              <h2>{editingRound ? 'Edit Round' : 'Add New Round'}</h2>
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
                      {drive.role} - {drive.driveDate}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Round Name</label>
                <input
                  type="text"
                  name="roundName"
                  className="input-control"
                  placeholder="e.g. Technical Round"
                  value={formData.roundName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Round Date</label>
                <input
                  type="date"
                  name="roundDate"
                  className="input-control"
                  value={formData.roundDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingRound ? 'Update Round' : 'Add Round')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rounds;
