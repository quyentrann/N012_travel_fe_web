import {
  Table,
  Tag,
  Button,
  Avatar,
  Dropdown,
  Spin,
  Menu,
  Layout,
  Breadcrumb,
  Typography,
  message,Modal, Input
} from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import {
  EyeOutlined,
  SettingOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import logo from '../../images/logo.png';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

// const statusColors = {
//   "Đã xác nhận": "green",
//   "Đang chờ": "gold",
//   "Đã hủy": "red",
// };

const statusColors = {
  CONFIRMED: 'gold',
  CANCELED: 'red',
  PAID: 'green',
  COMPLETED: 'blue',
  IN_PROGRESS: 'purple ',
};

const Orders = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);  // Modal visibility state
  const [reason, setReason] = useState('');  // Lý do hủy
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);  // Để lưu trữ bookingId đang hủy
  const [refundAmount, setRefundAmount] = useState(null);  // Số tiền hoàn
  const [cancellationFee, setCancellationFee] = useState(0);  // Phí hủy
  const [refundConfirmed, setRefundConfirmed] = useState(false);
   const navigate = useNavigate();

   const goToBookingDetail = (bookingId) => {
    if (!bookingId) {
      message.error('Không có thông tin booking!');
      return;
    }
    navigate('/booking-detail', { state: { id: bookingId } });
  };
  
  // Mở modal hủy tour và lưu bookingId
  const showCancelModal = (bookingId) => {
    setBookingIdToCancel(bookingId); // Lưu bookingId để hủy
    setIsModalVisible(true);
  };
  // Đóng modal hủy
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setReason('');
  };

   // Gửi yêu cầu hủy tour
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
        // If not paid, show confirmation modal directly
        Modal.confirm({
          title: 'Tour sắp khởi hành',
          content: 'Quý khách có chắc chắn muốn hủy tour này không?',
          onOk: async () => {
            message.success('Tour đã được hủy thành công.');
            setHistory((prevHistory) =>
              prevHistory.map((item) =>
                item.key === bookingIdToCancel ? { ...item, status: 'CANCELED' } : item
              )
            );
            setIsModalVisible(false);
          },
          onCancel() {
            message.info('Đã hủy bỏ hành động hủy tour.');
          },
        });
      } else {
        // If already paid, proceed with the regular flow
        setRefundAmount(response.data.refundAmount);
        setIsModalVisible(false); // Close the modal for cancellation
      }
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error.response || error.message);
      message.error('Không thể hủy tour');
    }
  };
  
  const handleRefundConfirmation = () => {
    setRefundConfirmed(true);
    // message.success("Số tiền chúng tôi sẽ nhanh chóng hoàn lại cho quý khách sớm nhất. Cảm ơn!");
    setIsModalVisible(false);
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

        formattedData.reverse(); // Sắp xếp từ mới nhất đến cũ nhất
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
  
      console.log('API Response:', response);  // Log response để xem kết quả trả về
  
      message.success(response.data.message);
  
      // Cập nhật trực tiếp trạng thái tour bị hủy trong danh sách
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
  
  
  
  
  

  // Hàm fetch dữ liệu từ backend
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.get('http://localhost:8080/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data); // Cập nhật danh sách mới từ backend
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
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => navigate('/booking-detail', { state: { id: record.key } })}>
                Xem chi tiết
              </Menu.Item>
              <Menu.Item
                key="cancel"
                disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                onClick={() => showCancelModal(record.key)}
              >
                Hủy tour
              </Menu.Item>
              <Menu.Item key="doi" disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}>
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
    <div className="w-screen h-screen">
      <Layout>
        <Header
          style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            backgroundColor: 'white',
          }}
          className="">
          <div className="flex justify-between  py-2 px-6 ">
            <div className="flex items-center ">
              <img src={logo} alt="logo" className="h-13 w-auto" />
              <span
                className="text-[26px] font-bold text-gray-900"
                style={{ fontFamily: 'Dancing Script, cursive' }}>
                TADA
              </span>
            </div>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              className="flex-grow justify-end">
              <Menu.Item key="1" icon={<HomeOutlined />}>
                Trang chủ
              </Menu.Item>
              <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
                Dịch vụ
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                Người dùng
              </Menu.Item>
            </Menu>
          </div>
        </Header>

        <Content>
          <div className="mx-auto pt-26 px-26 pb-10  bg-white shadow-md rounded-lg ">
            <h2 className="text-2xl font-semibold text-gray-700 pb-2">
              Danh Sách Tour Đã Đặt
            </h2>
            <Table
              columns={columns}
              dataSource={history}
              loading={loading}
              pagination={{ pageSize: 5 }}
             
            />
          </div>
        </Content>
          {/* Modal hiển thị số tiền hoàn */}
      {refundAmount !== null && !refundConfirmed && (
        <Modal visible={true} footer={null} onCancel={() => setRefundAmount(null)}>
          <div className="text-center">
            <h3>Thông tin hủy tour</h3>
            <p>
              Bạn đã thanh toán cho chuyến đi này. Nếu bạn hủy, sẽ có phí hủy tour.
              {cancellationFee > 0 ? (
                <>
                  <br />
                  Phí hủy: {cancellationFee.toLocaleString()} VND.
                </>
              ) : (
                <>
                  <br />
                  Không có phí hủy.
                </>
              )}
              <br />
              Nếu hủy, chúng tôi sẽ hoàn lại cho bạn: {refundAmount.toLocaleString()} VND.
            </p>
            <p>
              So với lúc thanh toán, bạn có chắc chắn muốn hủy chuyến đi này không?
            </p>
            <div>
              <Button
                type="primary"
                onClick={handleRefundConfirmation}
              >
                Xác nhận hủy
              </Button>
              <Button
                onClick={() => {
                  setRefundAmount(null);
                  message.info("Đã hủy bỏ hành động hủy tour.");
                }}
              >
                Hủy bỏ
              </Button>
            </div>
          </div>
        </Modal>
      )}


        {/* Modal nhập lý do hủy */}
        <Modal
          title="Nhập lý do hủy"
          visible={isModalVisible}
          onOk={handleConfirmCancel}
          onCancel={handleCancelModal}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do hủy tour"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Modal>

 {/* Final Refund Confirmation Message */}
{/* Final Refund Confirmation Message */}
{refundConfirmed && (
  <Modal visible={true} footer={null} onCancel={() => setRefundConfirmed(false)}>
    <div className="text-center">
      <h3>Tour đã bị hủy thành công.</h3>
      <p>
        Số tiền của bạn sẽ được hoàn lại trong thời gian sớm nhất.
      </p>
      <Button onClick={() => setRefundConfirmed(false)}>OK</Button>
    </div>
  </Modal>
)}


        <Footer style={{ textAlign: 'center' }}>
          <p>&copy; 2025 Travelista Tours. All Rights Reserved.</p>
        </Footer>
      </Layout>
    </div>
  );
};

export default Orders;
