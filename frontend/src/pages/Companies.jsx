import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Building } from 'lucide-react';
import api from '../api/axios';
import './TablePage.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);

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

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Companies</h1>
          <p>Manage recruiting companies and their placement drives.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Company
        </button>
      </div>

      <div className="glass-panel table-container">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search companies..." className="input-control" />
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
              {companies.map((company) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Companies;
