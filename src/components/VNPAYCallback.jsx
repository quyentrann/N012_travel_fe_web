// src/components/VNPAYCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../apis/axiosInstance';
import { message } from 'antd';

const VNPAYCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const query = new URLSearchParams(location.search);
      const bookingId = query.get('bookingId');
      const vnp_ResponseCode = query.get('vnp_ResponseCode');
      const vnp_TransactionStatus = query.get('vnp_TransactionStatus');

      if (!bookingId || !vnp_ResponseCode || !vnp_TransactionStatus) {
        message.error('Thông tin thanh toán không hợp lệ');
        navigate('/orders');
        return;
      }

      try {
        const token = localStorage.getItem('TOKEN');
        if (!token) {
          message.error('Vui lòng đăng nhập để xác nhận thanh toán');
          navigate('/login');
          return;
        }

        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
          // Payment successful
          const response = await axiosInstance.post(
            `/bookings/confirm-additional-payment/${bookingId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          message.success(response.data.message || 'Thanh toán bổ sung thành công!');
          navigate('/orders');
        } else {
          message.error('Thanh toán không thành công. Vui lòng thử lại.');
          navigate('/orders');
        }
      } catch (error) {
        console.error('Lỗi khi xác nhận thanh toán:', error.response || error);
        message.error(
          error.response?.data?.error || 'Lỗi khi xác nhận thanh toán. Vui lòng thử lại.'
        );
        navigate('/orders');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" tip="Đang xử lý thanh toán..." />
    </div>
  );
};

export default VNPAYCallback;