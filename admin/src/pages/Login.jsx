import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../api/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!loading && user && user.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Unauthorized: Insufficient security clearance.');
      }

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }

      setUser(data.user);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="global-logo-header">
        <h1>Parichay</h1>
        <p>FORENSIC SYSTEMS PORTAL</p>
      </div>

      <div className="login-container">
        <div className="login-card-wrapper">
          <div className="login-card">
            
            <div className="login-header-wrapper">
              <div>
                <h2 className="login-title">Terminal Access</h2>
                <p className="login-subtitle">Initialize encrypted administrative session.</p>
              </div>
              <div className="login-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                AUTHORITY: LEVEL 4
              </div>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>ADMIN ID</label>
                <input 
                  type="email" 
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label>ACCESS KEY</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="auth-button" disabled={isSubmitting}>
                {isSubmitting ? 'Authenticating...' : 'Authenticate \u2794'}
              </button>

              <div className="login-links">
                <span>REQUEST ACCESS</span>
                <span style={{color: '#334155'}}>-</span>
                <span>FORGOT KEY</span>
              </div>
            </form>

          </div>
        </div>

        <div className="login-footer-text">
          <div style={{ flex: 1 }}>
            © 2024 PARICHAY FORENSIC SYSTEMS. AUTHORIZED PERSONNEL ONLY.
          </div>
          <div className="login-footer-center">
             <div className="encrypted-node">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                END-TO-END ENCRYPTED NODE: PX-7700
             </div>
             <div className="warning">
               WARNING: UNAUTHORIZED ACCESS ATTEMPTS ARE LOGGED AND REPORTED TO FEDERAL FORENSIC AUTHORITIES.
             </div>
          </div>
          <div className="login-footer-links" style={{ flex: 1, justifyContent: 'flex-end' }}>
            <span>SECURITY POLICY</span>
            <span>SYSTEM STATUS</span>
            <span>CONTACT SUPPORT</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;