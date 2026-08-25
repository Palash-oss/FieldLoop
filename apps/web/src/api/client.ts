import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT Token to outgoing requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fieldloop_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
