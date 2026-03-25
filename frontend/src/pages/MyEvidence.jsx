import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DashboardLayout.css';
import API_URL from '../api/api';

const MyEvidence = () => {
  const navigate = useNavigate();
  const [evidenceList, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyEvidence = [
    {
      _id: 1,
      title: "Incident Photo at Office",
      type: "image",
      date: "Feb 15, 2026",
      location: "Corporate Tower, Sector 62",
      description: "Photograph showing the damaged workstation and surrounding area immediately after the structural failure of...",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    },
    {
      _id: 2,
      title: "Witness Statement Recording",
      type: "audio",
      date: "Feb 16, 2026",
      location: "Private Residence",
      description: "Audio recording of eyewitness account from the floor supervisor regarding safety protocol violations leading to the incident.",
    },
    {
      _id: 3,
      title: "Employment Contract 2025",
      type: "document",
      date: "Jan 02, 2025",
      location: "Legal Document",
      description: "Full employment agreement containing relevant safety liability clauses and workstation maintenance responsibilities.",
    }
  ];

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await fetch(`${API_URL}/api/evidence/my-evidence`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ''}` // Included for compatibility
          }
        });

        const data = await res.json();
        setEvidence(data.length ? data : dummyEvidence);
      } catch (err) {
        console.error("Error fetching evidence:", err);
        setEvidence(dummyEvidence);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  return (
    <div className="dashboard-page">


      <div className="dashboard-container">

        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-heading">MANAGEMENT</div>
          <div className="sidebar-nav">
            <div className="sidebar-item" onClick={() => navigate('/my-cases')}>
              <span className="sidebar-item-icon">🗂️</span>
              My Case
            </div>
            <div className="sidebar-item active" onClick={() => navigate('/my-evidence')}>
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
              <h1>Your Evidence</h1>
              <p>Manage, upload, and organize your legal evidence securely. All files are encrypted and private by default.</p>
            </div>

            <button className="sidebar-cta-btn" style={{ padding: '14px 24px' }} onClick={() => navigate('/save-evidence')}>
              <span style={{ marginRight: '8px' }}>+</span> ADD EVIDENCE
            </button>
          </div>

          <div className="evidence-grid">
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', gridColumn: '1 / -1' }}>Loading evidence...</div>
            ) : (
              evidenceList.map((ev) => {
                const getFileType = (filesArr) => {
                  if (!filesArr || filesArr.length === 0) return ev.type || 'document';
                  const ext = filesArr[0].split('.').pop().toLowerCase();
                  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
                  if (['mp3', 'm4a', 'wav'].includes(ext)) return 'audio';
                  return 'document';
                };

                const extType = getFileType(ev.files);
                const fileImage = (ev.files && ev.files.length > 0 && extType === 'image') 
                                    ? `${API_URL}${ev.files[0]}` 
                                    : ev.image;

                return (
                  <div className="dash-card evidence-card" key={ev._id || ev.id}>
                    
                    {extType === 'image' && (
                      <div className="ev-image" style={{ backgroundImage: `url(${fileImage})` }}>
                        <div className="ev-header-row">
                          <div className="private-pill">🔒 {ev.isPrivate === false ? 'PUBLIC' : 'PRIVATE'}</div>
                          <div className="dots-menu">•••</div>
                        </div>
                      </div>
                    )}

                    {extType !== 'image' && (
                      <div className="ev-header-row no-img">
                        <div className="private-pill">🔒 {ev.isPrivate === false ? 'PUBLIC' : 'PRIVATE'}</div>
                        <div className="dots-menu dark">•••</div>
                      </div>
                    )}

                    <div className="ev-body">
                      <h3>{ev.title || "Untitled Evidence"}</h3>
                      <div className="ev-meta-row">
                        <span>📅 {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : ev.date}</span>
                        <span>📍 {ev.location || "Unknown"}</span>
                      </div>

                      {extType === 'audio' && (
                        <div className="ev-audio-player">
                          <button className="play-btn">▶</button>
                          <div className="audio-track">
                            <div className="audio-progress"></div>
                          </div>
                          <div className="audio-times">01:12 / 03:45</div>
                        </div>
                      )}

                      <p className="ev-desc">{ev.description}</p>
                    </div>
                    
                    <div className="ev-footer" style={{ margin: '0 24px 24px 24px' }}>
                      <div className={`icon-box ${extType === 'image' ? 'red' : extType === 'audio' ? 'red' : 'blue'}`}>
                        {extType === 'image' ? '🖼️' : extType === 'audio' ? '🎙️' : '📄'}
                      </div>
                      <span className="detail-link" onClick={() => navigate(`/evidence/${ev._id || ev.id}`)}>VIEW DETAILS →</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Empty State Dropzone styled to match */}
            <div className="dash-card ev-empty-drop" onClick={() => navigate('/save-evidence')} style={{ cursor: 'pointer' }}>
              <div className="upload-icon-circle">☁️</div>
              <h3>No evidence uploaded yet</h3>
              <p>Need more space for evidence? Drag and drop files here to get started.</p>
              <button className="browse-btn">BROWSE FILES</button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default MyEvidence;
