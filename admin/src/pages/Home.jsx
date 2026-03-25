import React, { useContext } from 'react';
import { NavbarContext } from '../context/NavContext';
import './Home.css';

const Home = () => {
  const [navOpen, setNavOpen] = useContext(NavbarContext);

  return (
    <div className="admin-hero-container">
      {/* Global Dark Veil background is now in App.jsx */}

      <div className="admin-hero-content">
        <p className="admin-eyebrow">ADMIN CONTROL PANEL</p>
        <h1 className="admin-heading">Command Your System</h1>
        <p className="admin-subtext">
          Monitor users, manage cases, and control evidence securely from a centralized dashboard.
        </p>
        
        <div className="admin-button-group">
          <button className="admin-primary-btn" onClick={() => setNavOpen(true)}>Enter Admin Panel</button>
          <button className="admin-secondary-btn">View Users</button>
        </div>
      </div>
    </div>
  );
};

export default Home;