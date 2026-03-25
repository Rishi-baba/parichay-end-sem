import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import "../styles/Signup.css";

function validate(form) {
  const errors = {};
  if (!form.name.trim()) {
    errors.name = "Name is required.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }
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
  if (!form.agreed) {
    errors.agreed = "You must agree to the Terms of Service.";
  }
  return errors;
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", agreed: false });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      await registerUser({ name: form.name, email: form.email, password: form.password });
      navigate("/login");
    } catch (err) {
      setGlobalError(err.message || "Registration failed. Please try again.");
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
          <h1 className="auth-heading-signup">
            Legal clarity,<br /><span>defined by you.</span>
          </h1>
          <p className="auth-desc">
            Join the next generation of digital law. Access expert guidance while maintaining absolute control over your identity.
          </p>

          <div className="auth-cards-container">
            <div className="auth-info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5A2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </div>
              <div className="info-content">
                <div className="info-title">Anonymous Usage Available</div>
                <div className="info-text">Consult with confidence. Your identity remains private unless you choose to share it.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-footer-left">
          AUTHORITY IN DIGITAL LAW
          <br /><br />
          © 2024 PARICHAY LEGAL. AUTHORITY IN DIGITAL LAW.
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="auth-right">
        <div className="auth-form-container" style={{ marginTop: '0', alignSelf: 'center', margin: 'auto' }}>
          <h2 className="form-title">Create your account</h2>

          {globalError && <div className="form-global-error">{globalError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name" style={{ textTransform: 'uppercase' }}>FULL NAME</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`form-input ${errors.name ? "form-input-error" : ""}`}
              />
              {errors.name && <span className="form-error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email" style={{ textTransform: 'uppercase' }}>EMAIL ADDRESS</label>
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

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" htmlFor="password" style={{ textTransform: 'uppercase' }}>PASSWORD</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`form-input ${errors.password ? "form-input-error" : ""}`}
              />
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>

            <div className="form-checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={form.agreed}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">
                  I agree to the <span className="text-orange">Terms of Service</span> and <span className="text-orange">Privacy Policy</span>.
                </span>
              </label>
              {errors.agreed && <span className="form-error-msg" style={{ marginLeft: "32px", marginTop: "8px" }}>{errors.agreed}</span>}
            </div>

            <div className="form-footer" style={{ marginTop: '40px' }}>
              Already have an account? <Link to="/login" className="form-link" style={{ color: "#111" }}>Log in</Link>
            </div>

            <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop: '24px' }}>
              {loading ? "Creating account…" : "CREATE ACCOUNT"}
            </button>
          </form>


        </div>


      </div>
    </div>
  );
}
