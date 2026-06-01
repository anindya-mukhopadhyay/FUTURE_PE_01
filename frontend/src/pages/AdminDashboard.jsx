import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChartBar, 
  FaCalendarAlt, 
  FaPercentage, 
  FaQuestionCircle, 
  FaUserFriends, 
  FaRupeeSign, 
  FaPaperPlane, 
  FaTrashAlt, 
  FaSearch, 
  FaFileCsv, 
  FaUserEdit, 
  FaCreditCard, 
  FaQrcode
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { fetchAllUsers, adminUpdateUser, adminOverrideMembership, adminDeleteUser } = useAuth();
  const { classes, trainers, offers, queries: initialQueries } = useBooking();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'members', 'classes', 'offers', 'queries'
  
  // Analytics State
  const [stats, setStats] = useState({
    counters: { totalMembers: 125, activeMembers: 84, totalTrainers: 4, totalClasses: 4, totalQueries: 2, newsletterCount: 3, totalRevenue: 64200 },
    plansCount: { monthly: 12, quarterly: 25, halfYearly: 10, yearly: 4 }
  });
  
  // Members Directory State
  const [memberList, setMemberList] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberStatus, setMemberStatus] = useState('');
  const [membersLoading, setMembersLoading] = useState(false);

  // CRUD Modals State
  const [editUser, setEditUser] = useState(null); // User object being edited
  const [editForm, setEditForm] = useState({ fullName: '', email: '', mobileNumber: '', role: 'member', gender: 'male' });
  const [overrideUser, setOverrideUser] = useState(null); // User object for membership override
  const [overrideForm, setOverrideForm] = useState({ status: 'none', planType: '', startDate: '', endDate: '' });

  // Classes CRUD state
  const [classList, setClassList] = useState([]);
  const [newClass, setNewClass] = useState({ title: '', description: '', trainer: '', timeSlot: '', capacity: 20, scheduleDays: 'Monday, Wednesday, Friday', imageUrl: '' });

  // Offers CRUD state
  const [offerList, setOfferList] = useState([]);
  const [newOffer, setNewOffer] = useState({ title: '', code: '', discount: 10, description: '', validUntil: '' });

  // Queries state
  const [queries, setQueries] = useState([]);
  const [resolveForm, setResolveForm] = useState({ id: '', response: '' });

  // 1. Sync Analytics & Directory on load
  const loadDirectoryData = () => {
    setMembersLoading(true);
    fetchAllUsers({ search: memberSearch, role: memberRole, status: memberStatus })
      .then(res => {
        if (res.success) setMemberList(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setMembersLoading(false));
  };

  useEffect(() => {
    // Sync Analytics
    const token = localStorage.getItem('ntf_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
    
    axios.get(`${API_URL}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (res.data.success) setStats(res.data.data);
    })
    .catch(err => {
      console.warn("Backend down. Running offline Admin analytics graphs.", err.message);
    });

    // Populate static catalog states
    setClassList(classes);
    setOfferList(offers);
    setQueries(initialQueries);
  }, [classes, offers, initialQueries]);

  useEffect(() => {
    loadDirectoryData();
  }, [memberSearch, memberRole, memberStatus]);

  // CSV Export Utility
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Role', 'Status', 'Plan Type', 'Start Date', 'End Date', 'Join Date'];
    const rows = memberList.map(u => [
      u._id || u.id,
      `"${u.fullName.replace(/"/g, '""')}"`,
      u.email,
      u.mobileNumber,
      u.role,
      u.membership?.status || 'none',
      `"${(u.membership?.planType || 'None').replace(/"/g, '""')}"`,
      u.membership?.startDate ? new Date(u.membership.startDate).toLocaleDateString() : 'N/A',
      u.membership?.endDate ? new Date(u.membership.endDate).toLocaleDateString() : 'N/A',
      new Date(u.joinDate || Date.now()).toLocaleDateString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ntf_member_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CRUD User Management Actions
  const handleOpenEdit = (user) => {
    setEditUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      role: user.role || 'member',
      gender: user.gender || 'male'
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    const res = await adminUpdateUser(editUser._id || editUser.id, editForm);
    if (res.success) {
      setEditUser(null);
      loadDirectoryData();
    } else {
      alert(res.message);
    }
  };

  const handleOpenOverride = (user) => {
    setOverrideUser(user);
    const m = user.membership || {};
    setOverrideForm({
      status: m.status || 'none',
      planType: m.planType || '',
      startDate: m.startDate ? new Date(m.startDate).toISOString().split('T')[0] : '',
      endDate: m.endDate ? new Date(m.endDate).toISOString().split('T')[0] : ''
    });
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!overrideUser) return;
    const res = await adminOverrideMembership(overrideUser._id || overrideUser.id, overrideForm);
    if (res.success) {
      setOverrideUser(null);
      loadDirectoryData();
    } else {
      alert(res.message);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete the profile for ${name}? This will wipe out all bookings and invoicing sheets.`)) {
      const res = await adminDeleteUser(id);
      if (res.success) {
        loadDirectoryData();
      } else {
        alert(res.message);
      }
    }
  };

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
              Analytics Deck
            </button>
            <button onClick={() => setActiveTab('members')} style={activeTab === 'members' ? activeBtnStyle : sidebarBtnStyle}>
              <FaUserFriends />
              Member Directory
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
          
          {/* 1. ANALYTICS DECK */}
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
                  <FaCalendarAlt style={{ color: '#00D2FF', fontSize: '1.5rem' }} />
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
 
              {/* HIGH-FIDELITY ANIMATED SVG VISUALIZATIONS */}
              <div className="grid-2" style={{ gap: '30px', marginBottom: '40px' }} id="dashboard-grid">
                
                {/* 1. ANIMATED SVG LINE CHART (REVENUE TRENDS) */}
                <div style={analyticsBoxStyle}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>
                    Revenue Growth (H1 Trends)
                  </h4>
                  <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                    <svg viewBox="0 0 450 160" width="100%" height="100%">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary-red)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--primary-red)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="430" y2="20" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="40" y1="60" x2="430" y2="60" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="40" y1="100" x2="430" y2="100" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="40" y1="130" x2="430" y2="130" stroke="#222222" strokeWidth="1.5" />
                      
                      {/* Y Labels */}
                      <text x="10" y="25" fill="#555" fontSize="8" fontWeight="bold">25k</text>
                      <text x="10" y="65" fill="#555" fontSize="8" fontWeight="bold">15k</text>
                      <text x="10" y="105" fill="#555" fontSize="8" fontWeight="bold">5k</text>

                      {/* Area Fill */}
                      <motion.path
                        d="M 40 130 L 40 90 L 110 75 L 180 50 L 250 30 L 320 65 L 390 15 L 430 130 Z"
                        fill="url(#lineGrad)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      />

                      {/* Path Line */}
                      <motion.path
                        d="M 40 90 L 110 75 L 180 50 L 250 30 L 320 65 L 390 15 L 430 15"
                        fill="none"
                        stroke="var(--primary-red)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                      />

                      {/* Data Point Dots */}
                      <circle cx="40" cy="90" r="4" fill="#FFFFFF" stroke="var(--primary-red)" strokeWidth="2" />
                      <circle cx="110" cy="75" r="4" fill="#FFFFFF" stroke="var(--primary-red)" strokeWidth="2" />
                      <circle cx="180" cy="50" r="4" fill="#FFFFFF" stroke="var(--primary-red)" strokeWidth="2" />
                      <circle cx="250" cy="30" r="4" fill="#FFFFFF" stroke="var(--primary-red)" strokeWidth="2" />
                      <circle cx="320" cy="65" r="4" fill="#FFFFFF" stroke="var(--primary-red)" strokeWidth="2" />
                      <circle cx="390" cy="15" r="4" fill="#FFFFFF" stroke="var(--primary-red)" strokeWidth="2" />

                      {/* X Labels */}
                      <text x="35" y="148" fill="#777" fontSize="8" fontWeight="700">Jan</text>
                      <text x="105" y="148" fill="#777" fontSize="8" fontWeight="700">Feb</text>
                      <text x="175" y="148" fill="#777" fontSize="8" fontWeight="700">Mar</text>
                      <text x="245" y="148" fill="#777" fontSize="8" fontWeight="700">Apr</text>
                      <text x="315" y="148" fill="#777" fontSize="8" fontWeight="700">May</text>
                      <text x="385" y="148" fill="#777" fontSize="8" fontWeight="700">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* 2. DYNAMIC CONCENTRIC RING DONUT CHART (TIER RATIOS) */}
                <div style={analyticsBoxStyle}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>
                    Membership Plan Shares
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center' }}>
                    {/* Concentric Rings */}
                    <div style={{ height: '130px', width: '130px', position: 'relative', margin: '0 auto' }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%">
                        {/* Ring 1 - Quarterly (Gold) */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#ffd700" strokeWidth="6"
                          strokeDasharray="251.2"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 - (251.2 * 0.45) }}
                          transition={{ duration: 1.2 }}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Ring 2 - Half-Yearly (Steel Blue) */}
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#222" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="30" fill="none" stroke="#00D2FF" strokeWidth="6"
                          strokeDasharray="188.4"
                          initial={{ strokeDashoffset: 188.4 }}
                          animate={{ strokeDashoffset: 188.4 - (188.4 * 0.25) }}
                          transition={{ duration: 1.2, delay: 0.2 }}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Ring 3 - Monthly (Crimson) */}
                        <circle cx="50" cy="50" r="20" fill="none" stroke="#222" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="20" fill="none" stroke="var(--primary-red)" strokeWidth="6"
                          strokeDasharray="125.6"
                          initial={{ strokeDashoffset: 125.6 }}
                          animate={{ strokeDashoffset: 125.6 - (125.6 * 0.20) }}
                          transition={{ duration: 1.2, delay: 0.4 }}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>

                    {/* Explanatory Map */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffd700' }} />
                        <span>Quarterly (45%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00D2FF' }} />
                        <span>Half-Yearly (25%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-red)' }} />
                        <span>Monthly Pass (20%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a855f7' }} />
                        <span>Yearly Elite (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* 3. DYNAMIC BAR CHART (CLASS TRAFFIC) */}
              <div style={{ ...analyticsBoxStyle, marginBottom: '35px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px' }}>
                  Class Load capacity enrollments
                </h4>
                <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                  <svg viewBox="0 0 500 160" width="100%" height="100%">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="470" y2="20" stroke="#1a1a1a" strokeWidth="1" />
                    <line x1="40" y1="60" x2="470" y2="60" stroke="#1a1a1a" strokeWidth="1" />
                    <line x1="40" y1="100" x2="470" y2="100" stroke="#1a1a1a" strokeWidth="1" />
                    <line x1="40" y1="130" x2="470" y2="130" stroke="#222222" strokeWidth="1.5" />
                    
                    {/* Columns */}
                    {/* HIIT Burnout - 15 enrolled */}
                    <motion.rect x="70" y="40" width="30" height="90" rx="4" fill="url(#colRed)"
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1 }} style={{ transformOrigin: 'bottom', transform: 'translateY(130px) scaleY(-1)' }}
                    />
                    {/* CrossFit - 8 enrolled */}
                    <motion.rect x="170" y="80" width="30" height="50" rx="4" fill="url(#colBlue)"
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: 0.1 }} style={{ transformOrigin: 'bottom', transform: 'translateY(130px) scaleY(-1)' }}
                    />
                    {/* Yoga - 18 enrolled */}
                    <motion.rect x="270" y="25" width="30" height="105" rx="4" fill="url(#colGold)"
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ transformOrigin: 'bottom', transform: 'translateY(130px) scaleY(-1)' }}
                    />
                    {/* Strength Training - 12 enrolled */}
                    <motion.rect x="370" y="55" width="30" height="75" rx="4" fill="url(#colRed)"
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: 0.3 }} style={{ transformOrigin: 'bottom', transform: 'translateY(130px) scaleY(-1)' }}
                    />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="colRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary-red)" />
                        <stop offset="100%" stopColor="#7a0000" />
                      </linearGradient>
                      <linearGradient id="colBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00D2FF" />
                        <stop offset="100%" stopColor="#006c84" />
                      </linearGradient>
                      <linearGradient id="colGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffd700" />
                        <stop offset="100%" stopColor="#aa7c11" />
                      </linearGradient>
                    </defs>

                    {/* Numeric Indicators */}
                    <text x="80" y="32" fill="#FFF" fontSize="8" fontWeight="bold">15</text>
                    <text x="180" y="72" fill="#FFF" fontSize="8" fontWeight="bold">8</text>
                    <text x="280" y="17" fill="#FFF" fontSize="8" fontWeight="bold">18</text>
                    <text x="380" y="47" fill="#FFF" fontSize="8" fontWeight="bold">12</text>

                    {/* Labels */}
                    <text x="58" y="145" fill="#888" fontSize="8" fontWeight="bold">HIIT Burn</text>
                    <text x="162" y="145" fill="#888" fontSize="8" fontWeight="bold">CrossFit</text>
                    <text x="268" y="145" fill="#888" fontSize="8" fontWeight="bold">Yoga</text>
                    <text x="358" y="145" fill="#888" fontSize="8" fontWeight="bold">Strength</text>
                  </svg>
                </div>
              </div>

            </div>
          )}

          {/* 2. MEMBERS DIRECTORY TAB */}
          {activeTab === 'members' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={headingStyle}>Member Roster Directory</h3>
                  <p style={{ color: '#888888', fontSize: '0.85rem' }}>Search search, filter credentials, edit parameters, manual overrides and generate CSV logs.</p>
                </div>

                <button onClick={handleExportCSV} className="btn btn-secondary" style={{
                  padding: '10px 20px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(46,204,113,0.1)',
                  borderColor: '#2ecc71',
                  color: '#2ecc71'
                }}>
                  <FaFileCsv />
                  <span>Download Members CSV</span>
                </button>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: '12px',
                marginBottom: '25px'
              }} className="counters-row">
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555555' }} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or mobile..."
                    className="form-input"
                    style={{ paddingLeft: '38px', boxSizing: 'border-box', width: '100%' }}
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-input"
                  style={{ backgroundColor: '#161616', cursor: 'pointer' }}
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                >
                  <option value="">All Account Roles</option>
                  <option value="member">Members</option>
                  <option value="trainer">Coaches/Trainers</option>
                  <option value="admin">Administrators</option>
                </select>

                <select
                  className="form-input"
                  style={{ backgroundColor: '#161616', cursor: 'pointer' }}
                  value={memberStatus}
                  onChange={(e) => setMemberStatus(e.target.value)}
                >
                  <option value="">All Subscriptions</option>
                  <option value="active">Active Pass</option>
                  <option value="expired">Expired Pass</option>
                  <option value="none">No Pass</option>
                </select>
              </div>

              {/* DIRECTORY LISTING */}
              {membersLoading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <FaSpinner className="dumbbell-spinner" style={{ fontSize: '2.5rem', color: 'var(--primary-red)' }} />
                  <p style={{ marginTop: '15px', color: '#888' }}>Syncing Member Directories...</p>
                </div>
              ) : memberList.length === 0 ? (
                <p style={{ color: '#555555', textAlign: 'center', padding: '40px' }}>No user match found in records databases.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {memberList.map((m) => (
                    <div key={m._id || m.id} style={{
                      ...adminRowStyle,
                      border: m.membership?.status === 'active' 
                        ? '1px solid rgba(46,204,113,0.15)' 
                        : '1px solid #1a1a1a',
                      background: m.membership?.status === 'active' 
                        ? 'rgba(46,204,113,0.01)' 
                        : 'rgba(255,255,255,0.02)'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '1.1rem' }}>{m.fullName}</strong>
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            backgroundColor: m.role === 'admin' ? 'rgba(225,6,0,0.15)' : m.role === 'trainer' ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.05)',
                            color: m.role === 'admin' ? 'var(--primary-red)' : m.role === 'trainer' ? '#00D2FF' : '#aaaaaa',
                            border: '1px solid',
                            borderColor: m.role === 'admin' ? 'var(--primary-red)' : m.role === 'trainer' ? '#00D2FF' : '#333'
                          }}>{m.role}</span>
                        </div>
                        
                        <p style={{ fontSize: '0.8rem', color: '#aaaaaa', marginTop: '4px' }}>
                          Email: {m.email} | Mobile: {m.mobileNumber}
                        </p>

                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', marginTop: '6px', color: '#777777' }}>
                          <span>Plan: <strong style={{ color: '#eee' }}>{m.membership?.planType || 'None'}</strong></span>
                          <span>Status: <strong style={{ 
                            color: m.membership?.status === 'active' ? '#2ecc71' : m.membership?.status === 'expired' ? 'var(--primary-red)' : '#666'
                          }}>{(m.membership?.status || 'none').toUpperCase()}</strong></span>
                          {m.membership?.endDate && (
                            <span>Expires: <strong style={{ color: '#eee' }}>{new Date(m.membership.endDate).toLocaleDateString()}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Operations buttons */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleOpenEdit(m)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FaUserEdit />
                          Edit Info
                        </button>
                        
                        {m.role === 'member' && (
                          <button onClick={() => handleOpenOverride(m)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', borderColor: 'rgba(241,196,15,0.2)', color: '#f1c40f' }}>
                            <FaCreditCard />
                            Override Pass
                          </button>
                        )}

                        <button onClick={() => handleDeleteUser(m._id || m.id, m.fullName)} style={deleteBtnStyle}>
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CLASSES TAB */}
          {activeTab === 'classes' && (
            <div>
              <h3 style={headingStyle}>Manage Classes</h3>
              
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

          {/* SUPPORT QUERIES */}
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

      {/* ================= EDIT MEMBER DETAILS MODAL ================= */}
      <AnimatePresence>
        {editUser && (
          <div style={modalOverlayStyle}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '500px', padding: '30px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                Edit Account Information
              </h3>
              
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" required value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" required value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="text" className="form-input" required value={editForm.mobileNumber} onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-input" style={{ backgroundColor: '#161616' }} value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                      <option value="member">Member</option>
                      <option value="trainer">Trainer/Coach</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-input" style={{ backgroundColor: '#161616' }} value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Save Changes</button>
                  <button type="button" onClick={() => setEditUser(null)} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= SUBSCRIPTION OVERRIDE MODAL ================= */}
      <AnimatePresence>
        {overrideUser && (
          <div style={modalOverlayStyle}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '500px', padding: '30px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                Subscription Override Panel
              </h3>
              
              <form onSubmit={handleOverrideSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Membership Status</label>
                  <select className="form-input" style={{ backgroundColor: '#161616' }} value={overrideForm.status} onChange={(e) => setOverrideForm({ ...overrideForm, status: e.target.value })}>
                    <option value="none">No Active Membership (None)</option>
                    <option value="active">Active Access Granted</option>
                    <option value="expired">Expired Access Blocked</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Membership Tier Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Monthly Pass, Quarterly Package" value={overrideForm.planType} onChange={(e) => setOverrideForm({ ...overrideForm, planType: e.target.value })} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-input" value={overrideForm.startDate} onChange={(e) => setOverrideForm({ ...overrideForm, startDate: e.target.value })} />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-input" value={overrideForm.endDate} onChange={(e) => setOverrideForm({ ...overrideForm, endDate: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', backgroundColor: '#f1c40f', borderColor: '#f1c40f', color: '#000', fontWeight: 800 }}>
                    Override Subscription
                  </button>
                  <button type="button" onClick={() => setOverrideUser(null)} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px'
};

const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--primary-red)',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(8px)',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};
