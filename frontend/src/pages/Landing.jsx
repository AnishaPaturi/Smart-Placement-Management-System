import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Building, FileText, TrendingUp } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Track and manage student profiles, academic records, and placement eligibility seamlessly.'
    },
    {
      icon: Building,
      title: 'Company Drives',
      description: 'Streamline campus recruitment with organized company drives and application tracking.'
    },
    {
      icon: FileText,
      title: 'AI Resume Parsing',
      description: 'Automatically extract skills and qualifications from resumes using advanced AI.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Get insights into placement statistics and student performance metrics.'
    }
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">SmartPlace</div>
        <div className="landing-nav-links">
          <Link to="/login" className="landing-link">Login</Link>
          <Link to="/register" className="landing-btn">Get Started</Link>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="landing-hero"
      >
        <div className="landing-hero-content">
          <h1>Smart Placement Management System</h1>
          <p className="landing-subtitle">
            Streamline campus placements with AI-powered resume parsing, comprehensive analytics, and seamless communication between students and companies.
          </p>
          <div className="landing-cta">
            <Link to="/register" className="landing-cta-primary">Get Started Free</Link>
            <Link to="/login" className="landing-cta-secondary">Sign In</Link>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="floating-card card-1">
            <TrendingUp size={24} color="var(--brand-primary)" />
            <span>Placement Rate: 85%</span>
          </div>
          <div className="floating-card card-2">
            <Users size={24} color="var(--success)" />
            <span>500+ Students</span>
          </div>
          <div className="floating-card card-3">
            <Building size={24} color="var(--brand-accent)" />
            <span>50+ Companies</span>
          </div>
        </div>
      </motion.div>

      <section className="landing-features">
        <h2>Why Choose SmartPlace?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <feature.icon size={32} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 SmartPlace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
