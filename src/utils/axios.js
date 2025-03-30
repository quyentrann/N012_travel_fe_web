const LOCAL_STORAGE_TOKEN = 'TOKEN';
const LOCAL_STORAGE_REFRESHTOKEN = 'REFRESHTOKEN';
const LOCAL_STORAGE_TOKEN_EXPIRES_IN = 'TOKEN_EXPIRES_IN';
const LOCAL_STORAGE_USER_INFO = 'user_info';
const LOGIN_ROUTE = '/login';
import axios from 'axios';
import { refreshToken } from '../apis/auth/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log(baseURL);

let isRefreshing = false;
let subscribers = [];

const instance = axios.create({ baseURL });

// Add token to request header
const attachTokenToRequest = (config, token) => {
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
};

// Decode token and check expiration
const isTokenExpired = () => {
  const exp = Number(localStorage.getItem(LOCAL_STORAGE_TOKEN_EXPIRES_IN));
  return exp - Date.now() < TIME_LIMIT_DEFAULT;
};

// Handle all pending requests after token refresh
const notifySubscribers = (newToken) => {
  subscribers.forEach((callback) => callback(newToken));
  subscribers = [];
};

// Save tokens and expiration time to local storage
const saveTokenData = ({ token, refreshToken, exp }) => {
  localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
  localStorage.setItem(LOCAL_STORAGE_REFRESHTOKEN, refreshToken);
  localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRES_IN, exp);
};

// Refresh token logic
const refreshNewToken = async () => {
  const refresh_token = localStorage.getItem(LOCAL_STORAGE_REFRESHTOKEN);
  if (!refresh_token) throw new Error('No refresh token available');

  const response = await refreshToken();
  const data = JSON.parse(response);
  saveTokenData(data);
  return data.token;
};

// Handle logout and reset tokens
const handleLogout = () => {
  localStorage.removeItem(LOCAL_STORAGE_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_REFRESHTOKEN);
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_EXPIRES_IN);
  localStorage.removeItem(LOCAL_STORAGE_USER_INFO);
  window.location.href = LOGIN_ROUTE;
};

// Request interceptor for refreshing token if expired
instance.interceptors.request.use(
  async (config) => {
    if (config.url === LOGIN_ROUTE) return config; // Skip for login route

    let token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

    if (token && isTokenExpired()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshNewToken();
          notifySubscribers(newToken);
          token = newToken;
        } catch (error) {
          handleLogout();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Return a new promise that resolves when the token is refreshed
        return new Promise((resolve) => {
          subscribers.push((newToken) => {
            config.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axios(config)); // Retry the request after getting new token
          });
        });
      }
    }

    return attachTokenToRequest(config, token);
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and server errors
instance.interceptors.response.use(
  (res) => res, // Just return the response if no error
  async (error) => {
    console.log(error);

    const {
      response: { status },
      config,
    } = error;

    // Handle 401 errors (Unauthorized)
    if (status === 401 && config.url !== LOGIN_ROUTE) {
      try {
        const newToken = await refreshNewToken();
        config.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(config); // Retry the original request with the new token
      } catch (err) {
        handleLogout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
