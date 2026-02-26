import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const productApi = {
  getAll: (params?: object) => api.get('/products', { params }),
  getById: (id: number) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  create: (data: object) => api.post('/products', data),
  update: (id: number, data: object) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const authApi = {
  login: (data: object) => api.post('/auth/login', data),
  register: (data: object) => api.post('/auth/register', data),
};

export const orderApi = {
  getMyOrders: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: object) => api.post('/orders', data),
  cancel: (id: number) => api.put(`/orders/${id}/cancel`),
};

export default api;
