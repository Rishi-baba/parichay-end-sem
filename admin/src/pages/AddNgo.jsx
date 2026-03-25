import React, { useState } from 'react';
import './AddLawyer.css'; // Reusing the identical sleek styling from Lawyer to ensure consistency

const AddNgo = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    availability: "available",
    description: "",
    services: [],
    phone: "",
    email: "",
    website: "",
    isVerified: false,
    logo: ""
  });

  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' && name === 'isVerified' ? checked : value
    }));
  };

  const toggleService = (service) => {
    setFormData(prev => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter(s => s !== service)
          : [...prev.services, service]
      };
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        credentials: "include",
        body: fd
      });
      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.url);
      } else {
        alert("Logo upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.location || !formData.description) {
      alert("Please fill all required primary fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/ngos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure session token is sent
        body: JSON.stringify({ ...formData, logo: logoUrl })
      });

      if (res.ok) {
        alert("NGO successfully registered into the system.");
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert("Error adding NGO: " + (errorData.message || errorData.error));
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-lawyer-container">
      <div className="add-lawyer-header">
        <h1>Add NGO</h1>
        <p>Register a non-governmental organization into the system</p>
      </div>

      <form className="add-lawyer-form" onSubmit={handleSubmit}>
        
        {/* BASIC INFORMATION */}
        <div className="form-section">
          <div className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            BASIC INFORMATION
          </div>
          <div className="basic-info-grid">
            <div className="photo-upload-area">
              <label htmlFor="ngo-logo-input" style={{ cursor: 'pointer', display: 'block' }}>
                <div className="photo-placeholder">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>UPLOAD LOGO</span>
                    </>
                  )}
                </div>
              </label>
              <input id="ngo-logo-input" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              <small>{logoPreview ? '✓ Logo selected' : 'MAX SIZE: 2MB. JPG/PNG ONLY.'}</small>
            </div>
            
            <div className="basic-fields">
              <div className="input-group">
                <label>NGO NAME</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Global Rights Watch" required />
              </div>
              <div className="grid-2col" style={{ gap: '20px' }}>
                <div className="input-group">
                  <label>CATEGORY</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Legal Aid">Legal Aid</option>
                    <option value="Human Rights">Human Rights</option>
                    <option value="Child Protection">Child Protection</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Rehabilitation">Rehabilitation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>LOCATION</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. New Delhi, India" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <div className="form-section">
          <div className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            CONTACT DETAILS
          </div>
          <div className="grid-2col">
            <div className="input-group">
              <label>EMAIL ADDRESS</label>
              <div className="input-with-icon">
                <span>@</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@ngo.org" />
              </div>
            </div>
            <div className="input-group">
              <label>PHONE NUMBER</label>
              <div className="input-with-icon">
                <span>📞</span>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>WEBSITE</label>
              <div className="input-with-icon">
                <span>🌐</span>
                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://www.ngo.org" />
              </div>
            </div>
          </div>
        </div>

        {/* AVAILABILITY & SERVICES */}
        <div className="grid-2col" style={{ gap: '40px', marginBottom: '40px' }}>
          
          <div className="form-section" style={{marginBottom: 0}}>
            <div className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              AVAILABILITY
            </div>
            <div className="input-group">
              <label>CURRENT STATUS</label>
              <div className="status-pill-group">
                <button type="button" className={`pill-btn ${formData.availability === 'available' ? 'active' : ''}`} onClick={() => setFormData(prev => ({...prev, availability: 'available'}))}>AVAILABLE</button>
                <button type="button" className={`pill-btn ${formData.availability === 'limited' ? 'active' : ''}`} onClick={() => setFormData(prev => ({...prev, availability: 'limited'}))}>LIMITED</button>
                <button type="button" className={`pill-btn ${formData.availability === 'closed' ? 'active' : ''}`} onClick={() => setFormData(prev => ({...prev, availability: 'closed'}))}>CLOSED</button>
              </div>
            </div>
          </div>

          <div className="form-section" style={{marginBottom: 0}}>
            <div className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              SERVICES OFFERED
            </div>
            <div className="input-group">
              <label>CORE SERVICES</label>
              <div className="checkbox-group" style={{ flexWrap: 'wrap', gap: '15px' }}>
                {["Legal Aid", "Shelter", "Rehabilitation", "Counseling", "Healthcare"].map(service => (
                  <label key={service} className="custom-checkbox">
                    <input type="checkbox" checked={formData.services.includes(service)} onChange={() => toggleService(service)} />
                    <span className="checkmark"></span> {service}
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="form-section">
          <div className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            NGO DESCRIPTION
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe the NGO's mission, history, and primary focus area..." required></textarea>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="bottom-metadata-bar">
          <div className="verify-toggle">
            <div className="verify-text">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#2dd4bf" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <div>
                <h4>VERIFIED NGO</h4>
                <p>Authentication of organization status and licenses</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn">CANCEL REGISTRY</button>
          <button type="submit" className="confirm-btn" disabled={!formData.name || !formData.category || !formData.location || !formData.description || loading}>
            {loading ? "PROCESSING..." : "CONFIRM & ADD NGO ➔"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddNgo;
