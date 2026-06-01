import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCreditCard, FaMobileAlt, FaUniversity, FaSpinner, FaCheckCircle, FaLock } from 'react-icons/fa';

export const RazorpayModal = ({ isOpen, onClose, planName, amount, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'upi', 'net'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ cardNo: '', expiry: '', cvv: '', upiId: '' });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'card') {
      if (form.cardNo.length < 16 || form.expiry.length < 4 || form.cvv.length < 3) {
        setErrorMsg('Please enter valid mock credit/debit card numbers.');
        return;
      }
    } else if (activeTab === 'upi') {
      if (!form.upiId.includes('@')) {
        setErrorMsg('Please specify a valid UPI ID (e.g. user@okhdfc).');
        return;
      }
    }

    setLoading(true);

    // Simulate transaction delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        // Trigger completion callback
        const randomId = 'pay_razor_' + Math.random().toString(36).substr(2, 9);
        onSuccess({
          paymentId: randomId,
          paymentMethod: activeTab === 'card' ? 'Credit Card' : activeTab === 'upi' ? 'UPI' : 'Net Banking'
        });
        setSuccess(false);
        setForm({ cardNo: '', expiry: '', cvv: '', upiId: '' });
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(8px)'
      }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            width: '100%',
            maxWidth: '450px',
            backgroundColor: '#0c0c0c',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* HEADER */}
          <div style={{
            padding: '20px',
            backgroundColor: '#121212',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#aaaaaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Secure Payment Gateway
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                Razorpay <span style={{ color: '#E10600' }}>Sandbox</span>
              </h3>
            </div>
            <button onClick={onClose} style={{
              background: 'none',
              border: 'none',
              color: '#666666',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'color 0.2s'
            }}><FaTimes /></button>
          </div>

          {/* CHECKOUT STATS */}
          <div style={{
            padding: '15px 20px',
            backgroundColor: 'rgba(225, 6, 0, 0.05)',
            borderBottom: '1px solid rgba(225, 6, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>Plan: {planName}</p>
            </div>
            <div>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#E10600' }}>₹{amount}</p>
            </div>
          </div>

          {/* INNER WORKFLOW */}
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                <FaSpinner className="dumbbell-spinner" style={{ fontSize: '2.5rem', marginBottom: '15px' }} />
                <p style={{ color: '#aaaaaa', fontWeight: 600 }}>Simulating Secure Authorization...</p>
                <p style={{ fontSize: '0.8rem', color: '#666666', marginTop: '5px' }}>Do not refresh this screen.</p>
              </div>
            ) : success ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                <FaCheckCircle style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '15px' }} />
                <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem' }}>Payment Successful!</p>
                <p style={{ fontSize: '0.85rem', color: '#aaaaaa', marginTop: '5px' }}>Generating styled gym invoice receipt...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMsg && (
                  <div style={{
                    backgroundColor: 'rgba(225,6,0,0.1)',
                    border: '1px solid var(--primary-red)',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '15px'
                  }}>{errorMsg}</div>
                )}

                {/* TAB SWITCHES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: activeTab === 'card' ? '#E10600' : '#1a1a1a',
                      backgroundColor: activeTab === 'card' ? 'rgba(225,6,0,0.1)' : '#121212',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <FaCreditCard />
                    Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('upi')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: activeTab === 'upi' ? '#E10600' : '#1a1a1a',
                      backgroundColor: activeTab === 'upi' ? 'rgba(225,6,0,0.1)' : '#121212',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <FaMobileAlt />
                    UPI
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('net')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: activeTab === 'net' ? '#E10600' : '#1a1a1a',
                      backgroundColor: activeTab === 'net' ? 'rgba(225,6,0,0.1)' : '#121212',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <FaUniversity />
                    Net Banking
                  </button>
                </div>

                {/* TAB PANELS */}
                {activeTab === 'card' && (
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={labelStyle}>Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        maxLength="16"
                        required
                        value={form.cardNo}
                        onChange={(e) => setForm({ ...form, cardNo: e.target.value.replace(/\D/g, '') })}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyle}>Expiry (MMYY)</label>
                        <input
                          type="text"
                          placeholder="1228"
                          maxLength="4"
                          required
                          value={form.expiry}
                          onChange={(e) => setForm({ ...form, expiry: e.target.value.replace(/\D/g, '') })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength="3"
                          required
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'upi' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>UPI Address</label>
                    <input
                      type="text"
                      placeholder="mobile@upi or user@okhdfc"
                      required
                      value={form.upiId}
                      onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                      style={inputStyle}
                    />
                    <p style={{ color: '#666666', fontSize: '0.75rem', marginTop: '5px' }}>
                      You will receive a simulated collect request inside this sandbox model.
                    </p>
                  </div>
                )}

                {activeTab === 'net' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Select Bank</label>
                    <select style={{
                      ...inputStyle,
                      backgroundColor: '#121212',
                      cursor: 'pointer'
                    }}>
                      <option value="hdfc">HDFC Bank Sandbox</option>
                      <option value="sbi">SBI Netbanking Sandbox</option>
                      <option value="icici">ICICI Bank Sandbox</option>
                      <option value="axis">Axis Bank Sandbox</option>
                    </select>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Pay ₹{amount} (Sandbox)
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '15px',
                  color: '#666666',
                  fontSize: '0.75rem'
                }}>
                  <FaLock style={{ color: '#2ecc71' }} />
                  <span>128-bit SSL Encrypted Sandbox Session</span>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  color: '#aaaaaa',
  fontWeight: 600,
  marginBottom: '5px',
  letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#161616',
  border: '1px solid #222222',
  borderRadius: '8px',
  color: '#FFFFFF',
  fontSize: '0.9rem'
};
