import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'https://inventory-server-wild-shape-828.fly.dev';

export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 0, lowStock: 0 });

  useEffect(() => {
    const token = localStorage.getItem('access');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios.get('/api/dashboard/sales/', { headers })
      .then(res => setSalesData(res.data))
      .catch(err => console.error('❌ Sales fetch failed:', err));

    axios.get('/api/dashboard/inventory/', { headers })
      .then(res => setInventoryStats(res.data))
      .catch(err => console.error('❌ Inventory fetch failed:', err));
  }, []);

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
