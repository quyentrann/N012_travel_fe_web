import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import {
  Button,
  Spin,
  Rate,
  Input,
  Modal,
  message,
  Timeline,
  Tag,
  Skeleton,
  List,
  Avatar,
  Pagination,
  Collapse,
  Card,
  Typography,
  Select,
} from 'antd';
import axios from 'axios';
import {
  ArrowLeftOutlined,
  StarFilled,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const { Title, Text } = Typography;
const { Option } = Select;

const formatDate = (dateString, formatPattern = 'dd/MM/yyyy') => {
  try {
    return dateString ? format(parseISO(dateString), formatPattern, { locale: vi }) : 'N/A';
  } catch {
    return 'N/A';
  }
};

const getSimilarTours = async (tourId) => {
  try {
    const token = localStorage.getItem('TOKEN');
    if (!token) {
      message.error('Vui lòng đăng nhập để xem tour tương tự');
      return [];
    }
    const response = await axios.get(`http://localhost:8080/api/tours/${tourId}/similar`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi getSimilarTours:', error.response || error.message);
    if (error.response?.status === 403) {
      message.error('Bạn không có quyền truy cập tour tương tự');
    } else {
      message.error('Không thể lấy tour tương tự');
    }
    return [];
  }
};

const RatingModal = ({ open, onCancel, onConfirm, loading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (rating === 0) {
      message.error('Vui lòng chọn mức đánh giá!');
      return;
    }
    if (!comment.trim()) {
      message.error('Vui lòng nhập nhận xét!');
      return;
    }
    onConfirm(rating, comment);
    setRating(0);
    setComment('');
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2, type: 'spring', stiffness: 300 } },
  };

  return (
    <Modal
      title={<Title level={4} className="text-blue-700">Đánh Giá Chuyến Đi</Title>}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      className="rounded-xl"
    >
      <div className="space-y-6">
        <div>
          <Text className="text-sm font-medium text-gray-700">Chất lượng tour</Text>
          <Rate
            allowHalf
            value={rating}
            onChange={setRating}
            character={<StarFilled className="text-yellow-400 text-base" />}
            className="mt-2"
          />
        </div>
        <div>
          <Text className="text-sm font-medium text-gray-700">Nhận xét</Text>
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn..."
            className="mt-2 rounded-md"
          />
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            className="flex-1 h-10 rounded-md text-gray-600 hover:bg-gray-100"
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            className="flex-1 h-10 rounded-md bg-blue-600 hover:bg-blue-700"
            loading={loading}
          >
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const CancelModal = ({ open, onCancel, onConfirm, loading, cancellationInfo }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      message.error('Vui lòng nhập lý do hủy!');
      return;
    }
    onConfirm(reason);
  };

  return (
    <Modal
      title={<Title level={4} className="text-red-600">Hủy Tour</Title>}
      open={open}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Xác Nhận Hủy"
      cancelText="Quay Lại"
      okButtonProps={{ className: 'bg-red-600 hover:bg-red-700 rounded-md h-10' }}
      cancelButtonProps={{ className: 'rounded-md h-10' }}
      confirmLoading={loading}
      centered
      className="rounded-xl"
    >
      {cancellationInfo ? (
        <div className="space-y-4">
          <Text className="text-sm text-gray-600">Bạn sắp hủy tour. Thông tin chi tiết:</Text>
          <div className="bg-gray-50 p-4 rounded-md">
            <Text className="text-sm text-gray-600">
              Phí hủy:{' '}
              <span className="font-semibold text-red-600">
                {cancellationInfo.cancellationFee > 0
                  ? `${cancellationInfo.cancellationFee.toLocaleString('vi-VN')} VND`
                  : 'Miễn phí'}
              </span>
            </Text>
            <br />
            <Text className="text-sm text-gray-600">
              Hoàn lại:{' '}
              <span className="font-semibold text-green-600">
                {cancellationInfo.refundAmount.toLocaleString('vi-VN')} VND
              </span>
            </Text>
          </div>
          <Input.TextArea
            rows={4}
            placeholder="Lý do hủy tour"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-md"
          />
        </div>
      ) : (
        <Skeleton active paragraph={{ rows: 2 }} />
      )}
    </Modal>
  );
};

const BookingDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [similarTours, setSimilarTours] = useState([]);
  const [similarToursLoading, setSimilarToursLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cancellationInfo, setCancellationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const pageSize = 5;
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');

  useEffect(() => {
    const fetchData = async () => {
      if (!state?.id) {
        message.error('Không có thông tin đơn đặt tour');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('TOKEN');
        if (!token) {
          message.error('Vui lòng đăng nhập để xem chi tiết booking');
          navigate('/login');
          return;
        }

        const [bookingResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/bookings/${state.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log('Booking response:', bookingResponse.data); // Log response
        setBookingDetail(bookingResponse.data);

        const tourId = bookingResponse.data.tour?.tourId;
        const [
          historyResponse,
          reviewsResponse,
          reviewCheckResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:8080/api/bookings/history/${state.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: [] })),
          axios.get(
            `http://localhost:8080/api/reviews/by-tour/${tourId || state.id}?page=${currentPage - 1}&size=${pageSize}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch(() => ({ data: { content: [], totalElements: 0 } })),
          axios.get(`http://localhost:8080/api/reviews/by-booking/${state.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: false })),
        ]);

        setHistory(historyResponse.data);
        setReviews(reviewsResponse.data.content || []);
        setTotalReviews(reviewsResponse.data.totalElements || 0);
        setHasReviewed(reviewCheckResponse.data);

        if (tourId) {
          setSimilarToursLoading(true);
          const similarToursData = await getSimilarTours(tourId);
          setSimilarTours(similarToursData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.response || error.message);
        if (error.response?.status === 403) {
          message.error('Bạn không có quyền truy cập dữ liệu này. Vui lòng đăng nhập lại.');
          navigate('/login');
        } else {
          message.error(
            error.response?.status === 404
              ? 'Không tìm thấy đơn đặt tour'
              : 'Không thể lấy thông tin chi tiết đơn đặt tour'
          );
        }
      } finally {
        setLoading(false);
        setSimilarToursLoading(false);
      }
    };

    fetchData();
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state, currentPage, navigate]);

  const handleRatingConfirm = async (rating, comment) => {
    setRatingLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      await axios.post(
        `http://localhost:8080/api/reviews`,
        { bookingId: state.id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Đánh giá đã được gửi!');
      setHasReviewed(true);
      setIsRatingModalVisible(false);
      const reviewsResponse = await axios.get(
        `http://localhost:8080/api/reviews/by-tour/${bookingDetail.tour?.tourId || state.id}?page=${currentPage - 1}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviewsResponse.data.content || []);
      setTotalReviews(reviewsResponse.data.totalElements || 0);
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      message.error(
        error.response?.status === 403
          ? 'Bạn không có quyền đánh giá'
          : 'Không thể gửi đánh giá'
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const handleShowCancelModal = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.post(
        `http://localhost:8080/api/bookings/calculate-cancellation-fee/${state.id}`,
        { cancelDate: new Date().toISOString(), isHoliday: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCancellationInfo({
        cancellationFee: response.data.cancellationFee,
        refundAmount: response.data.refundAmount,
      });
      setIsCancelModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hủy:', error);
      message.error(
        error.response?.status === 403
          ? error.response.data.error || 'Không thể hủy tour'
          : 'Không thể lấy thông tin hủy'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelConfirm = async (reason) => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      await axios.put(
        `http://localhost:8080/api/bookings/cancel/${state.id}`,
        { reason, cancelDate: new Date().toISOString(), isHoliday: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingDetail((prev) => ({ ...prev, status: 'CANCELED' }));
      setIsCancelModalVisible(false);
      message.success('Tour đã được hủy!');
      const historyResponse = await axios.get(
        `http://localhost:8080/api/bookings/history/${state.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(historyResponse.data);
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error);
      message.error(
        error.response?.status === 403
          ? error.response.data.error || 'Không thể hủy tour'
          : 'Không thể hủy tour'
      );
    } finally {
      setCancelLoading(false);
      setCancellationInfo(null);
    }
  };

  const showPaymentModal = () => {
    setIsPaymentModalVisible(true);
  };

  const handlePayment = async () => {
    if (!state.id || !bookingDetail || !bookingDetail.totalPrice) {
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
        { bookingId: state.id, totalPrice: bookingDetail.totalPrice, paymentMethod },
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!bookingDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ExclamationCircleOutlined className="text-5xl text-red-500 mb-4" />
        <Text className="text-lg font-semibold text-gray-800 mb-4">Không Tìm Thấy Tour</Text>
        <Button
          type="primary"
          className="h-10 rounded-md bg-blue-600"
          onClick={() => navigate('/orders')}
        >
          Quay Về Danh Sách
        </Button>
      </div>
    );
  }

  const tour = bookingDetail.tour || {};

  return (
    <div className="min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 w-screen">
         <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className=" lg:top-4 lg:left-14 rounded-full bg-white/90 text-blue-600 h-10 w-10 flex items-center justify-center shadow-lg hover:bg-white m-2"
          />
      <div className="max-w-6xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-72 sm:h-96 rounded-xl overflow-hidden shadow-xl"
        >
          
          <img
            src={tour.imageURL || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
        
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
         
          <div className="absolute bottom-6 left-6 right-6">
            <Title level={2} className="text-white font-bold">
              <span className="text-white font-bold text-4xl">{tour.name || 'Chuyến Đi'}</span>
            </Title>
            <Text className="text-white/90">
              <span className="text-white">{tour.location || 'N/A'}</span>
            </Text>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card
              title={<Title level={4} className="text-blue-700">Thông Tin Đặt Tour</Title>}
              className="rounded-xl shadow-md border-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Text className="text-sm text-gray-600">
                    <span className="font-semibold">Ngày đặt:</span>{' '}
                    {formatDate(bookingDetail.bookingDate)}
                  </Text>
                  <Text className="text-sm text-gray-600 block mt-3">
                    <span className="font-semibold">Ngày khởi hành:</span>{' '}
                    {formatDate(bookingDetail.departureDate)}
                  </Text>
                  <Text className="text-sm text-gray-600 block mt-3">
                    <span className="font-semibold">Số người:</span>{' '}
                    {bookingDetail.numberPeople || 'N/A'}
                  </Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-600">
                    <span className="font-semibold">Trạng thái:</span>{' '}
                    <Tag
                      color={
                        bookingDetail.status === 'PAID'
                          ? 'green'
                          : bookingDetail.status === 'CANCELED'
                          ? 'red'
                          : bookingDetail.status === 'COMPLETED'
                          ? 'blue'
                          : 'yellow'
                      }
                    >
                      {bookingDetail.status || 'PENDING'}
                    </Tag>
                  </Text>
                  <Text className="text-sm text-gray-600 block mt-3">
                    <span className="font-semibold">Tổng giá:</span>{' '}
                    {bookingDetail.totalPrice
                      ? `${bookingDetail.totalPrice.toLocaleString('vi-VN')} VND`
                      : 'N/A'}
                  </Text>
                  <Text className="text-sm text-gray-600 block mt-3">
                    <span className="font-semibold">Danh mục:</span>{' '}
                    {tour.tourCategory?.categoryName || 'N/A'}
                  </Text>
                </div>
              </div>
              <Text className="text-sm text-gray-600 block mt-6">
                <EnvironmentOutlined className="text-blue-600 mr-2" />
                <span className="font-semibold">Địa điểm:</span> {tour.location || 'N/A'}
              </Text>
            </Card>

            {(tour.description || tour.highlights || tour.experiences) && (
              <Card
                title={<Title level={4} className="text-blue-700">Mô Tả Tour</Title>}
                className="rounded-xl shadow-md border-0"
              >
                {tour.description && (
                  <div>
                    <Text strong className="text-sm text-gray-700">Tổng quan</Text>
                    <Text className="text-sm text-gray-600 block mt-2">{tour.description}</Text>
                  </div>
                )}
                {tour.highlights && (
                  <div className="mt-4">
                    <Text strong className="text-sm text-gray-700">Điểm nhấn</Text>
                    <Text className="text-sm text-gray-600 block mt-2">{tour.highlights}</Text>
                  </div>
                )}
                {tour.experiences && (
                  <div className="mt-4">
                    <Text strong className="text-sm text-gray-700">Trải nghiệm</Text>
                    <Text className="text-sm text-gray-600 block mt-2">{tour.experiences}</Text>
                  </div>
                )}
              </Card>
            )}

            {tour.tourDetails?.length > 0 && (
              <Card
                title={<Title level={4} className="text-blue-700">Chi Tiết Tour</Title>}
                className="rounded-xl shadow-md border-0"
              >
                {tour.tourDetails.map((detail, index) => (
                  <div key={index} className="space-y-3">
                    <Text className="text-sm text-gray-600">
                      <span className="font-semibold">Thời gian:</span>{' '}
                      {detail.startDate && detail.endDate
                        ? `${formatDate(detail.startDate)} - ${formatDate(detail.endDate)}`
                        : 'N/A'}
                    </Text>
                    {detail.includedServices && (
                      <Text className="text-sm text-gray-600 block">
                        <span className="font-semibold">Dịch vụ bao gồm:</span>{' '}
                        {detail.includedServices}
                      </Text>
                    )}
                    {detail.excludedServices && (
                      <Text className="text-sm text-gray-600 block">
                        <span className="font-semibold">Không bao gồm:</span>{' '}
                        {detail.excludedServices}
                      </Text>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {tour.tourSchedules?.length > 0 && (
              <Card
                title={<Title level={4} className="text-blue-700">Lịch Trình</Title>}
                className="rounded-xl shadow-md border-0"
              >
                <Collapse
                  bordered={false}
                  expandIconPosition="end"
                  items={tour.tourSchedules.map((schedule, index) => ({
                    key: index,
                    label: (
                      <Text strong className="text-sm text-gray-700">{`Ngày ${schedule.dayNumber}: ${schedule.location}`}</Text>
                    ),
                    children: (
                      <div className="space-y-2">
                        <Text className="text-sm text-gray-600">
                          <span className="font-semibold">Phương tiện:</span>{' '}
                          {schedule.stransport || 'N/A'}
                        </Text>
                        <Text className="text-sm text-gray-600 block">
                          <span className="font-semibold">Hoạt động:</span>{' '}
                          {schedule.activities || 'N/A'}
                        </Text>
                      </div>
                    ),
                  }))}
                />
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="rounded-xl shadow-md border-0">
              <div className="flex flex-col gap-4">
                <Button
                  type="primary"
                  className="h-10 rounded-md bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsRatingModalVisible(true)}
                  disabled={bookingDetail.status !== 'COMPLETED' || hasReviewed}
                >
                  Đánh Giá
                </Button>
                <Button
                  className="h-10 rounded-md border-red-600 text-red-600 hover:bg-red-50"
                  onClick={handleShowCancelModal}
                  disabled={bookingDetail.status !== 'CONFIRMED' && bookingDetail.status !== 'PAID'}
                  loading={cancelLoading}
                >
                  Hủy Tour
                </Button>
                <Button
                  type="primary"
                  className="h-10 rounded-md bg-green-600 hover:bg-green-700"
                  onClick={showPaymentModal}
                  disabled={bookingDetail.status !== 'CONFIRMED'}
                  loading={paymentLoading}
                >
                  Thanh toán
                </Button>
              </div>
            </Card>

            <Card
              title={<Title level={4} className="text-blue-700">Tiến Trình</Title>}
              className="rounded-xl shadow-md border-0"
            >
              <Timeline
                items={
                  history.length > 0
                    ? history.map((item) => ({
                        key: item.id,
                        color:
                          item.newStatus === 'CANCELED'
                            ? 'red'
                            : item.newStatus === 'PAID' || item.newStatus === 'COMPLETED'
                            ? 'green'
                            : 'blue',
                        children: (
                          <>
                            <Text className="text-sm font-semibold text-gray-700">
                              {item.newStatus === 'CANCELED'
                                ? 'Hủy Tour'
                                : `Chuyển sang ${item.newStatus}`}
                            </Text>
                            <Text className="text-xs text-gray-500 block">
                              {formatDate(item.changeDate, 'dd/MM/yyyy HH:mm')}
                            </Text>
                            {item.reason && (
                              <Text className="text-xs text-gray-500 block">Lý do: {item.reason}</Text>
                            )}
                          </>
                        ),
                      }))
                    : [
                        {
                          color: 'blue',
                          children: (
                            <>
                              <Text className="text-sm font-semibold text-gray-700">Đặt Tour</Text>
                              <Text className="text-xs text-gray-500 block">
                                {formatDate(bookingDetail.bookingDate)}
                              </Text>
                            </>
                          ),
                        },
                        {
                          color: bookingDetail.status === 'PAID' ? 'green' : 'gray',
                          children: (
                            <>
                              <Text className="text-sm font-semibold text-gray-700">Thanh Toán</Text>
                              <Text className="text-xs text-gray-500 block">
                                {bookingDetail.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                              </Text>
                            </>
                          ),
                        },
                        {
                          color: bookingDetail.status === 'COMPLETED' ? 'green' : 'gray',
                          children: (
                            <>
                              <Text className="text-sm font-semibold text-gray-700">Hoàn Thành</Text>
                              <Text className="text-xs text-gray-500 block">
                                {bookingDetail.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                              </Text>
                            </>
                          ),
                        },
                      ]
                }
              />
            </Card>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-8">
            <Card
              title={<Title level={4} className="text-blue-700">Đánh Giá</Title>}
              className="rounded-xl shadow-md border-0"
            >
              <List
                dataSource={reviews}
                renderItem={(review) => (
                  <List.Item className="border-b last:border-b-0 py-4">
                    <List.Item.Meta
                      avatar={<Avatar src={review.avatarUrl} size={36} />}
                      title={
                        <div className="flex items-center gap-3">
                          <Text strong className="text-sm text-gray-700">
                            {review.customerFullName}
                          </Text>
                          <Rate
                            disabled
                            allowHalf
                            value={review.rating}
                            character={<StarFilled className="text-yellow-400 text-xs" />}
                          />
                        </div>
                      }
                      description={
                        <>
                          <Text className="text-sm text-gray-600">{review.comment}</Text>
                          <Text className="text-xs text-gray-500 block mt-1">
                            {formatDate(review.reviewDate)}
                          </Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalReviews}
                onChange={(page) => setCurrentPage(page)}
                className="mt-6 text-center"
                showSizeChanger={false}
              />
            </Card>
          </div>
        )}

        <div className="mt-8">
          <Title level={4} className="text-blue-700 mb-4">Tour Tương Tự</Title>
          {similarToursLoading ? (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          ) : similarTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTours.map((similarTour) => (
                <ItemTourBestForYou key={similarTour.tourId} tour={similarTour} />
              ))}
            </div>
          ) : (
            <Text className="text-sm text-gray-600">Không có tour tương tự nào.</Text>
          )}
        </div>
      </div>

      <RatingModal
        open={isRatingModalVisible}
        onCancel={() => setIsRatingModalVisible(false)}
        onConfirm={handleRatingConfirm}
        loading={ratingLoading}
      />
      <CancelModal
        open={isCancelModalVisible}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setCancellationInfo(null);
        }}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
        cancellationInfo={cancellationInfo}
      />
      <Modal
        title={<Title level={4} className="text-green-600">Xác nhận thanh toán</Title>}
        open={isPaymentModalVisible}
        onOk={handlePayment}
        onCancel={() => setIsPaymentModalVisible(false)}
        okText="Thanh toán"
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-green-600 hover:bg-green-700 rounded-md h-10', loading: paymentLoading }}
        cancelButtonProps={{ className: 'rounded-md h-10' }}
        centered
        className="rounded-xl"
      >
        <Text className="text-sm text-gray-600">Bạn sắp thanh toán cho tour:</Text>
        <Text className="text-sm font-semibold text-gray-700 block mt-2">{tour.name}</Text>
        <Text className="text-sm text-gray-600 block mt-2">
          Tổng giá:{' '}
          <span className="font-semibold">
            {bookingDetail.totalPrice ? bookingDetail.totalPrice.toLocaleString('vi-VN') : 'N/A'} VND
          </span>
        </Text>
        <Text className="text-sm text-gray-600 block mt-2">
          Bạn có chắc chắn muốn tiếp tục không?
        </Text>
      </Modal>
    </div>
  );
};

export default BookingDetail;