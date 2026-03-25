import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/NgoDetails.css';
import API_URL from '../api/api';

export default function NgoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgo = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/${id}`);
        if (res.ok) {
          setNgo(await res.json());
        } else {
          setNgo(null);
        }
      } catch (err) {
        console.error("Failed to fetch NGO:", err);
        setNgo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNgo();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>Loading NGO details...</div>;
  }

  if (!ngo) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2>NGO not found</h2>
        <button onClick={() => navigate('/find-help')} className="ngo-btn-primary" style={{width: 'auto', display: 'inline-block', marginTop: '20px'}}>
          Return to directory
        </button>
      </div>
    );
  }

  return (
    <div className="ngo-page">
      
      {/* Header */}
      <header className="ngo-header">
        <div className="ngo-header-left" onClick={() => navigate(-1)}>
          <span className="ngo-back-icon">←</span>
          <span className="ngo-logo-text">Parichay</span>
        </div>
        <div className="ngo-header-right">
          <button className="ngo-icon-btn">🔗</button>
          <button className="ngo-icon-btn">⋮</button>
        </div>
      </header>

      {/* Main Container */}
      <div className="ngo-container">
        
        {/* Left Column */}
        <div className="ngo-left-col">
          
          <div className="ngo-main-card">
            {ngo.logo && (
              <div style={{ marginBottom: '16px' }}>
                <img src={ngo.logo} alt={`${ngo.name} logo`} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e2e8f0' }} />
              </div>
            )}
            <div className="ngo-tags-wrap">
              <span className="ngo-tag orange">{ngo.category}</span>
              <span className={`ngo-tag ${ngo.availability === 'available' ? 'green' : 'orange'}`}>● {ngo.availability === 'available' ? 'Available' : ngo.availability === 'limited' ? 'Limited' : 'Closed'}</span>
            </div>

            <h1>{ngo.name}</h1>
            
            <div className="ngo-meta-wrap">
              <div className="ngo-meta-item">
                <span className="icon">📍</span> {ngo.location}
              </div>
              <div className="ngo-divider-vertical"></div>
              {ngo.isVerified && (
                <div className="ngo-meta-item blue">
                  <span className="icon">🛡️</span> Verified NGO
                </div>
              )}
            </div>

            <p className="ngo-desc">{ngo.description}</p>
          </div>

          <div className="ngo-services-grid">
            {(ngo.services || []).map((svc, idx) => (
              <div className="ngo-service-card" key={idx}>
                <div className="ngo-service-icon">
                  {svc === 'Legal Aid' ? '⚖️' : svc === 'Shelter' ? '🏠' : svc === 'Counseling' ? '🧠' : svc === 'Healthcare' ? '🏥' : '🤝'}
                </div>
                <h3>{svc}</h3>
                <p>Providing {svc.toLowerCase()} support for those who need it most.</p>
              </div>
            ))}
          </div>

          <div className="ngo-bottom-banner">
            <div className="ngo-banner-sub">Our Commitment</div>
            <h2 className="ngo-banner-title">Bridging the gap between law and justice.</h2>
          </div>

        </div>

        {/* Right Column */}
        <div className="ngo-right-col">
          
          <div className="ngo-contact-card">
            <h2>Connect with Aasra</h2>
            
            <div className="ngo-contact-list">
              <div className="ngo-contact-row">
                <div className="ngo-contact-icon">📞</div>
                <div className="ngo-contact-info">
                  <h4>Phone</h4>
                  <p>{ngo.phone}</p>
                </div>
              </div>

              <div className="ngo-contact-row">
                <div className="ngo-contact-icon">✉️</div>
                <div className="ngo-contact-info">
                  <h4>Email</h4>
                  <p>{ngo.email}</p>
                </div>
              </div>

              <div className="ngo-contact-row">
                <div className="ngo-contact-icon">🌐</div>
                <div className="ngo-contact-info">
                  <h4>Website</h4>
                  <p>{ngo.website}</p>
                </div>
              </div>
            </div>

            <button className="ngo-btn-primary">
              💬 CONTACT NOW
            </button>
            <button className="ngo-btn-secondary">
              SAVE FOR LATER
            </button>
          </div>

          <div className="ngo-map-card">
            <div className="ngo-map-image"></div>
            <button className="ngo-map-view-btn">View on Map</button>
          </div>

          <div className="ngo-legal-box">
            <div className="ngo-legal-icon">🛡️</div>
            <div className="ngo-legal-text">
              <h4>Legal Protection</h4>
              <p>Your data and cases are handled with absolute confidentiality under attorney-client privilege.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
