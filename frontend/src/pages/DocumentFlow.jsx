import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, ArrowLeft } from 'lucide-react';
import '../styles/DocumentFlow.css';

const questions = [
    { id: 1, label: "Who is this document for?", placeholder: "e.g. My landlord, Employer, Police station" },
    { id: 2, label: "What is the key issue?", placeholder: "Briefly describe the conflict or demand..." },
    { id: 3, label: "What date did this happen?", type: "date" }
];

const DocumentFlow = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({ 1: '', 2: '', 3: '' });
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const docType = location.state?.docType || "Legal Document";
    const inputRef = useRef(null);

    const handleNext = () => {
        const current = answers[step]?.trim();
        if (!current) {
            setError('This field is required before continuing.');
            if (inputRef.current) {
                inputRef.current.classList.remove('input-shake');
                void inputRef.current.offsetWidth;
                inputRef.current.classList.add('input-shake');
            }
            return;
        }
        setError('');
        if (step < 3) {
            setStep(step + 1);
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setStep(4);
            }, 1500);
        }
    };

    const handleBack = () => {
        setError('');
        if (step > 1) setStep(step - 1);
        else navigate('/documents');
    };

    if (step === 4) {
        return (
            <div className="doc-flow-page container">
                <div className="doc-preview-container fade-in">
                    <div className="preview-header">
                        <CheckCircle className="success-icon" size={48} />
                        <h2>{docType} Ready</h2>
                        <p>We have formatted your document based on your inputs.</p>
                    </div>

                    <div className="document-paper-preview">
                        <h3>{docType.toUpperCase()}</h3>
                        <p className="doc-date">{new Date().toLocaleDateString()}</p>
                        <br />
                        <p><strong>To Whom It May Concern,</strong></p>
                        <p>This letter is addressed to: <strong>{answers[1]}</strong></p>
                        <p>Regarding: {answers[2]}</p>
                        <p>Date of incident: {answers[3]}</p>
                        <br /><br />
                        <p>Sincerely,</p>
                        <p>[Your Name]</p>
                    </div>

                    <div className="preview-actions">
                        <button className="btn-secondary" onClick={() => setStep(1)}>Edit Details</button>
                        <button className="btn-primary flex-center gap-2">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const q = questions[step - 1];

    return (
        <div className="doc-flow-page container">
            <div className="flow-header">
                <button onClick={handleBack} className="back-btn"><ArrowLeft size={20} /></button>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
                <span className="step-count">Step {step} of 3</span>
            </div>

            <div className="question-container fade-in">
                <h2>
                    {q.label}{' '}
                    <span style={{ color: '#ef4444', fontSize: '1.2em', lineHeight: 1 }}>*</span>
                </h2>

                {loading ? (
                    <div className="typing-loader">
                        <span></span><span></span><span></span>
                    </div>
                ) : (
                    <div className="input-group">
                        <input
                            ref={inputRef}
                            key={step}
                            type={q.type || "text"}
                            className={`flow-input${error ? ' flow-input-error' : ''}`}
                            placeholder={q.placeholder}
                            value={answers[step]}
                            onChange={e => {
                                setAnswers(prev => ({ ...prev, [step]: e.target.value }));
                                setError('');
                            }}
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleNext()}
                        />
                        {error && (
                            <p style={{ color: '#ef4444', fontSize: '13px', margin: '6px 0 0 4px' }}>
                                ⚠ {error}
                            </p>
                        )}
                        <button className="flow-next-btn" onClick={handleNext}>
                            {step === 3 ? 'Generate' : 'Next'} <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentFlow;
