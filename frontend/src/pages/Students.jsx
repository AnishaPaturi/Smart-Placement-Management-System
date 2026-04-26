import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Filter, MoreVertical, Plus, X } from 'lucide-react';
import './TablePage.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    cgpa: '',
    activeBacklogs: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/students');
        // Map the backend data format to the table format
        const fetchedStudents = response.data.map(s => ({
          id: s.id,
          name: s.name,
          usn: s.email.split('@')[0], // Using email prefix as mock USN for now
          branch: s.branch,
          cgpa: s.cgpa,
          status: s.activeBacklogs === 0 ? 'Eligible' : 'Not Eligible'
        }));
        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = filterBranch === '' || student.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const branches = [...new Set(students.map(s => s.branch).filter(Boolean))];

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
      await api.post('/students/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        branch: formData.branch,
        cgpa: parseFloat(formData.cgpa) || null,
        activeBacklogs: parseInt(formData.activeBacklogs) || 0
      });

      // Refresh the student list
      const response = await api.get('/students');
      const fetchedStudents = response.data.map(s => ({
        id: s.id,
        name: s.name,
        usn: s.email.split('@')[0],
        branch: s.branch,
        cgpa: s.cgpa,
        status: s.activeBacklogs === 0 ? 'Eligible' : 'Not Eligible'
      }));
      setStudents(fetchedStudents);

      setShowModal(false);
      setFormData({ name: '', email: '', password: '', branch: '', cgpa: '', activeBacklogs: 0 });
    } catch (error) {
      console.error("Error adding student", error);
      alert('Failed to add student: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Students Directory</h1>
          <p>Manage student profiles and eligibility criteria.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Add New Student</h2>
              <button className="icon-btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="input-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-control"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    className="input-control"
                    placeholder="e.g. CSE, ECE"
                    value={formData.branch}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    step="0.01"
                    min="0"
                    max="10"
                    className="input-control"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Active Backlogs</label>
                <input
                  type="number"
                  name="activeBacklogs"
                  min="0"
                  className="input-control"
                  value={formData.activeBacklogs}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass-panel table-container">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, USN..."
              className="input-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-control"
            style={{ width: 'auto', minWidth: '150px' }}
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>USN</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm">{student.name.charAt(0)}</div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td>{student.usn}</td>
                  <td>{student.branch}</td>
                  <td>{student.cgpa}</td>
                  <td>
                    <span className={`status-badge status-${student.status.toLowerCase().replace(' ', '-')}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn-sm"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
              {currentStudents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No students found.
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

export default Students;
