import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import './TablePage.css';

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from the actual API
    // axios.get('http://localhost:8080/api/students').then(res => setStudents(res.data));
    
    // Mock Data
    setStudents([
      { id: 1, name: 'Alice Johnson', usn: '1RV20CS001', branch: 'Computer Science', cgpa: 9.2, status: 'Eligible' },
      { id: 2, name: 'Bob Smith', usn: '1RV20CS002', branch: 'Information Science', cgpa: 8.5, status: 'Placed' },
      { id: 3, name: 'Charlie Brown', usn: '1RV20EC005', branch: 'Electronics', cgpa: 7.8, status: 'Not Eligible' },
      { id: 4, name: 'Diana Prince', usn: '1RV20CS015', branch: 'Computer Science', cgpa: 9.6, status: 'Placed' },
      { id: 5, name: 'Evan Davis', usn: '1RV20IS022', branch: 'Information Science', cgpa: 8.1, status: 'Eligible' },
    ]);
  }, []);

  return (
    <div className="table-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>Students Directory</h1>
          <p>Manage student profiles and eligibility criteria.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="glass-panel table-container">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search by name, USN..." className="input-control" />
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
                <th>Name</th>
                <th>USN</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
