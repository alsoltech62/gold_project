import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://gold.foodpulse.in/api';
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('gold_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gold_token');
      localStorage.removeItem('gold_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
export const formatINR = n => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatGrams = g => Number(g).toFixed(4) + 'g';
