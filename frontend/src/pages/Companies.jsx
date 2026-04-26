import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Building, X } from 'lucide-react';
import api from '../api/axios';
import './TablePage.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies');
        // We'll mock the role/ctc for now if it's not provided by the backend company model
        const fetchedCompanies = response.data.map((c, index) => ({
          id: c.id,
          name: c.name,
          sector: c.description || 'Technology', // mock sector using description
          role: 'Various Roles', // mock role
          ctc: 'TBD', // mock ctc
          status: 'Hiring'
        }));
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    return searchQuery === '' ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage -1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
      await api.post('/companies', {
        name: formData.name,
        description: formData.description,
        website: formData.website
      });

      // Refresh the company list
      const response = await api.get('/companies');
      const fetchedCompanies = response.data.map((c) => ({
        id: c.id,
        name: c.name,
        sector: c.description || 'Technology',
        role: 'Various Roles',
        ctc: 'TBD',
        status: 'Hiring'
      }));
      setCompanies(fetchedCompanies);

      setShowModal(false);
      setFormData({ name: '', description: '', website: '' });
    } catch (error) {
      console.error("Error adding company", error);
      alert('Failed to add company: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Companies</h1>
          <p>Manage recruiting companies and their placement drives.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Company
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Add New Company</h2>
              <button className="icon-btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="input-group">
                <label>Company Name</label>
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
                <label>Description/Sector</label>
                <input
                  type="text"
                  name="description"
                  className="input-control"
                  placeholder="e.g. Technology, Finance"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  className="input-control"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Company'}
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
              placeholder="Search companies..."
              className="input-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                <th>Company Name</th>
                <th>Sector</th>
                <th>Role Offered</th>
                <th>CTC Package</th>
                <th>Drive Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-sm" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--brand-primary)' }}>
                        <Building size={16} />
                      </div>
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </td>
                  <td>{company.sector}</td>
                  <td>{company.role}</td>
                  <td>{company.ctc}</td>
                  <td>
                    <span className={`status-badge status-${company.status.toLowerCase()}`}>
                      {company.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm">View Details</button>
                  </td>
                </tr>
              ))}
              {currentCompanies.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No companies found.
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

export default Companies;
