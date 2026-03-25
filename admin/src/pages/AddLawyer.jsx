import React, { useState, useEffect } from 'react';
import './AddLawyer.css';

const AddLawyer = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    specialization: [],
    experience: "",
    barCouncilNumber: "",
    languages: [],
    email: "",
    phone: "",
    availability: "available",
    consultationTypes: [],
    bio: "",
    isVerified: false,
    assignedCases: []
  });

  const [activeCases, setActiveCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/cases", {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setActiveCases(data);
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      }
    };
    fetchCases();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' && name === 'isVerified' ? checked : value
    }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
      };
    });
  };

  const handleLanguageAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const val = e.target.value.trim();
      if (!formData.languages.includes(val)) {
        setFormData(prev => ({ ...prev, languages: [...prev.languages, val] }));
      }
      e.target.value = '';
    }
  };

  const removeLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const handleSpecializationChange = (e) => {
    const val = e.target.value;
    if (val && !formData.specialization.includes(val)) {
      setFormData(prev => ({ ...prev, specialization: [...prev.specialization, val] }));
    }
    e.target.value = '';
  };

  const removeSpecialization = (spec) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter(s => s !== spec)
    }));
  };

  const handleCaseChange = (e) => {
    const val = e.target.value;
    if (val && !formData.assignedCases.includes(val)) {
      setFormData(prev => ({ ...prev, assignedCases: [...prev.assignedCases, val] }));
    }
    e.target.value = '';
  };

  const removeCase = (caseId) => {
    setFormData(prev => ({
      ...prev,
      assignedCases: prev.assignedCases.filter(c => c !== caseId)
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    const formDataFile = new FormData();
    formDataFile.append("image", file);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formDataFile
      });
      if (res.ok) {
        const data = await res.json();
        setPhotoUrl(data.url);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || formData.specialization.length === 0 || !formData.barCouncilNumber) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/lawyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, photo: photoUrl })
      });

      if (res.ok) {
        alert("Lawyer successfully registered into the system.");
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert("Error adding lawyer: " + (errorData.message || errorData.error));
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
        <h1>Add Lawyer</h1>
        <p>Register a verified legal professional into the system</p>
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
              <label htmlFor="lawyer-photo-input" style={{ cursor: 'pointer', display: 'block' }}>
                <div className="photo-placeholder">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    <>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span>UPLOAD PHOTO</span>
                    </>
                  )}
                </div>
              </label>
              <input id="lawyer-photo-input" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <small>{photoPreview ? '✓ Photo selected' : 'MAX SIZE: 2MB. JPG/PNG ONLY.'}</small>
            </div>
            
            <div className="basic-fields">
              <div className="input-group">
                <label>FULL NAME</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Adv. Julian Vane" required />
              </div>
              <div className="input-group">
                <label>GENDER</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL DETAILS */}
        <div className="form-section">
          <div className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            PROFESSIONAL DETAILS
          </div>
          <div className="grid-2col">
            <div className="input-group">
              <label>SPECIALIZATION</label>
              <div className="tags-container">
                {formData.specialization.map(spec => (
                  <span key={spec} className="tag">{spec} <button type="button" onClick={() => removeSpecialization(spec)}>×</button></span>
                ))}
                <select onChange={handleSpecializationChange} value="">
                  <option value="">Select Practice Area</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Civil Rights">Civil Rights</option>
                  <option value="Immigration">Immigration</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>EXPERIENCE (YEARS)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years of practice" />
            </div>
            <div className="input-group">
              <label>BAR COUNCIL REG. NUMBER</label>
              <input type="text" name="barCouncilNumber" value={formData.barCouncilNumber} onChange={handleChange} placeholder="BCI/STATE/XXXX/YEAR" required />
            </div>
            <div className="input-group">
              <label>LANGUAGES SPOKEN</label>
              <div className="tags-container">
                {formData.languages.map(lang => (
                  <span key={lang} className="tag">{lang} <button type="button" onClick={() => removeLanguage(lang)}>×</button></span>
                ))}
                <input type="text" placeholder="Add language and press Enter..." onKeyDown={handleLanguageAdd} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT & AVAILABILITY */}
        <div className="grid-2col" style={{ gap: '40px' }}>
          
          <div className="form-section">
            <div className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="Mm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              CONTACT DETAILS
            </div>
            <div className="input-group" style={{marginBottom: '20px'}}>
              <label>EMAIL ADDRESS</label>
              <div className="input-with-icon">
                <span>@</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="lawyer@firm.com" required />
              </div>
            </div>
            <div className="input-group">
              <label>PHONE NUMBER</label>
              <div className="input-with-icon">
                <span>📞</span>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              AVAILABILITY
            </div>
            <div className="input-group" style={{marginBottom: '20px'}}>
              <label>CURRENT STATUS</label>
              <div className="status-pill-group">
                <button type="button" className={`pill-btn ${formData.availability === 'available' ? 'active' : ''}`} onClick={() => setFormData(prev => ({...prev, availability: 'available'}))}>AVAILABLE</button>
                <button type="button" className={`pill-btn ${formData.availability === 'limited' ? 'active' : ''}`} onClick={() => setFormData(prev => ({...prev, availability: 'limited'}))}>LIMITED</button>
                <button type="button" className={`pill-btn ${formData.availability === 'unavailable' ? 'active' : ''}`} onClick={() => setFormData(prev => ({...prev, availability: 'unavailable'}))}>UNAVAILABLE</button>
              </div>
            </div>
            <div className="input-group">
              <label>CONSULTATION TYPE</label>
              <div className="checkbox-group">
                <label className="custom-checkbox">
                  <input type="checkbox" checked={formData.consultationTypes.includes("Chat")} onChange={() => toggleArrayField("consultationTypes", "Chat")} />
                  <span className="checkmark"></span> Chat
                </label>
                <label className="custom-checkbox">
                  <input type="checkbox" checked={formData.consultationTypes.includes("Call")} onChange={() => toggleArrayField("consultationTypes", "Call")} />
                  <span className="checkmark"></span> Call
                </label>
                <label className="custom-checkbox">
                  <input type="checkbox" checked={formData.consultationTypes.includes("Video")} onChange={() => toggleArrayField("consultationTypes", "Video")} />
                  <span className="checkmark"></span> Video
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* PROFESSIONAL BRIEF */}
        <div className="form-section">
          <div className="section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            PROFESSIONAL BRIEF
          </div>
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Briefly describe the lawyer's professional background, notable achievements, and expertise area..."></textarea>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="bottom-metadata-bar">
          <div className="verify-toggle">
            <div className="verify-text">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#2dd4bf" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <div>
                <h4>VERIFIED LAWYER</h4>
                <p>Authentication of credentials and bar status</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="assign-cases">
            <label>ASSIGN TO ACTIVE CASES</label>
            <select onChange={handleCaseChange} value="">
              <option value="">Select Cases...</option>
              {activeCases.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
            <div className="tags-container">
               {formData.assignedCases.map(caseId => {
                  const caseObj = activeCases.find(c => c._id === caseId);
                  return <span key={caseId} className="tag">{caseObj ? caseObj.title : caseId} <button type="button" onClick={() => removeCase(caseId)}>×</button></span>
               })}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn">CANCEL REGISTRY</button>
          <button type="submit" className="confirm-btn" disabled={!formData.name || !formData.email || !formData.phone || formData.specialization.length === 0 || !formData.barCouncilNumber || loading}>
            {loading ? "PROCESSING..." : "CONFIRM & ADD LAWYER ➔"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddLawyer;
