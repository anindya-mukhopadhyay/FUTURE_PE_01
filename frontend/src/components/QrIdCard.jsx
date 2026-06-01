import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaQrcode, FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaFileDownload } from 'react-icons/fa';

export default function QrIdCard({ user }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardCode = `NTF-${user?.fullName.replace(/\s+/g, '').toUpperCase().substr(0, 4)}-${user?.mobileNumber?.substr(-4) || 'MOCK'}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=e10600&bgcolor=ffffff&data=${user?.id || user?._id || 'mock_member_id'}`;

  const handlePrint = (e) => {
    e.stopPropagation();
    window.print();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      perspective: '1000px',
      width: '100%',
      maxWidth: '380px',
      margin: '0 auto'
    }}>
      {/* GLOWING ROTATIONAL PASS CONTAINER */}
      <motion.div
        style={{
          width: '100%',
          height: '240px',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          position: 'relative'
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* CARD FRONT PANEL */}
        <div style={{
          ...cardPanelStyle,
          background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(5, 5, 5, 0.95) 100%)',
          border: '1px solid rgba(225, 6, 0, 0.25)',
          boxShadow: user?.membership?.status === 'active' 
            ? '0 0 25px rgba(46, 204, 113, 0.2)' 
            : '0 0 25px rgba(225, 6, 0, 0.2)',
          backfaceVisibility: 'hidden'
        }}>
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--primary-red)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Newtown Gym</span>
              <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px', letterSpacing: '0.5px' }}>CLUB ACCESS PASS</h4>
            </div>
            <FaDumbbell style={{ color: 'var(--primary-red)', fontSize: '1.4rem' }} />
          </div>

          {/* Chip & Layout details */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0' }}>
            {/* Holographic simulated chip */}
            <div style={{
              width: '45px',
              height: '35px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #aa7c11 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15, background: 'repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)' }} />
            </div>

            <div>
              <h5 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {user?.fullName}
              </h5>
              <span style={{ fontSize: '0.75rem', color: '#aaaaaa' }}>ID: {cardCode}</span>
            </div>
          </div>

          {/* Card Footer details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
            <div>
              <span style={{ fontSize: '0.6rem', color: '#666666', display: 'block', textTransform: 'uppercase' }}>Join Date</span>
              <strong style={{ fontSize: '0.75rem', color: '#FFFFFF' }}>{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</strong>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: user?.membership?.status === 'active' ? 'rgba(46,204,113,0.1)' : 'rgba(225,6,0,0.1)',
                color: user?.membership?.status === 'active' ? '#2ecc71' : 'var(--primary-red)',
                border: '1px solid',
                borderColor: user?.membership?.status === 'active' ? '#2ecc71' : 'var(--primary-red)',
                padding: '3px 10px',
                borderRadius: '20px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {user?.membership?.status === 'active' ? (
                  <>
                    <FaCheckCircle /> ACTIVE
                  </>
                ) : (
                  <>
                    <FaExclamationCircle /> INACTIVE
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Prompt to flip */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.6rem',
            color: '#444444',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <FaInfoCircle /> Click to scan QR code
          </div>
        </div>

        {/* CARD BACK PANEL */}
        <div style={{
          ...cardPanelStyle,
          background: '#FFFFFF',
          color: '#000000',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px'
        }}>
          {/* QR Code Container */}
          <div style={{
            width: '130px',
            height: '130px',
            padding: '5px',
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--primary-red)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <img
              src={qrUrl}
              alt="Gate Pass Access QR Code"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                // Fallback icon if offline
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div style="font-size: 4rem; color: #E10600;"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 224v240a16 16 0 0 0 16 16h240a16 16 0 0 0 16-16V224a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16zm96 180c0-26.5 21.5-48 48-48s48 21.5 48 48-21.5 48-48 48-48-21.5-48-48zm48-232a48 48 0 1 0 48 48 48 48 0 0 0-48-48zM224 0H16A16 16 0 0 0 0 16v240a16 16 0 0 0 16 16h240a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16zm-80 188a48 48 0 1 0-48-48 48.05 48.05 0 0 0 48 48zm280 192a16 16 0 0 1 16 16v80a16 16 0 0 1-16 16h-80a16 16 0 0 1-16-16v-80a16 16 0 0 1 16-16h80zm-176-64h-32v32h32zm176-320v80a16 16 0 0 1-16 16h-240a16 16 0 0 1-16-16V16a16 16 0 0 1 16-16h240a16 16 0 0 1 16 16zm-80 188a48 48 0 1 0-48-48 48.05 48.05 0 0 0 48 48zm128 32c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48z"></path></svg></div>';
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Hold Close to Scanner Gate
            </span>
            <p style={{ fontSize: '0.6rem', color: '#666666', marginTop: '3px', maxWidth: '280px' }}>
              Scan this dynamic QR pass at Newtown Fitness gate terminal for automated entry checkins.
            </p>
          </div>

          {/* Click to flip back */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.6rem',
            color: '#888888',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <FaQrcode /> Click to flip to front
          </div>
        </div>
      </motion.div>

      {/* Helper Trigger Details */}
      <button onClick={handlePrint} className="btn btn-secondary" style={{
        padding: '10px 22px',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderColor: 'rgba(255,255,255,0.1)',
        color: '#FFFFFF'
      }}>
        <FaFileDownload /> Print Physical Gate Pass
      </button>
    </div>
  );
}

const cardPanelStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  padding: '25px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};
