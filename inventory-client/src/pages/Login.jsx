// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import api from '../utils/axios';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Sending:', { username, password });
      const res = await api.post(
        '/api/auth/login/',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Login Success:', res.data);
      if (!res.data.access) {
        throw new Error('No access token in response');
      }
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      setIsAuthenticated(true);
      showToast('Login successful');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      showToast('Login failed. Check credentials.', 'error');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  );
}
