// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      setHasToken(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking auth...</span>
        </div>
      </div>
    );
  }

  return hasToken ? children : <Navigate to="/login" replace />;
}
