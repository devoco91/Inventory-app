import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'https://inventory-server-wild-shape-828.fly.dev';

const token = localStorage.getItem('access');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/customers/');
      setCustomers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/customers/${editingId}/`, form);
      } else {
        await axios.post('/api/customers/', form);
      }
      setForm({ name: '', email: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      console.error('❌ Failed to save customer:', err);
    }
  };

  const handleEdit = customer => {
    setForm({ name: customer.name, email: customer.email });
    setEditingId(customer.id);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/customers/${id}/`);
      fetchCustomers();
    } catch (err) {
      console.error('❌ Failed to delete customer:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Customers</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-5">
          <input type="text" name="name" className="form-control" placeholder="Customer name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-5">
          <input type="email" name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(c)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
