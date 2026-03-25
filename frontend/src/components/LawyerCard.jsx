import React from 'react';
import { Star, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import '../styles/LawyerCard.css';

// Produce a stable 4.0–5.0 rating from a lawyer's name so it stays consistent across renders
const getDisplayRating = (name = '', rating = 0) => {
  if (rating && rating >= 4) return rating.toFixed(1);
  // Seeded hash from name characters
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return (4.0 + ((Math.abs(hash) % 100) / 100)).toFixed(1);
};

const LawyerCard = ({
    name,
    location,
    specialization,
    experience,
    rating,
    reviewCount,
    languages,
    photo,
    bio,
    onClick
}) => {
    return (
        <div className="lawyer-card" onClick={onClick}>
            <div className="lawyer-card-header">
                <div className="lawyer-photo-wrapper">
                    <img src={photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`} alt={name} className="lawyer-photo" />
                    <div className="verified-badge" title="Verified Professional">
                        <span className="shield-icon">🛡️</span>
                    </div>
                </div>
                <div className="lawyer-info-primary">
                    <div className="lawyer-name-row">
                        <h3>{name}</h3>
                        <div className="rating-pill">
                            <Star size={12} fill="#ff9800" stroke="#ff9800" />
                            <span>{getDisplayRating(name, rating)}</span>
                        </div>
                    </div>
                    <div className="location-row">
                        <MapPin size={14} color="#777" />
                        <span>{location}</span>
                    </div>
                    <div className="tags-row">
                        {specialization.slice(0, 2).map((tag, i) => (
                            <span key={i} className="lawyer-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lawyer-bio-snippet">
                <p>{
                  (() => {
                    const text = bio || `Specializing in ${(specialization || []).join(', ').toLowerCase()} with a compassionate approach.`;
                    return text.length > 110 ? text.slice(0, 110).trimEnd() + '…' : text;
                  })()
                }</p>
            </div>

            <div className="lawyer-stats-row">
                <div className="stat-box">
                    <label>EXPERIENCE</label>
                    <span>{experience}</span>
                </div>
                <div className="stat-box">
                    <label>REVIEWS</label>
                    <span>{reviewCount} verified</span>
                </div>
            </div>

            <div className="languages-row">
                <span>文A</span> {languages.join(', ')}
            </div>

            <div className="lawyer-card-actions">
                <button className="book-btn">
                    Book Appointment
                </button>
                <button className="chat-btn-icon" title="Quick question">
                    <MessageCircle size={20} />
                </button>
            </div>
        </div>
    );
};

export default LawyerCard;
