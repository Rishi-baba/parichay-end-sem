import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    
    let user = null;
    let logout = () => { };

    try {
        const auth = useAuth();
        user = auth.user;
        logout = auth.logout;
    } catch (err) {
        console.log("Auth not ready");
    }
    
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLogout() {
        setIsOpen(false);
        await logout();
        localStorage.removeItem("token");
        navigate('/login');
    }

    const handleActionNavigate = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <div className="navbar-logo">
                    <NavLink to="/">
                        <span> Parichay</span>
                    </NavLink>
                </div>

                <div className="navbar-links">
                    <NavLink to="/documents" className={({ isActive }) => (isActive ? 'active' : '')}>Documents</NavLink>
                    <NavLink to="/women-safety" className={({ isActive }) => (isActive ? 'active' : '')}>Women Safety</NavLink>
                    <NavLink to="/find-lawyer" className={({ isActive }) => (isActive ? 'active' : '')}>Find a Lawyer</NavLink>
                    <NavLink to="/how-it-works" className={({ isActive }) => (isActive ? 'active' : '')}>How it works</NavLink>
                </div>

                <div className="navbar-action">
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Hi, {user.name}</span>
                            <div className="nav-user-container" ref={dropdownRef}>
                                <button 
                                    className="nav-user-btn" 
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </button>
                                
                                {isOpen && (
                                    <div className="nav-dropdown">
                                        <button className="nav-dropdown-item" onClick={() => handleActionNavigate("/my-cases")}>
                                            My Cases
                                        </button>
                                        <button className="nav-dropdown-item" onClick={() => handleActionNavigate("/my-evidence")}>
                                            My Evidence
                                        </button>
                                        <div className="nav-dropdown-divider"></div>
                                        <div style={{ padding: '8px' }}>
                                            <button className="btn-primary" onClick={handleLogout} style={{ width: '100%', padding: '10px', display: 'block', textAlign: 'center', fontSize: '13px' }}>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <button className="btn-primary" onClick={() => navigate('/login')}>Login / sign-in</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
