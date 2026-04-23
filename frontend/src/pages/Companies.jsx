import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Building } from 'lucide-react';
import './TablePage.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Mock Data
    setCompanies([
      { id: 1, name: 'Google', sector: 'Technology', role: 'SDE', ctc: '24 LPA', status: 'Hiring' },
      { id: 2, name: 'Microsoft', sector: 'Technology', role: 'Cloud Engineer', ctc: '22 LPA', status: 'Upcoming' },
      { id: 3, name: 'Goldman Sachs', sector: 'Finance', role: 'Analyst', ctc: '20 LPA', status: 'Completed' },
      { id: 4, name: 'Amazon', sector: 'E-commerce', role: 'SDE', ctc: '28 LPA', status: 'Hiring' },
    ]);
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
