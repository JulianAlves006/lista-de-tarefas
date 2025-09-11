import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://lista-de-tarefas-ju34.onrender.com',
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      toast.error('Você precisa logar novamente para essa requisição');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
