import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, FileText, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    applications: 0,
    placedRate: '0%'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, companiesRes] = await Promise.all([
          api.get('/students'),
          api.get('/companies')
        ]);
        
        setStats({
          students: studentsRes.data.length,
          companies: companiesRes.data.length,
          applications: 15, // Mock for now until applications endpoint is solid
          placedRate: '24%' // Mock rate
        });
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: Users, color: 'var(--brand-primary)', change: '+2%' },
    { title: 'Companies Hiring', value: stats.companies, icon: Building, color: 'var(--brand-accent)', change: '+5%' },
    { title: 'Active Applications', value: stats.applications, icon: FileText, color: 'var(--success)', change: '+12%' },
    { title: 'Placement Rate', value: stats.placedRate, icon: TrendingUp, color: 'var(--warning)', change: '+2%' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor placement activities and student progress.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="stat-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
              <div className="stat-change positive">
                {stat.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="glass-panel main-chart">
          <h3>Recent Placement Activity</h3>
          <div className="chart-placeholder">
            {/* Placeholder for actual chart */}
            <div className="bar-chart">
              {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                <div key={i} className="bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel recent-activity">
          <h3>Upcoming Rounds</h3>
          <div className="activity-list">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <h4>Google - Technical Interview</h4>
                  <p>Tomorrow at 10:00 AM</p>
                </div>
                <button className="btn btn-secondary btn-sm">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
