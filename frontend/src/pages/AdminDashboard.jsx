import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';
import { FaChartBar, FaCalendarAlt, FaPercentage, FaQuestionCircle, FaUserFriends, FaRupeeSign, FaPaperPlane, FaTrashAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { classes, trainers, offers, queries: initialQueries } = useBooking();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'classes', 'offers', 'queries'
  
  // Analytics State
  const [stats, setStats] = useState({
    counters: { totalMembers: 125, activeMembers: 84, totalTrainers: 4, totalClasses: 4, totalQueries: 2, newsletterCount: 3, totalRevenue: 64200 },
    plansCount: { monthly: 12, quarterly: 25, halfYearly: 10, yearly: 4 }
  });
  
  // Classes CRUD state
  const [classList, setClassList] = useState([]);
  const [newClass, setNewClass] = useState({ title: '', description: '', trainer: '', timeSlot: '', capacity: 20, scheduleDays: 'Monday, Wednesday, Friday', imageUrl: '' });

  // Offers CRUD state
  const [offerList, setOfferList] = useState([]);
  const [newOffer, setNewOffer] = useState({ title: '', code: '', discount: 10, description: '', validUntil: '' });

  // Queries state
  const [queries, setQueries] = useState([]);
  const [resolveForm, setResolveForm] = useState({ id: '', response: '' });

  useEffect(() => {
    // 1. Sync Analytics from backend or load rich mock
    axios.get('http://localhost:5000/api/dashboard/admin', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ntf_token')}` }
    })
    .then(res => {
      if (res.data.success) setStats(res.data.data);
    })
    .catch(err => {
      console.warn("Backend down. Running offline Admin analytics graphs.", err.message);
    });

    // Sync state lists
    setClassList(classes);
    setOfferList(offers);
    setQueries(initialQueries);
  }, [classes, offers, initialQueries]);

  // CRUD Class actions
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClass.title || !newClass.trainer || !newClass.timeSlot) return;

    const mockClass = {
      _id: 'cl_local_' + Math.random().toString(36).substr(2, 9),
      title: newClass.title,
      description: newClass.description,
      trainer: trainers.find(t => t._id === newClass.trainer) || { name: 'Senior Coach' },
      timeSlot: newClass.timeSlot,
      capacity: Number(newClass.capacity),
      scheduleDays: newClass.scheduleDays.split(',').map(s => s.trim()),
      enrolledMembers: [],
      imageUrl: newClass.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop'
    };

    setClassList([mockClass, ...classList]);
    setNewClass({ title: '', description: '', trainer: '', timeSlot: '', capacity: 20, scheduleDays: 'Monday, Wednesday, Friday', imageUrl: '' });
  };

  const handleDeleteClass = (id) => {
    setClassList(classList.filter(c => c._id !== id));
  };

  // CRUD Offer actions
  const handleAddOffer = (e) => {
    e.preventDefault();
    if (!newOffer.title || !newOffer.code) return;

    const mockOffer = {
      _id: 'of_local_' + Math.random().toString(36).substr(2, 9),
      title: newOffer.title,
      code: newOffer.code.toUpperCase(),
      discount: Number(newOffer.discount),
      description: newOffer.description,
      validUntil: newOffer.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setOfferList([mockOffer, ...offerList]);
    setNewOffer({ title: '', code: '', discount: 10, description: '', validUntil: '' });
  };

  const handleDeleteOffer = (id) => {
    setOfferList(offerList.filter(o => o._id !== id));
  };

  // Resolve Feedback Queries
  const handleResolveQuery = (e) => {
    e.preventDefault();
    if (!resolveForm.id || !resolveForm.response) return;

    const updatedQueries = queries.map(q => 
      q._id === resolveForm.id 
        ? { ...q, status: 'resolved', adminResponse: resolveForm.response }
        : q
    );

    setQueries(updatedQueries);
    setResolveForm({ id: '', response: '' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }} id="admin-grid">
        
        {/* LEFT COLUMN: HUB CONTROLLERS */}
        <div className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Admin Portal</h4>
            <span style={{ color: 'var(--primary-red)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Operations Executive
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('analytics')} style={activeTab === 'analytics' ? activeBtnStyle : sidebarBtnStyle}>
              <FaChartBar />
              Analytics
            </button>
            <button onClick={() => setActiveTab('classes')} style={activeTab === 'classes' ? activeBtnStyle : sidebarBtnStyle}>
              <FaCalendarAlt />
              Manage Classes
            </button>
            <button onClick={() => setActiveTab('offers')} style={activeTab === 'offers' ? activeBtnStyle : sidebarBtnStyle}>
              <FaPercentage />
              Active Coupons
            </button>
            <button onClick={() => setActiveTab('queries')} style={activeTab === 'queries' ? activeBtnStyle : sidebarBtnStyle}>
              <FaQuestionCircle />
              Inquiries Inbox
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAIL DESK */}
        <div className="glass-card" style={{ padding: '35px' }}>
          
          {/* ANALYTICS HUD */}
          {activeTab === 'analytics' && (
            <div>
              <h3 style={headingStyle}>Operational Analytics</h3>
              
              {/* COUNTERS ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '40px' }} className="counters-row">
                <div style={counterCardStyle}>
                  <FaUserFriends style={{ color: 'var(--primary-red)', fontSize: '1.5rem' }} />
                  <h5 style={{ color: '#888888', fontSize: '0.75rem', marginTop: '5px' }}>Active Members</h5>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stats.counters.activeMembers}</p>
                </div>
                <div style={counterCardStyle}>
                  <FaCalendarAlt style={{ color: '#3498db', fontSize: '1.5rem' }} />
                  <h5 style={{ color: '#888888', fontSize: '0.75rem', marginTop: '5px' }}>Group Classes</h5>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stats.counters.totalClasses}</p>
                </div>
                <div style={counterCardStyle}>
                  <FaQuestionCircle style={{ color: '#f1c40f', fontSize: '1.5rem' }} />
                  <h5 style={{ color: '#888888', fontSize: '0.75rem', marginTop: '5px' }}>Open Tickets</h5>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                    {queries.filter(q => q.status === 'pending').length}
                  </p>
                </div>
                <div style={counterCardStyle}>
                  <FaRupeeSign style={{ color: '#2ecc71', fontSize: '1.5rem' }} />
                  <h5 style={{ color: '#888888', fontSize: '0.75rem', marginTop: '5px' }}>Total Revenue</h5>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹{stats.counters.totalRevenue}</p>
                </div>
              </div>

              {/* DYNAMIC PURE CSS RATIOS & CHARTS */}
              <div className="grid-2">
                
                {/* Plan Distribution Bar Chart */}
                <div style={analyticsBoxStyle}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>Plan Tier Distribution</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {Object.entries(stats.plansCount).map(([plan, count], i) => {
                      const maxVal = Math.max(...Object.values(stats.plansCount));
                      const barWidth = `${(count / maxVal) * 100}%`;
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <span style={{ textTransform: 'capitalize' }}>{plan}</span>
                            <span style={{ fontWeight: 700 }}>{count} Subscribers</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: barWidth, backgroundColor: 'var(--primary-red)', borderRadius: '4px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Class Occupancies ratios */}
                <div style={analyticsBoxStyle}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>Class Enrollments</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {classList.slice(0, 4).map((c, i) => {
                      const enrolled = c.enrolledMembers ? c.enrolledMembers.length : 0;
                      const occupancyRate = ((enrolled / c.capacity) * 100).toFixed(0);
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid #141414', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.title}</span>
                          <span style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>
                            {enrolled} / {c.capacity} Enrolled ({occupancyRate}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* CLASSES OPERATIONS */}
          {activeTab === 'classes' && (
            <div>
              <h3 style={headingStyle}>Manage Classes</h3>
              
              {/* ADD CLASS FORM */}
              <form onSubmit={handleAddClass} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                padding: '20px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                marginBottom: '30px'
              }} className="counters-row">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Class Title</label>
                  <input type="text" className="form-input" required value={newClass.title} onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Instructor</label>
                  <select className="form-input" style={{ backgroundColor: '#161616' }} required value={newClass.trainer} onChange={(e) => setNewClass({ ...newClass, trainer: e.target.value })}>
                    <option value="">Choose Coach</option>
                    {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <input type="text" placeholder="e.g. 09:00 - 10:00" className="form-input" required value={newClass.timeSlot} onChange={(e) => setNewClass({ ...newClass, timeSlot: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Capacity</label>
                  <input type="number" className="form-input" required value={newClass.capacity} onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Days Schedule</label>
                  <input type="text" placeholder="e.g. Mon, Wed, Fri" className="form-input" required value={newClass.scheduleDays} onChange={(e) => setNewClass({ ...newClass, scheduleDays: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '10px' }}>
                  Create Class Schedulers
                </button>
              </form>

              {/* LIST DISPLAY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {classList.map((c) => (
                  <div key={c._id} style={adminRowStyle}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{c.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#aaaaaa', marginTop: '2px' }}>
                        Coach: {c.trainer ? c.trainer.name : 'Senior Coach'} | Time: {c.timeSlot} | Capacity: {c.capacity} seats
                      </p>
                    </div>
                    <button onClick={() => handleDeleteClass(c._id)} style={deleteBtnStyle}>
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE OFFERS OPERATIONS */}
          {activeTab === 'offers' && (
            <div>
              <h3 style={headingStyle}>Manage Promo Coupons</h3>

              {/* ADD COUPON FORM */}
              <form onSubmit={handleAddOffer} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                padding: '20px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                marginBottom: '30px'
              }} className="counters-row">
                <div className="form-group">
                  <label className="form-label">Coupon Title</label>
                  <input type="text" className="form-input" required value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Code Code</label>
                  <input type="text" placeholder="e.g. MONSOON30" className="form-input" required value={newOffer.code} onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount %</label>
                  <input type="number" className="form-input" required value={newOffer.discount} onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3', padding: '10px' }}>
                  Publish Offer
                </button>
              </form>

              {/* COUPONS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {offerList.map((o) => (
                  <div key={o._id} style={adminRowStyle}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{o.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#aaaaaa', marginTop: '2px' }}>
                        Code: <span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>{o.code}</span> | Discount: {o.discount}% OFF
                      </p>
                    </div>
                    <button onClick={() => handleDeleteOffer(o._id)} style={deleteBtnStyle}>
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT QUERIES INBOX */}
          {activeTab === 'queries' && (
            <div>
              <h3 style={headingStyle}>Contact Queries Desk</h3>
              <p style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '25px' }}>Review contact form requests and dispatch custom replies.</p>

              {queries.length === 0 ? (
                <p style={{ color: '#555555', fontSize: '0.9rem' }}>Query inbox is currently empty.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {queries.map((q) => (
                    <div key={q._id} style={{
                      padding: '20px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid #1a1a1a',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>{q.name}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: '#666666', marginTop: '3px' }}>
                            Email: {q.email} | Mobile: {q.mobile}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: q.status === 'resolved' ? 'rgba(46,204,113,0.1)' : 'rgba(241,196,15,0.1)',
                          color: q.status === 'resolved' ? '#2ecc71' : '#f1c40f',
                          border: '1px solid',
                          borderColor: q.status === 'resolved' ? '#2ecc71' : '#f1c40f',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>{q.status}</span>
                      </div>

                      <div style={{ margin: '15px 0', borderLeft: '3px solid var(--primary-red)', paddingLeft: '12px', fontSize: '0.9rem', color: '#aaaaaa' }}>
                        <span style={{ fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>
                          Subject: {q.subject}
                        </span>
                        {q.message}
                      </div>

                      {q.status === 'resolved' ? (
                        <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.85rem', color: '#888888', border: '1px solid #1e1e1e' }}>
                          <strong>Admin Dispatch Response:</strong> {q.adminResponse}
                        </div>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleResolveQuery(e);
                        }} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <input
                            type="text"
                            required
                            placeholder="Type support reply details..."
                            className="form-input"
                            style={{ padding: '10px 15px', fontSize: '0.85rem' }}
                            value={resolveForm.id === q._id ? resolveForm.response : ''}
                            onChange={(e) => setResolveForm({ id: q._id, response: e.target.value })}
                          />
                          <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaPaperPlane />
                            Reply
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <style>{`
        @media(max-width: 768px){
          #admin-grid {
            grid-template-columns: 1fr !important;
          }
          .counters-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media(max-width: 480px){
          .counters-row {
            grid-template-columns: 1fr !important;
          }
          .counters-row > * {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

const sidebarBtnStyle = {
  width: '100%',
  padding: '12px 15px',
  backgroundColor: '#121212',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  color: '#cccccc',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '0.9rem',
  fontWeight: 600,
  transition: 'all 0.2s',
  textAlign: 'left'
};

const activeBtnStyle = {
  ...sidebarBtnStyle,
  backgroundColor: 'rgba(225,6,0,0.12)',
  borderColor: 'var(--primary-red)',
  color: '#FFFFFF',
  boxShadow: '0 0 10px rgba(225,6,0,0.1)'
};

const headingStyle = {
  fontSize: '1.4rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  marginBottom: '25px',
  borderBottom: '2px solid var(--primary-red)',
  paddingBottom: '8px',
  display: 'inline-block'
};

const counterCardStyle = {
  padding: '15px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  textAlign: 'center'
};

const analyticsBoxStyle = {
  padding: '20px',
  backgroundColor: 'rgba(255,255,255,0.01)',
  border: '1px solid #1c1c1c',
  borderRadius: '10px'
};

const adminRowStyle = {
  padding: '15px 20px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--primary-red)',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.15)'
  }
};
