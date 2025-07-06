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
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  if (refresh) {
    try {
      const res = await axios.post('/api/token/refresh/', { refresh });
      localStorage.setItem('access', res.data.access);
      return res.data.access;
    } catch {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
  } else {
    window.location.href = '/login';
  }
};

axios.interceptors.request.use(async config => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(err);
  }
);

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
