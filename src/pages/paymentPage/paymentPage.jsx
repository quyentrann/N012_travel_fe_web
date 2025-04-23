import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, Typography, message } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const VnpayReturn = () => {
  const [status, setStatus] = useState(null); // 'success', 'error', 'not-found', null
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVnpayResult = async () => {
      try {
        // Lấy query params từ URL
        const queryParams = new URLSearchParams(location.search);
        const paramsObject = {};
        queryParams.forEach((value, key) => {
          paramsObject[key] = value;
        });

        // Gọi API vnpay-return với query params
        const response = await axios.get('http://localhost:8080/api/payment/vnpay-return', {
          params: paramsObject,
          headers: { Authorization: `Bearer ${localStorage.getItem('TOKEN')}` },
        });

        const { message } = response.data;

        if (message.includes('thành công')) {
          setStatus('success');
          setMessageText('Thanh toán thành công! Trạng thái đơn đặt tour đã được cập nhật.');
        } else if (message.includes('Không tìm thấy booking')) {
          setStatus('not-found');
          setMessageText('Không tìm thấy đơn đặt tour. Vui lòng kiểm tra lại.');
        } else {
          setStatus('error');
          setMessageText('Thanh toán thất bại. Vui lòng thử lại sau.');
        }
      } catch (error) {
        console.error('Lỗi khi xử lý kết quả VNPAY:', error.response || error.message);
        setStatus('error');
        setMessageText(
          error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.'
        );
        message.error('Lỗi khi xử lý kết quả thanh toán!');
      } finally {
        setLoading(false);
      }
    };

    fetchVnpayResult();
  }, [location]);

  const handleNavigate = () => {
    if (status === 'success') {
      navigate('/orders'); // Về danh sách đơn đặt tour
    } else {
      navigate('/'); // Về trang chính nếu thất bại hoặc lỗi
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        {status === 'success' && (
          <Result
            icon={<CheckCircleOutlined className="text-6xl text-green-500" />}
            title={<Title level={3} className="text-green-600">Thanh Toán Thành Công</Title>}
            subTitle={
              <Text className="text-gray-600">{messageText}</Text>
            }
            extra={
              <Button
                type="primary"
                className="h-10 rounded-md bg-green-300 hover:bg-blue-700"
                onClick={handleNavigate}
              >
                Xem Danh Sách Đơn Đặt Tour
              </Button>
            }
          />
        )}
        {status === 'error' && (
          <Result
            icon={<CloseCircleOutlined className="text-6xl text-red-500" />}
            title={<Title level={3} className="text-red-600">Thanh Toán Thất Bại</Title>}
            subTitle={
              <Text className="text-gray-600">{messageText}</Text>
            }
            extra={
              <div className="flex gap-4 justify-center">
                <Button
                  className="h-10 rounded-md border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/orders')}
                >
                  Thử Lại
                </Button>
                <Button
                  type="primary"
                  className="h-10 rounded-md bg-blue-600 hover:bg-blue-700"
                  onClick={handleNavigate}
                >
                  Về Trang Chủ
                </Button>
              </div>
            }
          />
        )}
        {status === 'not-found' && (
          <Result
            icon={<ExclamationCircleOutlined className="text-6xl text-yellow-500" />}
            title={<Title level={3} className="text-yellow-600">Lỗi Đơn Đặt Tour</Title>}
            subTitle={
              <Text className="text-gray-600">{messageText}</Text>
            }
            extra={
              <Button
                type="primary"
                className="h-10 rounded-md bg-blue-600 hover:bg-blue-700"
                onClick={handleNavigate}
              >
                Về Trang Chủ
              </Button>
            }
          />
        )}
      </motion.div>
    </div>
  );
};

export default VnpayReturn;