import axios from "axios";

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

API.interceptors.response.use(response => response, error => {
  if (typeof window !== 'undefined' && error.response?.status === 401 && window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
  return Promise.reject(error);
});

export default API;
