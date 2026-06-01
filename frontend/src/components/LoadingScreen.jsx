import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell } from 'react-icons/fa';

export const LoadingScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500); // fade transition
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(old + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <FaDumbbell style={{ fontSize: '4.5rem', color: '#E10600', filter: 'drop-shadow(0 0 15px rgba(225, 6, 0, 0.6))' }} />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: '2rem',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}
      >
        NEWTOWN <span style={{ color: '#E10600' }}>FITNESS</span>
      </motion.h1>

      <div style={{
        width: '240px',
        height: '3px',
        backgroundColor: '#222222',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '15px'
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
          style={{
            height: '100%',
            backgroundColor: '#E10600',
            boxShadow: '0 0 10px #E10600'
          }}
        />
      </div>

      <motion.span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          color: '#aaaaaa',
          fontSize: '1.2rem',
          letterSpacing: '1px'
        }}
      >
        {progress}%
      </motion.span>
    </motion.div>
  );
};
