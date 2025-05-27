import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Spin, Typography, message } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const VnpayReturn = () => {
  const [status, setStatus] = useState(null); // 'success', 'error', 'not-found', null
  const [messageText, setMessageText] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const maxRetries = 2;

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('REFRESH_TOKEN');
      if (!refreshToken) {
        throw new Error('Không tìm thấy refresh token');
      }
      const response = await axios.post(
        'https://18.138.107.49/api/auth/refresh',
        { refreshToken },
        { timeout: 5000 }
      );
      const newToken = response.data.accessToken;
      localStorage.setItem('TOKEN', newToken);
      console.log('Token refreshed:', newToken);
      return newToken;
    } catch (error) {
      console.error('Lỗi làm mới token:', {
        message: error.message,
        response: error.response?.data,
      });
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('REFRESH_TOKEN');
      return null;
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('https://18.138.107.49/api/auth/check', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      console.log('User info:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      return null;
    }
  };

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'PAYMENT_COMPLETED' }, '*');
    }

    let isMounted = true;

    const fetchVnpayResult = async (currentRetry = retryCount) => {
      if (!isMounted) return;

      let token = localStorage.getItem('TOKEN');
      if (!token) {
        console.warn('Không tìm thấy token trong localStorage');
        setStatus('error');
        setMessageText('Vui lòng đăng nhập để tiếp tục.');
        message.error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Lấy thông tin người dùng để gỡ lỗi
      const userInfo = await fetchUserInfo(token);
      console.log('Current user:', userInfo);

      try {
        const queryParams = new URLSearchParams(location.search);
        const paramsObject = {};
        queryParams.forEach((value, key) => {
          paramsObject[key] = value;
        });

        console.log('Query Params:', paramsObject);
        console.log('Token:', token);

        const txnRef = paramsObject['vnp_TxnRef'];
        if (!txnRef) {
          console.warn('Thiếu vnp_TxnRef trong query parameters');
          throw new Error('Không tìm thấy mã giao dịch (vnp_TxnRef).');
        }
        setBookingId(txnRef.split('_')[0]);

        const response = await axios.get(
          'https://18.138.107.49/api/payment/vnpay-return',
          {
            params: paramsObject,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        console.log('API Response:', response.data);

        const { message } = response.data;

        if (message.toLowerCase().includes('thành công')) {
          setStatus('success');
          setMessageText(
            'Thanh toán thành công! Trạng thái đơn đặt tour đã được cập nhật.'
          );
        } else if (message.toLowerCase().includes('không tìm thấy booking')) {
          setStatus('not-found');
          setMessageText('Không tìm thấy đơn đặt tour. Vui lòng kiểm tra lại.');
        } else {
          setStatus('error');
          setMessageText('Thanh toán thất bại. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Lỗi khi xử lý kết quả VNPAY:', {
          message: error.message,
          response: error.response
            ? {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
              }
            : null,
        });

        if (!isMounted) return;

        if (error.response?.status === 401 && currentRetry < maxRetries) {
          console.warn('Token hết hạn, thử làm mới token...');
          const newToken = await refreshToken();
          if (newToken) {
            localStorage.setItem('TOKEN', newToken);
            setRetryCount(currentRetry + 1);
            return fetchVnpayResult(currentRetry + 1);
          } else {
            setStatus('error');
            setMessageText('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            message.error('Phiên đăng nhập hết hạn. Đang chuyển hướng...');
            setTimeout(() => navigate('/login'), 3000);
          }
        } else if (error.response?.status === 403) {
          setStatus('error');
          setMessageText(
            error.response?.data?.message ||
              `Bạn không có quyền truy cập booking ${
                bookingId || 'này'
              }. Vui lòng kiểm tra tài khoản hoặc mã đơn đặt tour.`
          );
          message.error('Không có quyền truy cập booking.');
        } else if (error.response?.status === 404) {
          setStatus('not-found');
          setMessageText('Không tìm thấy đơn đặt tour. Vui lòng kiểm tra lại.');
          message.error('Không tìm thấy đơn đặt tour.');
        } else if (error.code === 'ECONNABORTED') {
          setStatus('error');
          setMessageText(
            'Kết nối đến server thất bại. Vui lòng kiểm tra mạng.'
          );
          message.error('Kết nối timeout. Vui lòng thử lại.');
        } else {
          setStatus('error');
          setMessageText(
            error.response?.data?.message ||
              'Lỗi xử lý thanh toán. Vui lòng thử lại sau.'
          );
          message.error('Lỗi xử lý thanh toán.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVnpayResult();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount(0);
    setStatus(null);
    setMessageText('');
    fetchVnpayResult(0);
  };

  const handleNavigate = () => {
    if (status === 'success' && bookingId) {
      navigate('/booking-detail', { state: { id: bookingId }, replace: true });
    } else {
      navigate('/orders', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 z-50 w-screen h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center">
          <Spin size="large" />
          <Text className="mt-2 text-gray-600">
            Đang xử lý kết quả thanh toán...
          </Text>
        </motion.div>
      </div>
    );
  }

  const statusConfig = {
    success: {
      icon: <CheckCircleFilled className="text-6xl text-green-500" />,
      title: 'Thanh Toán Thành Công',
      titleColor: 'text-green-600',
      extra: (
        <div className="mt-6">
          <Button
            type="primary"
            className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-base"
            onClick={handleNavigate}>
            Xem Chi Tiết Đơn Đặt Tour
          </Button>
          <div className="mt-4 text-gray-600">
            <Text>
              Mã đơn: <strong>{bookingId}</strong>
            </Text>
            <br />
            <Text>Thời gian: {new Date().toLocaleString('vi-VN')}</Text>
          </div>
        </div>
      ),
    },
    error: {
      icon: <CloseCircleFilled className="text-6xl text-red-500" />,
      title: 'Thanh Toán Thất Bại',
      titleColor: 'text-red-600',
      extra: (
        <div className="mt-6 flex gap-4 justify-center flex-wrap">
          <Button
            className="h-12 px-6 rounded-lg border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
            onClick={handleRetry}>
            Thử Lại
          </Button>
          <Button
            type="primary"
            className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-base"
            onClick={() => navigate('/orders')}>
            Xem Đơn Đặt Tour
          </Button>
          <Button
            type="primary"
            className="h-12 px-6 rounded-lg bg-gray-600 hover:bg-gray-700 text-base"
            onClick={() => navigate('/')}>
            Về Trang Chủ
          </Button>
          <Button
            type="link"
            href="mailto:support@traveltada.com"
            className="mt-4 text-blue-600">
            Liên hệ hỗ trợ
          </Button>
        </div>
      ),
    },
    'not-found': {
      icon: <ExclamationCircleFilled className="text-6xl text-yellow-500" />,
      title: 'Lỗi Đơn Đặt Tour',
      titleColor: 'text-yellow-600',
      extra: (
        <div className="mt-6 flex gap-4 justify-center">
          <Button
            className="h-12 px-6 rounded-lg border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
            onClick={handleRetry}>
            Thử Lại
          </Button>
          <Button
            type="primary"
            className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-base"
            onClick={() => navigate('/')}>
            Về Trang Chủ
          </Button>
          <Button
            type="link"
            href="mailto:support@traveleasy.com"
            className="mt-4 text-blue-600">
            Liên hệ hỗ trợ
          </Button>
        </div>
      ),
    },
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/40?text=Logo"
            alt="Logo"
            className="h-10 w-10"
          />
          <Title level={4} className="m-0 text-blue-600">
            TravelTADA
          </Title>
        </div>
        <Text className="text-gray-600">Hỗ trợ: support@traveltada.com</Text>
      </header>

      <div className="flex-grow flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            {statusConfig[status]?.icon}
            <Title
              level={3}
              className={`mt-4 ${statusConfig[status]?.titleColor}`}>
              {statusConfig[status]?.title}
            </Title>
            <Text className="text-gray-600 block mt-2">{messageText}</Text>
          </div>

          {status === 'success' && (
            <div className="mt-6 mb-8">
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleFilled className="text-green-500" />
                  </div>
                  <Text className="mt-2 text-sm">Đặt tour</Text>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleFilled className="text-green-500" />
                  </div>
                  <Text className="mt-2 text-sm">Thanh toán</Text>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleFilled className="text-green-500" />
                  </div>
                  <Text className="mt-2 text-sm">Hoàn tất</Text>
                </div>
              </div>
            </div>
          )}

          {statusConfig[status]?.extra}
        </motion.div>
      </div>

      <footer className="w-full bg-gray-800 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Text className="text-gray-300">
              © 2025 TravelTADA. All rights reserved.
            </Text>
          </div>
          <div className="flex gap-6">
            <a href="/about" className="text-gray-300 hover:text-white">
              Về chúng tôi
            </a>
            <a href="/contact" className="text-gray-300 hover:text-white">
              Liên hệ
            </a>
            <a href="/support" className="text-gray-300 hover:text-white">
              Hỗ trợ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VnpayReturn;
