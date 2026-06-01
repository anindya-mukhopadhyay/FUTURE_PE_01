import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaAward, FaBuilding, FaUsers, FaDumbbell, FaShieldAlt } from 'react-icons/fa';

export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>About <span>Newtown Fitness</span></h2>
          <p>Uncompromising training standards, science-based programming, and premium athletic utilities.</p>
        </div>

        {/* STORY SECTOR */}
        <div className="grid-2" style={{ alignItems: 'center', marginBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '15px' }}>
              Built For <span style={{ color: 'var(--primary-red)' }}>Athletes</span>, Engineered For Results
            </h3>
            <p style={{ color: '#aaaaaa', fontSize: '1.05rem', marginBottom: '15px', lineHeight: '1.8' }}>
              Founded in Rajarhat, Newtown in 2021, Newtown Fitness Gym emerged to bridge the gap between simple commercial facilities and high-performance training camps. We believe that true athletic potential is unlocked when scientific methodology meets peak facilities.
            </p>
            <p style={{ color: '#aaaaaa', fontSize: '1.05rem', marginBottom: '20px', lineHeight: '1.8' }}>
              Our 12,000 square foot facility contains custom-selected ergonomic machinery, Olympic lifting pads, an indoor sprinting track, dedicated group CrossFit spaces, and complete diagnostic water/diet monitoring centers.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaDumbbell style={{ color: 'var(--primary-red)', fontSize: '1.2rem' }} />
                <span style={{ fontWeight: 600 }}>120+ Ergonomic Weights</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaShieldAlt style={{ color: 'var(--primary-red)', fontSize: '1.2rem' }} />
                <span style={{ fontWeight: 600 }}>Certified Bio-mechanics</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative' }}
          >
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop"
              alt="Gym Floor"
              style={{
                width: '100%',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.5)'
              }}
            />
          </motion.div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid-3" style={{ marginBottom: '80px' }}>
          
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <FaCrown style={{ color: 'var(--primary-red)', fontSize: '2.5rem', marginBottom: '15px' }} />
            <h4 style={h4Style}>Our Mission</h4>
            <p style={{ color: '#aaaaaa', fontSize: '0.95rem' }}>
              To engineer elite physical transformations by equipping our members with science-based training methodologies and high-performance environments.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <FaBuilding style={{ color: 'var(--primary-red)', fontSize: '2.5rem', marginBottom: '15px' }} />
            <h4 style={h4Style}>Our Vision</h4>
            <p style={{ color: '#aaaaaa', fontSize: '0.95rem' }}>
              To establish Newtown Fitness as the national gold standard in athletic conditioning and specialized physical re-composition facilities.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <FaUsers style={{ color: 'var(--primary-red)', fontSize: '2.5rem', marginBottom: '15px' }} />
            <h4 style={h4Style}>Our Community</h4>
            <p style={{ color: '#aaaaaa', fontSize: '0.95rem' }}>
              Fostering a highly motivated, supportive community of lifting athletes, health seekers, and certified professional coaching minds.
            </p>
          </div>

        </div>

        {/* AWARDS & ACCOMPLISHMENTS */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '40px' }}>
            Awards & <span style={{ color: 'var(--primary-red)' }}>Recognition</span>
          </h3>
          <div className="grid-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid #1a1a1a', textAlign: 'left' }}>
              <FaAward style={{ color: 'var(--primary-red)', fontSize: '2.5rem', flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Best Premium Gym Facility 2024</h5>
                <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginTop: '4px' }}>Awarded by the East India Fitness Association for outstanding ergonomic standards and hygiene splits.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid #1a1a1a', textAlign: 'left' }}>
              <FaAward style={{ color: 'var(--primary-red)', fontSize: '2.5rem', flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Fitness Innovation Award</h5>
                <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginTop: '4px' }}>Recognized for our pioneering visual calculators integration, dynamic diet logs, and dashboard tools.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const h4Style = {
  fontSize: '1.3rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: '10px',
  color: '#FFFFFF'
};
