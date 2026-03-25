import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DashboardLayout.css';
import API_URL from '../api/api';

const MyCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyCases = [
    {
      _id: 1,
      title: "Workplace harassment issue",
      category: "Workplace Harassment",
      urgency: "high",
      status: "In Progress",
      createdAt: "2026-03-20T00:00:00Z"
    },
    {
      _id: 2,
      title: "Tenancy agreement review",
      category: "Property Law",
      urgency: "moderate",
      status: "Resolved",
      createdAt: "2026-03-15T00:00:00Z"
    },
    {
      _id: 3,
      title: "Employment contract dispute",
      category: "Labor Law",
      urgency: "low",
      status: "In Progress",
      createdAt: "2026-03-10T00:00:00Z"
    }
  ];

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch(`${API_URL}/api/case/my-cases`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ''}` // Included for compatibility
          }
        });

        const data = await res.json();
        setCases(data.length ? data : dummyCases);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setCases(dummyCases);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="dashboard-page">


      <div className="dashboard-container">

        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-heading">MANAGEMENT</div>
          <div className="sidebar-nav">
            <div className="sidebar-item active" onClick={() => navigate('/my-cases')}>
              <span className="sidebar-item-icon">🗂️</span>
              My Case
            </div>
            <div className="sidebar-item" onClick={() => navigate('/my-evidence')}>
              <span className="sidebar-item-icon">☁️</span>
              My Evidence
            </div>
          </div>

          <button className="sidebar-cta-btn" onClick={() => navigate('/find-lawyer')}>
            Find a Lawyer
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">
          <div className="dashboard-header-flex">
            <div className="dashboard-title-area">
              <h1>Your Cases</h1>
              <p>Track and manage your submitted legal issues</p>
            </div>
          </div>

          <div className="case-list">
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>Loading cases...</div>
            ) : (
              cases.map((c) => (
                <div className="case-item" key={c._id}>
                  <div className="case-info">
                    <h3>
                      {c.title || "Untitled Case"}
                      <span className={`urgency-badge urgency-${c.urgency || 'low'}`}>{(c.urgency || 'low').toUpperCase()}</span>
                    </h3>
                    <div className="case-meta">
                      <span className="meta-pill">{c.category || "General"}</span>
                      <span className="meta-date">📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                      <span className="status-indicator">
                        <span className={`status-dot ${c.status === 'Resolved' ? 'resolved' : 'progress'}`}></span>
                        <span className={`status-text ${c.status === 'Resolved' ? 'resolved' : 'progress'}`}>{c.status || 'In Progress'}</span>
                      </span>
                    </div>
                  </div>
                  <button className={`view-btn ${(c.status || 'In Progress') === 'In Progress' ? 'primary-view' : ''}`}>
                    VIEW DETAILS
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bottom-actions-grid">
            <div className="dash-card bottom-action-card">
              <div className="ba-icon">📚</div>
              <h3>Legal Resource Center</h3>
              <p>Access our curated library of legal precedents and documentation guides specifically for employment issues.</p>
              <span className="ba-link" onClick={() => navigate('/know-your-rights')}>BROWSE LIBRARY →</span>
            </div>

            <div className="dash-card bottom-action-card">
              <div className="ba-icon orange">🎧</div>
              <h3>Talk to an Assistant</h3>
              <p>Need immediate help with a case update? Our legal assistants are available for real-time guidance.</p>
              <span className="ba-link" onClick={() => navigate('/chat')}>START CHAT →</span>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default MyCases;
