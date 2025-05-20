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
  Tabs,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  EyeOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import logo from '../../images/logo.png';
import Footer from '../../components/Footer';
import Header from '../../components/Header1';
import { getTours, calculateChangeFee, changeTour } from '../../apis/tour';
import { calculateChangeFeeThunk, changeTourThunk } from '../../redux/tourSlice';
import axiosInstance from '../../apis/axiosInstance';
import { debounce } from 'lodash';
import axiosRetry from 'axios-retry';

// Thêm retry cho axios
axiosRetry(axiosInstance, { retries: 3, retryDelay: 1000 });

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const statusColors = {
  CONFIRMED: 'gold',
  CANCELED: 'red',
  PAID: 'green',
  COMPLETED: 'blue',
  IN_PROGRESS: 'purple',
  PENDING_PAYMENT: 'orange',
};

const Orders = () => {
  const dispatch = useDispatch();
  const { changeFee, changeTourResult, loading: reduxLoading, error: reduxError } = useSelector(
    (state) => state.tours
  );
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [cancellationInfo, setCancellationInfo] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentInfoLoading, setPaymentInfoLoading] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isAdditionalPaymentModalVisible, setIsAdditionalPaymentModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [additionalPaymentInfo, setAdditionalPaymentInfo] = useState(null);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
  const [changeTourData, setChangeTourData] = useState({
    bookingId: null,
    currentTourName: '',
    departureDate: null,
    numberAdults: 1,
    numberChildren: 0,
    numberInfants: 0,
    maxPeople: Infinity,
    adultPrice: 0,
    childPrice: 0,
    infantPrice: 0,
    totalPrice: 0,
  });
  const [availableDates, setAvailableDates] = useState([]);
  const [changeFeeInfo, setChangeFeeInfo] = useState(null);
  const [changeLoading, setChangeLoading] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);
  const [cachedDates, setCachedDates] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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

  const calculateTotalPrice = (data) => {
    const {
      numberAdults = 0,
      numberChildren = 0,
      numberInfants = 0,
      adultPrice = 0,
      childPrice = 0,
      infantPrice = 0,
      departureDate,
    } = data;

    console.log('calculateTotalPrice inputs:', {
      numberAdults,
      numberChildren,
      numberInfants,
      adultPrice,
      childPrice,
      infantPrice,
      departureDate,
    });

    let totalPrice = numberAdults * adultPrice + numberChildren * childPrice + numberInfants * infantPrice;
    const isHoliday = departureDate ? holidays.includes(dayjs(departureDate).format('MM-DD')) : false;
    totalPrice *= isHoliday ? 1.2 : 1.0;
    const totalPeople = numberAdults + numberChildren + numberInfants;
    if (totalPeople >= 5) {
      totalPrice *= 0.9;
    }
    totalPrice = Math.max(0, Math.round(totalPrice));
    console.log('Calculated totalPrice:', totalPrice);
    return totalPrice;
  };

  const calculateLocalChangeFee = (changeTourData, originalBooking) => {
    if (
      !changeTourData.departureDate ||
      (!changeTourData.numberAdults &&
        !changeTourData.numberChildren &&
        !changeTourData.numberInfants)
    ) {
      return null;
    }

    const totalPeople =
      changeTourData.numberAdults + changeTourData.numberChildren + changeTourData.numberInfants;
    if (totalPeople > changeTourData.maxPeople || totalPeople <= 0) {
      return null;
    }

    const originalPrice = originalBooking?.totalPrice || 0;
    const newTotalPrice = changeTourData.totalPrice || 0;

    if (newTotalPrice === 0) {
      console.warn('newTotalPrice is 0, check calculateTotalPrice inputs');
      return null;
    }

    const daysToDeparture = dayjs(changeTourData.departureDate).diff(dayjs(), 'day');
    const changeFee = daysToDeparture > 7 ? originalPrice * 0.1 : originalPrice * 0.2;
    const priceDifference = newTotalPrice - originalPrice;
    const refundAmount = priceDifference < 0 ? Math.abs(priceDifference) : 0;
    const additionalPayment = priceDifference > 0 ? priceDifference : 0;

    return {
      changeFee: Math.round(changeFee),
      priceDifference: Math.round(priceDifference),
      newTotalPrice: Math.round(newTotalPrice),
      refundAmount: Math.round(refundAmount),
      additionalPayment: Math.round(additionalPayment),
      message: 'Dữ liệu tạm tính, đang xác nhận với hệ thống...',
    };
  };

  const debouncedCalculateChangeFee = debounce(async (changeTourData) => {
    if (
      !changeTourData.departureDate ||
      (!changeTourData.numberAdults &&
        !changeTourData.numberChildren &&
        !changeTourData.numberInfants)
    ) {
      setChangeFeeInfo(null);
      setFeeLoading(false);
      return;
    }

    const totalPeople =
      changeTourData.numberAdults + changeTourData.numberChildren + changeTourData.numberInfants;
    if (totalPeople > changeTourData.maxPeople || totalPeople <= 0) {
      setChangeFeeInfo(null);
      setFeeLoading(false);
      return;
    }

    setFeeLoading(true);
    try {
      const isHoliday = changeTourData.departureDate
        ? holidays.includes(dayjs(changeTourData.departureDate).format('MM-DD'))
        : false;
      const changeRequest = {
        departureDate: dayjs(changeTourData.departureDate).format('YYYY-MM-DD'),
        numberAdults: changeTourData.numberAdults,
        numberChildren: changeTourData.numberChildren,
        numberInfants: changeTourData.numberInfants,
        isHoliday,
        changeDate: new Date().toISOString(),
      };
      const result = await dispatch(
        calculateChangeFeeThunk({ bookingId: changeTourData.bookingId, changeRequest })
      ).unwrap();
      setChangeFeeInfo({
        changeFee: result.changeFee,
        priceDifference: result.priceDifference,
        newTotalPrice: result.newTotalPrice,
        refundAmount: result.refundAmount,
        additionalPayment: result.priceDifference > 0 ? result.priceDifference : 0,
        message: result.message,
      });
    } catch (error) {
      console.error('Error calculating change fee:', error);
      setChangeFeeInfo(null);
    } finally {
      setFeeLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (!isChangeModalVisible || !changeTourData.bookingId) return;

    const totalPrice = calculateTotalPrice(changeTourData);
    setChangeTourData((prev) => ({ ...prev, totalPrice }));

    const originalBooking = history.find((item) => item.key === changeTourData.bookingId);
    const localFeeInfo = calculateLocalChangeFee(changeTourData, originalBooking);
    setChangeFeeInfo(localFeeInfo);

    debouncedCalculateChangeFee(changeTourData);
  }, [
    changeTourData.numberAdults,
    changeTourData.numberChildren,
    changeTourData.numberInfants,
    changeTourData.departureDate,
    changeTourData.bookingId,
    isChangeModalVisible,
    dispatch,
    history,
  ]);

  useEffect(() => {
    if (!isAdditionalPaymentModalVisible) {
      setAdditionalPaymentInfo(null);
      setSelectedBooking(null);
      setPaymentInfoLoading(false);
    }
  }, [isAdditionalPaymentModalVisible]);

  const fetchAvailableDates = async (tourId) => {
    if (cachedDates[tourId]) {
      setAvailableDates(cachedDates[tourId].dates);
      setChangeTourData((prev) => ({
        ...prev,
        maxPeople: cachedDates[tourId].maxPeople,
        adultPrice: cachedDates[tourId].adultPrice,
        childPrice: cachedDates[tourId].childPrice,
        infantPrice: cachedDates[tourId].infantPrice,
      }));
      return;
    }
    try {
      const tours = await getTours();
      const tour = tours.find((t) => t.tourId === tourId);
      if (tour && tour.tourDetails) {
        const validDates = tour.tourDetails
          .map((detail) => detail.startDate)
          .filter((date) => new Date(date) >= new Date());
        const maxPeople = Math.max(
          ...tour.tourDetails.map((detail) => detail.availableSlot || Infinity)
        );
        const { adultPrice = 1000000, childPrice = 500000, infantPrice = 200000 } = tour.tourDetails[0] || {};

        console.log('fetchAvailableDates result:', {
          tourId,
          validDates,
          maxPeople,
          adultPrice,
          childPrice,
          infantPrice,
        });

        setAvailableDates(validDates);
        setCachedDates((prev) => ({
          ...prev,
          [tourId]: { dates: validDates, maxPeople, adultPrice, childPrice, infantPrice },
        }));
        setChangeTourData((prev) => ({
          ...prev,
          maxPeople,
          adultPrice,
          childPrice,
          infantPrice,
          totalPrice: calculateTotalPrice({
            ...prev,
            maxPeople,
            adultPrice,
            childPrice,
            infantPrice,
          }),
        }));
      } else {
        message.error('Không tìm thấy thông tin tour');
        setAvailableDates([]);
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
      message.error('Không thể tải danh sách ngày khởi hành');
      setAvailableDates([]);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem lịch sử đặt tour');
        navigate('/login');
        return;
      }
      const response = await axiosInstance.get('/bookings/history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        console.error('Dữ liệu API không phải mảng:', response.data);
        message.error('Dữ liệu lịch sử booking không hợp lệ');
        setHistory([]);
        return;
      }

      const formattedData = response.data.map((item) => {
        const numberAdults = item.numberAdults !== undefined && item.numberAdults !== null
          ? parseInt(item.numberAdults)
          : 0;
        const numberChildren = item.numberChildren !== undefined && item.numberChildren !== null
          ? parseInt(item.numberChildren)
          : 0;
        const numberInfants = item.numberInfants !== undefined && item.numberInfants !== null
          ? parseInt(item.numberInfants)
          : 0;
        const numberPeople = item.numberPeople !== undefined && item.numberPeople !== null
          ? parseInt(item.numberPeople)
          : (numberAdults + numberChildren + numberInfants);

        return {
          key: item.bookingId,
          tourId: item.tour?.tourId,
          tourImage: item.tour?.imageURL || 'https://via.placeholder.com/80',
          tourName: item.tour?.name || 'Tour không xác định',
          bookingDate: item.bookingDate,
          departureDate: item.departureDate,
          status: item.status || 'PENDING',
          price: item.totalPrice ? item.totalPrice.toLocaleString('vi-VN') + 'đ' : 'N/A',
          numberPeople: numberPeople,
          numberAdults: numberAdults,
          numberChildren: numberChildren,
          numberInfants: numberInfants,
          totalPrice: item.totalPrice,
        };
      });

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

  useEffect(() => {
    fetchHistory();

    const handleFocus = () => fetchHistory();
    const handlePaymentCompleted = (event) => {
      if (event.data.type === 'PAYMENT_COMPLETED') {
        fetchHistory();
        message.success('Thanh toán đã được xử lý, danh sách booking đã được cập nhật.');
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('message', handlePaymentCompleted);

    if (location.state?.refresh) {
      fetchHistory();
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('message', handlePaymentCompleted);
    };
  }, [navigate, location.state]);

  const activeBookings = history.filter((item) =>
    ['CONFIRMED', 'PAID', 'IN_PROGRESS', 'PENDING_PAYMENT'].includes(item.status)
  );
  const pastBookings = history.filter((item) => ['COMPLETED', 'CANCELED'].includes(item.status));

  const showCancelModal = (bookingId) => {
    const booking = history.find((item) => item.key === bookingId);
    if (booking && booking.status === 'CANCELED') {
      message.warning('Tour đã được hủy trước đó!');
      return;
    }
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
      const response = await axiosInstance.post(
        `/bookings/calculate-cancellation-fee/${bookingIdToCancel}`,
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
      message.error(
        error.response?.status === 404
          ? 'Không tìm thấy booking'
          : error.response?.status === 403
          ? error.response.data.error || 'Không thể hủy tour do trạng thái hiện tại'
          : error.response?.status === 400
          ? error.response.data.error || 'Dữ liệu không hợp lệ'
          : 'Không thể lấy thông tin hủy tour'
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      const cancelDate = new Date().toISOString();
      await axiosInstance.put(
        `/bookings/cancel/${bookingIdToCancel}`,
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
          item.key === bookingIdToCancel
            ? { ...item, status: 'CANCELED' }
            : item
        )
      );

      setIsConfirmModalVisible(false);
      message.success('Tour đã được hủy thành công!');
      setReason('');
      setBookingIdToCancel(null);
      setCancellationInfo(null);
    } catch (error) {
      console.error('Lỗi khi hủy tour:', error.response || error.message);
      message.error(
        error.response?.status === 401
          ? 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.'
          : error.response?.status === 404
          ? 'Không tìm thấy booking'
          : error.response?.status === 403
          ? error.response.data.error || 'Bạn không có quyền hủy tour.'
          : error.response?.status === 400
          ? error.response.data.error || 'Dữ liệu không hợp lệ'
          : 'Không thể hủy tour'
      );
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
    setPaymentMethod('VNPAY');
    setIsPaymentModalVisible(true);
  };

  const handlePayment = async () => {
    if (!selectedBooking?.bookingId || !selectedBooking?.totalPrice) {
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
      const response = await axiosInstance.post(
        '/payment/vnpay-create',
        {
          bookingId: selectedBooking.bookingId,
          totalPrice: selectedBooking.totalPrice,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.paymentUrl) {
        const newWindow = window.open(response.data.paymentUrl, '_blank');
        if (!newWindow) {
          message.warning('Trình duyệt chặn tab thanh toán. Vui lòng cho phép popup.');
        }
        setIsPaymentModalVisible(false);
      } else {
        message.error(response.data.error || 'Không thể tạo liên kết thanh toán!');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán:', error.response || error.message);
      message.error(
        error.response?.data?.error ||
          (error.response?.status === 400
            ? 'Dữ liệu không hợp lệ hoặc booking đã hết hạn'
            : error.response?.status === 403
            ? 'Bạn không có quyền thanh toán booking này'
            : 'Lỗi khi tạo thanh toán, vui lòng thử lại!')
      );
    } finally {
      setPaymentLoading(false);
      setIsPaymentModalVisible(false);
      setSelectedBooking(null);
    }
  };

  const showAdditionalPaymentModal = async (bookingId, tourName) => {
    setSelectedBooking({ bookingId, tourName });
    setPaymentMethod('VNPAY');
    setPaymentInfoLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) {
        message.error('Vui lòng đăng nhập để thanh toán bổ sung');
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get(`/bookings/history/${bookingId}/entries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        message.error('Dữ liệu lịch sử booking không hợp lệ');
        return;
      }

      const latestHistory = response.data
        .sort((a, b) => new Date(b.changeDate) - new Date(a.changeDate))
        .find((entry) => entry.additionalPayment > 0 && entry.newStatus === 'PENDING_PAYMENT');

      if (!latestHistory) {
        message.error('Không tìm thấy thông tin thanh toán bổ sung.');
        return;
      }

      const booking = history.find((item) => item.key === bookingId);
      if (!booking || booking.status !== 'PENDING_PAYMENT') {
        message.error('Booking không ở trạng thái chờ thanh toán bổ sung');
        return;
      }

      setAdditionalPaymentInfo({
        additionalPayment: latestHistory.additionalPayment,
        changeDate: latestHistory.changeDate,
      });
      setIsAdditionalPaymentModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thanh toán bổ sung:', error.response || error);
      message.error(
        error.response?.status === 404
          ? 'Không tìm thấy booking'
          : error.response?.status === 403
          ? 'Bạn không có quyền truy cập thông tin booking'
          : error.response?.status === 400
          ? error.response.data.error || 'Dữ liệu không hợp lệ'
          : error.response?.data?.error || 'Không thể lấy thông tin thanh toán bổ sung'
      );
    } finally {
      setPaymentInfoLoading(false);
    }
  };

  const handleAdditionalPayment = async () => {
    if (!selectedBooking?.bookingId) {
      message.error('Không có thông tin booking!');
      return;
    }
    if (!additionalPaymentInfo?.additionalPayment || additionalPaymentInfo.additionalPayment <= 0) {
      message.error('Số tiền thanh toán bổ sung không hợp lệ!');
      return;
    }

    setPaymentLoading(true);
    try {
      const token = localStorage.getItem('TOKEN');
      if (!token) {
        message.error('Vui lòng đăng nhập để thanh toán bổ sung');
        navigate('/login');
        return;
      }

      let ipAddress = '127.0.0.1';
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        ipAddress = ipResponse.data.ip;
      } catch (ipError) {
        console.warn('Failed to fetch client IP, using default:', ipError);
      }

      const bookingResponse = await axiosInstance.get(`/bookings/${selectedBooking.bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingStatus = bookingResponse.data.status;
      if (bookingStatus !== 'PENDING_PAYMENT' && bookingStatus !== 'CONFIRMED') {
        message.error('Booking không ở trạng thái cho phép thanh toán. Vui lòng kiểm tra lại.');
        return;
      }

      const response = await axiosInstance.post(
        '/payment/vnpay-create',
        {
          bookingId: selectedBooking.bookingId,
          totalPrice: additionalPaymentInfo.additionalPayment,
          ipAddress,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.paymentUrl) {
        const newWindow = window.open(response.data.paymentUrl, '_blank');
        if (!newWindow) {
          message.warning('Trình duyệt chặn tab thanh toán. Vui lòng cho phép popup.');
          setPaymentLoading(false);
          return;
        }

        message.info('Vui lòng hoàn tất thanh toán trên cổng VNPAY.');
        setIsAdditionalPaymentModalVisible(false);
      } else {
        message.error(response.data.error || 'Không thể tạo liên kết thanh toán bổ sung!');
      }
    } catch (error) {
      console.error('Lỗi khi thực hiện thanh toán bổ sung:', error.response || error);
      message.error(
        error.response?.data?.error ||
          (error.response?.status === 400
            ? 'Dữ liệu không hợp lệ'
            : error.response?.status === 403
            ? 'Bạn không có quyền thực hiện thanh toán này'
            : 'Lỗi khi thực hiện thanh toán bổ sung, vui lòng thử lại!')
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const showChangeModal = async (
    bookingId,
    tourName,
    tourId,
    numberAdults,
    numberChildren,
    numberInfants
  ) => {
    setChangeTourData({
      bookingId,
      currentTourName: tourName,
      departureDate: null,
      numberAdults: numberAdults || 1,
      numberChildren: numberChildren || 0,
      numberInfants: numberInfants || 0,
      maxPeople: Infinity,
      adultPrice: 0,
      childPrice: 0,
      infantPrice: 0,
      totalPrice: 0,
    });
    setChangeFeeInfo(null);
    await fetchAvailableDates(tourId);
    setIsChangeModalVisible(true);
  };

  const handleChangeModalCancel = () => {
    setIsChangeModalVisible(false);
    setChangeTourData({
      bookingId: null,
      currentTourName: '',
      departureDate: null,
      numberAdults: 1,
      numberChildren: 0,
      numberInfants: 0,
      maxPeople: Infinity,
      adultPrice: 0,
      childPrice: 0,
      infantPrice: 0,
      totalPrice: 0,
    });
    setChangeFeeInfo(null);
  };

  const handleCalculateChangeFee = async () => {
    if (
      !changeTourData.departureDate ||
      (!changeTourData.numberAdults &&
        !changeTourData.numberChildren &&
        !changeTourData.numberInfants)
    ) {
      message.error('Vui lòng chọn ngày khởi hành và số người');
      return;
    }
    const totalPeople =
      changeTourData.numberAdults + changeTourData.numberChildren + changeTourData.numberInfants;
    if (totalPeople > changeTourData.maxPeople) {
      message.error(`Số người vượt quá số chỗ khả dụng (${changeTourData.maxPeople})`);
      return;
    }

    setChangeLoading(true);
    try {
      const isHoliday = changeTourData.departureDate
        ? holidays.includes(dayjs(changeTourData.departureDate).format('MM-DD'))
        : false;
      const changeRequest = {
        departureDate: dayjs(changeTourData.departureDate).format('YYYY-MM-DD'),
        numberAdults: changeTourData.numberAdults,
        numberChildren: changeTourData.numberChildren,
        numberInfants: changeTourData.numberInfants,
        isHoliday,
        changeDate: new Date().toISOString(),
      };
      const result = await dispatch(
        calculateChangeFeeThunk({ bookingId: changeTourData.bookingId, changeRequest })
      ).unwrap();
      setChangeFeeInfo({
        changeFee: result.changeFee,
        priceDifference: result.priceDifference,
        newTotalPrice: result.newTotalPrice,
        refundAmount: result.refundAmount,
        additionalPayment: result.priceDifference > 0 ? result.priceDifference : 0,
        message: result.message,
      });
      message.success('Tính phí đổi thành công!');
    } catch (error) {
      console.error('Error calculating change fee:', error);
      message.error(error.message || 'Không thể tính phí đổi tour');
      setChangeFeeInfo(null);
    } finally {
      setChangeLoading(false);
    }
  };

  const handleConfirmChange = async () => {
    if (
      !changeTourData.departureDate ||
      (!changeTourData.numberAdults &&
        !changeTourData.numberChildren &&
        !changeTourData.numberInfants)
    ) {
      message.error('Vui lòng chọn ngày khởi hành và số người');
      return;
    }
    const totalPeople =
      changeTourData.numberAdults + changeTourData.numberChildren + changeTourData.numberInfants;
    if (totalPeople > changeTourData.maxPeople) {
      message.error(`Số người vượt quá số chỗ khả dụng (${changeTourData.maxPeople})`);
      return;
    }

    setChangeLoading(true);
    try {
      const isHoliday = changeTourData.departureDate
        ? holidays.includes(dayjs(changeTourData.departureDate).format('MM-DD'))
        : false;
      const changeRequest = {
        departureDate: dayjs(changeTourData.departureDate).format('YYYY-MM-DD'),
        numberAdults: changeTourData.numberAdults,
        numberChildren: changeTourData.numberChildren,
        numberInfants: changeTourData.numberInfants,
        isHoliday,
        changeDate: new Date().toISOString(),
      };
      const response = await dispatch(
        changeTourThunk({ bookingId: changeTourData.bookingId, changeRequest })
      ).unwrap();

      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.key === changeTourData.bookingId
            ? {
                ...item,
                departureDate: changeTourData.departureDate,
                numberPeople: totalPeople,
                numberAdults: changeTourData.numberAdults,
                numberChildren: changeTourData.numberChildren,
                numberInfants: changeTourData.numberInfants,
                totalPrice: changeFeeInfo.newTotalPrice,
                price: changeFeeInfo.newTotalPrice
                  ? changeFeeInfo.newTotalPrice.toLocaleString('vi-VN') + 'đ'
                  : item.price,
                status: changeFeeInfo.priceDifference > 0 ? 'PENDING_PAYMENT' : item.status,
              }
            : item
        )
      );

      setIsChangeModalVisible(false);
      if (changeFeeInfo.priceDifference > 0) {
        message.success(
          `Đổi lịch tour thành công! Vui lòng thanh toán bổ sung ${changeFeeInfo.priceDifference.toLocaleString(
            'vi-VN'
          )} VND.`
        );
      } else {
        message.success(response.message || 'Đổi lịch tour thành công!');
      }
      setChangeTourData({
        bookingId: null,
        currentTourName: '',
        departureDate: null,
        numberAdults: 1,
        numberChildren: 0,
        numberInfants: 0,
        maxPeople: Infinity,
        adultPrice: 0,
        childPrice: 0,
        infantPrice: 0,
        totalPrice: 0,
      });
      setChangeFeeInfo(null);
    } catch (error) {
      console.error('Error changing tour:', error);
      message.error(error.message || 'Không thể đổi tour');
    } finally {
      setChangeLoading(false);
    }
  };

  const activeColumns = [
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
      title: 'Người Lớn',
      dataIndex: 'numberAdults',
      key: 'numberAdults',
      render: (numberAdults) => (
        <span className="font-semibold text-gray-700">{numberAdults}</span>
      ),
    },
    {
      title: 'Trẻ Em',
      dataIndex: 'numberChildren',
      key: 'numberChildren',
      render: (numberChildren) => (
        <span className="font-semibold text-gray-700">{numberChildren}</span>
      ),
    },
    {
      title: 'Trẻ Nhỏ',
      dataIndex: 'numberInfants',
      key: 'numberInfants',
      render: (numberInfants) => (
        <span className="font-semibold text-gray-700">{numberInfants}</span>
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
                key="additional_payment"
                icon={<CreditCardOutlined className="text-orange-500" />}
                disabled={record.status !== 'PENDING_PAYMENT'}
                onClick={() => showAdditionalPaymentModal(record.key, record.tourName)}
              >
                Thanh toán bổ sung
              </Menu.Item>
              <Menu.Item
                key="change"
                icon={<SwapOutlined className="text-purple-500" />}
                disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                onClick={() =>
                  showChangeModal(
                    record.key,
                    record.tourName,
                    record.tourId,
                    record.numberAdults,
                    record.numberChildren,
                    record.numberInfants
                  )
                }
              >
                Đổi lịch
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

  const historyColumns = [
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
      title: 'Người Lớn',
      dataIndex: 'numberAdults',
      key: 'numberAdults',
      render: (numberAdults) => (
        <span className="font-semibold text-gray-700">{numberAdults}</span>
      ),
    },
    {
      title: 'Trẻ Em',
      dataIndex: 'numberChildren',
      key: 'numberChildren',
      render: (numberChildren) => (
        <span className="font-semibold text-gray-700">{numberChildren}</span>
      ),
    },
    {
      title: 'Trẻ Nhỏ',
      dataIndex: 'numberInfants',
      key: 'numberInfants',
      render: (numberInfants) => (
        <span className="font-semibold text-gray-700">{numberInfants}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => goToBookingDetail(record.key)}
          className="border-gray-300 text-blue-500 hover:border-blue-500 rounded-md"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-screen">
      <Header />
      <Content className="flex-grow py-10 px-4 sm:px-6 mt-10">
        <Title level={3} className="text-gray-800 mb-6 ml-30 pt-5">
          Danh Sách Tour Đã Đặt
        </Title>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <Tabs
            defaultActiveKey="1"
            className="bg-white rounded-xl shadow-lg p-8"
            style={{ padding: '10px' }}
          >
            <TabPane tab="Tour Đã Đặt" key="1">
              <div className="hidden md:block">
                <Table
                  columns={activeColumns}
                  dataSource={activeBookings}
                  loading={loading || paymentLoading || changeLoading}
                  pagination={{ pageSize: 5, showSizeChanger: false }}
                  rowClassName="hover:bg-gray-50 transition-colors"
                  className="rounded-lg"
                  scroll={{ x: 'max-content' }}
                  locale={{ emptyText: 'Không có tour nào còn hiệu lực.' }}
                />
              </div>
              <div className="md:hidden">
                {loading || paymentLoading || changeLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin size="large" />
                  </div>
                ) : activeBookings.length === 0 ? (
                  <p className="text-center text-gray-500">Không có tour nào còn hiệu lực.</p>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map((record) => (
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
                            <h3 className="text-base font-semibold text-gray-800">
                              {record.tourName}
                            </h3>
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
                                <span className="font-medium">Người Lớn:</span> {record.numberAdults}
                              </p>
                              <p>
                                <span className="font-medium">Trẻ Em:</span> {record.numberChildren}
                              </p>
                              <p>
                                <span className="font-medium">Trẻ Nhỏ:</span> {record.numberInfants}
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
                            icon={<CreditCardOutlined />}
                            onClick={() => showAdditionalPaymentModal(record.key, record.tourName)}
                            disabled={record.status !== 'PENDING_PAYMENT'}
                            className="flex-1 min-w-[80px] h-8 text-xs border-gray-300 text-orange-500 hover:border-orange-500 rounded-md disabled:opacity-50"
                          >
                            Thanh toán bổ sung
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
                            onClick={() =>
                              showChangeModal(
                                record.key,
                                record.tourName,
                                record.tourId,
                                record.numberAdults,
                                record.numberChildren,
                                record.numberInfants
                              )
                            }
                            disabled={record.status !== 'CONFIRMED' && record.status !== 'PAID'}
                            className="flex-1 min-w-[80px] h-8 text-xs border-gray-300 text-purple-500 hover:border-purple-500 rounded-md disabled:opacity-50"
                          >
                            Đổi lịch
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabPane>
            <TabPane tab="Lịch Sử Đặt Tour" key="2">
              <div className="hidden md:block">
                <Table
                  columns={historyColumns}
                  dataSource={pastBookings}
                  loading={loading}
                  pagination={{ pageSize: 5, showSizeChanger: false }}
                  rowClassName="hover:bg-gray-50 transition-colors"
                  className="rounded-lg"
                  scroll={{ x: 'max-content' }}
                  locale={{ emptyText: 'Không có lịch sử đặt tour.' }}
                />
              </div>
              <div className="md:hidden">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spin size="large" />
                  </div>
                ) : pastBookings.length === 0 ? (
                  <p className="text-center text-gray-500">Không có lịch sử đặt tour.</p>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((record) => (
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
                            <h3 className="text-base font-semibold text-gray-800">
                              {record.tourName}
                            </h3>
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
                                <span className="font-medium">Người Lớn:</span> {record.numberAdults}
                              </p>
                              <p>
                                <span className="font-medium">Trẻ Em:</span> {record.numberChildren}
                              </p>
                              <p>
                                <span className="font-medium">Trẻ Nhỏ:</span> {record.numberInfants}
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
                        <div className="flex justify-center mt-3">
                          <Button
                            icon={<EyeOutlined />}
                            onClick={() => goToBookingDetail(record.key)}
                            className="h-8 text-xs border-gray-300 text-blue-500 hover:border-blue-500 rounded-md"
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </motion.div>
      </Content>

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

      {selectedBooking && (
        <Modal
          title={<Title level={4} className="text-green-600">Xác nhận thanh toán</Title>}
          open={isPaymentModalVisible}
          onOk={handlePayment}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setSelectedBooking(null);
            setPaymentMethod('VNPAY');
          }}
          okText="Thanh toán"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-green-600 hover:bg-green-700 rounded-md h-10',
            loading: paymentLoading,
          }}
          cancelButtonProps={{ className: 'rounded-md h-10' }}
          centered
          className="rounded-xl"
        >
          <div className="space-y-3 text-sm">
            <Text className="text-gray-600">Bạn sắp thanh toán cho tour:</Text>
            <Text className="font-semibold text-gray-800">{selectedBooking.tourName}</Text>
            <Text className="text-gray-600">
              Tổng giá:{' '}
              <span className="font-semibold">
                {selectedBooking.totalPrice
                  ? selectedBooking.totalPrice.toLocaleString('vi-VN')
                  : 'N/A'}{' '}
                VND
              </span>
            </Text>
            <div>
              <Text className="text-gray-600">Phương thức thanh toán:</Text>
              <Select
                value={paymentMethod}
                onChange={setPaymentMethod}
                className="w-full mt-2"
                disabled={paymentLoading}
              >
                <Option value="VNPAY">VNPAY</Option>
              </Select>
            </div>
            <Text className="text-gray-500 italic">
              Bạn sẽ được chuyển hướng đến cổng thanh toán VNPAY để hoàn tất.
            </Text>
          </div>
        </Modal>
      )}

      {selectedBooking && (
        <Modal
          title={<Title level={4} className="text-orange-600">Xác nhận thanh toán bổ sung</Title>}
          open={isAdditionalPaymentModalVisible}
          onOk={handleAdditionalPayment}
          onCancel={() => {
            setIsAdditionalPaymentModalVisible(false);
            setSelectedBooking(null);
            setAdditionalPaymentInfo(null);
            setPaymentMethod('VNPAY');
            setPaymentInfoLoading(false);
          }}
          okText="Thanh toán bổ sung"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-orange-600 hover:bg-orange-700 rounded-md h-10',
            loading: paymentLoading,
            disabled:
              paymentInfoLoading ||
              !additionalPaymentInfo?.additionalPayment ||
              additionalPaymentInfo.additionalPayment <= 0,
          }}
          cancelButtonProps={{ className: 'rounded-md h-10' }}
          centered
          className="rounded-xl"
        >
          <div className="space-y-3 text-sm">
            {paymentInfoLoading ? (
              <div className="flex justify-center py-4">
                <Spin tip="Đang tải thông tin thanh toán..." />
              </div>
            ) : additionalPaymentInfo?.additionalPayment > 0 ? (
              <>
                <Text className="text-gray-600">Bạn cần thanh toán bổ sung cho tour:</Text>
                <Text className="font-semibold text-gray-800">{selectedBooking.tourName}</Text>
                <Text className="text-gray-600">
                  Số tiền cần thanh toán bổ sung:{' '}
                  <span className="font-semibold">
                    {additionalPaymentInfo.additionalPayment.toLocaleString('vi-VN')} VND
                  </span>
                </Text>
                {additionalPaymentInfo.changeDate && (
                  <Text className="text-gray-600">
                    Ngày thay đổi:{' '}
                    <span className="font-semibold">
                      {new Date(additionalPaymentInfo.changeDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </Text>
                )}
                <div>
                  <Text className="text-gray-600">Phương thức thanh toán:</Text>
                  <Select
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    className="w-full mt-2"
                    disabled={paymentLoading}
                  >
                    <Option value="VNPAY">VNPAY</Option>
                  </Select>
                </div>
                <Text className="text-gray-500 italic">
                  Bạn sẽ được chuyển hướng đến cổng thanh toán VNPAY để hoàn tất.
                </Text>
              </>
            ) : (
              <Text className="text-red-600">Không có thông tin thanh toán bổ sung khả dụng.</Text>
            )}
          </div>
        </Modal>
      )}

      <Modal
  title={<Title level={4} className="text-purple-600">Đổi lịch tour</Title>}
  open={isChangeModalVisible}
  onOk={changeFeeInfo ? handleConfirmChange : handleCalculateChangeFee}
  onCancel={handleChangeModalCancel}
  okText={changeFeeInfo ? 'Xác nhận đổi' : 'Tính phí đổi'}
  cancelText="Hủy"
  okButtonProps={{
    className: 'bg-purple-600 hover:bg-purple-700 rounded-md h-10',
    loading: changeLoading,
    disabled:
      !changeTourData.departureDate ||
      (!changeTourData.numberAdults &&
        !changeTourData.numberChildren &&
        !changeTourData.numberInfants) ||
      !availableDates.length,
  }}
  cancelButtonProps={{ className: 'rounded-md h-10' }}
  centered
  className="rounded-xl"
  width={450}
>
  <div className="space-y-4 text-sm">
    <div>
      <Text className="text-gray-600">Tour hiện tại:</Text>
      <Text className="block font-semibold text-gray-800">
        {changeTourData.currentTourName}
      </Text>
    </div>
    <div>
      <Text className="text-gray-600">Chọn ngày khởi hành mới:</Text>
      <Select
        value={changeTourData.departureDate}
        onChange={(value) =>
          setChangeTourData((prev) => ({ ...prev, departureDate: value }))
        }
        className="w-full mt-2"
        placeholder="Chọn ngày khởi hành"
        disabled={changeLoading || !availableDates.length}
        aria-label="Ngày khởi hành mới"
      >
        {availableDates.map((date) => (
          <Option key={date} value={date}>
            {new Date(date).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </Option>
        ))}
      </Select>
    </div>
    <div>
      <Text className="text-gray-600">
        Người lớn (≥10 tuổi, tối đa {changeTourData.maxPeople},{' '}
        {(changeTourData.adultPrice || 1000000).toLocaleString('vi-VN')} VND/người):
      </Text>
      <Input
        type="number"
        min={0}
        max={changeTourData.maxPeople}
        value={changeTourData.numberAdults}
        onChange={(e) =>
          setChangeTourData((prev) => ({
            ...prev,
            numberAdults: parseInt(e.target.value) || 0,
          }))
        }
        className="w-full mt-2"
        placeholder="Nhập số người lớn"
        disabled={changeLoading}
        aria-label="Số người lớn tham gia"
      />
    </div>
    <div>
      <Text className="text-gray-600">
        Trẻ em (2–10 tuổi, tối đa {changeTourData.maxPeople},{' '}
        {(changeTourData.childPrice || 500000).toLocaleString('vi-VN')} VND/người):
      </Text>
      <Input
        type="number"
        min={0}
        max={changeTourData.maxPeople}
        value={changeTourData.numberChildren}
        onChange={(e) =>
          setChangeTourData((prev) => ({
            ...prev,
            numberChildren: parseInt(e.target.value) || 0,
          }))
        }
        className="w-full mt-2"
        placeholder="Nhập số trẻ em"
        disabled={changeLoading}
        aria-label="Số trẻ em tham gia"
      />
    </div>
    <div>
      <Text className="text-gray-600">
        Trẻ nhỏ (2 tuổi, tối đa {changeTourData.maxPeople},{' '}
        {(changeTourData.infantPrice || 200000).toLocaleString('vi-VN')} VND/người):
      </Text>
      <Input
        type="number"
        min={0}
        max={changeTourData.maxPeople}
        value={changeTourData.numberInfants}
        onChange={(e) =>
          setChangeTourData((prev) => ({
            ...prev,
            numberInfants: parseInt(e.target.value) || 0,
          }))
        }
        className="w-full mt-2"
        placeholder="Nhập số trẻ nhỏ"
        disabled={changeLoading}
        aria-label="Số trẻ nhỏ tham gia"
      />
    </div>
    <div>
      <Text className="text-gray-600">
        Tổng giá tạm tính:{' '}
        <span className="font-semibold text-gray-800">
          {changeTourData.totalPrice
            ? changeTourData.totalPrice.toLocaleString('vi-VN')
            : 'Đang tải giá...'}{' '}
          VND
        </span>
      </Text>
    </div>
    <div>
      <Text className="text-gray-600">Thông tin phí đổi:</Text>
      {feeLoading ? (
        <div className="flex items-center space-x-2">
          <Spin size="small" />
          <Text className="text-gray-500">Đang tính phí đổi...</Text>
        </div>
      ) : changeFeeInfo ? (
        <div className="space-y-2">
          <p>
            Phí đổi:{' '}
            <span className="font-medium text-purple-600">
              {(changeFeeInfo.changeFee || 0).toLocaleString('vi-VN')} VND
            </span>
          </p>
          {(() => {
            const booking = history.find((item) => item.key === changeTourData.bookingId);
            const isConfirmed = booking?.status === 'CONFIRMED';

            if (isConfirmed) {
              // Trường hợp CONFIRMED: Chỉ hiển thị phí đổi và tổng giá mới
              return (
                <>
                  <p>
                    Tổng giá mới:{' '}
                    <span className="font-medium text-gray-800">
                      {(changeFeeInfo.newTotalPrice || 0).toLocaleString('vi-VN')} VND
                    </span>
                  </p>
                  <p className="mt-2 font-semibold">
                    Tổng cộng cần thanh toán:{' '}
                    <span className="text-purple-600">
                      {((changeFeeInfo.changeFee || 0) + (changeFeeInfo.newTotalPrice || 0)).toLocaleString('vi-VN')} VND
                    </span>
                  </p>
                </>
              );
            } else {
              // Trường hợp PAID: Hiển thị chênh lệch giá, số tiền trả thêm hoặc hoàn lại
              return (
                <>
                  <p>
                    Chênh lệch giá:{' '}
                    <span
                      className={`font-medium ${
                        changeFeeInfo.priceDifference >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {(changeFeeInfo.priceDifference || 0).toLocaleString('vi-VN')} VND
                    </span>
                  </p>
                  <p>
                    Tổng giá mới:{' '}
                    <span className="font-medium text-gray-800">
                      {(changeFeeInfo.newTotalPrice || 0).toLocaleString('vi-VN')} VND
                    </span>
                  </p>
                  {changeFeeInfo.additionalPayment > 0 && (
                    <p>
                      Số tiền cần trả thêm:{' '}
                      <span className="font-medium text-red-600">
                        {changeFeeInfo.additionalPayment.toLocaleString('vi-VN')} VND
                      </span>
                    </p>
                  )}
                  {changeFeeInfo.refundAmount > 0 && (
                    <p>
                      Số tiền hoàn lại:{' '}
                      <span className="font-medium text-green-600">
                        {changeFeeInfo.refundAmount.toLocaleString('vi-VN')} VND
                      </span>
                    </p>
                  )}
                  {changeFeeInfo.additionalPayment > 0 && (
                    <p className="mt-2 font-semibold">
                      Tổng cộng cần thanh toán:{' '}
                      <span className="text-purple-600">
                        {((changeFeeInfo.changeFee || 0) + (changeFeeInfo.additionalPayment || 0)).toLocaleString('vi-VN')} VND
                      </span>
                    </p>
                  )}
                </>
              );
            }
          })()}
          {changeFeeInfo.message && (
            <Text className="text-gray-500 italic">{changeFeeInfo.message}</Text>
          )}
        </div>
      ) : (
        <Text className="text-gray-500 italic">
          Vui lòng chọn ngày và số lượng để tính phí đổi.
        </Text>
      )}
    </div>
  </div>
</Modal>

      <Footer />
    </div>
  );
};

export default Orders;