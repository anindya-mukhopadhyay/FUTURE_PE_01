import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { RazorpayModal } from '../components/RazorpayModal';
import { FaCheck, FaTimes, FaCrown, FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

export default function Membership() {
  const { user } = useAuth();
  const { processCheckout, offers } = useBooking();
  const navigate = useNavigate();

  const [checkoutPlan, setCheckoutPlan] = useState(null); // { planName, amount }
  const [successOverlay, setSuccessOverlay] = useState(false);

  const plans = [
    {
      name: 'Monthly Package',
      price: 3200,
      duration: '1 Month',
      popular: false,
      features: ['Full Gym Access', 'Locker & Shower Room', 'Free Workout App Log', '1 Basic Consultation']
    },
    {
      name: 'Quarterly Package',
      price: 8500,
      duration: '3 Months',
      popular: true,
      features: ['Full Gym Access', 'Locker & Shower Room', '10 Group Classes Included', '2 Fitness Consultations', '1 Free Gym Shaker']
    },
    {
      name: 'Half-Yearly Package',
      price: 15000,
      duration: '6 Months',
      popular: false,
      features: ['Full Gym Access', 'Locker & Shower Room', 'Unlimited Group Classes', 'Monthly Body Composition Scan', 'Dedicated Custom Diet Chart']
    },
    {
      name: 'Yearly Package',
      price: 26000,
      duration: '12 Months',
      popular: false,
      features: ['Full Gym Access', 'Locker & Shower Room', 'Unlimited Group Classes', 'All Scans & Diet Customization', '3 Free Guest Passes / Month', 'Official Gym T-Shirt & Kit']
    }
  ];

  const handleBuy = (plan) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setCheckoutPlan(plan);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    const res = await processCheckout({
      planType: checkoutPlan.name,
      amount: paymentDetails.finalAmount, // Save actual discounted final amount!
      paymentId: paymentDetails.paymentId,
      paymentMethod: paymentDetails.paymentMethod
    });

    if (res.success) {
      // Trigger canvas-confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E10600', '#FFFFFF', '#000000']
      });

      setSuccessOverlay(true);
      setTimeout(() => {
        setSuccessOverlay(false);
        setCheckoutPlan(null);
        navigate('/dashboard');
      }, 2500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>Membership <span>Plans</span></h2>
          <p>Choose an elite membership plan tailored to your physical target. Uncompromising training tools await.</p>
        </div>

        {/* PRICING PLANS GRID */}
        <div className="grid-4" style={{ marginBottom: '80px' }}>
          {plans.map((plan, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: plan.popular ? '2px solid var(--primary-red)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: plan.popular ? 'var(--glow-shadow)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--primary-red)',
                  color: '#FFFFFF',
                  padding: '4px 15px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <FaCrown />
                  Most Popular
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '5px' }}>{plan.name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#888888', fontWeight: 600 }}>Duration: {plan.duration}</span>
                
                <div style={{ margin: '20px 0 25px 0' }}>
                  <span style={{ fontSize: '2.3rem', fontWeight: 900, color: '#FFFFFF' }}>₹{plan.price}</span>
                  <span style={{ color: '#aaaaaa', fontSize: '0.85rem' }}> / total</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                  {plan.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#cccccc' }}>
                      <FaCheck style={{ color: 'var(--primary-red)', fontSize: '0.8rem', marginTop: '4px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuy(plan)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                Buy Plan
              </button>
            </div>
          ))}
        </div>

        {/* COMPARISON MATRIX SECTION */}
        <div style={{ marginTop: '80px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', marginBottom: '40px' }}>
            Compare <span>Benefits</span>
          </h3>

          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0c0c0c', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a', backgroundColor: '#121212' }}>
                  <th style={thStyle}>BENEFITS & PERKS</th>
                  <th style={thStyle}>MONTHLY</th>
                  <th style={thStyle}>QUARTERLY</th>
                  <th style={thStyle}>HALF-YEARLY</th>
                  <th style={thStyle}>YEARLY</th>
                </tr>
              </thead>
              <tbody>
                <tr style={trStyle}>
                  <td style={tdStyle}>12,000 sq ft Gym Access</td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                </tr>
                <tr style={trStyle}>
                  <td style={tdStyle}>Lockers & Showers</td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                </tr>
                <tr style={trStyle}>
                  <td style={tdStyle}>Nutritionist Consultation</td>
                  <td style={tdStyle}><FaTimes style={{ color: '#e74c3c' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                  <td style={tdStyle}><FaCheck style={{ color: '#2ecc71' }} /></td>
                </tr>
                <tr style={trStyle}>
                  <td style={tdStyle}>Group Classes Included</td>
                  <td style={tdStyle}><FaTimes style={{ color: '#e74c3c' }} /></td>
                  <td style={tdStyle}><span style={{ color: '#ffffff', fontWeight: 600 }}>10 Classes</span></td>
                  <td style={tdStyle}><span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>Unlimited</span></td>
                  <td style={tdStyle}><span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>Unlimited</span></td>
                </tr>
                <tr style={trStyle}>
                  <td style={tdStyle}>Free Guest Passes / Month</td>
                  <td style={tdStyle}><FaTimes style={{ color: '#e74c3c' }} /></td>
                  <td style={tdStyle}><FaTimes style={{ color: '#e74c3c' }} /></td>
                  <td style={tdStyle}><FaTimes style={{ color: '#e74c3c' }} /></td>
                  <td style={tdStyle}><span style={{ color: '#ffffff', fontWeight: 600 }}>3 Passes</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MOCK CHECKOUT OVERLAYS */}
        {checkoutPlan && (
          <RazorpayModal
            isOpen={true}
            onClose={() => setCheckoutPlan(null)}
            planName={checkoutPlan.name}
            amount={checkoutPlan.price}
            onSuccess={handlePaymentSuccess}
            offers={offers}
          />
        )}

        {/* SUCCESS PORTAL MODAL */}
        {successOverlay && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <FaCheckCircle style={{ color: '#2ecc71', fontSize: '5rem', marginBottom: '20px' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>
              Welcome to the <span style={{ color: 'var(--primary-red)' }}>Elite Club</span>!
            </h1>
            <p style={{ color: '#aaaaaa', fontSize: '1.1rem', marginTop: '10px' }}>Your active membership has been activated successfully!</p>
          </div>
        )}

      </div>
    </div>
  );
}

const thStyle = {
  padding: '16px 20px',
  fontWeight: 700,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  color: '#888888',
  borderBottom: '1px solid #1a1a1a'
};

const tdStyle = {
  padding: '16px 20px',
  fontSize: '0.9rem',
  color: '#cccccc',
  borderBottom: '1px solid #141414'
};

const trStyle = {
  transition: 'background 0.2s',
  '&:hover': {
    backgroundColor: '#111111'
  }
};
