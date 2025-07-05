// frontend/src/pages/Orders.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showToast } from '../utils/toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get('/api/orders/');
    setOrders(res.data);
  };

  const updateStatus = async (id, newStatus) => {
    const order = orders.find(o => o.id === id);
    try {
      await axios.put(`/api/orders/${id}/`, { ...order, status: newStatus });
      showToast(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch {
      showToast('Failed to update order', 'error');
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
