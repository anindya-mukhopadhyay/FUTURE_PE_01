import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaDumbbell, FaShieldAlt, FaHeartbeat, FaClock, FaArrowRight, FaStar } from 'react-icons/fa';

export default function Home() {
  // Mini BMI calculator state on homepage
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [bmi, setBmi] = useState(null);

  const calculateBmi = (e) => {
    e.preventDefault();
    const heightInMeters = height / 100;
    const score = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    let category = '';
    let color = '';

    if (score < 18.5) { category = 'Underweight'; color = '#3498db'; }
    else if (score >= 18.5 && score < 25) { category = 'Normal Weight'; color = '#2ecc71'; }
    else if (score >= 25 && score < 30) { category = 'Overweight'; color = '#f1c40f'; }
    else { category = 'Obese'; color = '#e74c3c'; }

    setBmi({ score, category, color });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', overflow: 'hidden' }}>
      
      {/* 1. HERO BANNER */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.4) 100%), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px'
      }}>
        <div className="container">
          <div style={{ maxWidth: '650px' }}>
            
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                color: 'var(--primary-red)',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                display: 'block',
                marginBottom: '15px'
              }}
            >
              Elite Fitness Gym Campus
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: '3.8rem',
                fontWeight: 900,
                lineHeight: '1.15',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#FFFFFF',
                marginBottom: '20px'
              }}
              className="hero-heading"
            >
              Unleash Your <br />
              <span style={{ color: 'var(--primary-red)', WebkitTextStroke: '1px var(--primary-red)' }}>Inner Beast</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                color: '#cccccc',
                fontSize: '1.15rem',
                lineHeight: '1.7',
                marginBottom: '35px'
              }}
            >
              At Newtown Fitness Gym, we equip you with certified bi-mechanics coaches, ergonomic weight floors, and customized metabolic metrics diagnostics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}
            >
              <Link to="/membership" className="btn btn-primary" style={{ padding: '14px 35px' }}>
                Explore Plans
              </Link>
              <Link to="/about" className="btn btn-secondary" style={{ padding: '14px 35px' }}>
                Our Story
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US */}
      <section className="section-padding" style={{ backgroundColor: '#060606' }}>
        <div className="container">
          
          <div className="section-title">
            <h2>Why <span>Choose Us</span></h2>
            <p>We combine advanced physical tools with high-fidelity coaching to accelerate physical outputs.</p>
          </div>

          <div className="grid-4">
            
            <div className="glass-card" style={whyCardStyle}>
              <FaDumbbell style={whyIconStyle} />
              <h4 style={whyH4Style}>Elite Equipment</h4>
              <p style={whyDescStyle}>Custom biomechanics machinery, lifting cages, and Olympic lifting setups.</p>
            </div>

            <div className="glass-card" style={whyCardStyle}>
              <FaShieldAlt style={whyIconStyle} />
              <h4 style={whyH4Style}>Certified Coaches</h4>
              <p style={whyDescStyle}>Guidance under ISSA, ACE, and CSCS certified fitness and diet engineers.</p>
            </div>

            <div className="glass-card" style={whyCardStyle}>
              <FaHeartbeat style={whyIconStyle} />
              <h4 style={whyH4Style}>Calculators Integration</h4>
              <p style={whyDescStyle}>Log physical metrics directly in your dashboard to dynamically gauge daily deficits.</p>
            </div>

            <div className="glass-card" style={whyCardStyle}>
              <FaClock style={whyIconStyle} />
              <h4 style={whyH4Style}>Extended Hours</h4>
              <p style={whyDescStyle}>Operational 365 days a year from 06:00 AM to 10:00 PM for flexibility splits.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOME BMI CALCULATOR MODULE */}
      <section className="section-padding" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.7) 100%), url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            <div>
              <span style={{ color: 'var(--primary-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
                Instant Physical Checkup
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginTop: '10px', color: '#FFFFFF', lineHeight: '1.2' }}>
                Calculate Your <span style={{ color: 'var(--primary-red)' }}>Body Mass Index</span>
              </h2>
              <p style={{ color: '#aaaaaa', marginTop: '15px', lineHeight: '1.7', fontSize: '1rem', maxWidth: '500px' }}>
                BMI is a key indicator used internationally by medical experts to estimate lean vs fat weights proportional to height. Slide physical parameters below!
              </p>
            </div>

            {/* INTERACTIVE MINI BMI CARD */}
            <div className="glass-card">
              <form onSubmit={calculateBmi}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label className="form-label">Height</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-red)' }}>{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="130"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label className="form-label">Weight</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-red)' }}>{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    style={sliderStyle}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Get BMI Score
                </button>
              </form>

              {/* BMI RESULT HUD */}
              {bmi && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid #222222',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', color: '#aaaaaa', textTransform: 'uppercase' }}>Computed Score</span>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900, color: bmi.color, lineHeight: '1.2' }}>{bmi.score}</p>
                  <h5 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '5px', color: '#FFFFFF' }}>{bmi.category}</h5>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 4. SUCCESS TESTIMONIALS */}
      <section className="section-padding" style={{ backgroundColor: '#060606' }}>
        <div className="container">
          
          <div className="section-title">
            <h2>Success <span>Stories</span></h2>
            <p>Hear from real members who transformed their bodies, mental focus, and athletic routines at Newtown Gym.</p>
          </div>

          <div className="grid-3">
            
            <div className="glass-card">
              <div style={{ display: 'flex', gap: '5px', color: '#f1c40f', marginBottom: '15px' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p style={{ color: '#aaaaaa', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                "Newtown Fitness completely redefined my training framework. The custom diet logs in the dashboard kept my protein levels in check, and Vikram coached me to squat 140kg in under 6 months!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#222', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Marcus V.</h5>
                  <span style={{ fontSize: '0.75rem', color: '#666666' }}>IT Engineer</span>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', gap: '5px', color: '#f1c40f', marginBottom: '15px' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p style={{ color: '#aaaaaa', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                "The premium glassmorphic atmosphere here is exceptionally elite. Real Olympic platform weights, amazing CrossFit schedulers, and zero crowds on the main compound lifting floors. Unrivaled in Rajarhat."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#222', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Elena R.</h5>
                  <span style={{ fontSize: '0.75rem', color: '#666666' }}>Creative Director</span>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', gap: '5px', color: '#f1c40f', marginBottom: '15px' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p style={{ color: '#aaaaaa', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                "I bought the Quarterly Package and the visual Razorpay simulator checkout was incredibly smooth. Having the invoice dynamic PDF download immediately ready inside my profile tab felt incredibly premium."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#222', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                </div>
                <div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Robert L.</h5>
                  <span style={{ fontSize: '0.75rem', color: '#666666' }}>Corporate Counsel</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. MEMBERSHIP PROMO TICKETS */}
      <section className="section-padding" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(225,6,0,0.2) 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '15px' }}>
            Elevate Your Training <span style={{ color: 'var(--primary-red)' }}>Standard</span> Today
          </h2>
          <p style={{ color: '#aaaaaa', maxWidth: '600px', margin: '0 auto 35px auto', fontSize: '1.05rem', lineHeight: '1.7' }}>
            Seize absolute control over your health metrics. Pick your premium package split and start tracking active booking schedules today.
          </p>
          <Link to="/membership" className="btn btn-primary" style={{ padding: '14px 40px' }}>
            Choose Plan Now <FaArrowRight style={{ fontSize: '0.9rem' }} />
          </Link>
        </div>
      </section>

    </div>
  );
}

// Inline component CSS styles
const whyCardStyle = {
  textAlign: 'center',
  padding: '35px 20px'
};

const whyIconStyle = {
  fontSize: '2.5rem',
  color: 'var(--primary-red)',
  marginBottom: '15px',
  filter: 'drop-shadow(0 0 5px rgba(225,6,0,0.4))'
};

const whyH4Style = {
  fontSize: '1.25rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#FFFFFF',
  marginBottom: '10px'
};

const whyDescStyle = {
  fontSize: '0.85rem',
  color: '#aaaaaa',
  lineHeight: '1.6'
};

const sliderStyle = {
  width: '100%',
  accentColor: 'var(--primary-red)',
  cursor: 'pointer',
  height: '6px',
  backgroundColor: '#222222',
  borderRadius: '3px'
};
