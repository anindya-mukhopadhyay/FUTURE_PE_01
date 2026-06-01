import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF'
      }}>
        <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    // User not authenticated
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User does not possess authorization permission
    return <Navigate to="/" replace />;
  }

  return children;
};
