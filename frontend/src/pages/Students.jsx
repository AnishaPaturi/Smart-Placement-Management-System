import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import './TablePage.css';

const Students = () => {
  const [students, setStudents] = useState([]);

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
