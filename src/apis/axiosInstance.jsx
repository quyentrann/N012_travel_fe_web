import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://18.138.107.49/api',
  timeout: 30000,
});

export default axiosInstance;
