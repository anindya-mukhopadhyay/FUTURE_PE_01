import React from 'react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaClock, FaEnvelope, FaBriefcase } from 'react-icons/fa';

export default function Trainers() {
  const { trainers, loading } = useBooking();

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>Certified <span>Coaches</span></h2>
          <p>Train with national and international champion bodybuilders, corrective exercise masters, and certified nutritionists.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            <div className="skeleton" style={{ width: '280px', height: '350px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '280px', height: '350px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '280px', height: '350px', borderRadius: '12px' }} />
          </div>
        ) : (
          <div className="grid-3">
            {trainers.map((trainer) => (
              <motion.div
                key={trainer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card"
                style={{ padding: 0, overflow: 'hidden' }}
              >
                {/* PHOTO CONTAINER */}
                <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={trainer.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop'}
                    alt={trainer.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    className="trainer-img"
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    padding: '20px 15px 15px 15px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)'
                  }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>{trainer.name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                      {trainer.specialization.map((spec, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-red)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DETAILS CONTAINER */}
                <div style={{ padding: '20px' }}>
                  <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.6' }}>
                    {trainer.bio}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #222222', paddingTop: '15px' }}>
                    <div style={flexRowStyle}>
                      <FaBriefcase style={iconStyle} />
                      <span style={detailStyle}>Experience: {trainer.experience} Years</span>
                    </div>

                    <div style={flexRowStyle}>
                      <FaGraduationCap style={iconStyle} />
                      <span style={detailStyle}>
                        Certifications: {trainer.certifications.slice(0, 2).join(', ')}
                      </span>
                    </div>

                    <div style={flexRowStyle}>
                      <FaClock style={iconStyle} />
                      <span style={detailStyle}>
                        Available: {trainer.schedule.slice(0, 2).join(' | ')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
      <style>{`
        .glass-card:hover .trainer-img {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
}

const flexRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const iconStyle = {
  color: 'var(--primary-red)',
  fontSize: '0.9rem',
  flexShrink: 0
};

const detailStyle = {
  fontSize: '0.85rem',
  color: '#cccccc',
  fontWeight: 500
};
