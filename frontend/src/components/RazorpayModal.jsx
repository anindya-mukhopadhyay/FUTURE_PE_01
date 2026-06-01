import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaCreditCard, 
  FaMobileAlt, 
  FaUniversity, 
  FaSpinner, 
  FaCheckCircle, 
  FaLock, 
  FaWhatsapp, 
  FaQrcode, 
  FaTags 
} from 'react-icons/fa';

export const RazorpayModal = ({ isOpen, onClose, planName, amount, onSuccess, offers = [] }) => {
  const [activeTab, setActiveTab] = useState('card'); // 'card', 'upi', 'net', 'whatsapp'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ cardNo: '', expiry: '', cvv: '', upiId: '', utrNo: '' });
  const [errorMsg, setErrorMsg] = useState('');
  
  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount }
  const [couponFeedback, setCouponFeedback] = useState({ success: false, message: '' });
  const [finalAmount, setFinalAmount] = useState(amount);

  useEffect(() => {
    setFinalAmount(amount);
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponFeedback({ success: false, message: '' });
  }, [amount, isOpen]);

  if (!isOpen) return null;

  // Coupon Code Validation
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponFeedback({ success: false, message: '' });
    setErrorMsg('');

    if (!couponInput.trim()) {
      setCouponFeedback({ success: false, message: 'Please enter a coupon code.' });
      return;
    }

    const cleanedCode = couponInput.trim().toUpperCase();
    
    // Find matching coupon in database list
    const foundOffer = offers.find(o => o.code === cleanedCode);

    if (foundOffer) {
      setAppliedCoupon(foundOffer);
      const discountVal = Math.round((amount * foundOffer.discount) / 100);
      setFinalAmount(amount - discountVal);
      setCouponFeedback({
        success: true,
        message: `Success! Code ${foundOffer.code} applied: ${foundOffer.discount}% OFF (-₹${discountVal})`
      });
    } else {
      // Local fallback standard coupon checks
      if (cleanedCode === 'NEWTOWN25') {
        const fallbackOffer = { code: 'NEWTOWN25', discount: 25 };
        setAppliedCoupon(fallbackOffer);
        const discountVal = Math.round((amount * 25) / 100);
        setFinalAmount(amount - discountVal);
        setCouponFeedback({
          success: true,
          message: `Success! Code NEWTOWN25 applied: 25% OFF (-₹${discountVal})`
        });
      } else if (cleanedCode === 'MONSOON15') {
        const fallbackOffer = { code: 'MONSOON15', discount: 15 };
        setAppliedCoupon(fallbackOffer);
        const discountVal = Math.round((amount * 15) / 100);
        setFinalAmount(amount - discountVal);
        setCouponFeedback({
          success: true,
          message: `Success! Code MONSOON15 applied: 15% OFF (-₹${discountVal})`
        });
      } else {
        setCouponFeedback({
          success: false,
          message: 'Invalid or expired coupon code.'
        });
      }
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setFinalAmount(amount);
    setCouponInput('');
    setCouponFeedback({ success: false, message: '' });
  };

  // Sound beep synthesiser
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch(e) {}
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'card') {
      if (form.cardNo.length < 16 || form.expiry.length < 4 || form.cvv.length < 3) {
        setErrorMsg('Please enter valid mock credit/debit card numbers.');
        return;
      }
    } else if (activeTab === 'upi') {
      if (!form.upiId.includes('@')) {
        setErrorMsg('Please specify a valid UPI ID (e.g. name@upi).');
        return;
      }
    } else if (activeTab === 'whatsapp') {
      if (!form.utrNo.trim()) {
        setErrorMsg('Please enter your transaction ref number (UTR / Txn ID) to confirm.');
        return;
      }
    }

    setLoading(true);
    playBeep();

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        const randomId = 'pay_razor_' + Math.random().toString(36).substr(2, 9);
        const methodMap = {
          card: 'Credit Card',
          upi: 'UPI Sandbox',
          net: 'Net Banking',
          whatsapp: 'WhatsApp Direct Pay'
        };

        // If paying via WhatsApp, open pre-filled chat link in new window
        if (activeTab === 'whatsapp') {
          const userStr = localStorage.getItem('ntf_user');
          const email = userStr ? JSON.parse(userStr).email : 'guest@gmail.com';
          const msg = `Hi Newtown Gym, I have successfully paid ₹${finalAmount} for the "${planName}" membership!\n\nDetails:\n- Plan: ${planName}\n- Final Price: ₹${finalAmount}\n- Coupon Applied: ${appliedCoupon ? appliedCoupon.code : 'None'}\n- Transaction Ref (UTR): ${form.utrNo}\n- Email Account: ${email}\n\nPlease approve my membership pass!`;
          const waUrl = `https://wa.me/919083206460?text=${encodeURIComponent(msg)}`;
          window.open(waUrl, '_blank');
        }

        // Trigger completion callback
        onSuccess({
          paymentId: activeTab === 'whatsapp' ? `UTR-${form.utrNo}` : randomId,
          paymentMethod: methodMap[activeTab] || 'Sandbox Checkout',
          appliedCoupon: appliedCoupon ? appliedCoupon.code : undefined,
          finalAmount
        });

        setSuccess(false);
        setForm({ cardNo: '', expiry: '', cvv: '', upiId: '', utrNo: '' });
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
            maxWidth: '460px',
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

          {/* DYNAMIC CHECKOUT PRICE SHEET */}
          <div style={{
            padding: '18px 20px',
            backgroundColor: 'rgba(225, 6, 0, 0.05)',
            borderBottom: '1px solid rgba(225, 6, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>{planName}</p>
              {appliedCoupon && (
                <span style={{ fontSize: '0.75rem', color: '#ffd700', display: 'block', marginTop: '3px' }}>
                  Original: <span style={{ textDecoration: 'line-through' }}>₹{amount}</span> (-{appliedCoupon.discount}%)
                </span>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 950, color: 'var(--primary-red)' }}>₹{finalAmount}</p>
              <span style={{ fontSize: '0.65rem', color: '#888888', textTransform: 'uppercase' }}>FINAL PRICE</span>
            </div>
          </div>

          {/* INNER WORKFLOW */}
          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                <FaSpinner className="dumbbell-spinner" style={{ fontSize: '2.5rem', color: 'var(--primary-red)', marginBottom: '15px' }} />
                <p style={{ color: '#aaaaaa', fontWeight: 600 }}>Simulating Secure Authorization...</p>
                <p style={{ fontSize: '0.8rem', color: '#666666', marginTop: '5px' }}>Do not refresh this screen.</p>
              </div>
            ) : success ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
                <FaCheckCircle style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '15px' }} />
                <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem' }}>Payment Successful!</p>
                <p style={{ fontSize: '0.85rem', color: '#aaaaaa', marginTop: '5px' }}>Synchronizing club pass dashboard...</p>
              </div>
            ) : (
              <div>
                {/* 1. COUPON APPLICATION BOX */}
                <div style={{
                  padding: '12px 15px',
                  backgroundColor: 'rgba(255,255,255,0.01)',
                  border: '1px solid #1a1a1a',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FaTags style={{ color: 'var(--primary-red)', fontSize: '0.85rem' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apply Promotion Coupon</span>
                  </div>

                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="e.g. NEWTOWN25, MONSOON15"
                        className="form-input"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{ padding: '8px', fontSize: '0.85rem', flex: 1 }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(46,204,113,0.05)', border: '1px solid rgba(46,204,113,0.15)', padding: '6px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#2ecc71', fontWeight: 700 }}>
                        ✓ {appliedCoupon.code} applied (-{appliedCoupon.discount}%)
                      </span>
                      <button onClick={handleRemoveCoupon} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-red)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>Remove</button>
                    </div>
                  )}

                  {couponFeedback.message && !appliedCoupon && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: couponFeedback.success ? '#2ecc71' : 'var(--primary-red)',
                      marginTop: '6px',
                      fontWeight: 600
                    }}>{couponFeedback.message}</p>
                  )}
                </div>

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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('card')}
                      style={activeTab === 'card' ? activeTabStyle : inactiveTabStyle}
                    >
                      <FaCreditCard />
                      Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('upi')}
                      style={activeTab === 'upi' ? activeTabStyle : inactiveTabStyle}
                    >
                      <FaMobileAlt />
                      UPI
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('net')}
                      style={activeTab === 'net' ? activeTabStyle : inactiveTabStyle}
                    >
                      <FaUniversity />
                      NetBank
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('whatsapp')}
                      style={activeTab === 'whatsapp' ? activeTabStyle : inactiveTabStyle}
                    >
                      <FaWhatsapp style={{ color: '#2ecc71' }} />
                      WhatsApp
                    </button>
                  </div>

                  {/* TAB PANELS */}
                  {activeTab === 'card' && (
                    <div>
                      <div style={{ marginBottom: '12px' }}>
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
                        You will receive a simulated collect request inside this sandbox.
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

                  {/* WhatsApp DIRECT UPI / QR CODE GATEWAY */}
                  {activeTab === 'whatsapp' && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                        <FaQrcode />
                        UPI Scan & WhatsApp Activation
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', alignItems: 'center', backgroundColor: '#060606', padding: '15px', borderRadius: '10px', border: '1px solid #1a1a1a', marginBottom: '15px' }}>
                        
                        {/* Dynamic Mock QR Code */}
                        <div style={{
                          padding: '8px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                        }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000000&data=upi://pay?pa=newtownfitness@upi%26pn=Newtown%20Fitness%20Gym%26am=${finalAmount}%26cu=INR`}
                            alt="Payment QR"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        {/* Scanner guidelines */}
                        <div style={{ fontSize: '0.75rem', color: '#aaaaaa', lineHeight: '1.5' }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 800, display: 'block', fontSize: '0.8rem', marginBottom: '3px' }}>Scan with GPay/PhonePe</span>
                          1. Scan this QR Code.
                          <br />
                          2. Pay <strong style={{ color: '#ffd700' }}>₹{finalAmount}</strong>.
                          <br />
                          3. Input the Txn ID below.
                        </div>

                      </div>

                      <div className="form-group">
                        <label style={labelStyle}>UPI Transaction ID / UTR No.</label>
                        <input
                          type="text"
                          placeholder="e.g. UTR123456789012"
                          required
                          value={form.utrNo}
                          onChange={(e) => setForm({ ...form, utrNo: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {activeTab === 'whatsapp' ? (
                      <>
                        <FaWhatsapp style={{ fontSize: '1.1rem' }} />
                        Confirm & Send Receipt to Admin
                      </>
                    ) : (
                      `Pay ₹${finalAmount} (Sandbox)`
                    )}
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
                    <span>Secure 128-bit SSL Payment Gateway</span>
                  </div>

                </form>
              </div>
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

const tabStyle = {
  padding: '8px 5px',
  borderRadius: '8px',
  border: '1px solid',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.65rem',
  fontWeight: 700,
  transition: 'all 0.2s'
};

const activeTabStyle = {
  ...tabStyle,
  borderColor: 'var(--primary-red)',
  backgroundColor: 'rgba(225,6,0,0.1)',
  color: '#FFFFFF'
};

const inactiveTabStyle = {
  ...tabStyle,
  borderColor: '#1a1a1a',
  backgroundColor: '#121212',
  color: '#888888'
};
