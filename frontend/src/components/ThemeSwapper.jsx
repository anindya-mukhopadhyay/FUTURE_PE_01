import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export const ThemeSwapper = () => {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('red'); // 'red', 'gold', 'blue'

  const themes = {
    red: {
      primary: '#E10600',
      hover: '#b30500',
      shadow: '0 0 20px rgba(225, 6, 0, 0.35)',
      glow: ['#E10600', '#FFFFFF']
    },
    gold: {
      primary: '#D4AF37',
      hover: '#aa8c2c',
      shadow: '0 0 20px rgba(212, 175, 55, 0.35)',
      glow: ['#D4AF37', '#FFFFFF']
    },
    blue: {
      primary: '#00D2FF',
      hover: '#00a3c7',
      shadow: '0 0 20px rgba(0, 210, 255, 0.35)',
      glow: ['#00D2FF', '#FFFFFF']
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('ntf_accent_theme');
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme, false);
    }
  }, []);

  const applyTheme = (themeName, triggerConfetti = true) => {
    const theme = themes[themeName];
    if (!theme) return;

    setActiveTheme(themeName);
    localStorage.setItem('ntf_accent_theme', themeName);

    // Apply Mapped Root CSS Variables dynamically
    document.documentElement.style.setProperty('--primary-red', theme.primary);
    document.documentElement.style.setProperty('--primary-red-hover', theme.hover);
    document.documentElement.style.setProperty('--glow-shadow', theme.shadow);

    if (triggerConfetti) {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { x: 0.95, y: 0.95 },
        colors: theme.glow
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '25px',
      right: '25px',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              padding: '10px 15px',
              backgroundColor: 'rgba(12, 12, 12, 0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#aaaaaa', textTransform: 'uppercase', marginRight: '5px' }}>Accent Accent:</span>
            
            {/* RED CIRCLE */}
            <button
              onClick={() => applyTheme('red')}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#E10600',
                border: activeTheme === 'red' ? '2px solid #FFFFFF' : 'none',
                cursor: 'pointer'
              }}
              title="Midnight Crimson"
            />

            {/* GOLD CIRCLE */}
            <button
              onClick={() => applyTheme('gold')}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#D4AF37',
                border: activeTheme === 'gold' ? '2px solid #FFFFFF' : 'none',
                cursor: 'pointer'
              }}
              title="Luxury Gold"
            />

            {/* BLUE CIRCLE */}
            <button
              onClick={() => applyTheme('blue')}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#00D2FF',
                border: activeTheme === 'blue' ? '2px solid #FFFFFF' : 'none',
                cursor: 'pointer'
              }}
              title="Steel Blue"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-red)',
          color: '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: 'var(--glow-shadow)',
          transition: 'all 0.3s'
        }}
        title="Change Accent Style Theme"
      >
        <FaPalette />
      </button>
    </div>
  );
};
