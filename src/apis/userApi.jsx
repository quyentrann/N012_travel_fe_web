import axios from 'axios';
import { message } from 'antd';

const basePath = import.meta.env.VITE_API_BASE_URL;

// Kiểm tra basePath
if (!basePath) {
  console.error('VITE_API_BASE_URL is not defined in .env');
}

// Lấy thông tin người dùng
export const fetchUserProfile = async (navigate) => {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      message.error('Vui lòng đăng nhập lại!');
      navigate('/login');
      return null;
    }

    const response = await axios.get(`${basePath}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    message.error('Không thể tải thông tin hồ sơ!');
    console.error('Lỗi lấy hồ sơ:', error);
    return null;
  }
};

// Cập nhật thông tin người dùng
export const handleUpdateProfile = async (values, token) => {
  try {
    if (!token) {
      message.error('Vui lòng đăng nhập lại!');
      return false;
    }

    // Chuyển đổi gender thành boolean
    const updatedValues = {
      ...values,
      gender: values.gender === 'female' ? true : values.gender === 'male' ? false : null,
    };

    await axios.put(`${basePath}/users/update-profile`, updatedValues, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.success('Cập nhật hồ sơ thành công!');
    return true;
  } catch (error) {
    message.error(error.response?.data || 'Cập nhật thất bại, vui lòng thử lại!');
    console.error('Lỗi cập nhật hồ sơ:', error);
    return false;
  }
};

// Tải ảnh avatar
export const handleAvatarUpload = async (file, token) => {
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

    message.success('Tải ảnh đại diện thành công!');
    return response.data.avatarUrl;
  } catch (error) {
    message.error(error.response?.data || 'Tải ảnh thất bại, vui lòng thử lại!');
    console.error('Lỗi tải ảnh:', error);
    return null;
  }
};