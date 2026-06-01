import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { FaDumbbell, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';

export const Footer = () => {
  const { subscribeNewsletter } = useBooking();
  const [email, setEmail] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    const res = await subscribeNewsletter(email);
    if (res.success) {
      setSubscribedMsg(res.message);
      setEmail('');
    }
  };

  return (
    <footer style={{
      backgroundColor: '#090909',
      borderTop: '1px solid #1a1a1a',
      padding: '70px 0 30px 0',
      color: '#FFFFFF'
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '50px' }}>
          
          {/* COLUMN 1: BRAND SUMMARY */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FaDumbbell style={{ fontSize: '1.8rem', color: '#E10600' }} />
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
                NEWTOWN <span style={{ color: '#E10600' }}>FIT</span>
              </span>
            </div>
            <p style={{ color: '#aaaaaa', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.7' }}>
              Elite fitness gym and international athletic standard club. Providing premium amenities, group modules, and scientific coaching solutions.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={socialIconStyle}><FaInstagram /></a>
              <a href="#" style={socialIconStyle}><FaFacebookF /></a>
              <a href="#" style={socialIconStyle}><FaYoutube /></a>
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div>
            <h4 style={colHeaderStyle}>Explore</h4>
            <ul style={listStyle}>
              <li><Link to="/about" style={linkStyle}>About Our Story</Link></li>
              <li><Link to="/membership" style={linkStyle}>Membership Plans</Link></li>
              <li><Link to="/classes" style={linkStyle}>Workouts Classes</Link></li>
              <li><Link to="/trainers" style={linkStyle}>Certified Coaches</Link></li>
              <li><Link to="/gallery" style={linkStyle}>Gym Gallery</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: OPERATING HOURS & CONTACTS */}
          <div>
            <h4 style={colHeaderStyle}>Contact Us</h4>
            <ul style={listStyle}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaaaaa', fontSize: '0.95rem' }}>
                <FaMapMarkerAlt style={{ color: '#E10600', flexShrink: 0 }} />
                <span>Rajarhat Main Rd, Newtown, Kolkata, WB</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaaaaa', fontSize: '0.95rem' }}>
                <FaPhoneAlt style={{ color: '#E10600', flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaaaaa', fontSize: '0.95rem' }}>
                <FaEnvelope style={{ color: '#E10600', flexShrink: 0 }} />
                <span>info@newtownfitness.com</span>
              </li>
            </ul>
            <div style={{ marginTop: '20px' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px' }}>Hours:</h5>
              <p style={{ color: '#aaaaaa', fontSize: '0.85rem' }}>Monday - Sunday: 06:00 AM - 10:00 PM</p>
            </div>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div>
            <h4 style={colHeaderStyle}>Newsletter</h4>
            <p style={{ color: '#aaaaaa', fontSize: '0.95rem', marginBottom: '15px' }}>
              Subscribe to unlock premium discount alerts, expert diet charts, and gym schedule updates.
            </p>
            {subscribedMsg ? (
              <p style={{ color: '#E10600', fontWeight: 600, fontSize: '0.9rem' }}>{subscribedMsg}</p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #222222',
                    backgroundColor: '#161616',
                    color: '#FFFFFF',
                    fontSize: '0.9rem'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* BOTTOM RIGHTS */}
        <div style={{
          borderTop: '1px solid #1a1a1a',
          paddingTop: '25px',
          textAlign: 'center',
          color: '#666666',
          fontSize: '0.85rem'
        }}>
          &copy; {new Date().getFullYear()} Newtown Fitness Gym. All Rights Reserved. Built for Athletic Excellence.
        </div>
      </div>
    </footer>
  );
};

const colHeaderStyle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '20px',
  borderLeft: '3px solid #E10600',
  paddingLeft: '10px'
};

const listStyle = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const linkStyle = {
  color: '#aaaaaa',
  fontSize: '0.95rem',
  transition: 'color 0.2s',
  cursor: 'pointer'
};

const socialIconStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#161616',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s',
  border: '1px solid #222222'
};
