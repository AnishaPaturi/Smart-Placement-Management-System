import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, FileText, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    companies: 0,
    applications: 0,
    placedRate: '0%'
  });
  const [drives, setDrives] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [runningEngine, setRunningEngine] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, companiesRes, drivesRes, analyticsRes, applicationsRes] = await Promise.all([
          api.get('/students'),
          api.get('/companies'),
          api.get('/drives'),
          api.get('/analytics/dashboard'),
          api.get('/applications')
        ]);

        setDrives(drivesRes.data);

        const totalStudents = studentsRes.data.length;
        const totalPlaced = analyticsRes.data.totalPlaced || 0;
        const placedRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) + '%' : '0%';

        setStats({
          students: totalStudents,
          companies: companiesRes.data.length,
          applications: applicationsRes.data.length,
          placedRate: placedRate
        });

        setAnalytics(analyticsRes.data);

        // Calculate branch distribution
        const branchCounts = {};
        studentsRes.data.forEach(s => {
          if (s.branch) {
            branchCounts[s.branch] = (branchCounts[s.branch] || 0) + 1;
          }
        });

        const colors = ['var(--brand-primary)', 'var(--brand-accent)', 'var(--success)', 'var(--warning)'];
        const branchArray = Object.entries(branchCounts).map(([name, value], idx) => ({
          name,
          value,
          fill: colors[idx % colors.length]
        }));
        setBranchData(branchArray);
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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', width: '100%' }}>
          <div className="glass-panel main-chart">
            <h3>Placement Trends (Last 6 Months)</h3>
            <div style={{ height: '300px', marginTop: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.monthlyPlacements || [
                  { month: 'Jan', placements: 0 },
                  { month: 'Feb', placements: 0 },
                  { month: 'Mar', placements: 0 },
                  { month: 'Apr', placements: 0 },
                  { month: 'May', placements: 0 },
                  { month: 'Jun', placements: 0 }
                ]}>
                  <defs>
                    <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-tertiary)" tick={{fill: 'var(--text-tertiary)'}} />
                  <YAxis stroke="var(--text-tertiary)" tick={{fill: 'var(--text-tertiary)'}} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="placements" stroke="var(--brand-primary)" fillOpacity={1} fill="url(#colorPlacements)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel">
            <h3>Students by Branch</h3>
            <div style={{ height: '300px', marginTop: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'CSE', value: 400 },
                      { name: 'ISE', value: 300 },
                      { name: 'ECE', value: 300 },
                      { name: 'ME', value: 200 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      'var(--brand-primary)', 
                      'var(--brand-accent)', 
                      'var(--success)', 
                      'var(--warning)'
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-panel recent-activity">
          <h3>Upcoming Drives</h3>
          <div className="activity-list">
            {drives.length === 0 ? <p>No active drives.</p> : drives.map((drive) => (
              <div key={drive.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <h4>{drive.companyName || `Company ID: ${drive.companyId}`} - {drive.role}</h4>
                  <p>Min CGPA: {drive.minCgpa} | {drive.driveDate}</p>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  disabled={runningEngine === drive.id}
                  onClick={async () => {
                    setRunningEngine(drive.id);
                    try {
                      const res = await api.post(`/drives/${drive.id}/shortlist`);
                      alert(`Engine Run Complete! ${res.data.length} students matched the criteria and were shortlisted.`);
                    } catch (err) {
                      alert('Failed to run engine.');
                    }
                    setRunningEngine(null);
                  }}
                >
                  {runningEngine === drive.id ? 'Running...' : 'Run Engine'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
