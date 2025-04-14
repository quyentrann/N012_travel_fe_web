import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, Rate, Input, Modal, message, Divider, Timeline, Tag } from 'antd';
import axios from 'axios';
import { ArrowLeftOutlined, StarFilled, InfoCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

// Placeholder cho gợi ý tour (có thể thay bằng API thật)
const relatedTours = [
  { id: 1, name: 'Tour Đà Lạt 3N2D', price: 2500000, image: 'https://via.placeholder.com/200x120?text=Da+Lat' },
  { id: 2, name: 'Tour Phú Quốc 4N3D', price: 4500000, image: 'https://via.placeholder.com/200x120?text=Phu+Quoc' },
];

const RatingModal = ({ visible, onCancel, onConfirm }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (rating === 0) {
      message.error('Vui lòng chọn mức đánh giá!');
      return;
    }
    onConfirm(rating, comment);
    setRating(0);
    setComment('');
    onCancel();
  };

  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Modal
        title={<span className="text-xl font-semibold text-cyan-600">Đánh giá chuyến đi</span>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
        className="rounded-lg"
        bodyStyle={{ background: '#f0ede3', borderRadius: '8px', padding: '16px' }}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-medium text-gray-700">Chất lượng tour:</h3>
          <Rate
            allowHalf
            value={rating}
            onChange={setRating}
            character={<StarFilled className="text-yellow-500 text-lg" />}
          />
          <h3 className="text-base font-medium text-gray-700">Nhận xét:</h3>
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn về chuyến đi..."
            className="rounded-md border-gray-200 focus:border-cyan-600"
          />
          <div className="flex gap-2">
            <Button
              onClick={onCancel}
              className="flex-1 rounded-md border-gray-300 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              type="primary"
              className="flex-1 rounded-md bg-cyan-600 hover:bg-cyan-700"
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

const BookingDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const token = localStorage.getItem('TOKEN');
        const response = await axios.get(`http://localhost:8080/api/bookings/${state.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookingDetail(response.data);
      } catch (error) {
        message.error('Không thể lấy thông tin chi tiết đơn đặt tour');
      } finally {
        setLoading(false);
      }
    };

    if (state?.id) {
      fetchBookingDetail();
    } else {
      message.error('Không có thông tin đơn đặt tour');
      setLoading(false);
    }
  }, [state]);

  const handleRatingConfirm = (rating, comment) => {
    console.log('Đánh giá:', rating, 'Nhận xét:', comment);
    message.success('Cảm ơn bạn đã đánh giá chuyến đi!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-gray-100 py-6 px-4 w-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-64">
          <img
            src={bookingDetail?.tourImage || 'https://via.placeholder.com/1200x300?text=Tour+Image'}
            alt="Tour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="rounded-full bg-white/90 text-cyan-600 hover:bg-white shadow-md"
            >
              Quay lại
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              {bookingDetail?.tourName || 'Chuyến đi của bạn'}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-12"
            >
              <Spin size="large" className="text-cyan-600" />
              <p className="text-lg text-gray-600">Đang tải hành trình của bạn...</p>
            </motion.div>
          ) : bookingDetail ? (
            <>
              {/* Thông tin chính */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-xl font-semibold text-cyan-600">Chi tiết đơn đặt tour</h2>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Ngày đặt:</span>
                        <span>{new Date(bookingDetail.bookingDate).toLocaleDateString('vi-VN')}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Số người:</span>
                        <span>{bookingDetail.numberPeople}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Trạng thái:</span>
                        <Tag
                          color={
                            bookingDetail.status === 'PAID' ? 'green' :
                            bookingDetail.status === 'CANCELED' ? 'red' :
                            'yellow'
                          }
                          className="font-medium"
                        >
                          {bookingDetail.status}
                        </Tag>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Giá tiền:</span>
                        <span className="font-semibold text-cyan-600">
                          {bookingDetail.totalPrice.toLocaleString('vi-VN')} đ
                        </span>
                      </p>
                    </div>
                    <p className="flex items-center gap-2 mt-4">
                      <EnvironmentOutlined className="text-gray-500" />
                      <span className="text-gray-500 font-medium">Vị trí:</span>
                      <span>{bookingDetail.location || 'Chưa xác định'}</span>
                    </p>
                  </div>
                  {bookingDetail.description && (
                    <div className="mt-4">
                      <h3 className="text-base font-medium text-gray-700 mb-2">Mô tả chuyến đi:</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-sm">
                        {bookingDetail.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timeline trạng thái */}
                <div className="md:col-span-1">
                  <h3 className="text-base font-medium text-gray-700 mb-4">Tiến trình</h3>
                  <Timeline className="pl-2">
                    <Timeline.Item color="blue">
                      <p className="font-medium">Đặt tour</p>
                      <p className="text-sm text-gray-500">
                        {new Date(bookingDetail.bookingDate).toLocaleDateString('vi-VN')}
                      </p>
                    </Timeline.Item>
                    <Timeline.Item color={bookingDetail.status === 'PAID' ? 'green' : 'gray'}>
                      <p className="font-medium">Thanh toán</p>
                      <p className="text-sm text-gray-500">
                        {bookingDetail.status === 'PAID' ? 'Đã hoàn tất' : 'Chưa thanh toán'}
                      </p>
                    </Timeline.Item>
                    <Timeline.Item color={bookingDetail.status === 'COMPLETED' ? 'green' : 'gray'}>
                      <p className="font-medium">Hoàn thành</p>
                      <p className="text-sm text-gray-500">
                        {bookingDetail.status === 'COMPLETED' ? 'Tour đã kết thúc' : 'Chưa hoàn thành'}
                      </p>
                    </Timeline.Item>
                  </Timeline>
                </div>
              </div>

              {/* Nút đánh giá */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex justify-center md:justify-start"
              >
                <Button
                  onClick={() => setIsModalVisible(true)}
                  type="primary"
                  className="w-full md:w-64 rounded-md bg-cyan-600 hover:bg-cyan-700 text-base py-2"
                  disabled={bookingDetail.status !== 'COMPLETED'}
                >
                  Đánh giá chuyến đi
                </Button>
              </motion.div>

              {/* Gợi ý tour tương tự */}
              <Divider className="my-8" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-600 mb-4">Khám phá thêm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedTours.map((tour) => (
                    <motion.div
                      key={tour.id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-50 rounded-lg shadow-sm overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/tours/${tour.id}`)}
                    >
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="text-base font-medium text-gray-800">{tour.name}</h4>
                        <p className="text-sm text-cyan-600 font-semibold">
                          {tour.price.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-12"
            >
              <InfoCircleOutlined className="text-5xl text-red-500" />
              <p className="text-xl text-red-500">Không tìm thấy thông tin đơn đặt tour</p>
              <Button
                onClick={() => navigate('/orders')}
                className="rounded-md bg-cyan-600 text-white hover:bg-cyan-700 px-6"
              >
                Quay về danh sách tour
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <RatingModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleRatingConfirm}
      />
    </div>
  );
};

export default BookingDetailPage;