import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaDumbbell, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 999,
      padding: scrolled ? '15px 0' : '25px 0',
      backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease-in-out'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* LOGO */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMenuOpen(false)}>
          <FaDumbbell style={{ fontSize: '1.8rem', color: '#E10600' }} />
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#FFFFFF'
          }}>
            NEWTOWN <span style={{ color: '#E10600' }}>FIT</span>
          </span>
        </Link>

        {/* DESKTOP MENU LINKS */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <NavLink to="/" className={({ isActive }) => isActive ? "glow-text" : ""} style={navLinkStyle}>Home</NavLink>
          <NavLink to="/classes" className={({ isActive }) => isActive ? "glow-text" : ""} style={navLinkStyle}>Classes</NavLink>
          <NavLink to="/membership" className={({ isActive }) => isActive ? "glow-text" : ""} style={navLinkStyle}>Plans</NavLink>
          <NavLink to="/trainers" className={({ isActive }) => isActive ? "glow-text" : ""} style={navLinkStyle}>Trainers</NavLink>
          <NavLink to="/calculators" className={({ isActive }) => isActive ? "glow-text" : ""} style={navLinkStyle}>Calculators</NavLink>
          
          {/* EXPLORE DROPDOWN */}
          <div className="nav-dropdown" style={{ position: 'relative', padding: '10px 0' }}>
            <span style={{ ...navLinkStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Explore <span style={{ fontSize: '0.65rem', color: '#aaaaaa' }}>▼</span>
            </span>
            <div className="nav-dropdown-menu" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'rgba(12, 12, 12, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '10px 0',
              minWidth: '160px',
              display: 'none',
              zIndex: 1000,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <Link to="/about" style={dropdownLinkStyle}>About Us</Link>
              <Link to="/gallery" style={dropdownLinkStyle}>Gallery</Link>
              <Link to="/offers" style={dropdownLinkStyle}>Promo Offers</Link>
            </div>
          </div>

          <NavLink to="/contact" className={({ isActive }) => isActive ? "glow-text" : ""} style={navLinkStyle}>Contact</NavLink>
        </div>

        {/* AUTH ACTIONS */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                <FaUserCircle style={{ color: '#E10600', fontSize: '1.3rem' }} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none',
                border: 'none',
                color: '#aaaaaa',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }} title="Sign Out">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Join Now
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="mobile-toggle" style={{ display: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#FFFFFF' }} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: scrolled ? '65px' : '85px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 70px)',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '25px',
          paddingTop: '40px',
          zIndex: 998,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <NavLink to="/" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/membership" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Membership Plans</NavLink>
          <NavLink to="/classes" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Classes</NavLink>
          <NavLink to="/trainers" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Trainers</NavLink>
          <NavLink to="/gallery" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Gallery</NavLink>
          <NavLink to="/offers" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Offers & Promos</NavLink>
          <NavLink to="/calculators" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Calculators</NavLink>
          <NavLink to="/contact" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>Contact Us</NavLink>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', marginTop: '20px' }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{
                color: '#E10600',
                fontWeight: 700,
                fontSize: '1.2rem'
              }} onClick={() => setMenuOpen(false)}>
                Go to Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '80%' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ width: '80%', marginTop: '20px' }} onClick={() => setMenuOpen(false)}>
              Join Now
            </Link>
          )}
        </div>
      )}

      {/* Inject custom mobile and dropdown styles locally to maintain Normal CSS restriction */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        .nav-dropdown:hover .nav-dropdown-menu {
          display: block !important;
        }
        .nav-dropdown-menu a:hover {
          color: #FFFFFF !important;
          background-color: rgba(225, 6, 0, 0.15) !important;
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 500,
  fontSize: '0.95rem',
  color: '#FFFFFF',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  transition: 'color 0.2s',
  cursor: 'pointer'
};

const dropdownLinkStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: '0.85rem',
  color: '#aaaaaa',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'block',
  padding: '10px 20px',
  transition: 'all 0.2s',
  cursor: 'pointer'
};

const mobileNavLinkStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: '1.2rem',
  color: '#FFFFFF',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};
