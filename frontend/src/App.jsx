import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Companies from './pages/Companies';
import Applications from './pages/Applications';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
