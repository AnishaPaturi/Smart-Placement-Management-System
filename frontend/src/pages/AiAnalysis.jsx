import React, { useState, useEffect } from 'react';
import { UploadCloud, Sparkles, Target, Briefcase, ChevronRight, CheckCircle, AlertTriangle, Lightbulb, FileText, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import './Dashboard.css';

const AiAnalysis = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [activeTab, setActiveTab] = useState('ats');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleATSAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume (PDF) first.");
      return;
    }
    setError('');
    setAnalyzing(true);
    setAtsResult(null);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await api.post('/ai/analyze-ats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAtsResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "ATS Analysis failed. Please check backend logs or API key.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleResumeAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume (PDF) first.");
      return;
    }
    setError('');
    setAnalyzing(true);
    setResumeResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/ai/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Resume Analysis failed. Please check backend logs or API key.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <h1>AI Resume Analysis <Sparkles size={24} style={{ color: 'var(--brand-accent)', marginLeft: '0.5rem', display: 'inline' }} /></h1>
        <p>Analyze your resume with ATS scoring and get actionable feedback to optimize for job descriptions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Side: Inputs */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <button
              className={`btn ${activeTab === 'ats' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('ats')}
              style={{ borderRadius: '8px 8px 0 0' }}
            >
              <BarChart3 size={16} /> ATS Score
            </button>
            <button
              className={`btn ${activeTab === 'resume' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('resume')}
              style={{ borderRadius: '8px 8px 0 0' }}
            >
              <FileText size={16} /> Resume Analysis
            </button>
          </div>

          {activeTab === 'ats' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Job Description (Optional but Recommended)
                </label>
                <textarea
                  className="input-control"
                  style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Paste the job description here to get a tailored ATS score..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={analyzing}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  Providing a job description helps the AI tailor its analysis and improve keyword matching.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Upload Resume
                </label>
                <div
                  style={{
                    border: '2px dashed var(--glass-border)',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s',
                    backgroundColor: file ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    borderColor: file ? 'var(--brand-primary)' : 'var(--glass-border)'
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={analyzing}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  <UploadCloud size={40} color={file ? 'var(--brand-primary)' : 'var(--text-tertiary)'} style={{ margin: '0 auto', marginBottom: '1rem' }} />
                  <h4 style={{ color: file ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                    {file ? file.name : 'Click or Drag PDF here'}
                  </h4>
                </div>
              </div>
            </>
          )}

          {activeTab === 'resume' && (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Upload Resume
              </label>
              <div
                style={{
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.3s',
                  backgroundColor: file ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  borderColor: file ? 'var(--brand-primary)' : 'var(--glass-border)'
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={analyzing}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <UploadCloud size={40} color={file ? 'var(--brand-primary)' : 'var(--text-tertiary)'} style={{ margin: '0 auto', marginBottom: '1rem' }} />
                <h4 style={{ color: file ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                  {file ? file.name : 'Click or Drag PDF here'}
                </h4>
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            onClick={activeTab === 'ats' ? handleATSAnalyze : handleResumeAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles size={20} /> {activeTab === 'ats' ? 'Check ATS Score' : 'Analyze Resume'}
              </>
            )}
          </button>
        </div>

        {/* Right Side: Results */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>

          {/* ATS Score Display */}
          {activeTab === 'ats' && !analyzing && !atsResult && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              <BarChart3 size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>ATS Score Checker</h3>
              <p style={{ maxWidth: '300px', marginTop: '0.5rem' }}>Upload your resume and paste a job description to get your ATS compatibility score.</p>
            </div>
          )}

          {activeTab === 'ats' && atsResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Main ATS Score */}
              <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto', marginBottom: '1rem' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="var(--glass-border)" strokeWidth="12" />
                    <circle
                      cx="80" cy="80" r="70" fill="none"
                      stroke={getScoreColor(atsResult.atsScore || 0)}
                      strokeWidth="12"
                      strokeDasharray={`${(atsResult.atsScore || 0) * 4.4} 440`}
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, color: getScoreColor(atsResult.atsScore || 0) }}>{atsResult.atsScore || 0}</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>out of 100</span>
                  </div>
                </div>
                <h3 style={{ color: getScoreColor(atsResult.atsScore || 0), marginBottom: '0.5rem' }}>
                  {getScoreLabel(atsResult.atsScore || 0)} ATS Match
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{atsResult.overallFeedback || 'Analysis complete.'}</p>
              </div>

              {/* Section Scores */}
              {atsResult.sectionScores && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={18} /> Section Scores
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(atsResult.sectionScores).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div style={{ flex: 2, height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${value}%`, height: '100%', background: getScoreColor(value), borderRadius: '4px', transition: 'width 1s ease' }} />
                        </div>
                        <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: getScoreColor(value) }}>{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {atsResult.strengths && Array.isArray(atsResult.strengths) && (
                  <div>
                    <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                      <CheckCircle size={16} /> Strengths
                    </h4>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {atsResult.strengths.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                          <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {atsResult.weaknesses && Array.isArray(atsResult.weaknesses) && (
                  <div>
                    <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                      <AlertTriangle size={16} /> Areas to Improve
                    </h4>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {atsResult.weaknesses.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                          <AlertTriangle size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Keywords Analysis */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {atsResult.matchedKeywords && Array.isArray(atsResult.matchedKeywords) && (
                  <div>
                    <h4 style={{ marginBottom: '0.75rem', color: 'var(--success)', fontSize: '0.9rem' }}>Matched Keywords</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {atsResult.matchedKeywords.map((kw, idx) => (
                        <span key={idx} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {atsResult.missingKeywords && Array.isArray(atsResult.missingKeywords) && (
                  <div>
                    <h4 style={{ marginBottom: '0.75rem', color: 'var(--danger)', fontSize: '0.9rem' }}>Missing Keywords</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {atsResult.missingKeywords.map((kw, idx) => (
                        <span key={idx} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {atsResult.suggestions && Array.isArray(atsResult.suggestions) && (
                <div>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={18} color="var(--warning)" /> Actionable Suggestions
                  </h4>
                  <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                    {atsResult.suggestions.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: idx < atsResult.suggestions.length - 1 ? '0.75rem' : 0 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)', marginTop: '8px', flexShrink: 0 }}></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Resume Analysis Results */}
          {activeTab === 'resume' && !analyzing && !resumeResult && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              <FileText size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Resume Analysis</h3>
              <p style={{ maxWidth: '250px', marginTop: '0.5rem' }}>Upload your resume to get detailed feedback and skill analysis.</p>
            </div>
          )}

          {activeTab === 'resume' && resumeResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ textAlign: 'center', width: '150px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Match</p>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{resumeResult.currentMatchPercent || 50}%</div>
                </div>
                <div style={{ textAlign: 'center', width: '150px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Optimized Potential</p>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{resumeResult.optimizedMatchPercent || 90}%</div>
                </div>
              </div>

              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} color="var(--success)" /> AI Feedback
              </h4>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {resumeResult.feedback && Array.isArray(resumeResult.feedback) ? resumeResult.feedback.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <ChevronRight size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                )) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No specific feedback generated.</p>
                )}
              </ul>

              {resumeResult.suggestions && Array.isArray(resumeResult.suggestions) && (
                <>
                  <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={18} color="var(--warning)" /> Suggestions
                  </h4>
                  <ul style={{ listStyleType: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', backgroundColor: 'rgba(234, 179, 8, 0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                    {resumeResult.suggestions.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--warning)', marginTop: '8px', flexShrink: 0 }}></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h4 style={{ marginBottom: '1rem' }}>Detected Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {resumeResult.detectedSkills && resumeResult.detectedSkills.split(',').map((skill, idx) => (
                  <span key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.85rem', border: '1px solid var(--glass-border)' }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Analyzing State */}
          {analyzing && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles size={48} />
              </motion.div>
              <h3 style={{ marginTop: '1.5rem', color: 'var(--text-primary)' }}>Analyzing Resume...</h3>
              <p style={{ color: 'var(--text-secondary)' }}>AI is processing your resume with advanced algorithms</p>
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default AiAnalysis;
