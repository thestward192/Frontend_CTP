// src/Services/api.ts
import axios from 'axios';

const API_URL = 'https://backendcontrolactivos-2.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: Agrega el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Se supone que el token se guarda desde AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
