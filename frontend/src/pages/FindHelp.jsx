import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/FindHelp.css';

const dummyNGOs = [
  {
    id: 1,
    name: "Aashray Foundation",
    category: "Domestic Violence",
    location: "New Delhi",
    supportTypes: ["Shelter", "Legal Aid", "Counseling"],
    availability: "Today",
    description: "Providing 24/7 safe shelter, legal assistance, and trauma-informed counseling for women in distress.",
    verified: true,
    badge: "AVAILABLE TODAY"
  },
  {
    id: 2,
    name: "Legal Sahaya Unit",
    category: "Legal Help",
    location: "New Delhi",
    supportTypes: ["Legal Aid"],
    availability: "This week",
    description: "Expert pro-bono legal counsel specializing in matrimonial disputes and workplace harassment cases.",
    verified: true,
    badge: "LIMITED SLOTS",
    limited: true
  },
  {
    id: 3,
    name: "MindWell Collective",
    category: "Mental Health",
    location: "New Delhi",
    supportTypes: ["Counseling"],
    availability: "Today",
    description: "Anonymous mental health support and therapy groups for survivors of harassment and violence.",
    verified: true,
    badge: "AVAILABLE TODAY"
  },
  {
    id: 4,
    name: "Safety Response Cell",
    category: "Workplace Harassment",
    location: "New Delhi",
    supportTypes: ["Legal Aid"],
    availability: "Tomorrow",
    description: "Direct action unit helping corporate employees report and resolve workplace safety and harassment issues.",
    verified: true,
    badge: "AVAILABLE TOMORROW"
  },
  {
    id: 5,
    name: "Mumbai Support House",
    category: "Domestic Violence",
    location: "Mumbai",
    supportTypes: ["Shelter", "Counseling"],
    availability: "Today",
    description: "Emergency shelter and psychological support spanning across Maharashtra.",
    verified: true,
    badge: "AVAILABLE TODAY"
  },
  {
    id: 6,
    name: "Bangalore Legal Clinic",
    category: "Legal Help",
    location: "Bangalore",
    supportTypes: ["Legal Aid"],
    availability: "This week",
    description: "Assists with FIR registration and court representation across Karnataka clinics.",
    verified: true,
    badge: "OPEN THIS WEEK"
  }
];

