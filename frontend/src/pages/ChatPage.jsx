import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Send, 
    Paperclip, 
    Shield, 
    Scale, 
    FileText, 
    LogOut, 
    Globe, 
    Lock, 
    Info, 
    Menu, 
    X, 
    Briefcase,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
import '../styles/ChatPage.css';
import API_URL from '../api/api';

const ChatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I am your Parichay Assistant. How can I help you today? Please describe your situation, and I will guide you through your legal rights and options.' }
    ]);
    const [caseForm, setCaseForm] = useState({ title: '', category: '', urgency: '' });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('English');
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Handle restoring session from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('parichay_guest_messages');
        const savedForm = localStorage.getItem('parichay_guest_case_form');
        
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Error parsing saved messages:", e);
            }
            localStorage.removeItem('parichay_guest_messages');
        }
        
        if (savedForm) {
            try {
                setCaseForm(JSON.parse(savedForm));
            } catch (e) {
                console.error("Error parsing saved case form:", e);
            }
            localStorage.removeItem('parichay_guest_case_form');
        }
    }, []);

    const fetchBotResponse = async (userMessage) => {
        setIsTyping(true);
        try {
            const response = await fetch(`${API_URL}/api/chat`, {
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

    // Helper to store session details before redirecting to login
    const saveSessionAndRedirect = (alertMessage) => {
        localStorage.setItem('parichay_guest_messages', JSON.stringify(messages));
        localStorage.setItem('parichay_guest_case_form', JSON.stringify(caseForm));
        navigate('/login', { state: { message: alertMessage, from: '/chat' } });
    };

    const handleSubmitProblem = async () => {
        setFormError('');
        if (!caseForm.title || !caseForm.category || !caseForm.urgency) {
            setFormError('Please fill in all fields (Title, Category, Urgency) in your case panel.');
            return;
        }

        // Guest check: If unauthenticated, redirect to login but save current session
        if (!user) {
            saveSessionAndRedirect('Please sign in or create an account to submit your case details.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/case/create`, {
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

    const suggestedPrompts = [
        "What are my rights in a rental dispute?",
        "My employer is delaying my salary.",
        "How can I file a complaint for workplace harassment?",
        "What is the procedure for police verification?"
    ];

    const handleSuggestedPromptClick = (promptText) => {
        setInputText(promptText);
    };

    const handleActionClick = (targetPath, resourceName) => {
        if (!user) {
            saveSessionAndRedirect(`Please login or sign up to access ${resourceName}.`);
        } else {
            navigate(targetPath);
        }
    };

    return (
        <div className="chat-page-root">
            {/* Custom Navbar for Chat Page */}
            <nav className="chat-navbar">
                <div className="chat-navbar-left">
                    <button 
                        className="mobile-sidebar-toggle" 
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        aria-label="Toggle Case Form"
                    >
                        {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <NavLink to="/" className="chat-navbar-logo">
                        <Scale size={24} className="logo-icon-accent" />
                        <span>Parichay</span>
                    </NavLink>
                </div>

                <div className="chat-navbar-links">
                    <NavLink to="/documents" className="chat-navbar-link">Documents</NavLink>
                    <NavLink to="/women-safety" className="chat-navbar-link">Women Safety</NavLink>
                    <NavLink to="/find-lawyer" className="chat-navbar-link">Find a Lawyer</NavLink>
                    <NavLink to="/how-it-works" className="chat-navbar-link">How it works</NavLink>
                </div>

                <div className="chat-navbar-user">
                    {user ? (
                        <>
                            <span className="user-greeting">Hi, {user.name}</span>
                            <div className="chat-user-icon">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button className="chat-logout-btn" onClick={handleLogout} title="Logout">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="user-greeting">Hi, Guest</span>
                            <button className="chat-login-btn" onClick={() => saveSessionAndRedirect()}>Login / Sign-in</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Layout Body */}
            <div className="chat-body-container">
                {/* Sidebar - Desktop and Mobile Drawer */}
                <aside className={`chat-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
                    <div className="chat-sidebar-scroll">
                        <div className="sidebar-title">
                            <span className="sidebar-emoji-icon">⚖️</span>
                            <h2>Your Case Panel</h2>
                        </div>

                        <p className="sidebar-instruction">
                            Fill out these details to structure your consultation before submitting or saving.
                        </p>

                        <div className="sidebar-card">
                            <div className="input-group-field">
                                <label className="card-label">Case Title</label>
                                <input 
                                    className="chat-input-field-styled" 
                                    placeholder="e.g., Unfair Dismissal" 
                                    value={caseForm.title}
                                    onChange={(e) => {
                                        setCaseForm({...caseForm, title: e.target.value});
                                        if (formError) setFormError('');
                                    }}
                                />
                            </div>

                            <div className="input-group-field">
                                <label className="card-label">Category</label>
                                <select 
                                    className="chat-input-field-styled"
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

                            <div className="input-group-field">
                                <label className="card-label">Urgency Level</label>
                                <select 
                                    className="chat-input-field-styled"
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

                            {formError && (
                                <div className="form-error-bubble">
                                    <AlertTriangle size={14} />
                                    <span>{formError}</span>
                                </div>
                            )}
                        </div>

                        <div className="next-actions-title">Resources & Next Steps</div>
                        <div className="action-buttons-group">
                            <button onClick={() => handleActionClick("/save-evidence", "evidence locker")} className="action-btn primary">
                                <span className="action-icon">🗄️</span> 
                                <div className="btn-label-group">
                                    <span className="btn-title">Save Evidence</span>
                                    <span className="btn-subtext">Secure your documents</span>
                                </div>
                                <ChevronRight size={16} className="btn-arrow" />
                            </button>
                            <button onClick={() => handleActionClick("/find-lawyer", "lawyer directories")} className="action-btn">
                                <span className="action-icon">🤝</span>
                                <div className="btn-label-group">
                                    <span className="btn-title">Find a Lawyer</span>
                                    <span className="btn-subtext">Consult verified lawyers</span>
                                </div>
                                <ChevronRight size={16} className="btn-arrow" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="chat-main-area">
                    {/* Top Status Bar */}
                    <div className="chat-status-bar">
                        <div className="status-left">
                            <div className="status-indicator">
                                <span className="dot-green"></span>
                                <span className="status-text">{user ? "Session Active" : "Guest Session"}</span>
                            </div>
                            <div className="status-divider"></div>
                            <div className="status-tag">STATUS: <span className="status-highlight">{user ? "In progress" : "Anonymous Mode"}</span></div>
                        </div>
                        
                        <div className="status-right">
                            <div className="lang-toggle">
                                <button 
                                    className={`lang-btn ${currentLang === 'English' ? 'active' : ''}`}
                                    onClick={() => setCurrentLang('English')}
                                >
                                    English
                                </button>
                                <button 
                                    className={`lang-btn ${currentLang === 'Hindi' ? 'active' : ''}`}
                                    onClick={() => setCurrentLang('Hindi')}
                                >
                                    Hindi
                                </button>
                            </div>
                            <div className="private-badge">
                                <Lock size={12} />
                                <span>SECURE</span>
                            </div>
                            <button className="quick-exit-btn" onClick={() => navigate('/')}>
                                Quick Exit
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="messages-container">
                        {messages.length === 1 && (
                            <div className="empty-chat-welcome">
                                <div className="welcome-glow-icon">
                                    <Scale size={40} />
                                </div>
                                <h3>Welcome to Parichay Legal Assistant</h3>
                                <p>Get confidential, instant guidance on Indian laws. Select a question below or describe your issue in detail.</p>
                                
                                <div className="suggested-prompts-grid">
                                    {suggestedPrompts.map((prompt, index) => (
                                        <button 
                                            key={index} 
                                            className="suggested-prompt-card"
                                            onClick={() => handleSuggestedPromptClick(prompt)}
                                        >
                                            <span>{prompt}</span>
                                            <ChevronRight size={14} className="prompt-arrow" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={msg.id} className={`message-row ${msg.sender} fade-in`}>
                                <div className="message-content">
                                    {msg.sender === 'bot' ? (
                                        <div className="avatar bot">
                                            <Scale size={16} />
                                        </div>
                                    ) : (
                                        <div className="avatar user">
                                            <span>U</span>
                                        </div>
                                    )}

                                    <div className="msg-details">
                                        <div className="bubble">
                                            {msg.text}
                                        </div>
                                        <div className="timestamp">
                                            {msg.sender === 'bot' ? 'Parichay AI' : 'Sent'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>

                                        {/* Show Legal Insight Card conditionally */}
                                        {msg.sender === 'bot' && idx > 0 && msg.text.includes('Payment of Wages Act') && (
                                            <div className="legal-insight-card">
                                                <div className="insight-header">
                                                    <Info size={14} />
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
                            <div className="message-row bot fade-in">
                                <div className="message-content">
                                    <div className="avatar bot">
                                        <Scale size={16} />
                                    </div>
                                    <div className="typing-wrapper">
                                        <div className="typing-bubble">
                                            <div className="typing-dots">
                                                <span className="typing-dot"></span>
                                                <span className="typing-dot"></span>
                                                <span className="typing-dot"></span>
                                            </div>
                                            <span className="typing-text">ASSISTANT IS THINKING</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Section */}
                    <div className="input-position-wrapper">
                        <div className="input-pill-container">
                            <div className="input-pill">
                                <button className="icon-btn" aria-label="Attach File">
                                    <Paperclip size={20} />
                                </button>
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
                                    aria-label="Send Message"
                                >
                                    <Send size={18} />
                                </button>
                            </div>

                            <div className="input-actions-row">
                                <button
                                    onClick={handleSubmitProblem}
                                    disabled={isSubmitting}
                                    className="submit-problem-btn"
                                >
                                    {isSubmitting ? 'Saving Case...' : (user ? 'Submit Problem & Continue' : 'Log In to Submit Problem')}
                                </button>
                                <span className="input-disclaimer">
                                    Parichay AI can make mistakes. Please verify important information.
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Overlay for mobile sidebar */}
            {isMobileSidebarOpen && (
                <div 
                    className="mobile-sidebar-overlay" 
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default ChatPage;
