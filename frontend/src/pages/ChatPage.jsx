import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ChatPage.css';


const UserIconSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
const SendIconSVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '-2px' }}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const ChatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I am your Parichay Assistant. How can I help you today? Please describe your situation.' }
    ]);
    const [caseForm, setCaseForm] = useState({ title: '', category: '', urgency: '' });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const fetchBotResponse = async (userMessage) => {
        setIsTyping(true);
        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    sender: 'bot',
                    text: data.reply
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    sender: 'bot',
                    text: "Sorry, I encountered an error: " + (data.message || "Unknown error")
                }]);
            }
        } catch (error) {
            console.error("Chat API error:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'bot',
                text: "Sorry, I couldn't reach the server. Please check your connection and try again."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (!hasInitialized.current && location.state?.message) {
            hasInitialized.current = true;
            const userMsg = {
                id: Date.now(),
                sender: 'user',
                text: location.state.message
            };
            setMessages(prev => [...prev, userMsg]);
            fetchBotResponse(location.state.message);
        }
    }, [location.state]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            sender: 'user',
            text: inputText
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        fetchBotResponse(inputText);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSubmitProblem = async () => {
        setFormError('');
        if (!caseForm.title || !caseForm.category || !caseForm.urgency) {
            setFormError('Please fill in all fields (Title, Category, Urgency) in your case panel.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/case/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(caseForm)
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to submit case.');
            }

            // Collect all user messages or the full conversation
            const fullConversation = messages
                .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
                .join('\n\n');

            navigate('/triage', { state: { issue: fullConversation } });
        } catch (error) {
            console.error("Case submission error:", error);
            setFormError(error.message || "Failed to submit case.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="chat-page-root">
            {/* Custom Navbar for Chat Page */}
            <nav className="chat-navbar">
                <NavLink to="/" className="chat-navbar-logo">
                    Parichay
                </NavLink>

                <div className="chat-navbar-links">
                    <NavLink to="/documents" className="chat-navbar-link">Documents</NavLink>
                    <NavLink to="/women-safety" className="chat-navbar-link">Women Safety</NavLink>
                    <NavLink to="/find-lawyer" className="chat-navbar-link">Find a Lawyer</NavLink>
                    <NavLink to="/how-it-works" className="chat-navbar-link">How it works</NavLink>
                </div>

                <div className="chat-navbar-user">
                    {user ? (
                        <>
                            <span style={{ color: '#666' }}>Hi, {user.name}</span>
                            <div className="chat-user-icon">
                                <UserIconSVG />
                            </div>
                            <button className="chat-logout-btn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <button className="chat-logout-btn" onClick={() => navigate('/login')}>Login / sign-in</button>
                    )}
                </div>
            </nav>

            {/* Layout Body */}
            <div className="chat-body-container">
                {/* Left Sidebar */}
                <aside className="chat-sidebar">
                    <div className="chat-sidebar-scroll">
                        <div className="sidebar-title">
                            <span style={{ fontSize: '20px', lineHeight: '1' }}>⛑️</span> Your Case
                        </div>

                        <div className="sidebar-card" style={{ padding: '16px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="card-label" style={{ display: 'block', marginBottom: '8px' }}>Case Title</label>
                                <input 
                                    className="chat-input-field" 
                                    style={{ width: '100%', border: '1px solid #eaeaea', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', background: '#fdfdfd' }} 
                                    placeholder="e.g., Unfair Dismissal" 
                                    value={caseForm.title}
                                    onChange={(e) => {
                                        setCaseForm({...caseForm, title: e.target.value});
                                        if (formError) setFormError('');
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="card-label" style={{ display: 'block', marginBottom: '8px' }}>Category</label>
                                <select 
                                    className="chat-input-field" 
                                    style={{ width: '100%', border: '1px solid #eaeaea', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', background: '#fdfdfd' }}
                                    value={caseForm.category}
                                    onChange={(e) => {
                                        setCaseForm({...caseForm, category: e.target.value});
                                        if (formError) setFormError('');
                                    }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="Employment Dispute">Employment Dispute</option>
                                    <option value="Family Law">Family Law</option>
                                    <option value="Criminal Defense">Criminal Defense</option>
                                    <option value="Property Dispute">Property Dispute</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                                <label className="card-label" style={{ display: 'block', marginBottom: '8px' }}>Urgency Level</label>
                                <select 
                                    className="chat-input-field" 
                                    style={{ width: '100%', border: '1px solid #eaeaea', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', background: '#fdfdfd' }}
                                    value={caseForm.urgency}
                                    onChange={(e) => {
                                        setCaseForm({...caseForm, urgency: e.target.value});
                                        if (formError) setFormError('');
                                    }}
                                >
                                    <option value="" disabled>Select Urgency</option>
                                    <option value="low">Low Risk</option>
                                    <option value="moderate">Medium Risk</option>
                                    <option value="high">High Risk</option>
                                </select>
                            </div>
                            {formError && <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '12px', fontWeight: '600' }}>{formError}</div>}
                        </div>

                        <div className="next-actions-title">Next Actions</div>
                        <div>
                            <button onClick={() => navigate("/save-evidence")} className="action-btn primary">
                                <span className="action-icon">🗄️</span> Save Evidence
                            </button>
                            <button onClick={() => navigate("/find-lawyer")} className="action-btn">
                                <span className="action-icon">⚖️</span> Talk to a lawyer
                            </button>
                        </div>
                    </div>


                </aside>

                {/* Main Chat Area */}
                <main className="chat-main-area">
                    {/* Top Status Bar */}
                    <div className="chat-status-bar">
                        <div className="status-left">
                            {/* <div><span className="dot-green"></span> Anonymous session</div> */}
                            <div className="status-divider"></div>
                            <div>STATUS: <span className="status-highlight">In progress</span></div>
                        </div>
                        <div className="status-right">
                            <div className="lang-toggle">
                                <button className="lang-btn active">English</button>
                                <button className="lang-btn">Hindi</button>
                            </div>
                            <div className="private-badge">
                                <span>🔒</span> PRIVATE
                            </div>
                            <button className="quick-exit-btn" onClick={() => navigate('/')}>
                                Quick Exit
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="messages-container">
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className={`message-row ${msg.sender}`}>
                                <div className="message-content">
                                    {msg.sender === 'bot' ? (
                                        <div className="avatar bot">P</div>
                                    ) : (
                                        <div className="avatar user"><UserIconSVG /></div>
                                    )}

                                    <div className="msg-details">
                                        <div className="bubble">
                                            {msg.text}
                                        </div>
                                        <div className="timestamp">
                                            10:24 AM • {msg.sender === 'bot' ? 'Parichay AI' : 'Read'}
                                        </div>

                                        {/* Show Legal Insight Card only when backend returns it, fallback mocked here for reference when triggered */}
                                        {msg.sender === 'bot' && idx > 0 && msg.text.includes('Payment of Wages Act') && (
                                            <div className="legal-insight-card">
                                                <div className="insight-header">
                                                    <div className="insight-icon">i</div>
                                                    LEGAL INSIGHT
                                                </div>
                                                <div className="insight-text">
                                                    Under the Payment of Wages Act, employers must disburse salary before the 7th or 10th of the following month depending on company size.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message-row bot">
                                <div className="message-content">
                                    <div className="avatar bot">P</div>
                                    <div className="typing-wrapper">
                                        <div className="typing-bubble">
                                            <div className="typing-dots">
                                                <span className="typing-dot"></span>
                                                <span className="typing-dot"></span>
                                                <span className="typing-dot"></span>
                                            </div>
                                            <div className="typing-text">ASSISTANT IS TYPING</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Section */}
                    <div className="input-position-wrapper">
                        <div className="input-pill">
                            <button className="icon-btn" style={{ fontSize: '20px' }}>📎</button>
                            <input
                                type="text"
                                className="chat-input-field"
                                placeholder="Describe your legal issue or ask a question..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />

                            <button
                                className="send-btn"
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                            >
                                <SendIconSVG />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px', pointerEvents: 'auto' }}>
                            <button
                                onClick={handleSubmitProblem}
                                disabled={isSubmitting}
                                style={{
                                    background: 'transparent', border: 'none', color: '#FF5A2C', fontSize: '14px',
                                    fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginBottom: '8px', textDecoration: 'underline',
                                    opacity: isSubmitting ? 0.6 : 1
                                }}
                            >
                                {isSubmitting ? 'Saving Case...' : 'Submit Problem & Continue'}
                            </button>
                            <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
                                Parichay can make mistakes. Consider checking important information.
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatPage;
