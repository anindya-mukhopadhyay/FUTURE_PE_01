import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBarcode, FaSpinner, FaCheckCircle, FaTimesCircle, FaChevronRight, FaLock, FaDumbbell } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function GateScannerTerminal() {
  const { fetchAllUsers, executeGateCheckIn } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [customUserId, setCustomUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { success: boolean, message: string, data?: any }

  useEffect(() => {
    // Load members for checkin list selector
    fetchAllUsers()
      .then(res => {
        if (res.success) {
          // Filter to show trainers and members for access terminal
          setUsers(res.data.filter(u => u.role !== 'admin'));
          if (res.data.length > 0) {
            const firstMember = res.data.find(u => u.role === 'member');
            setSelectedUserId(firstMember?._id || res.data[0]._id);
          }
        }
      })
      .catch(err => console.error("Could not fetch terminal members", err))
      .finally(() => setLoading(false));
  }, []);

  const playScanBeep = (isSuccess) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (isSuccess) {
        // High pitched clean positive beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else {
        // Low buzzy warning tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn("AudioContext sound synthesis blocked by user interaction requirements.", e.message);
    }
  };

  const handleScanSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const scanId = customUserId.trim() || selectedUserId;
    if (!scanId) return;

    setScanning(true);
    setScanResult(null);

    // Simulate scanning delay for visual high-fidelity
    setTimeout(async () => {
      const res = await executeGateCheckIn(scanId);
      setScanning(false);
      setScanResult(res);

      // Play synthesized tone
      playScanBeep(res.success);

      // Trigger Confetti bursts on access granted
      if (res.success) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2ecc71', '#00D2FF', '#FFFFFF']
        });
      } else {
        // Warning red confetti/shards
        confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.6 },
          colors: ['#E10600', '#ff5555']
        });
      }

      // Automatically reset screen after 4.5 seconds
      setTimeout(() => {
        setScanResult(null);
        setCustomUserId('');
      }, 4500);

    }, 1800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-family)'
    }}>
      {/* Dynamic Background Grid Mesh */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        backgroundImage: 'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none'
      }} />

      {/* Main Terminal Frame */}
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '750px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(10, 10, 10, 0.75)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        position: 'relative',
        zIndex: 5
      }}>
        
        {/* Terminal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaDumbbell style={{ color: 'var(--primary-red)', fontSize: '1.8rem' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Newtown Fitness Gym
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#888888', letterSpacing: '2px', textTransform: 'uppercase' }}>
                GATE ACCESS MONITOR
              </span>
            </div>
          </div>
          <div style={{
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            border: '1px solid #00D2FF',
            color: '#00D2FF',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            LOBBY GATE TERMINAL #1
          </div>
        </div>

        {/* Outer Split layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '35px'
        }} id="dashboard-grid">
          
          {/* VIEWPORT SCREEN LEFT */}
          <div style={{
            aspectRatio: '4/3',
            backgroundColor: '#050505',
            border: '2px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)'
          }}>
            {/* Dynamic Sweep Red Line */}
            {!scanResult && (
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  backgroundColor: 'var(--primary-red)',
                  boxShadow: '0 0 15px var(--primary-red)',
                  zIndex: 10
                }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Scanning overlay guidelines */}
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '15%',
              width: '70%',
              height: '70%',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: '8px',
              pointerEvents: 'none'
            }} />

            {/* CRT Monitor Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
              backgroundSize: '100% 4px, 6px 100%',
              pointerEvents: 'none',
              zIndex: 8
            }} />

            {/* Screen State Text */}
            {scanning ? (
              <div style={{ textAlign: 'center', zIndex: 5 }}>
                <FaSpinner className="dumbbell-spinner" style={{ fontSize: '2.5rem', color: 'var(--primary-red)', marginBottom: '15px' }} />
                <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ANALYZING CORE DATES...
                </h5>
              </div>
            ) : scanResult ? (
              <div style={{ zIndex: 5, padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    backgroundColor: scanResult.success ? 'rgba(46, 204, 113, 0.06)' : 'rgba(225, 6, 0, 0.06)',
                    border: `1px solid ${scanResult.success ? '#2ecc71' : 'var(--primary-red)'}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: `0 0 20px ${scanResult.success ? 'rgba(46, 204, 113, 0.15)' : 'rgba(225, 6, 0, 0.15)'}`
                  }}
                >
                  {scanResult.success ? (
                    <>
                      <FaCheckCircle style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '12px' }} />
                      <h4 style={{ color: '#2ecc71', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '1px' }}>
                        ACCESS GRANTED
                      </h4>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '10px 0 5px 0' }}>
                        {scanResult.data?.fullName}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: '#aaaaaa', display: 'block' }}>
                        Tier: {scanResult.data?.planType || 'Active Club Package'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#2ecc71', fontWeight: 700, display: 'block', marginTop: '5px' }}>
                        Attendance Check-In #{scanResult.data?.attendanceCount}
                      </span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle style={{ color: 'var(--primary-red)', fontSize: '3rem', marginBottom: '12px' }} />
                      <h4 style={{ color: 'var(--primary-red)', fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                        ACCESS REJECTED
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#eeeeee', marginTop: '10px', lineHeight: '1.5' }}>
                        {scanResult.message}
                      </p>
                    </>
                  )}
                </motion.div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', zIndex: 5 }}>
                <FaBarcode style={{ fontSize: '3rem', color: '#333333', marginBottom: '12px' }} />
                <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  READY FOR SCANS
                </h5>
              </div>
            )}

          </div>

          {/* CONTROL SWITCH PANEL RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '15px' }}>
                Access Controller
              </h4>

              {loading ? (
                <div style={{ color: '#666666', fontSize: '0.85rem' }}>Loading gym rosters...</div>
              ) : (
                <form onSubmit={handleScanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Select Member */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Member Profile</label>
                    <select
                      className="form-input"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      disabled={scanning || scanResult !== null}
                      style={{
                        backgroundColor: '#0c0c0c',
                        border: '1px solid #222222',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        padding: '10px'
                      }}
                    >
                      {users.map(u => (
                        <option key={u._id} value={u._id}>
                          {u.fullName} ({u.role.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom ID Input */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Or Input Custom User ID</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Paste MongoDB _id"
                      value={customUserId}
                      onChange={(e) => setCustomUserId(e.target.value)}
                      disabled={scanning || scanResult !== null}
                      style={{ padding: '10px' }}
                    />
                  </div>

                  {/* Scan card */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={scanning || scanResult !== null}
                    style={{
                      width: '100%',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      backgroundColor: 'var(--primary-red)',
                      boxShadow: 'var(--glow-shadow)'
                    }}
                  >
                    <FaBarcode />
                    <span>{scanning ? 'Transmitting...' : 'SCAN ACCESS CARD'}</span>
                  </button>
                </form>
              )}
            </div>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid #141414',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.75rem',
              color: '#888888'
            }}>
              <FaLock style={{ color: 'var(--primary-red)' }} />
              <span>Gateway uses real-time JWT checks. Active member plans only.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
