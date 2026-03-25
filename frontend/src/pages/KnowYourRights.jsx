import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/KnowYourRights.css';

const rightsData = {
  "Domestic Violence": {
    rights: [
      {
        title: "Right to Safety:",
        desc: "You have the inherent legal right to live in a home free from violence and emotional abuse."
      },
      {
        title: "Right to Residence:",
        desc: "You cannot be arbitrarily evicted from your shared household, regardless of legal ownership."
      },
      {
        title: "Financial Support:",
        desc: "The law mandates your right to claim maintenance for yourself and your children."
      }
    ],
    canFileCase: {
      yes: "There is evidence of physical, emotional, or economic abuse within a domestic relationship.",
      no: "Generic arguments or minor disagreements usually don't qualify, but mediation is always an option."
    },
    whatToDo: [
      "Document incidents with dates, times, and descriptions.",
      "Keep a secure log of all communication (texts, emails).",
      "Identify a safe place to go in case of immediate danger.",
      "Contact a trusted family member or a legal advisor."
    ],
    whenToAct: [
      "If you feel your physical safety is at immediate risk.",
      "When threats of violence become frequent or escalate.",
      "If your movements or finances are being restricted.",
      "Immediately after any physical altercation."
    ]
  },

  "Workplace Harassment": {
    rights: [
      { title: "Safe Workplace:", desc: "Right to work without physical or verbal harassment." },
      { title: "Complaint Filing:", desc: "You have the right to file a complaint under the POSH Act." }
    ],
    canFileCase: {
      yes: "Repeated harassment or hostile work environment exists.",
      no: "Lack of concrete evidence may weaken the case."
    },
    whatToDo: [
      "Report internally to the ICC committee.",
      "Keep proof of emails and messages.",
      "Talk to HR regarding the matter."
    ],
    whenToAct: [
      "After repeated inappropriate behavior.",
      "When facing extreme mental stress.",
      "If your career is threatened."
    ]
  },

  "Cyber Harassment": {
    rights: [
      { title: "Online Safety:", desc: "You are legally protected from online abuse and doxxing." }
    ],
    canFileCase: {
      yes: "Clear threats or persistent harassment online.",
      no: "Minor trolling without physical threats."
    },
    whatToDo: ["Take screenshots immediately.", "Report the account.", "File cyber cell complaint if needed."],
    whenToAct: ["When receiving direct threats.", "In case of severe privacy breach."]
  },

  "Dowry / Marriage Issues": {
    rights: [
      { title: "Stringent Protection:", desc: "Demanding dowry is illegal under the Dowry Prohibition Act." }
    ],
    canFileCase: {
      yes: "Repeated demands for money or assets post-marriage.",
      no: "Normal marital conflicts unrelated to assets."
    },
    whatToDo: ["Record conversations securely.", "Do not give in to demands.", "Consult an advocate."],
    whenToAct: ["Upon facing physical or mental pressure for funds."]
  },

  "Stalking / Threats": {
    rights: [
      { title: "Right to Privacy:", desc: "You are protected from unwanted offline or online surveillance." }
    ],
    canFileCase: {
      yes: "Repeated unwanted contact despite clear refusal.",
      no: "A single innocent attempt at communication."
    },
    whatToDo: ["Block the individual.", "Inform family/friends.", "Keep a record of all occurrences."],
    whenToAct: ["If they physically follow you.", "When threats limit your daily movement."]
  }
};

export default function KnowYourRights() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Domestic Violence");

  const categories = Object.keys(rightsData);
  const data = rightsData[activeCategory];

  return (
    <div className="kyr-page">

      <div className="kyr-container">
        <div className="kyr-header">
          <h1>Know Your Rights</h1>
          <p>
            Understand what the law says and what you can do. Our guide breaks down complex legal structures into simple, actionable steps.
          </p>
        </div>

        <div className="kyr-category-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`kyr-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="kyr-main-grid">

          {/* LEFT COLUMN */}
          <div className="kyr-left-col">
            <div className="kyr-card">
              <div className="kyr-card-title">
                <span className="icon-orange">🛡️</span> Your Rights
              </div>

              <div className="rights-list">
                {data.rights.map((item, index) => (
                  <div key={index} className="right-item">
                    <div className="right-num">{(index + 1).toString().padStart(2, '0')}</div>
                    <div className="right-content">
                      <p><h4>{item.title}</h4> {item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="kyr-action-row">
              <div className="action-card">
                <div className="action-title"><span className="icon-blue">⚡</span> What You Can Do</div>
                <ul className="action-list">
                  {data.whatToDo.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="action-card">
                <div className="action-title"><span className="icon-red">🛑</span> When to Act</div>
                <ul className="action-list">
                  {data.whenToAct.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="kyr-dark-banner">
              <div className="promo-badge">NEW UPDATE</div>
              <h2>Legal Literacy for the Digital Age</h2>
              <p>Learn how the latest amendments in the Digital Privacy Act protect your online identity and personal records.</p>
              <a href="https://acr-journal.com/article/access-to-justice-via-digital-legal-literacy-an-analysis-2881/" className="kyr-read-link">READ WHITEPAPER <span style={{ fontSize: '16px' }}>→</span></a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="kyr-right-col">
            <div className="case-card">
              <h3>CAN I FILE A CASE?</h3>

              <div className="case-status status-yes">
                <div className="status-icon">✓</div>
                <div className="status-text">
                  <h4>Yes, If...</h4>
                  <p>{data.canFileCase.yes}</p>
                </div>
              </div>

              <div className="case-status status-no">
                <div className="status-icon">✕</div>
                <div className="status-text">
                  <h4>No, But...</h4>
                  <p>{data.canFileCase.no}</p>
                </div>
              </div>

              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-4PZ8d2aD6H9rN53hQZ6nQf6L3rN3mE8xw&s"
                alt="Gavel"
                className="gavel-img"
              />
            </div>

            <div className="kyr-action-btns">
              <button className="kyr-btn" onClick={() => navigate('/find-help')}>
                <span>👥</span> Find NGO
              </button>
              <button className="kyr-btn kyr-btn-outline" onClick={() => navigate('/save-evidence')}>
                <span>🗄️</span> Save Evidence
              </button>
            </div>

            <div className="orange-promo-card">
              <div className="promo-icon-large">📄</div>
              <h3>Emergency Legal Kit</h3>
              <p>Download a simplified PDF of your rights to keep offline.</p>
              <button className="dl-btn">DOWNLOAD</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
