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
  MoreOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import Footer from '../../components/Footer';
import Header from '../../components/Header1';

const { Content } = Layout;
const { Title, Text } = Typography;

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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('TOKEN');
        if (!token) {
          message.error('Vui lòng đăng nhập để xem lịch sử đặt tour');
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:8080/api/bookings/history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedData = response.data.map((item) => ({
          key: item.bookingId,
          tourImage: item.tour?.imageURL || 'https://via.placeholder.com/80',
          tourName: item.tour?.name || 'Tour không xác định',
          bookingDate: item.bookingDate,
          departureDate: item.departureDate,
          status: item.status || 'PENDING',
          price: item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') + 'đ' : 'N/A',
          numberPeople: item.numberPeople || 'N/A',
          totalPrice: item.totalPrice,
        }));

        formattedData.reverse();
        setHistory(formattedData);
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử đặt tour:', error.response || error.message);
        message.error(
          error.response?.status === 403
            ? 'Bạn không có quyền truy cập lịch sử đặt tour'
            : 'Có lỗi xảy ra khi lấy lịch sử đặt tour. Vui lòng thử lại sau.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const handleFocus = () => fetchHistory();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [navigate]);

  const showCancelModal = (bookingId) => {
    setBookingIdToCancel(bookingId);
    setIsCancelModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsCancelModalVisible(false);
    setReason('');
    setCancellationInfo(null);
  };

  const handleSubmitCancel = async () => {
    if (!reason) {
      message.error('Vui lòng nhập lý do hủy.');
      return;
    }

    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const cancelDate = new Date().toISOString();
      const response = await axios.post(
        `http://localhost:8080/api/bookings/calculate-cancellation-fee/${bookingIdToCancel}`,
        {
          reason,
          cancelDate,
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

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const cancelDate = new Date().toISOString();
      const response = await axios.put(
        `http://localhost:8080/api/bookings/cancel/${bookingIdToCancel}`,
        {
          reason,
          cancelDate,
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

  const handleCancelConfirmModal = () => {
    setIsConfirmModalVisible(false);
    setCancellationInfo(null);
    setReason('');
    setBookingIdToCancel(null);
    message.info('Đã hủy bỏ hành động hủy tour.');
  };

  const goToBookingDetail = (bookingId) => {
    if (!bookingId) {
      message.error('Không có thông tin booking!');
      return;
    }
    navigate('/booking-detail', { state: { id: bookingId } });
  };

  const showPaymentModal = (bookingId, totalPrice, tourName) => {
    setSelectedBooking({ bookingId, totalPrice, tourName });
    setIsPaymentModalVisible(true);
  };

  const handlePayment = async (bookingId, totalPrice) => {
    if (!bookingId || !totalPrice) {
      message.error('Không có thông tin booking hoặc giá tiền!');
      return;
    }

    setPaymentLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) {
        message.error('Vui lòng đăng nhập để thanh toán');
        navigate('/login');
        return;
      }
      const response = await axios.post(
        'http://localhost:8080/api/payment/vnpay-create',
        { bookingId, totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        message.error(response.data.error || 'Không thể tạo liên kết thanh toán!');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán:', error.response || error.message);
      message.error(
        error.response?.data?.error ||
          error.response?.status === 400
          ? 'Dữ liệu không hợp lệ hoặc booking đã hết hạn'
          : error.response?.status === 403
          ? 'Bạn không có quyền thanh toán booking này'
          : 'Lỗi khi tạo thanh toán, vui lòng thử lại!'
      );
    } finally {
      setPaymentLoading(false);
      setIsPaymentModalVisible(false);
      setSelectedBooking(null);
    }
  };

  const columns = [
    {
      title: 'Tour',
      dataIndex: 'tourImage',
      key: 'tourImage',
      render: (text) => (
        <Avatar shape="square" size={64} src={text} className="border border-gray-200" />
      ),
    },
    {
      title: 'Tên Tour',
      dataIndex: 'tourName',
      key: 'tourName',
      render: (text) => <span className="text-gray-800 font-medium">{text}</span>,
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : 'N/A',
    },
    {
      title: 'Ngày Đi',
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : 'N/A',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]} className="px-3 py-1 rounded-full">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Giá Tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span className="font-semibold text-black">{price}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'numberPeople',
      key: 'numberPeople',
      render: (numberPeople) => (
        <span className="font-semibold text-gray-700">{numberPeople}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <Dropdown
          overlay={
            <Menu className="rounded-lg shadow-md">
              <Menu.Item
                key="view"
                icon={<EyeOutlined className="text-blue-500" />}
                onClick={() => goToBookingDetail(record.key)}
              >
                Xem chi tiết
              </Menu.Item>
              <Menu.Item
                key="cancel"
                icon={<CloseCircleOutlined className="text-red-500" />}
                disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                onClick={() => showCancelModal(record.key)}
              >
                Hủy tour
              </Menu.Item>
              <Menu.Item
                key="payment"
                icon={<CreditCardOutlined className="text-green-500" />}
                disabled={record.status !== 'CONFIRMED'}
                onClick={() => showPaymentModal(record.key, record.totalPrice, record.tourName)}
              >
                Thanh toán
              </Menu.Item>
              <Menu.Item
                key="doi"
                icon={<SwapOutlined className="text-purple-500" />}
                disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
              >
                Đổi tour
              </Menu.Item>
            </Menu>
          }
          placement="bottomRight"
        >
          <Button
            icon={<MoreOutlined />}
            className="border-gray-300 hover:border-blue-500 hover:text-blue-500 rounded-full"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-screen">
      {/* Header */}
      <Header />

      {/* Content */}
      <Content className="flex-grow py-10 px-4 sm:px-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto"
        >
          {/* Desktop View */}
          <div className="hidden md:block max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
            <Title level={2} className="text-gray-800 mb-6">
              Danh Sách Tour Đã Đặt
            </Title>
            <Table
              columns={columns}
              dataSource={history}
              loading={loading || paymentLoading}
              pagination={{ pageSize: 5, showSizeChanger: false }}
              rowClassName="hover:bg-gray-50 transition-colors"
              className="rounded-lg"
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* Mobile View */}
          <div className="md:hidden bg-white shadow-md rounded-lg p-4 sm:max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh Sách Tour Đã Đặt</h2>
            {loading || paymentLoading ? (
              <div className="flex justify-center py-8">
                <Spin size="large" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-center text-gray-500">Không có tour nào đã đặt.</p>
            ) : (
              <div className="space-y-4">
                {history.map((record) => (
                  <div
                    key={record.key}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar
                        shape="square"
                        size={60}
                        src={record.tourImage}
                        className="border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800">{record.tourName}</h3>
                        <div className="text-sm text-gray-600 space-y-1 mt-1">
                          <p>
                            <span className="font-medium">Ngày Đặt:</span>{' '}
                            {record.bookingDate
                              ? new Date(record.bookingDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Ngày Đi:</span>{' '}
                            {record.departureDate
                              ? new Date(record.departureDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Số Lượng:</span> {record.numberPeople}
                          </p>
                          <p>
                            <span className="font-medium">Giá:</span>{' '}
                            <span className="text-black font-semibold">{record.price}</span>
                          </p>
                          <p>
                            <span className="font-medium">Trạng Thái:</span>{' '}
                            <Tag
                              color={statusColors[record.status]}
                              className="px-2 py-0.5 rounded-full text-xs"
                            >
                              {record.status}
                            </Tag>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => goToBookingDetail(record.key)}
                        className="flex-1 min-w-[80px] h-8 text-xs border-gray-300 text-blue-500 hover:border-blue-500 rounded-md"
                      >
                        Chi tiết
                      </Button>
                      <Button
                        icon={<CreditCardOutlined />}
                        onClick={() =>
                          showPaymentModal(record.key, record.totalPrice, record.tourName)
                        }
                        disabled={record.status !== 'CONFIRMED'}
                        className="flex-1 min-w-[80px] h-8 text-xs border-gray-300 text-green-500 hover:border-green-500 rounded-md disabled:opacity-50"
                      >
                        Thanh toán
                      </Button>
                      <Button
                        icon={<CloseCircleOutlined />}
                        onClick={() => showCancelModal(record.key)}
                        disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                        className="flex-1 min-w-[80px] h-8 text-xs border-gray-300 text-red-500 hover:border-red-500 rounded-md disabled:opacity-50"
                      >
                        Hủy
                      </Button>
                      <Button
                        icon={<SwapOutlined />}
                        disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                        className="flex-1 min-w-[80px] h-8 text-xs border-gray-300 text-purple-500 hover:border-purple-500 rounded-md disabled:opacity-50"
                      >
                        Đổi
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </Content>

      {/* Modal nhập lý do hủy */}
      <Modal
        title={<Title level={4} className="text-blue-600">Nhập lý do hủy tour</Title>}
        open={isCancelModalVisible}
        onOk={handleSubmitCancel}
        onCancel={handleCancelModal}
        okText="Tiếp tục"
        cancelText="Hủy"
        okButtonProps={{
          disabled: cancelLoading,
          className: 'bg-blue-600 hover:bg-blue-700 rounded-md h-10 md:w-24',
        }}
        cancelButtonProps={{ className: 'rounded-md h-10 md:w-24' }}
        centered
        closable
        maskClosable
        width={320}
      >
        <Input.TextArea
          rows={4}
          placeholder="Vui lòng nhập lý do hủy tour (ví dụ: thay đổi kế hoạch)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-lg border-gray-300 focus:border-blue-500 text-sm"
        />
      </Modal>

      {/* Modal xác nhận hủy tour */}
      {cancellationInfo && (
        <Modal
          title={<Title level={4} className="text-red-600">Xác nhận hủy tour</Title>}
          open={isConfirmModalVisible}
          onOk={handleConfirmCancel}
          onCancel={handleCancelConfirmModal}
          okText="Xác nhận hủy"
          cancelText="Hủy bỏ"
          okButtonProps={{
            className: 'bg-red-600 hover:bg-red-700 rounded-md h-10 md:w-24',
            loading: cancelLoading,
          }}
          cancelButtonProps={{ className: 'rounded-md h-10 md:w-24' }}
          centered
          closable
          maskClosable
          width={320}
        >
          <div className="text-sm text-gray-600 space-y-2">
            <p>Bạn sắp hủy tour này. Dưới đây là thông tin chi tiết:</p>
            <p>
              {cancellationInfo.cancellationFee > 0 ? (
                <>
                  Phí hủy:{' '}
                  <span className="font-medium text-red-600">
                    {cancellationInfo.cancellationFee.toLocaleString('vi-VN')} VND
                  </span>
                </>
              ) : (
                'Không có phí hủy.'
              )}
            </p>
            <p>
              Số tiền hoàn lại:{' '}
              <span className="font-medium text-green-600">
                {cancellationInfo.refundAmount.toLocaleString('vi-VN')} VND
              </span>
            </p>
            <p>Bạn có chắc chắn muốn hủy tour này không?</p>
          </div>
        </Modal>
      )}

      {/* Modal thanh toán */}
      {selectedBooking && (
        <Modal
          title={<Title level={4} className="text-green-600">Xác nhận thanh toán</Title>}
          open={isPaymentModalVisible}
          onOk={() => handlePayment(selectedBooking.bookingId, selectedBooking.totalPrice)}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setSelectedBooking(null);
          }}
          okText="Thanh toán"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-green-600 hover:bg-green-700 rounded-md h-10 md:w-24',
            loading: paymentLoading,
          }}
          cancelButtonProps={{ className: 'rounded-md h-10 md:w-24' }}
          centered
          closable
          maskClosable
          width={320}
        >
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">Bạn sắp thanh toán cho tour:</p>
            <p className="font-semibold text-gray-800">{selectedBooking.tourName}</p>
            <p className="text-gray-600">
              Tổng giá:{' '}
              <span className="font-semibold text-red-500">
                {selectedBooking.totalPrice
                  ? selectedBooking.totalPrice.toLocaleString('vi-VN')
                  : 'N/A'}{' '}
                VND
              </span>
            </p>
            <p className="text-gray-500 italic">
              Bạn sẽ được chuyển hướng đến cổng thanh toán VNPAY để hoàn tất.
            </p>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <motion.footer>
        <Footer />
      </motion.footer>
    </div>
  );
};

export default Orders;