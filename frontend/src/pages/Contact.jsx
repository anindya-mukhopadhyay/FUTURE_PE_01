import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function Contact() {
  const { submitContactForm } = useBooking();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitContactForm(form);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setForm({ name: '', email: '', mobile: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>Contact <span>Us</span></h2>
          <p>Get in touch with our operations desk, book a physical consultation, or start a trial session.</p>
        </div>

        <div className="grid-2" style={{ maxWidth: '1000px', margin: '0 auto', gap: '40px' }}>
          
          {/* LEFT COLUMN: CONTACT DETAILS */}
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              We Are Here To <span style={{ color: 'var(--primary-red)' }}>Guide</span> You
            </h3>
            <p style={{ color: '#aaaaaa', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.7' }}>
              Have questions regarding membership tiers, custom corporate packages, or personal trainer assignments? Reach out to our front desk team today.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={flexCenterStyle}>
                <div style={iconBoxStyle}><FaMapMarkerAlt /></div>
                <div>
                  <h5 style={h5Style}>Main Center Location</h5>
                  <p style={detailStyle}>Rajarhat Main Road, Newtown, Kolkata, WB 700135</p>
                </div>
              </div>

              <div style={flexCenterStyle}>
                <div style={iconBoxStyle}><FaPhoneAlt /></div>
                <div>
                  <h5 style={h5Style}>Call Desk Phone</h5>
                  <p style={detailStyle}>+91 98765 43210 / +91 33 2456 7890</p>
                </div>
              </div>

              <div style={flexCenterStyle}>
                <div style={iconBoxStyle}><FaEnvelope /></div>
                <div>
                  <h5 style={h5Style}>Email Support</h5>
                  <p style={detailStyle}>support@newtownfitness.com / info@newtownfitness.com</p>
                </div>
              </div>

              <div style={flexCenterStyle}>
                <div style={iconBoxStyle}><FaClock /></div>
                <div>
                  <h5 style={h5Style}>Gym Operating Hours</h5>
                  <p style={detailStyle}>Monday - Sunday: 06:00 AM - 10:00 PM</p>
                </div>
              </div>

            </div>

            {/* WHATSAPP & PHONE ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ borderColor: '#25d366', color: '#25d366', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FaWhatsapp style={{ fontSize: '1.2rem' }} />
                <span>WhatsApp Chat</span>
              </a>
              <a href="tel:+919876543210" className="btn btn-primary">
                Call Support Now
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="glass-card">
            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <FaCheckCircle style={{ color: '#2ecc71', fontSize: '3.5rem', marginBottom: '15px' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase' }}>Message Dispatched!</h3>
                <p style={{ color: '#aaaaaa', fontSize: '0.9rem', marginTop: '8px' }}>
                  Your inquiry has been stored successfully. Our support desk will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
                  Write A <span style={{ color: 'var(--primary-red)' }}>Message</span>
                </h3>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    required
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    required
                    className="form-input"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    placeholder="Corporate Discount, PT Booking, etc."
                    required
                    className="form-input"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '25px' }}>
                  <label className="form-label">Message Details</label>
                  <textarea
                    rows="4"
                    placeholder="Describe your inquiry..."
                    required
                    className="form-input"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Sending Message...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* GOOGLE MAPS BLOCK */}
        <div style={{ marginTop: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: '350px' }}>
          {/* Seamless dark Google Map mock using visual elements */}
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0c0c0c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666666',
            position: 'relative'
          }}>
            <iframe
              title="Newtown Fitness Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.090334812328!2d88.47318787595304!3d22.575713432851415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02753066a36f6d%3A0xe54fb7a2c09268f4!2sRajarhat%20Main%20Rd%2C%20New%20Town%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1717258900000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(100%) contrast(120%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div style={{
              position: 'absolute',
              bottom: '15px',
              left: '15px',
              backgroundColor: 'rgba(0,0,0,0.85)',
              padding: '10px 15px',
              borderRadius: '8px',
              border: '1px solid #222222',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              pointerEvents: 'none'
            }}>
              <span style={{ fontWeight: 700 }}>Newtown Fitness Gym Campus</span>
              <p style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>Rajarhat Road Intersection</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const flexCenterStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const iconBoxStyle = {
  width: '45px',
  height: '45px',
  borderRadius: '8px',
  backgroundColor: 'rgba(225, 6, 0, 0.1)',
  color: 'var(--primary-red)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  flexShrink: 0
};

const h5Style = {
  fontSize: '0.95rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#FFFFFF'
};

const detailStyle = {
  fontSize: '0.85rem',
  color: '#aaaaaa',
  marginTop: '2px'
};
