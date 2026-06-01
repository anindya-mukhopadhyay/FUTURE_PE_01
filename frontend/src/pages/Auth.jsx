import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSignInAlt, FaLock } from 'react-icons/fa';

export default function Auth() {
  const { login, register, error } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const [loginForm, setLoginForm] = useState({ loginCredential: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    dateOfBirth: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    const res = await login(loginForm.loginCredential, loginForm.password);
    setLoading(false);
    if (res.success) {
      navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setLocalError(res.message || 'Incorrect credentials');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (registerForm.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register(registerForm);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLocalError(res.message || 'Registration failed.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 20px 80px 20px',
      background: 'radial-gradient(circle at center, #111111 0%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 30px'
        }}
      >
        {/* TABS CONTROLLERS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-grey)',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => { setIsLogin(true); setLocalError(''); }}
            style={{
              padding: '12px',
              background: isLogin ? 'var(--primary-red)' : 'none',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.3s'
            }}
          >
            <FaSignInAlt />
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setLocalError(''); }}
            style={{
              padding: '12px',
              background: !isLogin ? 'var(--primary-red)' : 'none',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.3s'
            }}
          >
            <FaUserPlus />
            Register
          </button>
        </div>

        {/* FEEDBACK STATUS */}
        {(localError || error) && (
          <div style={{
            backgroundColor: 'rgba(225, 6, 0, 0.1)',
            border: '1px solid var(--primary-red)',
            padding: '12px',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {localError || error}
          </div>
        )}

        {isLogin ? (
          /* LOGIN PANEL */
          <form onSubmit={handleLoginSubmit}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              Welcome <span style={{ color: 'var(--primary-red)' }}>Back</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Email or Mobile Number</label>
              <input
                type="text"
                placeholder="Enter registered email or mobile"
                required
                className="form-input"
                value={loginForm.loginCredential}
                onChange={(e) => setLoginForm({ ...loginForm, loginCredential: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="form-input"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#aaaaaa' }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary-red)' }} />
                <span>Remember Me</span>
              </label>
              <a href="#" style={{ color: 'var(--primary-red)' }}>Forgot Password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* REGISTRATION PANEL */
          <form onSubmit={handleRegisterSubmit}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}>
              Create <span style={{ color: 'var(--primary-red)' }}>Account</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                required
                className="form-input"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                required
                className="form-input"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                required
                className="form-input"
                value={registerForm.mobileNumber}
                onChange={(e) => setRegisterForm({ ...registerForm, mobileNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-input"
                value={registerForm.gender}
                onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                style={{ backgroundColor: '#161616', cursor: 'pointer' }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                required
                className="form-input"
                value={registerForm.dateOfBirth}
                onChange={(e) => setRegisterForm({ ...registerForm, dateOfBirth: e.target.value })}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                required
                className="form-input"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-type password"
                required
                className="form-input"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
              {loading ? 'Creating Profile...' : 'Complete Register'}
            </button>
          </form>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '25px',
          color: '#666666',
          fontSize: '0.8rem'
        }}>
          <FaLock style={{ color: 'var(--primary-red)' }} />
          <span>Encrypted Account Database Session</span>
        </div>
      </motion.div>
    </div>
  );
}
