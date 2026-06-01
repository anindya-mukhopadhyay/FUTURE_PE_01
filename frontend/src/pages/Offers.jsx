import React from 'react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';
import { FaTag, FaRegClock, FaGift } from 'react-icons/fa';

export default function Offers() {
  const { offers, loading } = useBooking();

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container">
        
        <div className="section-title">
          <h2>Offers & <span>Promotions</span></h2>
          <p>Unlock limited-time discounts, festival deals, referral rewards, and premium promotional packages.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            <div className="skeleton" style={{ width: '320px', height: '220px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '320px', height: '220px', borderRadius: '12px' }} />
          </div>
        ) : (
          <div className="grid-3" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {offers.map((offer) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--primary-red)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* DISCOUNT TAG BADGE */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(225,6,0,0.15)',
                  border: '1px solid var(--primary-red)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#FFFFFF'
                }}>
                  {offer.discount}% OFF
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', width: '80%' }}>
                    {offer.title}
                  </h3>
                  <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.6' }}>
                    {offer.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #222222', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* COUPON CODE BOX */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px dotted #333333',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#666666', textTransform: 'uppercase', fontWeight: 600 }}>Promo Code</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-red)', letterSpacing: '1px' }}>
                      {offer.code}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666666', fontSize: '0.75rem' }}>
                    <FaRegClock />
                    <span>Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>

              </motion.div>
            ))}

            {/* MOCK REFERRAL PROMO CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '4px solid #2ecc71',
                backgroundColor: 'rgba(46,204,113,0.03)'
              }}
            >
              <div>
                <FaGift style={{ color: '#2ecc71', fontSize: '2.2rem', marginBottom: '10px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
                  Refer A Lifter Buddy
                </h3>
                <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.6' }}>
                  Invite your friends to register and purchase membership subscriptions. Both you and your friend receive an absolute 30% off your next renewals!
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#2ecc71', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Active Referrals Campaign
                </span>
              </div>
            </motion.div>

          </div>
        )}

      </div>
    </div>
  );
}
