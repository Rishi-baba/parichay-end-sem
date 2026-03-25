import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function validate(form) {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGlobalError("");
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });
      login(data.user);
      navigate("/");
    } catch (err) {
      setGlobalError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* LEFT SECTION */}
      <div className="auth-left">
        <Link to="/" className="auth-logo">Parichay</Link>

        <div>

          <h1 className="auth-heading">
            Get legal clarity,<br /><span>instantly.</span>
          </h1>
          <p className="auth-desc">
            Safe, anonymous legal guidance in simple language. We translate complexity into confidence.
          </p>

          <div className="auth-cards-container">
            <div className="auth-stat-card">
              <div className="stat-value">50k+</div>
              <div className="stat-label">Consultations</div>
            </div>
            <div className="auth-stat-card">
              <div className="stat-value">99%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>

        <div className="auth-footer-left">
          © 2024 PARICHAY LEGAL. AUTHORITY IN DIGITAL LAW.
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="auth-right">
        <Link to="/" className="auth-top-right">BACK TO HOME</Link>

        <div className="auth-form-container">
          <h2 className="form-title">Welcome back</h2>
          <p className="form-subtitle">Enter your credentials to access your legal dashboard.</p>

          {globalError && <div className="form-global-error">{globalError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className={`form-input ${errors.email ? "form-input-error" : ""}`}
              />
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`form-input ${errors.password ? "form-input-error" : ""}`}
              />
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Signing in…" : "SIGN IN"}
            </button>
          </form>

          <div className="form-footer">
            Don't have an account? <Link to="/signup" className="form-link">Create Account</Link>
          </div>

          <div style={{ textAlign: "center" }}>
            <div className="security-badge">
              <span>🔒</span> YOUR DATA IS PRIVATE AND SECURE
            </div>
          </div>
        </div>

        <div className="auth-footer-right">
          <Link to="#" className="footer-link">Privacy Policy</Link>
          <Link to="#" className="footer-link">Terms of Service</Link>
          <Link to="#" className="footer-link">Legal Notice</Link>
        </div>
      </div>
    </div>
  );
}
