// src/utils/axios.js
import axios from 'axios';
import { showToast } from './toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'https://inventory-server-wild-shape-828.fly.dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    const isExpired =
      err.response?.status === 401 &&
      err.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry;

    if (isExpired) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token');
        const res = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, { refresh });
        const newAccess = res.data.access;
        localStorage.setItem('access', newAccess);
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.warn('🔒 Token refresh failed:', refreshErr);
        processQueue(refreshErr, null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        if (!window.location.pathname.startsWith('/login')) {
          showToast('Session expired. Please log in again.', 'error');
          setTimeout(() => window.location.replace('/login'), 500);
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
