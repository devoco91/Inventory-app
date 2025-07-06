// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import BarcodeScanner from './pages/BarcodeScanner';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import { showToast } from './utils/toast';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function Logout() {
  useEffect(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    showToast('Logged out');
    window.location.href = '/login';
  }, []);
  return null;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('access'));

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      localStorage.removeItem('refresh');
      setToken(null);
    } else {
      setToken(access);
    }
  }, []);

  return (
    <Router>
      <ToastContainer />
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/barcode-scanner" element={<ProtectedRoute><BarcodeScanner /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
