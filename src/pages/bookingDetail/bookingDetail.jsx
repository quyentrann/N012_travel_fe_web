import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
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
  DatePicker,
} from 'antd';
import axios from 'axios';
import {
  ArrowLeftOutlined,
  StarFilled,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const formatDate = (dateString, formatPattern = 'dd/MM/yyyy') => {
  try {
    return dateString
      ? format(parseISO(dateString), formatPattern, { locale: vi })
      : 'N/A';
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
    const response = await axios.get(
      `http://18.138.107.49:8080/api/tours/${tourId}/similar`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

  return (
    <Modal
      title={
        <Title level={4} className="text-blue-700">
          Đánh Giá Chuyến Đi
        </Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      className="rounded-xl">
      <div className="space-y-6">
        <div>
          <Text className="text-sm font-medium text-gray-700">
            Chất lượng tour
          </Text>
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
            disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            className="flex-1 h-10 rounded-md bg-blue-600 hover:bg-blue-700"
            loading={loading}>
            Gửi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const CancelModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
  cancellationInfo,
}) => {
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
      title={
        <Title level={4} className="text-red-600">
          Hủy Tour
        </Title>
      }
      open={open}
      onOk={handleConfirm}
      onCancel={onCancel}
      okText="Xác Nhận Hủy"
      cancelText="Quay Lại"
      okButtonProps={{
        className: 'bg-red-600 hover:bg-red-700 rounded-md h-10',
        loading: loading,
        disabled: loading, // Vô hiệu hóa nút khi đang tải
      }}
      cancelButtonProps={{ className: 'rounded-md h-10', disabled: loading }}
      confirmLoading={loading}
      centered
      className="rounded-xl">
      {cancellationInfo ? (
        <div className="space-y-4">
          <Text className="text-sm text-gray-600">
            Bạn sắp hủy tour. Thông tin chi tiết:
          </Text>
          <div className="bg-gray-50 p-4 rounded-md">
            <Text className="text-sm text-gray-600">
              Phí hủy:{' '}
              <span className="font-semibold text-red-600">
                {cancellationInfo.cancellationFee > 0
                  ? `${cancellationInfo.cancellationFee.toLocaleString(
                      'vi-VN'
                    )} VND`
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
  const [isRebookModalVisible, setIsRebookModalVisible] = useState(false);
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
  const [rebookLoading, setRebookLoading] = useState(false);
  const [cancellationInfo, setCancellationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [cancelReason, setCancelReason] = useState(null); // Thêm state cho lý do hủy
  const pageSize = 5;
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [rebookAdults, setRebookAdults] = useState(1);
  const [rebookChildren, setRebookChildren] = useState(0);
  const [rebookInfants, setRebookInfants] = useState(0);
  const [rebookDepartureDate, setRebookDepartureDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [isRebookFormValid, setIsRebookFormValid] = useState(false);

  const holidays = [
    '01-01',
    '03-08',
    '04-30',
    '05-01',
    '09-02',
    '12-25',
    '11-20',
    '07-27',
    '08-19',
    '10-10',
    '09-15',
    '12-23',
  ];

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
          axios.get(`http://18.138.107.49:8080/api/bookings/${state.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log('Booking response:', bookingResponse.data);
        setBookingDetail(bookingResponse.data);

        const tourId = bookingResponse.data.tour?.tourId;
        if (tourId) {
          const tourResponse = await axios.get(
            `http://18.138.107.49:8080/api/tours/${tourId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (
            tourResponse.data.tourDetails &&
            tourResponse.data.tourDetails.length > 0
          ) {
            const startDates = tourResponse.data.tourDetails.map((tour) =>
              dayjs(tour.startDate).startOf('day')
            );
            setAvailableDates(startDates);
            console.log('Available Dates:', startDates);
          } else {
            console.warn(
              'No tour details or start dates available for tour:',
              tourId
            );
            setAvailableDates([]);
            message.warning('Tour này hiện không có ngày khởi hành khả dụng.');
          }
        }

        const [historyResponse, reviewsResponse, reviewCheckResponse] =
          await Promise.all([
            axios
              .get(
                `http://18.138.107.49:8080/api/bookings/history/${state.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .catch((error) => {
                console.error(
                  'History API error:',
                  error.response || error.message
                );
                return { data: [] };
              }),
            axios
              .get(
                `http://18.138.107.49:8080/api/reviews/by-tour/${
                  tourId || state.id
                }?page=${currentPage - 1}&size=${pageSize}`,
                { headers: { Authorization: `Bearer ${token}` } }
              )
              .catch(() => ({ data: { content: [], totalElements: 0 } })),
            axios
              .get(
                `http://18.138.107.49:8080/api/reviews/by-booking/${state.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .catch(() => ({ data: false })),
          ]);

        console.log('History response data:', historyResponse.data);
        const historyData = Array.isArray(historyResponse.data)
          ? historyResponse.data
          : historyResponse.data?.content || [];
        setHistory(historyData);

        // Tìm lý do hủy
        const cancelHistory = historyData.find(
          (item) => item.newStatus === 'CANCELED'
        );
        setCancelReason(cancelHistory?.reason || null);

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
        if (error.response?.status === 401) {
          message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
          localStorage.removeItem('TOKEN');
          navigate('/login');
        } else if (error.response?.status === 403) {
          message.error(
            error.response?.data?.error ||
              'Bạn không có quyền truy cập dữ liệu này.'
          );
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
        `http://18.138.107.49:8080/api/reviews`,
        { bookingId: state.id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Đánh giá đã được gửi!');
      setHasReviewed(true);
      setIsRatingModalVisible(false);
      const reviewsResponse = await axios.get(
        `http://18.138.107.49:8080/api/reviews/by-tour/${
          bookingDetail.tour?.tourId || state.id
        }?page=${currentPage - 1}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(reviewsResponse.data.content || []);
      setTotalReviews(reviewsResponse.data.totalElements || 0);
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (error.response?.status === 403) {
        message.error(
          error.response?.data?.error || 'Bạn không có quyền đánh giá.'
        );
      } else {
        message.error('Không thể gửi đánh giá.');
      }
    } finally {
      setRatingLoading(false);
    }
  };

  const handleShowCancelModal = async () => {
    if (
      bookingDetail.status !== 'CONFIRMED' &&
      bookingDetail.status !== 'PAID'
    ) {
      message.error('Tour không thể hủy với trạng thái hiện tại!');
      return;
    }
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await axios.post(
        `http://18.138.107.49:8080/api/bookings/calculate-cancellation-fee/${state.id}`,
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
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (error.response?.status === 403) {
        message.error(
          error.response?.data?.error || 'Bạn không có quyền hủy tour.'
        );
      } else {
        message.error('Không thể lấy thông tin hủy.');
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCancelConfirm = async (reason) => {
    if (bookingDetail.status === 'CANCELED') {
      message.warning('Tour đã được hủy trước đó!');
      setIsCancelModalVisible(false);
      return;
    }
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      // Gọi API hủy tour
      await axios.put(
        `http://18.138.107.49:8080/api/bookings/cancel/${state.id}`,
        { reason, cancelDate: new Date().toISOString(), isHoliday: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Lấy lại thông tin booking mới nhất
      const bookingResponse = await axios.get(
        `http://18.138.107.49:8080/api/bookings/${state.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedBooking = bookingResponse.data;
      setBookingDetail(updatedBooking);
      setIsCancelModalVisible(false);
      message.success('Tour đã được hủy!');

      // Kiểm tra trạng thái booking trước khi gọi API lịch sử
      if (updatedBooking.status === 'CANCELED') {
        try {
          const historyResponse = await axios.get(
            `http://18.138.107.49:8080/api/bookings/history/${state.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const historyData = Array.isArray(historyResponse.data)
            ? historyResponse.data
            : historyResponse.data?.content || [];
          setHistory(historyData);
          const cancelHistory = historyData.find(
            (item) => item.newStatus === 'CANCELED'
          );
          setCancelReason(cancelHistory?.reason || null);
        } catch (historyError) {
          console.error('Lỗi khi lấy lịch sử booking:', historyError);
          // message.warning('Không thể lấy lịch sử booking, nhưng tour đã được hủy thành công.');
        }
      } else {
        console.warn(
          'Booking không ở trạng thái CANCELED sau khi hủy:',
          updatedBooking.status
        );
        // message.warning('Tour đã được hủy, nhưng trạng thái không được cập nhật đúng.');
      }
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (error.response?.status === 403) {
        message.error(
          error.response?.data?.error || 'Bạn không có quyền hủy tour.'
        );
      } else {
        message.error('Không thể hủy tour.');
      }
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
        'http://18.138.107.49:8080/api/payment/vnpay-create',
        {
          bookingId: state.id,
          totalPrice: bookingDetail.totalPrice,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.paymentUrl) {
        const newWindow = window.open(response.data.paymentUrl, '_blank');
        if (!newWindow) {
          message.warning(
            'Trình duyệt chặn tab thanh toán. Vui lòng cho phép popup.'
          );
        }
        setIsPaymentModalVisible(false);
      } else {
        message.error(
          response.data.error || 'Không thể tạo liên kết thanh toán!'
        );
      }
    } catch (error) {
      message.error('Lỗi khi tạo thanh toán!');
    } finally {
      setPaymentLoading(false);
    }
  };

  const disabledDate = (date) => {
    const isAvailable = availableDates.some((d) =>
      d.isSame(dayjs(date), 'day')
    );
    const isBeforeLimit = dayjs(date).diff(dayjs(), 'day') < 7;
    return !isAvailable || isBeforeLimit;
  };

  const increase = (setter, currentValue, maxValue) => {
    const currentTotal = rebookAdults + rebookChildren + rebookInfants;
    if (currentTotal + 1 <= maxValue) {
      setter((prev) => parseInt(prev, 10) + 1);
      validateRebookForm(
        setter === setRebookAdults
          ? parseInt(currentValue, 10) + 1
          : rebookAdults,
        setter === setRebookChildren
          ? parseInt(currentValue, 10) + 1
          : rebookChildren,
        setter === setRebookInfants
          ? parseInt(currentValue, 10) + 1
          : rebookInfants,
        rebookDepartureDate
      );
    } else {
      message.warning(`Tour này chỉ còn ${maxValue} chỗ`);
    }
  };

  const decrease = (setter, min) => {
    setter((prev) => {
      const newValue = parseInt(prev, 10) - 1;
      if (newValue >= min) {
        validateRebookForm(
          setter === setRebookAdults ? newValue : rebookAdults,
          setter === setRebookChildren ? newValue : rebookChildren,
          setter === setRebookInfants ? newValue : rebookInfants,
          rebookDepartureDate
        );
        return newValue;
      }
      return prev;
    });
  };

  const validateRebookForm = (adults, children, infants, departureDate) => {
    const total =
      parseInt(adults, 10) + parseInt(children, 10) + parseInt(infants, 10);
    const isValid =
      total > 0 &&
      parseInt(adults, 10) >= 1 &&
      !!departureDate &&
      !isNaN(total);
    setIsRebookFormValid(isValid);
  };

  const calculateRebookPrice = (tourPrice) => {
    if (!rebookDepartureDate) return 0;
    const holidayRate = holidays.includes(
      format(new Date(rebookDepartureDate), 'MM-dd')
    )
      ? 1.2
      : 1;
    const adultPrice = tourPrice * holidayRate;
    const childPrice = tourPrice * 0.85 * holidayRate;
    const infantPrice = tourPrice * 0.3 * holidayRate;
    return (
      adultPrice * rebookAdults +
      childPrice * rebookChildren +
      infantPrice * rebookInfants
    );
  };

  const handleRebook = async () => {
    if (!bookingDetail || !bookingDetail.tour?.tourId) {
      message.error('Thông tin tour không đầy đủ để đặt lại!');
      console.error('Missing booking details:', { bookingDetail });
      return;
    }

    setRebookLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) {
        message.error('Vui lòng đăng nhập để đặt lại tour');
        navigate('/login');
        return;
      }

      const userResponse = await axios.get(
        'http://18.138.107.49:8080/api/users/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userRoles =
        userResponse.data.roles || userResponse.data.authorities || [];
      if (!userRoles.some((role) => role.authority === 'CUSTOMER')) {
        message.error('Tài khoản của bạn không có quyền đặt tour.');
        return;
      }

      const tourResponse = await axios.get(
        `http://18.138.107.49:8080/api/tours/${bookingDetail.tour.tourId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isActive =
        tourResponse.data.isActive ??
        tourResponse.data.active ??
        tourResponse.data.status === 'ACTIVE';
      if (!isActive) {
        message.error('Tour không còn khả dụng để đặt!');
        return;
      }

      const adults = Math.max(0, Math.floor(parseInt(rebookAdults, 10) || 0));
      const children = Math.max(
        0,
        Math.floor(parseInt(rebookChildren, 10) || 0)
      );
      const infants = Math.max(0, Math.floor(parseInt(rebookInfants, 10) || 0));
      const totalPeople = adults + children + infants;

      console.log('Parsed Values:', { adults, children, infants, totalPeople });

      if (adults < 1) {
        message.error('Vui lòng chọn ít nhất một người lớn!');
        return;
      }

      if (
        tourResponse.data.availableSlot === undefined ||
        tourResponse.data.availableSlot < totalPeople
      ) {
        message.error(
          `Tour chỉ còn ${
            tourResponse.data.availableSlot || 0
          } chỗ, không đủ cho ${totalPeople} người!`
        );
        return;
      }

      if (totalPeople <= 0) {
        message.error('Vui lòng chọn ít nhất một người tham gia!');
        return;
      }

      if (!rebookDepartureDate) {
        message.error('Vui lòng chọn ngày khởi hành!');
        return;
      }

      let formattedDate;
      try {
        formattedDate = dayjs(rebookDepartureDate).format('YYYY-MM-DD');
      } catch (error) {
        console.error('Invalid departureDate:', rebookDepartureDate);
        message.error('Ngày khởi hành không hợp lệ!');
        return;
      }

      const isValidDate = availableDates.some((d) =>
        d.isSame(dayjs(formattedDate), 'day')
      );
      if (!isValidDate) {
        message.error('Ngày khởi hành không khả dụng cho tour này!');
        return;
      }

      const totalPrice = calculateRebookPrice(tourResponse.data.price);
      const discountRate = totalPeople >= 5 ? 0.1 : 0;
      const discountAmount = totalPrice * discountRate;
      const finalPrice = totalPrice - discountAmount;

      const payload = {
        tourId: bookingDetail.tour.tourId,
        numberPeople: totalPeople,
        numberAdults: adults,
        numberChildren: children,
        numberInfants: infants,
        totalPrice: finalPrice,
        fullName: userResponse.data.customer?.fullName || 'Unknown',
        phoneNumber: userResponse.data.customer?.phoneNumber || 'Unknown',
        email: userResponse.data.customer?.email || 'Unknown',
        departureDate: formattedDate,
        notes: '',
      };
      console.log('Booking Payload:', payload);

      const response = await axios.post(
        'http://18.138.107.49:8080/api/bookings/book',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      message.success('Đặt tour lại thành công!');
      setIsRebookModalVisible(false);
      navigate(`/booking-detail`, {
        state: { id: response.data.bookingId || response.data.id },
      });
    } catch (error) {
      console.error('Lỗi khi đặt lại tour:', error.response || error.message);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (error.response?.status === 403) {
        message.error('Bạn không có quyền đặt lại tour.');
      } else if (error.response?.status === 400) {
        message.error(
          error.response?.data?.message ||
            'Dữ liệu không hợp lệ, vui lòng kiểm tra lại.'
        );
        console.error('Backend Error Details:', error.response?.data);
      } else if (error.response?.status === 404) {
        message.error('Tour không tồn tại hoặc không khả dụng.');
      } else {
        message.error('Không thể đặt lại tour, vui lòng thử lại sau!');
      }
    } finally {
      setRebookLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 w-screen">
        <Header />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-15 mb-7">
            <Skeleton.Button
              active
              shape="circle"
              size="large"
              className="h-10 w-10"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-72 sm:h-96 rounded-xl overflow-hidden shadow-xl">
            <Skeleton.Image active className="w-full h-full" />
          </motion.div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-xl shadow-md border-0">
                <Skeleton active title={false} paragraph={{ rows: 4 }} />
              </Card>
              <Card className="rounded-xl shadow-md border-0">
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              </Card>
              <Card className="rounded-xl shadow-md border-0">
                <Skeleton active title={false} paragraph={{ rows: 2 }} />
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="rounded-xl shadow-md border-0">
                <Skeleton.Button active block className="h-10 mb-2" />
                <Skeleton.Button active block className="h-10 mb-2" />
                <Skeleton.Button active block className="h-10 mb-2" />
                <Skeleton.Button active block className="h-10" />
              </Card>
              <Card className="rounded-xl shadow-md border-0">
                <Skeleton active title={false} paragraph={{ rows: 3 }} />
              </Card>
            </div>
          </div>
          <div className="mt-8">
            <Card className="rounded-xl shadow-md border-0">
              <Skeleton active title={false} paragraph={{ rows: 5 }} />
            </Card>
          </div>
          <div className="mt-8">
            <Skeleton active title paragraph={{ rows: 0 }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
              <Skeleton active avatar paragraph={{ rows: 2 }} />
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bookingDetail) {
    return (
      <div className="min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8 w-screen">
        <Header />
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <ExclamationCircleOutlined className="text-5xl text-red-500 mb-4" />
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Không Tìm Thấy Tour
          </Text>
          <Button
            type="primary"
            className="h-10 rounded-md bg-blue-600"
            onClick={() => navigate('/orders')}>
            Quay Về Danh Sách
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tour = bookingDetail.tour || {};
  const canRebook =
    bookingDetail.status === 'COMPLETED' || bookingDetail.status === 'CANCELED';

  const selectedTourDetail =
    tour.tourDetails?.find((detail) =>
      dayjs(detail.startDate).isSame(dayjs(bookingDetail.departureDate), 'day')
    ) || tour.tourDetails?.[0];

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      <Header />
      <div className="max-w-6xl mx-auto">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="lg:top-4 rounded-full bg-white/90 text-blue-600 h-10 w-10 flex items-center justify-center shadow-lg hover:bg-white mt-15 mb-7"
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-72 sm:h-96 rounded-xl overflow-hidden shadow-xl">
          <img
            src={
              tour.imageURL ||
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
            }
            alt={tour.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Title level={2} className="text-white font-bold">
              <span className="text-white font-bold text-4xl">
                {tour.name || 'Chuyến Đi'}
              </span>
            </Title>
            <Text className="text-white/90">
              <span className="text-white">{tour.location || 'N/A'}</span>
            </Text>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card
              title={
                <Title level={4} className="text-blue-700">
                  Thông Tin Đặt Tour
                </Title>
              }
              className="rounded-xl shadow-md border-0">
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
                      }>
                      {bookingDetail.status || 'PENDING'}
                    </Tag>
                  </Text>
                  <Text className="text-sm text-gray-600 block mt-3">
                    <span className="font-semibold">Tổng giá:</span>{' '}
                    {bookingDetail.totalPrice
                      ? `${bookingDetail.totalPrice.toLocaleString(
                          'vi-VN'
                        )} VND`
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
                <span className="font-semibold">Địa điểm:</span>{' '}
                {tour.location || 'N/A'}
                {bookingDetail.status === 'CANCELED' && cancelReason && (
                  <>
                    {' | '}
                    <span className="font-semibold">Lý do hủy:</span>{' '}
                    {cancelReason}
                  </>
                )}
              </Text>
            </Card>

            {(tour.description || tour.highlights || tour.experiences) && (
              <Card
                title={
                  <Title level={4} className="text-blue-700">
                    Mô Tả Tour
                  </Title>
                }
                className="rounded-xl shadow-md border-0">
                {tour.description && (
                  <div>
                    <Text strong className="text-sm text-gray-700">
                      Tổng quan
                    </Text>
                    <Text className="text-sm text-gray-600 block mt-2">
                      {tour.description}
                    </Text>
                  </div>
                )}
                {tour.highlights && (
                  <div className="mt-4">
                    <Text strong className="text-sm text-gray-700">
                      Điểm nhấn
                    </Text>
                    <Text className="text-sm text-gray-600 block mt-2">
                      {tour.highlights}
                    </Text>
                  </div>
                )}
                {tour.experiences && (
                  <div className="mt-4">
                    <Text strong className="text-sm text-gray-700">
                      Trải nghiệm
                    </Text>
                    <Text className="text-sm text-gray-600 block mt-2">
                      {tour.experiences}
                    </Text>
                  </div>
                )}
              </Card>
            )}

            {selectedTourDetail && (
              <Card
                title={
                  <Title level={4} className="text-blue-700">
                    Chi Tiết Tour
                  </Title>
                }
                className="rounded-xl shadow-md border-0">
                <div className="space-y-3">
                  <Text className="text-sm text-gray-600">
                    <span className="font-semibold">Ngày khởi hành:</span>{' '}
                    {formatDate(bookingDetail.departureDate)}
                  </Text>
                  {selectedTourDetail.includedServices && (
                    <Text className="text-sm text-gray-600 block">
                      <span className="font-semibold">Dịch vụ bao gồm:</span>{' '}
                      {selectedTourDetail.includedServices}
                    </Text>
                  )}
                  {selectedTourDetail.excludedServices && (
                    <Text className="text-sm text-gray-600 block">
                      <span className="font-semibold">Không bao gồm:</span>{' '}
                      {selectedTourDetail.excludedServices}
                    </Text>
                  )}
                </div>
              </Card>
            )}

            {tour.tourSchedules?.length > 0 && (
              <Card
                title={
                  <Title level={4} className="text-blue-700">
                    Lịch Trình
                  </Title>
                }
                className="rounded-xl shadow-md border-0">
                <Collapse
                  bordered={false}
                  expandIconPosition="end"
                  items={tour.tourSchedules.map((schedule, index) => ({
                    key: index,
                    label: (
                      <Text
                        strong
                        className="text-sm text-gray-700">{`Ngày ${schedule.dayNumber}: ${schedule.location}`}</Text>
                    ),
                    children: (
                      <div className="space-y-2">
                        <Text className="text-sm text-gray-600">
                          <span className="font-semibold">Phương tiện:</span>{' '}
                          {schedule.transport || 'N/A'}
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
                  disabled={
                    bookingDetail.status !== 'COMPLETED' || hasReviewed
                  }>
                  Đánh Giá
                </Button>
                <Button
                  className="h-10 rounded-md border-red-600 text-red-600 hover:bg-red-50"
                  onClick={handleShowCancelModal}
                  disabled={
                    bookingDetail.status !== 'CONFIRMED' &&
                    bookingDetail.status !== 'PAID'
                  }
                  loading={cancelLoading}>
                  Hủy Tour
                </Button>
                <Button
                  type="primary"
                  className="h-10 rounded-md bg-green-600 hover:bg-green-700"
                  onClick={showPaymentModal}
                  disabled={bookingDetail.status !== 'CONFIRMED'}
                  loading={paymentLoading}>
                  Thanh toán
                </Button>
                <Button
                  type="primary"
                  className="h-10 rounded-md bg-orange-600 hover:bg-orange-700"
                  onClick={() => setIsRebookModalVisible(true)}
                  disabled={!canRebook}
                  loading={rebookLoading}>
                  Đặt Lại
                </Button>
              </div>
            </Card>

            <Card
              title={
                <Title level={4} className="text-blue-700">
                  Tiến Trình
                </Title>
              }
              className="rounded-xl shadow-md border-0">
              <Timeline
                items={
                  history.length > 0
                    ? history.map((item) => ({
                        key: item.id,
                        color:
                          item.newStatus === 'CANCELED'
                            ? 'red'
                            : item.newStatus === 'PAID' ||
                              item.newStatus === 'COMPLETED'
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
                              <Text className="text-xs text-gray-500 block">
                                Lý do: {item.reason}
                              </Text>
                            )}
                          </>
                        ),
                      }))
                    : [
                        {
                          color: 'blue',
                          children: (
                            <>
                              <Text className="text-sm font-semibold text-gray-700">
                                Đặt Tour
                              </Text>
                              <Text className="text-xs text-gray-500 block">
                                {formatDate(bookingDetail.bookingDate)}
                              </Text>
                            </>
                          ),
                        },
                        {
                          color:
                            bookingDetail.status === 'PAID' ? 'green' : 'gray',
                          children: (
                            <>
                              <Text className="text-sm font-semibold text-gray-700">
                                Thanh Toán
                              </Text>
                              <Text className="text-xs text-gray-500 block">
                                {bookingDetail.status === 'PAID'
                                  ? 'Đã thanh toán'
                                  : 'Chưa thanh toán'}
                              </Text>
                            </>
                          ),
                        },
                        {
                          color:
                            bookingDetail.status === 'COMPLETED'
                              ? 'green'
                              : 'gray',
                          children: (
                            <>
                              <Text className="text-sm font-semibold text-gray-700">
                                Hoàn Thành
                              </Text>
                              <Text className="text-xs text-gray-500 block">
                                {bookingDetail.status === 'COMPLETED'
                                  ? 'Đã hoàn thành'
                                  : 'Chưa hoàn thành'}
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
              title={
                <Title level={4} className="text-blue-700">
                  Đánh Giá
                </Title>
              }
              className="rounded-xl shadow-md border-0">
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
                            character={
                              <StarFilled className="text-yellow-400 text-xs" />
                            }
                          />
                        </div>
                      }
                      description={
                        <>
                          <Text className="text-sm text-gray-600">
                            {review.comment}
                          </Text>
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
          <Title level={4} className="text-blue-700">
            Tour Tương Tự
          </Title>
          {similarToursLoading ? (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          ) : similarTours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTours.map((similarTour) => (
                <ItemTourBestForYou
                  key={similarTour.tourId}
                  tour={similarTour}
                />
              ))}
            </div>
          ) : (
            <Text className="text-sm text-gray-600">
              Không có tour tương tự nào.
            </Text>
          )}
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
          title={
            <Title level={4} className="text-green-600">
              Xác nhận thanh toán
            </Title>
          }
          open={isPaymentModalVisible}
          onOk={handlePayment}
          onCancel={() => setIsPaymentModalVisible(false)}
          okText="Thanh toán"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-green-600 hover:bg-green-700 rounded-md h-10',
            loading: paymentLoading,
          }}
          cancelButtonProps={{ className: 'rounded-md h-10' }}
          centered
          className="rounded-xl">
          <Text className="text-sm text-gray-600">
            Bạn sắp thanh toán cho tour:
          </Text>
          <Text className="text-sm font-semibold text-gray-700 block mt-2">
            {tour.name}
          </Text>
          <Text className="text-sm text-gray-600">
            Tổng giá:{' '}
            <span className="font-semibold">
              {bookingDetail.totalPrice
                ? bookingDetail.totalPrice.toLocaleString('vi-VN')
                : 'N/A'}{' '}
              VND
            </span>
          </Text>
        </Modal>
        <Modal
          title={
            <Title level={4} className="text-orange-600">
              Đặt Lại Tour
            </Title>
          }
          open={isRebookModalVisible}
          onOk={handleRebook}
          onCancel={() => {
            setIsRebookModalVisible(false);
            setRebookAdults(1);
            setRebookChildren(0);
            setRebookInfants(0);
            setRebookDepartureDate(null);
            setIsRebookFormValid(false);
          }}
          okText="Xác Nhận Đặt Lại"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-orange-600 hover:bg-orange-700 rounded-md h-10',
            loading: rebookLoading,
            disabled: !isRebookFormValid,
          }}
          cancelButtonProps={{ className: 'rounded-md h-10' }}
          centered
          className="rounded-xl">
          <div className="space-y-4">
            <Text className="text-sm text-gray-600">
              Vui lòng chọn số lượng người và ngày khởi hành:
            </Text>
            <div className="bg-white h-12 rounded-lg flex justify-between p-3 items-center text-center border-1 border-gray-300">
              <div className="text-center">
                <Text className="text-[13px] font-medium">Người lớn</Text>
                <Text className="text-[9px] text-gray-700 block">
                  ≥ 10 tuổi
                </Text>
              </div>
              <div className="flex justify-between w-14 text-[12px] font-medium">
                <MinusOutlined
                  className={`cursor-pointer ${
                    rebookAdults <= 1 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={() => decrease(setRebookAdults, 1)}
                />
                <Text>{rebookAdults}</Text>
                <PlusOutlined
                  className="cursor-pointer"
                  onClick={() =>
                    increase(
                      setRebookAdults,
                      rebookAdults,
                      bookingDetail.tour?.availableSlot || 999
                    )
                  }
                />
              </div>
            </div>
            <div className="bg-white h-12 rounded-lg flex justify-between p-3 items-center text-center border-1 border-gray-300">
              <div className="text-center">
                <Text className="text-[13px] font-medium">Trẻ em</Text>
                <Text className="text-[9px] text-gray-700 block">
                  2 - 10 tuổi
                </Text>
              </div>
              <div className="flex justify-between w-14 text-[12px] font-medium">
                <MinusOutlined
                  className={`cursor-pointer ${
                    rebookChildren <= 0 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={() => decrease(setRebookChildren, 0)}
                />
                <Text>{rebookChildren}</Text>
                <PlusOutlined
                  className="cursor-pointer"
                  onClick={() =>
                    increase(
                      setRebookChildren,
                      rebookChildren,
                      bookingDetail.tour?.availableSlot || 999
                    )
                  }
                />
              </div>
            </div>
            <div className="bg-white h-12 rounded-lg flex justify-between p-3 items-center text-center border-1 border-gray-300">
              <div className="text-center">
                <Text className="text-[13px] font-medium">Trẻ nhỏ</Text>
                <Text className="text-[9px] text-gray-700 block"> 2 tuổi</Text>
              </div>
              <div className="flex justify-between w-14 text-[12px] font-medium">
                <MinusOutlined
                  className={`cursor-pointer ${
                    rebookInfants <= 0 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={() => decrease(setRebookInfants, 0)}
                />
                <Text>{rebookInfants}</Text>
                <PlusOutlined
                  className="cursor-pointer"
                  onClick={() =>
                    increase(
                      setRebookInfants,
                      rebookInfants,
                      bookingDetail.tour?.availableSlot || 999
                    )
                  }
                />
              </div>
            </div>
            <div className="flex h-12 items-center border-1 border-gray-300 rounded-[8px] w-full">
              <div className="flex items-center justify-center px-2">
                <CalendarOutlined className="text-gray-500 text-[13px]" />
              </div>
              <DatePicker
                value={rebookDepartureDate ? dayjs(rebookDepartureDate) : null}
                onChange={(date) => {
                  const newDate = date ? date.toDate() : null;
                  setRebookDepartureDate(newDate);
                  validateRebookForm(
                    rebookAdults,
                    rebookChildren,
                    rebookInfants,
                    newDate
                  );
                }}
                placeholder="Chọn ngày khởi hành"
                format="DD/MM/YYYY"
                className="border-none text-[13px] h-8 w-full"
                disabledDate={disabledDate}
              />
            </div>
            <Text className="text-sm text-gray-600">
              Tổng giá:{' '}
              <span className="font-semibold">
                {rebookDepartureDate && bookingDetail.tour?.price
                  ? calculateRebookPrice(
                      bookingDetail.tour.price
                    ).toLocaleString('vi-VN')
                  : 'Vui lòng chọn ngày khởi hành'}{' '}
                {rebookDepartureDate && bookingDetail.tour?.price ? 'VND' : ''}
              </span>
            </Text>
          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDetail;
