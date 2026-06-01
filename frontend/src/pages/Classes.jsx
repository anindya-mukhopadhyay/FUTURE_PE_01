import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { FaRegClock, FaCalendarAlt, FaCheckCircle, FaUserTie, FaExclamationTriangle } from 'react-icons/fa';

export default function Classes() {
  const { classes, createBooking, loading } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingClass, setBookingClass] = useState(null); // active class object triggered for checkout
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [processing, setProcessing] = useState(false);

  const triggerBookingFlow = (classObj) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!user.membership || user.membership.status !== 'active') {
      setBookingError('Active membership subscription required to book group gym sessions.');
      setTimeout(() => setBookingError(''), 4000);
      return;
    }

    setBookingClass(classObj);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingClass || !bookingDate) return;

    setProcessing(true);
    setBookingError('');

    const res = await createBooking({
      bookingType: 'class',
      classId: bookingClass._id,
      date: bookingDate,
      timeSlot: bookingClass.timeSlot
    });

    setProcessing(false);

    if (res.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingClass(null);
      }, 2000);
    } else {
      setBookingError(res.message || 'Failed to register booking slot.');
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
          <h2>Workout <span>Classes</span></h2>
          <p>Explore group cardio sessions, hypertrophy power sessions, CrossFit routines, and mindful yoga flows.</p>
        </div>

        {bookingError && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 30px auto',
            backgroundColor: 'rgba(225,6,0,0.1)',
            border: '1px solid var(--primary-red)',
            color: '#FFFFFF',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaExclamationTriangle style={{ color: 'var(--primary-red)', flexShrink: 0 }} />
            <span>{bookingError}</span>
          </div>
        )}

        {loading ? (
          <div className="grid-2">
            <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
          </div>
        ) : (
          <div className="grid-2">
            {classes.map((c) => {
              const remainingSeats = c.capacity - (c.enrolledMembers ? c.enrolledMembers.length : 0);
              return (
                <div key={c._id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', padding: '20px', overflow: 'hidden' }}>
                  
                  {/* LEFT COLUMN: IMAGE */}
                  <div style={{ height: '100%', minHeight: '180px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img
                      src={c.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop'}
                      alt={c.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* RIGHT COLUMN: CATALOG STATS */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', color: '#aaaaaa', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
                        Group Workout
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '5px' }}>{c.title}</h3>
                      <p style={{ color: '#888888', fontSize: '0.8rem', marginTop: '6px', lineHeight: '1.5' }}>{c.description}</p>
                    </div>

                    <div style={{ margin: '15px 0', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
                      <div style={statFlexStyle}>
                        <div style={flexCenterStyle}><FaUserTie style={iconStyle} /> <span style={lblStyle}>{c.trainer ? c.trainer.name : 'Senior Coach'}</span></div>
                        <div style={flexCenterStyle}><FaRegClock style={iconStyle} /> <span style={lblStyle}>{c.timeSlot}</span></div>
                      </div>
                      <div style={{ ...statFlexStyle, marginTop: '8px' }}>
                        <div style={flexCenterStyle}><FaCalendarAlt style={iconStyle} /> <span style={lblStyle}>{c.scheduleDays.join(', ')}</span></div>
                        <div style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: remainingSeats < 5 ? 'var(--primary-red)' : '#2ecc71'
                        }}>
                          {remainingSeats <= 0 ? 'Full Seats' : `${remainingSeats} Seats Left`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerBookingFlow(c)}
                      disabled={remainingSeats <= 0}
                      className="btn btn-primary"
                      style={{ padding: '8px 15px', fontSize: '0.85rem', width: '100%' }}
                    >
                      {remainingSeats <= 0 ? 'Fully Booked' : 'Book Session'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* BOOKING MODAL POPUP */}
        {bookingClass && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(8px)'
          }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '420px' }}>
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <FaCheckCircle style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '15px' }} />
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Booking Confirmed!</h3>
                  <p style={{ color: '#aaaaaa', fontSize: '0.85rem', marginTop: '5px' }}>Check your email and dashboard schedule.</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase' }}>Book Class</h3>
                    <button type="button" onClick={() => setBookingClass(null)} style={{ background: 'none', border: 'none', color: '#666666', cursor: 'pointer', fontSize: '1.1rem' }}>
                      ✕
                    </button>
                  </div>

                  <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid #1c1c1c' }}>
                    <span style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase' }}>Selected Schedule</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{bookingClass.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#aaaaaa', marginTop: '5px' }}>Slot: {bookingClass.timeSlot}</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Choose Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <button type="submit" disabled={processing} className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                    {processing ? 'Processing...' : 'Confirm Book'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
      <style>{`
        /* Overrides locally */
        @media(max-width: 768px){
          .glass-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const statFlexStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const flexCenterStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const iconStyle = {
  color: 'var(--primary-red)',
  fontSize: '0.85rem',
  flexShrink: 0
};

const lblStyle = {
  fontSize: '0.8rem',
  color: '#cccccc',
  fontWeight: 500
};
