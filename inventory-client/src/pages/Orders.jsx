// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { showToast } from '../utils/toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/');
      setOrders(res.data);
    } catch (err) {
      showToast('❌ Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const order = orders.find(o => o.id === id);
    try {
      await api.put(`/api/orders/${id}/`, { ...order, status: newStatus });
      showToast(`✅ Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      showToast('❌ Failed to update order', 'error');
    }
  };

  const statusBadge = status => {
    const map = {
      pending: 'warning',
      shipped: 'info',
      delivered: 'success',
    };
    return <span className={`badge bg-${map[status]}`}>{status}</span>;
  };

  useEffect(() => {
    fetchOrders();
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
      <h2 className="mb-4">Customer Orders</h2>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.customer?.name || 'N/A'}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{statusBadge(order.status)}</td>
                <td>
                  <ul className="mb-0">
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item.product?.name || 'N/A'} × {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-info" onClick={() => updateStatus(order.id, 'shipped')}>Ship</button>
                    <button className="btn btn-success" onClick={() => updateStatus(order.id, 'delivered')}>Deliver</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
