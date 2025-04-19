import {
  Table,
  Tag,
  Button,
  Avatar,
  Dropdown,
  Spin,
  Menu,
  Layout,
  Typography,
  message,
  Modal,
  Input,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  EyeOutlined,
  HomeOutlined,
  UserOutlined,
  MoreOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const statusColors = {
  CONFIRMED: 'gold',
  CANCELED: 'red',
  PAID: 'green',
  COMPLETED: 'blue',
  IN_PROGRESS: 'purple',
};

const Orders = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [cancellationInfo, setCancellationInfo] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra token và lấy lịch sử đặt tour
  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      message.error('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log('Token:', token);
        const response = await axios.get('http://localhost:8080/api/bookings/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);

        const formattedData = response.data.map((item) => {
          console.log('Booking Item:', item);
          return {
            key: item.bookingId,
            tourImage: item.tour?.imageURL || 'https://via.placeholder.com/80',
            tourName: item.tour?.name || 'Tour không xác định',
            bookingDate: item.bookingDate,
            status: item.status || 'PENDING',
            price: item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') + 'đ' : 'N/A',
            numberPeople: item.numberPeople || 'N/A',
          };
        });

        formattedData.reverse();
        setHistory(formattedData);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử đặt tour:', error.response || error.message);
        message.error(
          error.response?.status === 403
            ? 'Bạn không có quyền truy cập lịch sử đặt tour'
            : 'Không thể lấy lịch sử đặt tour'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Hiển thị modal nhập lý do hủy
  const showCancelModal = (bookingId) => {
    setBookingIdToCancel(bookingId);
    setIsCancelModalVisible(true);
  };

  // Đóng modal nhập lý do
  const handleCancelModal = () => {
    setIsCancelModalVisible(false);
    setReason('');
    setCancellationInfo(null);
  };

  // Lấy thông tin phí hủy và số tiền hoàn lại
  const handleSubmitCancel = async () => {
    if (!reason) {
      message.error('Vui lòng nhập lý do hủy.');
      return;
    }

    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.post(
        `http://localhost:8080/api/bookings/calculate-cancellation-fee/${bookingIdToCancel}`,
        {
          reason,
          cancelDate: new Date().toISOString(),
          isHoliday: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCancellationInfo({
        cancellationFee: response.data.cancellationFee,
        refundAmount: response.data.refundAmount,
        message: response.data.message,
      });
      setIsCancelModalVisible(false);
      setIsConfirmModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hủy:', error.response || error.message);
      let errorMessage = 'Không thể lấy thông tin hủy tour';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy booking';
        } else if (error.response.status === 403) {
          errorMessage = error.response.data.error || 'Không thể hủy tour do trạng thái hiện tại';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.error || 'Dữ liệu không hợp lệ';
        }
      }
      message.error(errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  // Xác nhận hủy tour
  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.put(
        `http://localhost:8080/api/bookings/cancel/${bookingIdToCancel}`,
        {
          reason,
          cancelDate: new Date().toISOString(),
          isHoliday: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.key === bookingIdToCancel ? { ...item, status: 'CANCELED' } : item
        )
      );
      setIsConfirmModalVisible(false);
      message.success(response.data.message || 'Tour đã được hủy thành công!');
      setReason('');
      setBookingIdToCancel(null);
      setCancellationInfo(null);
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error.response || error.message);
      let errorMessage = 'Không thể hủy tour';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Không tìm thấy booking';
        } else if (error.response.status === 403) {
          errorMessage = error.response.data.error || 'Không thể hủy tour do trạng thái hiện tại';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.error || 'Dữ liệu không hợp lệ';
        }
      }
      message.error(errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  // Đóng modal xác nhận
  const handleCancelConfirmModal = () => {
    setIsConfirmModalVisible(false);
    setCancellationInfo(null);
    setReason('');
    setBookingIdToCancel(null);
    message.info('Đã hủy bỏ hành động hủy tour.');
  };

  // Chuyển đến chi tiết booking
  const goToBookingDetail = (bookingId) => {
    if (!bookingId) {
      message.error('Không có thông tin booking!');
      return;
    }
    console.log('Navigating to BookingDetail with bookingId:', bookingId);
    navigate('/booking-detail', { state: { id: bookingId } });
  };

  const columns = [
    {
      title: 'Tour',
      dataIndex: 'tourImage',
      key: 'tourImage',
      render: (text) => <Avatar shape="square" size={64} src={text} />,
    },
    {
      title: 'Tên Tour',
      dataIndex: 'tourName',
      key: 'tourName',
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Giá Tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span className="font-semibold">{price}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'numberPeople',
      key: 'numberPeople',
      render: (numberPeople) => (
        <span className="font-semibold">{numberPeople}</span>
      ),
    },
    {
      key: 'action',
      render: (record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => goToBookingDetail(record.key)}
              >
                Xem chi tiết
              </Menu.Item>
              <Menu.Item
                key="cancel"
                disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                onClick={() => showCancelModal(record.key)}
              >
                Hủy tour
              </Menu.Item>
              <Menu.Item
                key="doi"
                disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
              >
                Đổi tour
              </Menu.Item>
            </Menu>
          }
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f0ede3] shadow-md py-4 px-4 sm:px-6 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Travel TADA" className="h-8 w-auto" />
            <span
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              TADA
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              onClick={() => navigate('/')}
              aria-label="Trang chủ"
            >
              Trang chủ
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              onClick={() => navigate('/profile')}
              aria-label="Hồ sơ"
            >
              Hồ sơ
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-red-600 text-sm font-medium flex items-center transition-colors"
              onClick={() => {
                localStorage.clear();
                message.success('Đăng xuất thành công!');
                navigate('/login');
              }}
              aria-label="Đăng xuất"
            >
              <LogoutOutlined className="mr-1" /> Đăng xuất
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <Content className="flex-grow py-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Danh Sách Tour Đã Đặt
          </h2>
          <Table
            columns={columns}
            dataSource={history}
            loading={loading}
            pagination={{ pageSize: 5 }}
            rowClassName="hover:bg-gray-50 transition-colors"
          />
        </motion.div>
      </Content>

      {/* Modal nhập lý do hủy */}
      <Modal
        title="Nhập lý do hủy tour"
        visible={isCancelModalVisible}
        onOk={handleSubmitCancel}
        onCancel={handleCancelModal}
        okText="Tiếp tục"
        cancelText="Hủy"
        okButtonProps={{ disabled: cancelLoading, className: 'bg-blue-600 hover:bg-blue-700' }}
        confirmLoading={cancelLoading}
      >
        <Input.TextArea
          rows={4}
          placeholder="Vui lòng nhập lý do hủy tour"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border-gray-300"
        />
      </Modal>

      {/* Modal xác nhận hủy tour */}
      {cancellationInfo && (
        <Modal
          title="Xác nhận hủy tour"
          visible={isConfirmModalVisible}
          onOk={handleConfirmCancel}
          onCancel={handleCancelConfirmModal}
          okText="Xác nhận hủy"
          cancelText="Hủy bỏ"
          okButtonProps={{ className: 'bg-red-600 hover:bg-red-700', loading: cancelLoading }}
        >
          <p className="text-sm text-gray-600">
            Bạn sắp hủy tour này. Dưới đây là thông tin chi tiết:
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {cancellationInfo.cancellationFee > 0 ? (
              <>
                Phí hủy:{' '}
                <span className="font-medium">
                  {cancellationInfo.cancellationFee.toLocaleString('vi-VN')} VND
                </span>
              </>
            ) : (
              'Không có phí hủy.'
            )}
          </p>
          <p className="text-sm text-gray-600">
            Số tiền hoàn lại:{' '}
            <span className="font-medium text-green-600">
              {cancellationInfo.refundAmount.toLocaleString('vi-VN')} VND
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Bạn có chắc chắn muốn hủy tour này không?
          </p>
        </Modal>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-[#f0ede3] py-6 px-4 sm:px-6 shadow-inner"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Về Travel TADA</h4>
            <p>Khám phá thế giới với những hành trình đáng nhớ.</p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Liên kết</h4>
            <p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/about"
                className="hover:text-blue-600 transition-colors"
              >
                Giới thiệu
              </motion.a>{' '}
              |{' '}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="/contact"
                className="hover:text-blue-600 transition-colors"
              >
                Liên hệ
              </motion.a>
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Hỗ trợ</h4>
            <p>Email: support@traveltada.vn</p>
            <p>Hotline: 1900 8888</p>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          © 2025 Travel TADA. Mọi quyền được bảo lưu.
        </div>
      </motion.footer>
    </div>
  );
};

export default Orders;