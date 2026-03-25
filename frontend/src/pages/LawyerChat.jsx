import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LawyerChat.css';
import API_URL from '../api/api';

const LawyerChat = () => {
  const navigate = useNavigate();

  // State
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef(null);

  // Focus bottom automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial Fetch: Cases & Evidence
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Cases
        const caseRes = await fetch(`${API_URL}/api/case/my-cases`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` }
        });
        const caseData = await caseRes.json();

        // Safety check to prevent .map crashes if auth still fails
        if (!caseRes.ok) {
          console.error("Case Fetch Error:", caseData);
          setCases([]);
        } else {
          setCases(caseData);
          if (caseData.length > 0) {
            setSelectedCase(caseData[0]);
            setMessages([
              {
                id: Date.now(),
                type: 'system',
                text: `This chat is regarding your case: ${caseData[0].title} (Urgency: ${caseData[0].urgency})`
              },
              {
                id: Date.now() + 1,
                sender: 'lawyer',
                text: "Hello, I am reviewing your case. How can I help you today?"
              }
            ]);
          }
        }

        // Fetch Evidence
        const evRes = await fetch(`${API_URL}/api/evidence/my-evidence`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` }
        });
        const evData = await evRes.json();
        if (evRes.ok) {
          setEvidenceList(evData);
        } else {
          setEvidenceList([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle case dropdown change
  const handleCaseChange = (e) => {
    const caseId = e.target.value;
    const c = cases.find(c => c._id === caseId);
    setSelectedCase(c);

    // Auto Context Message
    if (c) {
      setMessages([
        {
          id: Date.now(),
          type: 'system',
          text: `This chat is regarding your case: ${c.title} (Urgency: ${c.urgency})`
        },
        {
          id: Date.now() + 1,
          sender: 'lawyer',
          text: `Hello, I've loaded your context for ${c.title}. What updates do you have?`
        }
      ]);
    }
  };

  // Handle basic chat message
  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: inputText
    }]);

    setInputText("");

    // Dummy reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'lawyer',
        text: "Please provide any relevant evidence from your vault so I can cross-reference it."
      }]);
    }, 1500);
  };

  // Attach Evidence to Case API
  const handleSendEvidence = async (evidenceId, evidenceTitle) => {
    if (!selectedCase) {
      alert("Please select a case first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/evidence/attach-to-case`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          evidenceId: evidenceId,
          caseId: selectedCase._id
        })
      });

      if (res.ok) {
        // Show in chat dynamically
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'user',
          text: `[Attached Evidence]: ${evidenceTitle}`
        }]);
      } else {
        alert("Failed to attach evidence.");
      }
    } catch (err) {
      console.error(err);
      alert("Error attaching evidence");
    }
  };

  return (
    <div className="lawyer-chat-root">

      {/* NAVBAR */}
      <nav className="lc-navbar">
        <div className="lc-navbar-left">
          <button className="lc-back-btn" onClick={() => navigate(-1)}>←</button>
          <span className="lc-brand">Go back</span>
          <span className="lc-page-title">Chat with Legal Advisor</span>
        </div>

        <div className="lc-navbar-right">
          <select className="lc-case-select" onChange={handleCaseChange} value={selectedCase?._id || ""}>
            <option value="" disabled>Select Case...</option>
            {cases.map(c => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <span style={{ fontSize: '20px', cursor: 'pointer', color: '#666' }}>📁</span>
          <span style={{ fontSize: '20px', cursor: 'pointer', color: '#666' }}>⋮</span>
        </div>
      </nav>

      <div className="lc-body">

        {/* CHAT AREA */}
        <div className="lc-chat-area">
          <div className="lc-messages-container">
            {messages.map((msg) => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="lc-system-msg">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`lc-msg-row ${msg.sender}`}>
                  <div>
                    <div className="lc-bubble">
                      {msg.text}
                    </div>
                    <div className="lc-msg-meta">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT WRAPPER */}
          <div className="lc-input-wrapper">
            <div className="lc-input-box">
              <button className="lc-attach-btn">📎</button>
              <input
                className="lc-input"
                placeholder="Type your message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              />
              <button className="lc-send-btn" onClick={handleSend} disabled={!inputText.trim()}>
                SEND ➢
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (CASE INFO & EVIDENCE TO ATTACH) */}
        <aside className="lc-sidebar">
          <div className="lc-sidebar-scroll">

            <div className="lc-sidebar-section">
              <div className="lc-sidebar-title">CASE INFO</div>
              <h2 className="lc-case-title">{selectedCase ? selectedCase.title : "No Case Selected"}</h2>

              {selectedCase && (
                <>
                  <div className="lc-case-row">
                    <span className="lc-case-label">Category</span>
                    <span className="lc-case-val">{selectedCase.category}</span>
                  </div>
                  <div className="lc-case-row">
                    <span className="lc-case-label">Urgency</span>
                    <span className="lc-urgency-badge">{selectedCase.urgency}</span>
                  </div>
                  <div className="lc-case-row">
                    <span className="lc-case-label">Status</span>
                    <span className="lc-status-badge">In Progress</span>
                  </div>
                </>
              )}
            </div>

            <div className="lc-sidebar-section">
              <div className="lc-sidebar-title">YOUR VAULT</div>

              {evidenceList.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#888' }}>No evidence found in vault.</p>
              ) : (
                evidenceList.map(ev => (
                  <div key={ev._id} className="lc-evidence-card">
                    <h4>{ev.title || "Untitled File"}</h4>
                    <p>{new Date(ev.createdAt).toLocaleDateString()}</p>
                    <button
                      className="lc-attach-ev-btn"
                      onClick={() => handleSendEvidence(ev._id, ev.title || "Evidence")}
                    >
                      + Send to Chat
                    </button>
                  </div>
                ))
              )}

            </div>

            <div className="lc-legal-note">
              <h4><span>🛡️</span> LEGAL CURATED ADVICE</h4>
              <p>All chats are encrypted end-to-end and strictly confidential under attorney-client privilege protocols.</p>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
};

export default LawyerChat;
