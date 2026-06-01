import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/aux/gallery`)
      .then(res => {
        if (res.data.success) setItems(res.data.data);
      })
      .catch(err => {
        console.warn("Backend servers offline, seeding static mock gallery catalog.", err.message);
        setItems([
          {
            _id: 'g1',
            title: 'Ergonomic Heavy Dumbbells Floor',
            imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
            category: 'Facilities'
          },
          {
            _id: 'g2',
            title: 'Dynamic Group Cardio Lines',
            imageUrl: 'https://images.unsplash.com/photo-1571731956622-9a642941b3f5?q=80&w=800&auto=format&fit=crop',
            category: 'Facilities'
          },
          {
            _id: 'g3',
            title: 'Intense Metabolic HIIT Circuits',
            imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
            category: 'Workouts'
          },
          {
            _id: 'g4',
            title: 'Sarah Leading Group Aerobics',
            imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
            category: 'Events'
          },
          {
            _id: 'g5',
            title: 'Athletic 12-Week Lean Transformation',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
            category: 'Transformations'
          },
          {
            _id: 'g6',
            title: 'Elena Core Midsection Cuts',
            imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
            category: 'Transformations'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Facilities', 'Workouts', 'Events', 'Transformations'];

  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.category === activeFilter);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>Our <span>Gallery</span></h2>
          <p>Explore our premium machinery floors, group sessions, events highlights, and inspirational member transformations.</p>
        </div>

        {/* FILTER CATEGORY ROW */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => { setActiveFilter(cat); setLightboxIndex(null); }}
              style={{
                padding: '10px 22px',
                borderRadius: '25px',
                border: '1px solid',
                borderColor: activeFilter === cat ? 'var(--primary-red)' : '#222222',
                backgroundColor: activeFilter === cat ? 'var(--primary-red)' : 'rgba(255,255,255,0.02)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GALLERY IMAGE GRID */}
        {loading ? (
          <div className="grid-3">
            <div className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />
          </div>
        ) : (
          <motion.div layout className="grid-3">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(index)}
                style={{
                  height: '260px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
                className="gallery-item-card"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  className="gallery-img"
                />
                
                {/* DYNAMIC SHADOW COVER ON HOVER */}
                <div className="gallery-hover-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  opacity: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'opacity 0.3s'
                }}>
                  <FaEye style={{ fontSize: '2rem', color: 'var(--primary-red)' }} />
                  <h4 style={{ fontSize: '1rem', color: '#FFFFFF', textTransform: 'uppercase', padding: '0 15px', textAlign: 'center' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#aaaaaa', border: '1px solid #333333', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* LIGHTBOX POPUP COMPONENT */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                backdropFilter: 'blur(8px)'
              }}
            >
              {/* CLOSE ICON */}
              <button style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '2rem',
                cursor: 'pointer'
              }}><FaTimes /></button>

              {/* NAVIGATION BUTTONS */}
              <button onClick={handlePrev} style={{ ...navBtnStyle, left: '20px' }}>
                <FaChevronLeft />
              </button>
              <button onClick={handleNext} style={{ ...navBtnStyle, right: '20px' }}>
                <FaChevronRight />
              </button>

              {/* SLIDE DETAILS */}
              <div onClick={(e) => e.stopPropagation()} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '90%',
                maxHeight: '90%'
              }}>
                <img
                  src={filteredItems[lightboxIndex].imageUrl}
                  alt={filteredItems[lightboxIndex].title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    objectFit: 'contain'
                  }}
                />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: 800, marginTop: '20px', textTransform: 'uppercase', textAlign: 'center' }}>
                  {filteredItems[lightboxIndex].title}
                </h3>
                <span style={{ color: 'var(--primary-red)', fontWeight: 600, fontSize: '0.9rem', marginTop: '5px' }}>
                  Category: {filteredItems[lightboxIndex].category}
                </span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <style>{`
        .gallery-item-card:hover .gallery-img {
          transform: scale(1.06);
        }
        .gallery-item-card:hover .gallery-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

const navBtnStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#FFFFFF',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'background 0.2s',
  zIndex: 10000
};
