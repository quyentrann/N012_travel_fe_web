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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [refundAmount, setRefundAmount] = useState(null);
  const [cancellationFee, setCancellationFee] = useState(0);
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  const navigate = useNavigate();

  const goToBookingDetail = (bookingId) => {
    if (!bookingId) {
      message.error('Không có thông tin booking!');
      return;
    }
    navigate('/booking-detail', { state: { id: bookingId } });
  };

  const showCancelModal = (bookingId) => {
    setBookingIdToCancel(bookingId);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setReason('');
  };

  const handleConfirmCancel = async () => {
    if (!reason) {
      message.error('Vui lòng nhập lý do hủy.');
      return;
    }

    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.put(
        `http://localhost:8080/api/bookings/cancel/${bookingIdToCancel}`,
        {
          reason,
          cancelDate: new Date(),
          isHoliday: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.refundAmount === 0) {
        Modal.confirm({
          title: 'Tour sắp khởi hành',
          content: 'Quý khách có chắc chắn muốn hủy tour này không?',
          onOk: async () => {
            message.success('Tour đã được hủy thành công.');
            setHistory((prevHistory) =>
              prevHistory.map((item) =>
                item.key === bookingIdToCancel
                  ? { ...item, status: 'CANCELED' }
                  : item
              )
            );
            setIsModalVisible(false);
          },
          onCancel() {
            message.info('Đã hủy bỏ hành động hủy tour.');
          },
        });
      } else {
        setRefundAmount(response.data.refundAmount);
        setCancellationFee(response.data.cancellationFee);
        console.log('Refund Amount:', response.data.refundAmount);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error.response || error.message);
      message.error('Không thể hủy tour');
    }
  };

  const handleRefundConfirmation = () => {
    setRefundConfirmed(true);
    setIsModalVisible(false);
    Modal.success({
      title: 'Tour đã bị hủy thành công',
      content: `Số tiền của bạn sẽ được hoàn lại trong thời gian sớm nhất: ${refundAmount.toLocaleString()} VND.`,
      onOk() {
        setRefundConfirmed(false);
      },
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('TOKEN');
        const response = await axios.get(
          'http://localhost:8080/api/bookings/history',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedData = response.data.map((item) => ({
          key: item.bookingId,
          tourImage: item.tourImage || 'https://via.placeholder.com/80',
          tourName: item.tourName || 'Tour không xác định',
          bookingDate: item.bookingDate,
          status: item.status || 'PENDING',
          price: item.totalPrice.toLocaleString() + 'đ',
          numberPeople: item.numberPeople,
        }));

        formattedData.reverse();
        setHistory(formattedData);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử đặt tour:', error);
        message.error('Không thể lấy lịch sử đặt tour');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const cancelTour = async (bookingId) => {
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.put(
        `http://localhost:8080/api/bookings/cancel/${bookingId}`,
        {
          reason: 'Không có lý do cụ thể',
          cancelDate: new Date(),
          isHoliday: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('API Response:', response);
      message.success(response.data.message);
      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.key === bookingId ? { ...item, status: 'CANCELED' } : item
        )
      );
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error);
      message.error('Không thể hủy tour');
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.get('http://localhost:8080/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đặt tour:', error);
    }
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
                onClick={() =>
                  navigate('/booking-detail', { state: { id: record.key } })
                }
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

      {/* Modals */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isModalVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Modal
          title="Nhập lý do hủy"
          visible={isModalVisible}
          onOk={handleConfirmCancel}
          onCancel={handleCancelModal}
          okText="Xác nhận"
          cancelText="Hủy"
          okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700' }}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do hủy tour"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-lg border-gray-300"
          />
        </Modal>
      </motion.div>

      {refundAmount !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Modal
            visible={true}
            footer={null}
            onCancel={() => setRefundAmount(null)}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin hủy tour
              </h3>
              <p className="text-sm text-gray-600">
                Bạn đã thanh toán cho chuyến đi này. Nếu bạn hủy, sẽ có phí hủy tour.
                {cancellationFee > 0 ? (
                  <>
                    <br />
                    Phí hủy: <span className="font-medium">{cancellationFee.toLocaleString()} VND</span>.
                  </>
                ) : (
                  <>
                    <br />
                    Không có phí hủy.
                  </>
                )}
                <br />
                Nếu hủy, chúng tôi sẽ hoàn lại cho bạn:{' '}
                <span className="font-medium text-green-600">{refundAmount.toLocaleString()} VND</span>.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                So với lúc thanh toán, bạn có chắc chắn muốn hủy chuyến đi này không?
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <Button
                  type="primary"
                  onClick={handleRefundConfirmation}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Xác nhận hủy
                </Button>
                <Button
                  onClick={() => {
                    setRefundAmount(null);
                    message.info('Đã hủy bỏ hành động hủy tour.');
                  }}
                >
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </Modal>
        </motion.div>
      )}

      {refundConfirmed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Modal
            visible={true}
            footer={null}
            onCancel={() => setRefundConfirmed(false)}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tour đã bị hủy thành công
              </h3>
              <p className="text-sm text-gray-600">
                Số tiền của bạn sẽ được hoàn lại trong thời gian sớm nhất.
              </p>
              <Button
                onClick={() => setRefundConfirmed(false)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                OK
              </Button>
            </div>
          </Modal>
        </motion.div>
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