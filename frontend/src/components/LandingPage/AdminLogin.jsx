import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Config';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // SAVE TOKEN TO LOCAL STORAGE
        localStorage.setItem('nextbyte_admin_token', data.token);
        // Direct the user to the master management hub
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setError('Connection failure with authentication node.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 font-sans">
      <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">Sign in to manage courses, subjects, and view metrics.</p>

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="admin_username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A63E] hover:bg-green-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition mt-6 shadow-md shadow-green-100"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate Access'}
          </button>
        </form>
      </div>
    </div>
  );
}