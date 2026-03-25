import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SaveEvidence.css';
import API_URL from '../api/api';

export default function SaveEvidence() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    isPrivate: true,
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.date || !formData.location || !formData.description) {
      setError("Please fill in the required fields: Date, Location, and Description.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("isPrivate", formData.isPrivate);

    files.forEach(file => {
      data.append("files", file);
    });

    try {
      const response = await fetch(`${API_URL}/api/evidence/create`, {
        method: "POST",
        credentials: "include",
        body: data // FormData automatically sets multipart/form-data with proper boundary
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save evidence");
      }

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="save-evidence-page">
      
      <div className="se-container">
        <div className="se-header">
          <h1>Save Your Situation <span>Securely</span></h1>
          <p>
            Document your experience privately. Your data stays safe and confidential with end-to-end encryption.
          </p>
        </div>

        {success ? (
          <div className="se-card" style={{textAlign: 'center', padding: '60px 20px'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>✅</div>
            <h2 style={{color: '#111'}}>Situation Documented Securely</h2>
            <p style={{color: '#666'}}>Your private entry has been saved to your encrypted vault. Redirecting...</p>
          </div>
        ) : (
          <div className="se-card">
            <form onSubmit={handleSubmit}>
              
              {error && <div style={{backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px'}}>{error}</div>}

              <div className="se-row">
                <div className="se-col se-form-group">
                  <label className="se-label">TITLE OF ENTRY (OPTIONAL)</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="se-input" 
                    placeholder="e.g., Incident at Central Park" 
                  />
                </div>
                <div className="se-col se-form-group">
                  <label className="se-label">DATE OF INCIDENT *</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="se-input" 
                    required 
                  />
                </div>
              </div>

              <div className="se-form-group">
                <label className="se-label">LOCATION *</label>
                <div className="se-input-icon">
                  <span>📍</span>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="se-input" 
                    placeholder="Search or enter location address" 
                    required 
                  />
                </div>
              </div>

              <div className="se-form-group">
                <label className="se-label">DESCRIBE YOUR SITUATION *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="se-textarea" 
                  placeholder="Provide as much detail as you can..."
                  required
                ></textarea>
              </div>

              <div className="se-form-group">
                <label className="se-label">EVIDENCE & ATTACHMENTS</label>
                
                <div 
                  className="se-dropzone" 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if(e.dataTransfer.files) {
                      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                    }
                  }}
                >
                  <div className="se-upload-icon">☁️</div>
                  <h4>Click to upload or drag and drop</h4>
                  <p>PNG, JPG, MP3, M4A or PDF (max. 50MB)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    multiple 
                    onChange={handleFileChange} 
                    accept="image/*,audio/*,application/pdf"
                  />
                </div>

                {files.length > 0 && (
                  <div className="se-file-list">
                    {files.map((file, i) => (
                      <div key={i} className="se-file-pill">
                        <div className="se-file-info">
                          <div className={`se-file-type-icon ${file.type.includes('image') ? 'bg-orange' : 'bg-blue'}`}>
                            {file.type.includes('image') ? '🖼️' : file.type.includes('audio') ? '🎤' : '📄'}
                          </div>
                          <div className="se-file-details">
                            <h5>{file.name}</h5>
                            <p>{(file.size / (1024 * 1024)).toFixed(1)} MB • TO UPLOAD</p>
                          </div>
                        </div>
                        <button type="button" className="se-file-remove" onClick={() => removeFile(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="se-privacy-toggle">
                <div className="se-privacy-info">
                  <div className="se-lock-icon">🔒</div>
                  <div className="se-privacy-text">
                    <h4>Keep this entry private</h4>
                    <p>Only you can access this information. Not even Parichay staff can view your vault.</p>
                  </div>
                </div>
                <label className="se-switch">
                  <input 
                    type="checkbox" 
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleChange}
                  />
                  <span className="se-slider"></span>
                </label>
              </div>

              <button type="submit" className="se-submit-btn" disabled={loading}>
                {loading ? "SAVING..." : "🛡️ SAVE SECURELY"}
              </button>

            </form>
          </div>
        )}

        <div className="se-trusts">
          <div className="se-trust-badge">🔒 AES-256 ENCRYPTED</div>
          <div className="se-trust-badge">🛡️ GDPR COMPLIANT</div>
          <div className="se-trust-badge">👁️ ZERO-KNOWLEDGE STORAGE</div>
        </div>
      </div>
    </div>
  );
}
