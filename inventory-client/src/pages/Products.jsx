// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { showToast } from '../utils/toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products/');
      setProducts(res.data);
    } catch (err) {
      if (!err?.config?._retry && err?.response?.status !== 401) {
        showToast('❌ Failed to load products', 'error');
      }
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.price) {
      return showToast('All fields are required', 'error');
    }
    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}/`, form);
        showToast('✅ Product updated');
      } else {
        await api.post('/api/products/', form);
        showToast('✅ Product added');
      }
      setForm({ name: '', quantity: '', price: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      if (!err?.config?._retry && err?.response?.status !== 401) {
        showToast('❌ Failed to save product', 'error');
      }
    }
  };

  const handleEdit = product => {
    setForm({ name: product.name, quantity: product.quantity, price: product.price });
    setEditingId(product.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/products/${id}/`);
      showToast('🗑️ Deleted');
      fetchProducts();
    } catch (err) {
      if (!err?.config?._retry && err?.response?.status !== 401) {
        showToast('❌ Delete failed', 'error');
      }
    }
  };

  const exportCSV = () => window.open('/api/export/products/csv/', '_blank');
  const exportPDF = () => window.open('/api/export/products/pdf/', '_blank');

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Products</h2>

      <div className="mb-3">
        <button className="btn btn-outline-secondary me-2" onClick={exportCSV}>Export CSV</button>
        <button className="btn btn-outline-secondary" onClick={exportPDF}>Export PDF</button>
      </div>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-sm-12 col-md-4">
          <input type="text" name="name" className="form-control" placeholder="Product name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-sm-6 col-md-3">
          <input type="number" name="quantity" className="form-control" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        </div>
        <div className="col-sm-6 col-md-3">
          <input type="number" step="0.01" name="price" className="form-control" placeholder="Price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="col-sm-12 col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            {editingId ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>{prod.quantity}</td>
                <td>{prod.price}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prod)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prod.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
