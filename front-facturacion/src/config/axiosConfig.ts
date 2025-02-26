import axios from "axios";

// ✅ Base URL del backend (usa variables de entorno)
const API_URL = process.env.APP_API_URL || "http://localhost:3001";

// ✅ Configuración inicial de Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Interceptor para añadir automáticamente el token en cada petición
axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
