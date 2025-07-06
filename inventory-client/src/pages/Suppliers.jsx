import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { showToast } from '../utils/toast';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', contact_email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/api/suppliers/');
      setSuppliers(res.data);
    } catch {
      showToast('❌ Failed to fetch suppliers', 'error');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.contact_email) return showToast('All fields required', 'error');

    try {
      if (editingId) {
        await api.put(`/api/suppliers/${editingId}/`, form);
        showToast('✅ Supplier updated');
      } else {
        await api.post('/api/suppliers/', form);
        showToast('✅ Supplier added');
      }
      setForm({ name: '', contact_email: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch {
      showToast('❌ Save failed', 'error');
    }
  };

  const handleEdit = s => {
    setForm({ name: s.name, contact_email: s.contact_email });
    setEditingId(s.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete supplier?')) return;
    try {
      await api.delete(`/api/suppliers/${id}/`);
      showToast('🗑️ Deleted');
      fetchSuppliers();
    } catch {
      showToast('❌ Delete failed', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Suppliers</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-sm-12 col-md-5">
          <input type="text" name="name" className="form-control" placeholder="Supplier name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-sm-12 col-md-5">
          <input type="email" name="contact_email" className="form-control" placeholder="Contact email" value={form.contact_email} onChange={handleChange} required />
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
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.contact_email}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