export default function FindHelp() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [activeSupportTypes, setActiveSupportTypes] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loadingNgos, setLoadingNgos] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/public");
        if (res.ok) setNgos(await res.json());
      } catch (err) {
        console.error("Failed to fetch NGOs:", err);
      } finally {
        setLoadingNgos(false);
      }
    };
    fetchNgos();
  }, []);

  const toggleSupportType = (type) => {
    setActiveSupportTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const categories = ["All", "Domestic Violence", "Workplace Harassment", "Legal Help", "Mental Health", "Emergency Support", "Legal Aid", "Human Rights", "Child Protection", "Rehabilitation", "Other"];
  const cities = ["All", ...new Set(ngos.map(n => n.location).filter(Boolean))];

  const filteredNGOs = useMemo(() => {
    return ngos.filter(ngo => {
      if (searchQuery && !ngo.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !ngo.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (activeCategory !== "All" && ngo.category !== activeCategory) {
        return false;
      }
      if (selectedCity !== "All" && !ngo.location?.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
      if (availability !== "All" && ngo.availability !== availability) {
        return false;
      }
      if (activeSupportTypes.length > 0) {
        const matchesType = activeSupportTypes.some(t => ngo.services?.includes(t));
        if (!matchesType) return false;
      }
      return true;
    });
  }, [searchQuery, activeCategory, selectedCity, availability, activeSupportTypes, ngos]);

  const handleQuickExit = () => {
    window.location.href = "https://www.google.com"; // Rapid redirect for safety
  };

  return (
    <div className="find-help-page">


      {/* Hero Section */}
      <div className="fh-hero-container">
        <div className="fh-hero-content">
          <h1>Find the right <span>help</span>,<br />safely</h1>
          <p>
            Connect with trusted NGOs based on your situation. Your identity and browsing history remain private within this portal.
          </p>
          <div className="fh-search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Describe your issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="fh-search-btn">Search</button>
          </div>
        </div>
        <div className="fh-hero-visual">
          {/* SVG shield representation */}
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYfPjPm18g2YjM9JMPESw_NgeTJ3jYj1HaPg&s" alt="" />
        </div>
      </div>

      {/* Category Horizontal Filter Nav */}
      <div className="fh-category-nav">
        <div className="fh-category-label">SELECT CATEGORY</div>
        <div className="fh-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`fh-cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="fh-main">
        {/* Sidebar Filters */}
        <aside className="fh-sidebar">
          <div className="fh-filter-box">
            <div className="filter-header">
              <span>⚡</span> Filters
            </div>

            <div className="filter-group">
              <div className="filter-group-title">CITY</div>
              <select className="filter-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <div className="filter-group-title">AVAILABILITY</div>
              <div className="filter-radio-list">
                <label>
                  <input type="radio" name="availability" checked={availability === "All"} onChange={() => setAvailability("All")} /> Any time
                </label>
                <label>
                  <input type="radio" name="availability" checked={availability === "Today"} onChange={() => setAvailability("Today")} /> Today
                </label>
                <label>
                  <input type="radio" name="availability" checked={availability === "Tomorrow"} onChange={() => setAvailability("Tomorrow")} /> Tomorrow
                </label>
                <label>
                  <input type="radio" name="availability" checked={availability === "This week"} onChange={() => setAvailability("This week")} /> This week
                </label>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-group-title">SUPPORT TYPE</div>
              <div className="filter-tags">
                <button className={`filter-tag ${activeSupportTypes.includes("Shelter") ? "active" : ""}`} onClick={() => toggleSupportType("Shelter")}>SHELTER</button>
                <button className={`filter-tag ${activeSupportTypes.includes("Counseling") ? "active" : ""}`} onClick={() => toggleSupportType("Counseling")}>COUNSELING</button>
                <button className={`filter-tag ${activeSupportTypes.includes("Legal Aid") ? "active" : ""}`} onClick={() => toggleSupportType("Legal Aid")}>LEGAL AID</button>
              </div>
            </div>
          </div>

          <button className="emergency-btn">
            <span>📞</span> Emergency Call
          </button>
        </aside>

        {/* Results Area */}
        <div className="fh-content">
          <div className="fh-results-header">
            <span>Showing {filteredNGOs.length} verified partners in <strong>{selectedCity === "All" ? "all locations" : selectedCity}</strong></span>
          </div>

          {loadingNgos ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading NGOs from database...</div>
          ) : filteredNGOs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eaeaea' }}>
              No NGOs found matching your criteria.
            </div>
          ) : (
            <div className="fh-grid">
              {filteredNGOs.map(ngo => (
                <div key={ngo._id} className="ngo-card">
                  <div className="ngo-card-top">
                    <div className="ngo-icon">
                      {ngo.logo
                        ? <img src={ngo.logo} alt={ngo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        : ngo.category === "Legal Help" || ngo.category === "Legal Aid" ? "⚖️" : ngo.category === "Mental Health" ? "🧠" : "🏠"
                      }
                    </div>
                    <div className={`ngo-badge ${ngo.availability === 'limited' ? 'limited' : ''}`}>
                      {ngo.availability === 'available' ? 'AVAILABLE' : ngo.availability === 'limited' ? 'LIMITED SLOTS' : 'CLOSED'}
                    </div>
                  </div>

                  <h3 className="ngo-name">{ngo.name}</h3>
                  <div className="ngo-meta">
                    {ngo.category} <span>•</span> {ngo.location}
                  </div>

                  <p className="ngo-desc">{ngo.description}</p>

                  <div className="ngo-card-bottom">
                    <div className="ngo-avatars">
                      <div className="ngo-avatar" style={{ backgroundColor: '#e2e8f0' }}></div>
                      <div className="ngo-avatar" style={{ backgroundColor: '#cbd5e1', zIndex: 1 }}></div>
                      <div className="ngo-avatar-count">+4</div>
                    </div>
                    <Link to={`/ngo/${ngo._id}`} className="ngo-link">
                      View Details <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats block */}
      <div className="fh-footer-stats">
        <div className="stats-left">
          <h3>Your safety is our priority</h3>
          <p>
            All organizations listed on Parichay undergo a multi-level verification process to ensure credibility and safety. If you feel unsafe at any point, use the <strong style={{ color: '#FF5A2C' }}>Quick Exit</strong> button to immediately hide this screen and clear session memory.
          </p>
        </div>
        <div className="stats-right">
          <div className="stat-item">
            <div className="s-val">150+</div>
            <div className="s-lbl">VERIFIED NGOS</div>
          </div>
          <div className="stat-item">
            <div className="s-val">24/7</div>
            <div className="s-lbl">ACTIVE HELP</div>
          </div>
          <div className="stat-item">
            <div className="s-val">100%</div>
            <div className="s-lbl">ANONYMITY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
