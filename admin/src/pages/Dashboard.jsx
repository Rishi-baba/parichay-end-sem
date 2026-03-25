import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import API_URL from '../api/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData([]); // clear old data
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/admin/${activeTab}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to connect to the backend API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/${activeTab}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if(res.ok) {
        setData(prev => prev.filter(item => item._id !== id));
      } else {
        console.error(`Failed to delete ${activeTab}`);
      }
    } catch (error) {
       console.error(error);
    }
  };

  const filteredData = data.filter(item => {
    const q = search.toLowerCase();
    if (activeTab === "users") {
      return item.name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q);
    } else if (activeTab === "cases") {
      return item.title?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
    } else if (activeTab === "evidence") {
      return item.title?.toLowerCase().includes(q) || item.location?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    } else if (activeTab === "lawyers") {
      return item.name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q) || item.barCouncilNumber?.toLowerCase().includes(q);
    } else if (activeTab === "ngos") {
      return item.name?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q) || item.location?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setSearch("");
    }
  };

  const renderTableHeaders = () => {
    if (activeTab === "users") {
      return (
        <tr>
          <th>IDENTITY</th>
          <th>ACCESS NODE</th>
          <th>PROTOCOL</th>
          <th style={{ textAlign: 'right' }}>ACTIONS</th>
        </tr>
      );
    } else if (activeTab === "cases") {
      return (
        <tr>
          <th>CASE PROTOCOL</th>
          <th>CLIENT IDENTITY</th>
          <th>URGENCY LEVEL</th>
          <th style={{ textAlign: 'right' }}>ACTIONS</th>
        </tr>
      );
    } else if (activeTab === "evidence") {
      return (
        <tr>
          <th>EVIDENCE FILE</th>
          <th>SUBMITTED BY</th>
          <th>CASE REFERENCE</th>
          <th style={{ textAlign: 'right' }}>ACTIONS</th>
        </tr>
      );
    } else if (activeTab === "lawyers") {
      return (
        <tr>
          <th>LAWYER</th>
          <th>SPECIALIZATION</th>
          <th>STATUS</th>
          <th style={{ textAlign: 'right' }}>ACTIONS</th>
        </tr>
      );
    } else if (activeTab === "ngos") {
      return (
        <tr>
          <th>NGO NAME</th>
          <th>CATEGORY</th>
          <th>STATUS</th>
          <th style={{ textAlign: 'right' }}>ACTIONS</th>
        </tr>
      );
    }
  };

  const renderTableRows = () => {
    return filteredData.map((item) => {
      if (activeTab === "users") {
        return (
          <tr key={item._id}>
            <td>
              <div className="user-identity">
                <div className="user-avatar">
                  {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                  <div className="status-dot"></div>
                </div>
                <div>
                  <span className="user-name">{item.name || 'Unknown User'}</span>
                  <span className="user-id">ID: {item._id.substring(item._id.length - 6).toUpperCase()}-PX</span>
                </div>
              </div>
            </td>
            <td>
              <span className="user-email">{item.email}</span>
            </td>
            <td>
              <span className={`protocol-badge ${item.role === 'admin' ? 'admin' : 'user'}`}>
                {item.role ? item.role.toUpperCase() : 'USER'}
              </span>
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="action-btn" onClick={() => handleDelete(item._id)} style={{ marginLeft: 'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </td>
          </tr>
        );
      } else if (activeTab === "cases") {
        return (
          <tr key={item._id}>
            <td>
              <div className="user-identity">
                <div className="user-avatar" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' }}>
                  {item.title ? item.title.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <span className="user-name">{item.title || 'Untitled Case'}</span>
                  <span className="user-id">CTG: {item.category?.toUpperCase()}</span>
                </div>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="user-email" style={{ color: '#f8fafc' }}>{item.user?.name || 'Unknown'}</span>
                <span className="user-id">{item.user?.email}</span>
              </div>
            </td>
            <td>
              <span className={`protocol-badge ${item.urgency === 'high' ? 'admin' : 'user'}`} style={item.urgency === 'high' ? { borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' } : {}}>
                {item.urgency ? item.urgency.toUpperCase() : 'MODERATE'}
              </span>
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="action-btn" onClick={() => handleDelete(item._id)} style={{ marginLeft: 'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </td>
          </tr>
        );
      } else if (activeTab === "evidence") {
        return (
          <tr key={item._id}>
            <td>
              <div className="user-identity">
                <div className="user-avatar" style={{ background: 'rgba(45, 212, 191, 0.2)', color: '#5eead4' }}>
                  E
                </div>
                <div>
                  <span className="user-name">{item.title || 'Raw Evidence Data'}</span>
                  <span className="user-id">LOC: {item.location}</span>
                </div>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="user-email" style={{ color: '#f8fafc' }}>{item.user?.name || 'Unknown'}</span>
                <span className="user-id">{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </td>
            <td>
              <span className="user-email">{item.case?.title || 'Unlinked'}</span>
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="action-btn" onClick={() => handleDelete(item._id)} style={{ marginLeft: 'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </td>
          </tr>
        );
      } else if (activeTab === "lawyers") {
        return (
          <tr key={item._id}>
            <td>
              <div className="user-identity">
                <div className="user-avatar" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' }}>
                  {item.name ? item.name.charAt(0).toUpperCase() : 'L'}
                  {item.isVerified && <div className="status-dot" style={{ background: '#2dd4bf' }}></div>}
                </div>
                <div>
                  <span className="user-name">{item.name}</span>
                  <span className="user-id">BCI: {item.barCouncilNumber}</span>
                </div>
              </div>
            </td>
            <td><span className="user-email">{item.specialization?.join(', ') || 'N/A'}</span></td>
            <td>
              <span className={`protocol-badge ${item.availability === 'available' ? '' : 'admin'}`} style={item.availability !== 'available' ? {borderColor:'#f59e0b', color:'#f59e0b', background:'rgba(245,158,11,0.1)'} : {}}>
                {item.availability?.toUpperCase()}
              </span>
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="action-btn" onClick={() => handleDelete(item._id)} style={{ marginLeft: 'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </td>
          </tr>
        );
      } else if (activeTab === "ngos") {
        return (
          <tr key={item._id}>
            <td>
              <div className="user-identity">
                <div className="user-avatar" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                  {item.name ? item.name.charAt(0).toUpperCase() : 'N'}
                  {item.isVerified && <div className="status-dot" style={{ background: '#2dd4bf' }}></div>}
                </div>
                <div>
                  <span className="user-name">{item.name}</span>
                  <span className="user-id">LOC: {item.location}</span>
                </div>
              </div>
            </td>
            <td><span className="user-email">{item.category}</span></td>
            <td>
              <span className={`protocol-badge ${item.availability === 'available' ? '' : 'admin'}`} style={item.availability === 'closed' ? {borderColor:'#ef4444', color:'#ef4444', background:'rgba(239,68,68,0.1)'} : item.availability === 'limited' ? {borderColor:'#f59e0b', color:'#f59e0b', background:'rgba(245,158,11,0.1)'} : {}}>
                {item.availability?.toUpperCase()}
              </span>
            </td>
            <td style={{ textAlign: 'right' }}>
              <button className="action-btn" onClick={() => handleDelete(item._id)} style={{ marginLeft: 'auto' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </td>
          </tr>
        );
      }
    });
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 8px #2dd4bf' }}></div>
          <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700' }}>System Authority: Level 4</span>
        </div>
        <h1 className="dashboard-title">
          Admin <span className="highlight">Dashboard</span>
        </h1>
        <p className="dashboard-subtitle">
          Manage users, cases, and evidence within the Parichay forensic ecosystem. Full administrative override active.
        </p>
      </div>

      <div className="dashboard-toolbar">
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cases' ? 'active' : ''}`}
            onClick={() => handleTabChange('cases')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Cases
          </button>
          <button 
            className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => handleTabChange('evidence')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Evidence
          </button>
          <button 
            className={`tab-btn ${activeTab === 'lawyers' ? 'active' : ''}`}
            onClick={() => handleTabChange('lawyers')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Lawyers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ngos' ? 'active' : ''}`}
            onClick={() => handleTabChange('ngos')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            NGOs
          </button>
        </div>

        <div className="dashboard-search">
          <div className="search-input-wrapper">
             <span className="search-icon">🔍</span>
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder={`Search ${activeTab}...`}
             />
          </div>
          <button className="filter-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="dashboard-panel">
        <table className="dashboard-table">
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="loading-state">Loading {activeTab}...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="empty-state" style={{color: '#ef4444'}}>
                  {error} <br/> <small>Please ensure the backend server is running and you are logged in.</small>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">No {activeTab} found</td>
              </tr>
            ) : (
              renderTableRows()
            )}
          </tbody>
        </table>

        <div className="dashboard-footer">
          <div className="footer-text">
            Showing <span>{filteredData.length}</span> of {data.length} registered {activeTab}
          </div>
          <div className="pagination">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>

      <button className="fab-btn">
        +
      </button>
    </div>
  );
};

export default Dashboard;
