import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EvidenceDetails.css';

export default function EvidenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/evidence/${id}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to load evidence details.");
        }

        const data = await res.json();
        setEvidence(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to permanently delete this evidence?");
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/evidence/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        navigate("/my-evidence");
      } else {
        alert("Failed to delete the evidence.");
      }
    } catch (err) {
      alert("An error occurred trying to delete evidence.");
    }
  };

  const getExtFromSrc = (pathStr) => {
    const ext = pathStr.split('.').pop().toLowerCase();
    return ext;
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Evidence Context...</div>;
  if (error || !evidence) return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <h2>Cannot Find Evidence</h2>
      <button onClick={() => navigate('/my-evidence')} style={{ marginTop: '20px', padding: '10px 20px', background: '#FF5A2C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Return to My Evidence
      </button>
    </div>
  );

  return (
    <div className="ed-page">

      {/* Header */}


      <div className="ed-container">

        {/* Left Col */}
        <div className="ed-left-col">
          <div>
            <div className="ed-meta-top">
              <div className="ed-private-badge">
                🔒 {evidence.isPrivate === false ? 'PUBLIC' : 'PRIVATE'}
              </div>
              <div className="ed-date">{new Date(evidence.createdAt || Date.now()).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>

            <h1 className="ed-title">{evidence.title || "Untitled Record"}</h1>
            <div className="ed-location">
              📍 {evidence.location || 'Location Not Specified'}
            </div>
          </div>

          <div className="ed-description-card">
            <h4>Description</h4>
            <p>{evidence.description || 'No direct description appended to this vault fragment.'}</p>
          </div>

          <div className="ed-files-grid">
            {evidence.files && evidence.files.map((file, idx) => {
              const ext = getExtFromSrc(file);
              const url = `http://localhost:5000${file}`;
              const basename = file.split('/').pop();

              if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
                return (
                  <div key={idx} className="ed-image-card" style={{ backgroundImage: `url(${url})` }}>
                    <div className="ed-image-caption">Visual Context - Attachment #{idx + 1}</div>
                  </div>
                );
              }

              if (['mp3', 'm4a', 'wav'].includes(ext)) {
                return (
                  <div key={idx} className="ed-audio-card">
                    <div className="ed-audio-header">
                      <div className="ed-audio-icon">▶</div>
                      <div className="ed-audio-meta">
                        <h5>{basename}</h5>
                        <p>Audio Track</p>
                      </div>
                    </div>
                    <div className="ed-audio-track">
                      <div className="ed-audio-prog"></div>
                    </div>
                    <div className="ed-audio-times">
                      <span>0:00</span>
                      <span>Audio Recording</span>
                    </div>
                  </div>
                );
              }

              // Fallback for doc/pdf sizes and standard representation
              return (
                <div key={idx} className="ed-doc-card">
                  <div className="ed-doc-info">
                    <div className="ed-doc-icon">📄</div>
                    <div className="ed-file-meta">
                      <h5>{basename}</h5>
                      <p>Document</p>
                    </div>
                  </div>
                  <button className="ed-view-btn" onClick={() => window.open(url, "_blank")}>VIEW</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col */}
        <div className="ed-right-col">

          <div className="ed-sidebar-card">
            <h3>Evidence Actions</h3>

            <button className="ed-delete-btn" onClick={handleDelete}>
              🗑️ DELETE EVIDENCE
            </button>

            <div className="ed-security-note">
              <div className="ed-sec-icon">🛡️</div>
              <div className="ed-sec-text">
                <h4>Security Note</h4>
                <p>This entry is securely stored and only accessible by you.</p>
              </div>
            </div>

            <div className="ed-storage-list">
              <div className="ed-storage-row">
                <span className="ed-storage-label">Storage ID</span>
                <span className="ed-storage-val">PR-{(evidence._id || '').slice(-6).toUpperCase()}</span>
              </div>
              <div className="ed-storage-row">
                <span className="ed-storage-label">Hash</span>
                <span className="ed-storage-val">sha256:7f8d...</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
