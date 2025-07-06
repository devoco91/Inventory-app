// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { showToast } from '../utils/toast';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, inventoryRes] = await Promise.all([
          api.get('/api/dashboard/sales/'),
          api.get('/api/dashboard/inventory/')
        ]);
        setSalesData(salesRes.data);
        setInventoryStats(inventoryRes.data);
      } catch (err) {
        showToast('❌ Dashboard data fetch failed', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard Overview</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <p className="card-text display-6">{inventoryStats.total}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Low Stock Items</h5>
              <p className="card-text display-6">{inventoryStats.lowStock}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-5">
        <div className="card-header bg-secondary text-white">Monthly Sales</div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
