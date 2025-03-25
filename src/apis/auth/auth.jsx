export const LOCAL_STORAGE_TOKEN = 'TOKEN';
export const LOCAL_STORAGE_REFRESHTOKEN = 'REFRESHTOKEN';
export const LOCAL_STORAGE_TOKEN_EXPIRES_IN = 'TOKEN_EXPIRES_IN';
export const LOCAL_STORAGE_USER_INFO = 'user_info';

import axios from '../../utils/axios';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`/auth/login`, null, {
      params: {
        email,
        password,
      },
    });
    if (response.status === 200) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.token);
      localStorage.setItem(
        LOCAL_STORAGE_REFRESHTOKEN,
        response.data.refreshToken
      );
      localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRES_IN, response.data.exp);
      localStorage.setItem(
        LOCAL_STORAGE_USER_INFO,
        JSON.stringify(response.data.user)
      );

      window.location.href = '/';
    }
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
  }
};

export const refreshToken = async () => {
  let data = localStorage.getItem(LOCAL_STORAGE_REFRESHTOKEN);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseURL}/auth/refreshToken`,
    headers: {
      'Content-Type': 'text/plain',
    },
    data: data, 
  };

  try {
    const response = await axios.request(config);
    console.log(response);

    if (response.status === 200) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.token);
      localStorage.setItem(
        LOCAL_STORAGE_REFRESHTOKEN,
        response.data.refreshToken
      );
      localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRES_IN, response.data.exp);
      localStorage.setItem(
        LOCAL_STORAGE_USER_INFO,
        JSON.stringify(response.data.user)
      );
    }
    return JSON.stringify(response.data);
  } catch (error) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN);
    localStorage.setItem(LOCAL_STORAGE_REFRESHTOKEN);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_EXPIRES_IN);
    localStorage.setItem(LOCAL_STORAGE_USER_INFO);
    window.router.push({ name: 'Login' });
    return '';
  }
};
