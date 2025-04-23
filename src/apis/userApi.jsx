import axios from 'axios';
import { message } from 'antd';
import { updateUser } from '../redux/userSlice';

const basePath = import.meta.env.VITE_API_BASE_URL;

if (!basePath) {
  console.error('VITE_API_BASE_URL is not defined in .env');
}

export const fetchUserProfile = async (navigate, dispatch) => {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      message.error('Vui lòng đăng nhập lại!');
      navigate('/login');
      return null;
    }

    const response = await axios.get(`${basePath}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    // Cập nhật user trong Redux
    if (dispatch) {
      dispatch(updateUser(response.data));
      console.log('Updated user in Redux:', response.data); // Debug
    }

    return response.data;
  } catch (error) {
    message.error('Không thể tải thông tin hồ sơ: ' + (error.response?.data?.message || error.message));
    console.error('Lỗi lấy hồ sơ:', error.response?.data || error);
    if (error.response?.status === 401) {
      localStorage.removeItem('TOKEN');
      navigate('/login');
    }
    return null;
  }
};

export const handleUpdateProfile = async (payload, token) => {
  try {
    if (!token) {
      message.error('Vui lòng đăng nhập lại!');
      return false;
    }

    const response = await axios.put(`${basePath}/users/update-profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // message.success('Cập nhật hồ sơ thành công!');
    return true;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Cập nhật hồ sơ thất bại!';
    message.error(errorMessage);
    console.error('Lỗi cập nhật hồ sơ:', error.response?.data || error);
    return false;
  }
};

export const handleAvatarUpload = async (file, token, dispatch, navigate) => {
  try {
    if (!token) {
      message.error('Vui lòng đăng nhập lại!');
      return null;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axios.post(`${basePath}/users/upload-avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // message.success('Tải ảnh đại diện thành công!');

    // Làm mới dữ liệu người dùng
    const userData = await fetchUserProfile(navigate, dispatch);
    if (!userData) {
      throw new Error('Không thể làm mới dữ liệu người dùng');
    }

    return response.data.avatarUrl;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Tải ảnh thất bại, vui lòng thử lại!';
    message.error(errorMessage);
    console.error('Lỗi tải ảnh:', error.response?.data || error);
    return null;
  }
};