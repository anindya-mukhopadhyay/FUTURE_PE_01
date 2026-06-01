import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context wrappers
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Navigation Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeSwapper } from './components/ThemeSwapper';

// Standard Pages
import Home from './pages/Home';
import About from './pages/About';
import Membership from './pages/Membership';
import Classes from './pages/Classes';
import Trainers from './pages/Trainers';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import Calculators from './pages/Calculators';
import Contact from './pages/Contact';
import Auth from './pages/Auth';

// Dashboards
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen onFinished={() => setLoading(false)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />

                {/* Member Portal (Protected) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['member', 'admin']}>
                      <MemberDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Portal (Protected) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ThemeSwapper />
          </div>
        )}
      </AnimatePresence>
    </Router>
  );
}
