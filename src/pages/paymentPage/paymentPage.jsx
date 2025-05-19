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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'PAYMENT_COMPLETED' }, '*');
    }

    let isMounted = true;
    const fetchVnpayResult = async () => {
      if (!isMounted) return;
      try {
        const queryParams = new URLSearchParams(location.search);
        const paramsObject = {};
        queryParams.forEach((value, key) => {
          paramsObject[key] = value;
        });

        const txnRef = paramsObject['vnp_TxnRef'];
        if (txnRef) {
          setBookingId(txnRef);
        } else {
          throw new Error('Không tìm thấy vnp_TxnRef');
        }

        const response = await axios.get(
          'http://localhost:8080/api/payment/vnpay-return',
          {
            params: paramsObject,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
            },
          }
        );

        const { message } = response.data;

        if (message.includes('thành công')) {
          setStatus('success');
          setMessageText(
            'Thanh toán thành công! Trạng thái đơn đặt tour đã được cập nhật.'
          );
        } else if (message.includes('Không tìm thấy booking')) {
          setStatus('not-found');
          setMessageText('Không tìm thấy đơn đặt tour. Vui lòng kiểm tra lại.');
        } else {
          setStatus('error');
          setMessageText('Thanh toán thất bại. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error(
          'Lỗi khi xử lý kết quả VNPAY:',
          error.response || error.message
        );
        if (isMounted) {
          setStatus('error');
          setMessageText(
            error.response?.data?.message ||
              'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.'
          );
          message.error('Lỗi khi xử lý kết quả thanh toán!');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVnpayResult();
    return () => {
      isMounted = false;
    };
  }, [location.search]);

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
          transition={{ duration: 0.3 }}>
          <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
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
        <div className="mt-6 flex gap-4 justify-center">
          <Button
            className="h-12 px-6 rounded-lg border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
            onClick={() => navigate('/orders')}>
            Thử Lại
          </Button>
          <Button
            type="primary"
            className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-base"
            onClick={() => navigate('/')}>
            Về Trang Chủ
          </Button>
        </div>
      ),
    },
    'not-found': {
      icon: <ExclamationCircleFilled className="text-6xl text-yellow-500" />,
      title: 'Lỗi Đơn Đặt Tour',
      titleColor: 'text-yellow-600',
      extra: (
        <div className="mt-6">
          <Button
            type="primary"
            className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-base"
            onClick={() => navigate('/')}>
            Về Trang Chủ
          </Button>
        </div>
      ),
    },
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/40?text=Logo"
            alt="Logo"
            className="h-10 w-10"
          />
          <Title level={4} className="m-0 text-blue-600">
            TravelEasy
          </Title>
        </div>
        <Text className="text-gray-600">Hỗ trợ: support@traveleasy.com</Text>
      </header>

      {/* Main Content */}
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

          {/* Timeline for Success */}
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

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Text className="text-gray-300">
              © 2025 TravelEasy. All rights reserved.
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
