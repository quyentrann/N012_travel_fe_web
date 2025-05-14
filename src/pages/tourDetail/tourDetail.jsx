import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTourById } from '../../apis/tour';
import TourBookingForm from '../../components/ItemTourBookingDetail';
import card1 from '../../images/pq1.jpg';
import card2 from '../../images/pq2.jpg';
import card3 from '../../images/pq4.webp';
import card4 from '../../images/pq5.jpg';
import { motion } from 'framer-motion';
import logo from '../../images/logo.png';
import { logout } from '../../redux/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../../images/defaultAvatar.png';
import { useRef } from 'react';

import {
  Button,
  Carousel,
  DatePicker,
  Dropdown,
  Menu,
  Collapse,
  theme,
  Tabs,
  Typography,
  Select,
  message,
  Modal,
  Avatar,
  Badge,
  Tag,
} from 'antd';
import {
  CalendarOutlined,
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  CheckOutlined,
  CaretRightOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ForkOutlined,
  StarFilled,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import Header from '../../components/Header2';

const promotions = [{ key: '1', label: 'Giảm 10% cho nhóm trên 5 người' }];
const { Title, Paragraph } = Typography;

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour', path: '/tours' },
  { label: 'Tour Yêu Thích', path: '/tours' },
];

const itemss = [
  {
    key: '1',
    label: 'Giá bao gồm',
    children: (
      <Typography>
        <Title level={5}>Vận Chuyển:</Title>
        <Paragraph>- Vé máy bay khứ hồi theo đoàn.</Paragraph>
        <Paragraph>
          - Thuế sân bay hai nước, phụ phí xăng dầu, an ninh hàng không.
        </Paragraph>
        <Paragraph>- Xe tham quan như chương trình.</Paragraph>

        <Title level={5}>Lưu Trú:</Title>
        <Paragraph>
          - Khách sạn 3 sao theo tiêu chuẩn địa phương, 2 khách/phòng.
        </Paragraph>

        <Title level={5}>Khác:</Title>
        <Paragraph>- Ăn uống theo chương trình.</Paragraph>
        <Paragraph>- Hướng dẫn viên suốt tuyến.</Paragraph>
        <Paragraph>- Vé tham quan theo chương trình.</Paragraph>
        <Paragraph>- Tặng 04 khách/1 đèn lồng tại phố cổ Thập Phần.</Paragraph>
        <Paragraph>- Tặng một ly trà sữa trân châu Đài Loan.</Paragraph>
        <Paragraph>- Tặng một chiếc bánh bao Khách Gia.</Paragraph>
      </Typography>
    ),
  },
  {
    key: '2',
    label: 'Giá không bao gồm',
    children: (
      <Typography>
        <Paragraph>- Bia hay nước ngọt trong các bữa ăn.</Paragraph>
        <Paragraph>- Vé máy bay khứ hồi theo đoàn.</Paragraph>
        <Paragraph>- Chi phí cá nhân: điện thoại, giặt ủi…</Paragraph>
        <Paragraph>- Vé cáp treo đi Bà Nà, công viên Châu Á.</Paragraph>
        <Paragraph>- 01 bữa trưa ngày thứ 1 theo chương trình.</Paragraph>
        <Paragraph>- Vé xem pháo hoa</Paragraph>
        <Paragraph>- Chi phí bãi biển: dù, võng, tắm nước ngọt…</Paragraph>
      </Typography>
    ),
  },
  {
    key: '3',
    label: 'Phụ thu',
    children: (
      <Typography>
        <Paragraph>
          - Trẻ em dưới 2 tuổi: 30% giá tour người lớn (sử dụng chung dịch vụ
          người lớn)
        </Paragraph>
        <Paragraph>
          - Trẻ em từ 2 tuổi - dưới 10 tuổi: 85% giá tour người lớn (không có
          chế độ giường riêng).
        </Paragraph>
        <Paragraph>
          - Trẻ em đủ 10 tuổi trở lên: 100% giá tour người lớn.
        </Paragraph>
        <Paragraph>
          - Hai người lớn chỉ kèm một bé, bé thứ hai tính giá người lớn.
        </Paragraph>
        <Title level={5}>Quy định về thanh toán</Title>
        <Paragraph>
          - Khách hàng cần thanh toán 100% chi phí tour trước ngày khởi hành ít
          nhất 5 ngày.
        </Paragraph>
        <Paragraph>
          - Vé máy bay, tàu, xe được xuất sau khi xác nhận thanh toán. Các vé
          này không được hoàn, đổi tên hoặc thay đổi lịch trình.
        </Paragraph>
        <Paragraph>
          - Hoàn tiền (nếu có) sẽ được chuyển vào tài khoản thanh toán ban đầu.
        </Paragraph>
        <Paragraph>
          - Thời gian xử lý hoàn tiền phụ thuộc vào đối tác cung cấp dịch vụ.
        </Paragraph>
      </Typography>
    ),
  },
  {
    key: '4',
    label: 'Hủy đổi',
    children: (
      <Typography>
        <Title level={5}>Quy định về hủy tour</Title>

        <p className="text-[14px] font-medium">Hủy tour ngày lễ, tết</p>
        <Paragraph>
          - Trước 30 ngày: Chịu phí 20% giá trị tour và toàn bộ chi phí vé (vé
          máy bay, tàu, xe).
        </Paragraph>
        <Paragraph>
          - Từ 15-29 ngày: Chịu phí 40% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 7-14 ngày: Chịu phí 60% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 3-6 ngày: Chịu phí 80% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Trong vòng 2 ngày hoặc không tham gia: Chịu phí 100% giá trị tour và
          toàn bộ chi phí vé.
        </Paragraph>
        <span className="text-[14px] font-medium">Hủy tour ngày thường</span>
        <Paragraph>
          - Trước 14 ngày: Chịu phí 10% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 7-13 ngày: Chịu phí 30% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 4-6 ngày: Chịu phí 50% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Từ 1-3 ngày: Chịu phí 70% giá trị tour và toàn bộ chi phí vé.
        </Paragraph>
        <Paragraph>
          - Trong vòng 1 ngày hoặc không tham gia: Chịu phí 100% giá trị tour và
          toàn bộ chi phí vé.
        </Paragraph>
        <Title level={5}>Quy định về đổi tour</Title>
        <Paragraph>
          - Khách hàng có thể đổi tour trước ngày khởi hành ít nhất 7 ngày (đối
          với tour ngày thường) hoặc trước 15 ngày (đối với tour ngày lễ, Tết).
        </Paragraph>
        <Paragraph>
          - Việc đổi tour phụ thuộc vào tình trạng chỗ trống và điều kiện của
          tour mới.
        </Paragraph>
        <Paragraph>
          - Nếu tour mới có giá cao hơn, khách hàng cần thanh toán phần chênh
          lệch.
        </Paragraph>
        <Paragraph>
          - Nếu tour mới có giá thấp hơn, khách hàng không được hoàn lại phần
          chênh lệch.
        </Paragraph>
        <Paragraph>
          - Trường hợp khách hàng muốn đổi tour sát ngày khởi hành (trong vòng 6
          ngày đối với tour ngày thường và 14 ngày đối với tour lễ, Tết), sẽ áp
          dụng phí hủy tour theo quy định.
        </Paragraph>
        <Paragraph>
          - Phí hủy phụ thuộc vào thời gian báo hủy, khách cần xem kỹ chính sách
          trước khi đăng ký.
        </Paragraph>
      </Typography>
    ),
  },
  {
    key: '5',
    label: 'Lưu ý',
    children: (
      <Typography>
        <Title level={5}>Giấy Tờ Tùy Thân</Title>
        <Paragraph>
          - Trẻ em dưới 12 tuổi: Giấy khai sinh (bản chính hoặc sao y có công
          chứng).
        </Paragraph>
        <Paragraph>
          - Trẻ từ 14 tuổi: Bắt buộc có CMND hoặc Passport. Nếu chưa có, cần
          Giấy xác nhận nhân thân + Giấy khai sinh.
        </Paragraph>
        <Paragraph>
          - Khách nước ngoài/Việt kiều: Passport và Visa Việt Nam còn hạn. Nếu
          visa nhập cảnh 1 lần, cần tự làm lại visa trước khi đi tour.
        </Paragraph>
        <Title level={5}>Điều Kiện Tham Gia Tour</Title>
        <Paragraph>
          - Khách từ 55 tuổi (nữ) / 60 tuổi (nam): Khuyến khích có người thân đi
          cùng.
        </Paragraph>
        <Paragraph>
          - Khách từ 70 tuổi trở lên: Bắt buộc có người thân dưới 55 tuổi đi
          cùng.
        </Paragraph>
        <Paragraph>- Không nhận khách từ 80 tuổi trở lên.</Paragraph>
        <Paragraph>
          - Khách mang thai trên 5 tháng: Không được tham gia tour.
        </Paragraph>
        <Paragraph>
          - Khách từ 55 tuổi (nữ) / 60 tuổi (nam): Khuyến khích có người thân đi
          cùng.
        </Paragraph>
        <Paragraph>
          Trẻ dưới 18 tuổi: Nếu không đi cùng bố mẹ, cần có giấy ủy quyền có xác
          nhận chính quyền.
        </Paragraph>
        <Title level={5}>Quy Định Khi Tham Gia Tour</Title>
        <Paragraph>
          - Giờ bay, lịch trình có thể thay đổi do hãng hàng không hoặc điều
          kiện thực tế.
        </Paragraph>
        <Paragraph>- Không tách đoàn khi tham gia tour.</Paragraph>
        <Paragraph>
          - Không mang thực phẩm bên ngoài vào nhà hàng/khách sạn.
        </Paragraph>
        <Paragraph>- Hành lý & tư trang do khách tự bảo quản.</Paragraph>
        <Paragraph>
          - Tour bị hủy do bất khả kháng (thiên tai, an ninh, vấn đề hàng
          không), công ty sẽ điều chỉnh lịch trình nhưng không chịu trách nhiệm
          bồi thường.
        </Paragraph>
      </Typography>
    ),
  },
  {
    key: '6',
    label: 'Hướng dẫn viên',
    children: (
      <Typography>
        <Paragraph>
          - Hướng Dẫn Viên (HDV) sẽ liên lạc với Quý Khách khoảng 2 ngày trước
          khi khởi hành để sắp xếp giờ đón và cung cấp các thông tin cần thiết
          cho chuyển đi.
        </Paragraph>
      </Typography>
    ),
  },
];

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function TourDetail() {
  const [startDate, setStartDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState(null);
  const query = useQuery();
  const tourId = query.get('id');
  const { token } = theme.useToken();
  const [availableDates, setAvailableDates] = useState([]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [similarTours, setSimilarTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false); // For desktop account dropdown
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const [accountOpen, setAccountOpen] = useState(false); // For mobile account sub-menu
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    message.success('Đăng xuất thành công!');
    navigate('/login');
    setOpen(false);
    setMenuOpen(false);
    setAccountOpen(false);
  };

  // Filter navLinks for mobile menu when not authenticated
  const mobileNavLinks = isAuthenticated
    ? navLinks
    : navLinks.filter(
        (link) =>
          link.label === 'Trang Chủ' ||
          link.label === 'Giới Thiệu' ||
          link.label === 'Tour'
      );

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

  const holidayRate = 1.2;

  const priceForOneAdult = tour?.price
    ? tour.price *
      (holidays.includes(dayjs(startDate).format('MM-DD')) ? holidayRate : 1)
    : 0;

  const priceForOneChild = tour?.price
    ? tour.price *
      0.85 *
      (holidays.includes(dayjs(startDate).format('MM-DD')) ? holidayRate : 1)
    : 0;

  const priceForOneInfant = tour?.price
    ? tour.price *
      0.3 *
      (holidays.includes(dayjs(startDate).format('MM-DD')) ? holidayRate : 1)
    : 0;

  const totalPrice =
    priceForOneAdult * adults +
    priceForOneChild * children +
    priceForOneInfant * infants;

  const totalGuests = adults + children + infants;
  const discountRate = totalGuests >= 5 ? 0.1 : 0;
  const discountAmount = totalPrice * discountRate;
  const finalPrice = totalPrice - discountAmount;

  const handleCloseModal = () => {
    setShowBookingModal(false);
  };

  const panelStyle = {
    marginBottom: 15,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  const getSimilarTours = async (tourId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tours/${tourId}/similar`
      );
      if (!response.ok) {
        throw new Error('Lỗi khi lấy tour tương tự');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    if (!tourId) {
      message.error('Không tìm thấy tour. Vui lòng chọn tour từ danh sách!');
      navigate('/tours');
      return;
    }

    setLoading(true);
    getTourById(tourId)
      .then((data) => {
        setTour(data);
        if (data.tourDetails) {
          const startDates = data.tourDetails.map((tour) =>
            dayjs(tour.startDate).startOf('day')
          );
          setAvailableDates(startDates);
        }
      })
      .catch((err) => console.error('Lỗi API:', err));

    getSimilarTours(tourId)
      .then((data) => {
        setSimilarTours(data);
      })
      .catch((err) => console.error('Lỗi API tour tương tự:', err))
      .finally(() => setLoading(false));
  }, [tourId]);

  const listImageTour = [
    { id: 1, image: card1 },
    { id: 2, image: card2 },
    { id: 3, image: card3 },
    { id: 4, image: card4 },
  ];

  const menu = (
    <Menu>
      {promotions.map((promo) => (
        <Menu.Item key={promo.key}>{promo.label}</Menu.Item>
      ))}
    </Menu>
  );

  const benefits = [
    ['Vé máy bay', 'Visa', 'Khách sạn 3*'],
    ['Bữa ăn', 'Xe tham quan', 'Vé tham quan'],
    ['Hướng dẫn viên', 'Bảo hiểm du lịch'],
  ];

  const items = tour?.tourSchedules?.map((schedule, index) => ({
    key: String(index + 1),
    label: (
      <div>
        <span>Ngày {schedule.dayNumber}</span>
        <span style={{ color: 'gray', marginLeft: 10 }}>
          {schedule.location}
        </span>
      </div>
    ),
    children: (
      <div className="text-[14px] pl-4">
        <p>
          <ClockCircleOutlined style={{ paddingRight: '5px' }} />
          <strong> Thời gian:</strong> {schedule.arrivalTime} -{' '}
          {schedule.departureTime}
        </p>
        <p>
          <CarOutlined style={{ paddingRight: '5px' }} />
          <strong> Phương tiện:</strong> {schedule.stransport}
        </p>
        <p>
          <ForkOutlined style={{ paddingRight: '5px' }} />
          <strong> Bữa ăn:</strong> {schedule.meal}
        </p>
        <p>
          <CheckOutlined style={{ paddingRight: '5px', color: '#228B22' }} />
          <strong> Hoạt động:</strong> {schedule.activities}
        </p>
      </div>
    ),
    style: panelStyle,
  }));

  const disabledDate = (date) => {
    const isAvailable = availableDates.some((d) =>
      d.isSame(dayjs(date), 'day')
    );
    const isBeforeLimit = dayjs(date).diff(dayjs(), 'day') < 7;
    return !isAvailable || isBeforeLimit;
  };

  const increase = (setter, currentValue, maxValue) => {
    if (totalGuests < maxValue) {
      setter(currentValue + 1);
    } else {
      message.warning(`Tour này chỉ còn ${maxValue} chỗ`);
    }
  };

  const decrease = (setter, min) =>
    setter((prev) => (prev > min ? prev - 1 : prev));

  useEffect(() => {
    console.log('Similar Tours:', JSON.stringify(similarTours, null, 2));
  }, [similarTours]);

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, type: 'spring', stiffness: 300 },
    },
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <style>
        {`
          @media (max-width: 767px) {
            .mobile-nav {
              display: flex;
              overflow-x: auto;
              white-space: nowrap;
              -webkit-overflow-scrolling: touch;
              padding: 0.5rem 0;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .mobile-nav::-webkit-scrollbar {
              display: none;
            }
            .mobile-nav button {
              display: inline-block;
              margin-right: 1rem;
              padding: 0.5rem 1rem;
              font-size: 13px;
              font-weight: 500;
              color: #333;
              background: #f0f0f0;
              border-radius: 20px;
              transition: background 0.2s;
            }
            .mobile-nav button:hover {
              background: #e0e0e0;
            }
            .mobile-sticky-booking {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 30; /* Giảm z-index để không đè lên header */
              background: white;
              box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
              padding: 1rem;
              transform: translateY(100%);
              transition: transform 0.3s ease-in-out;
            }
            .mobile-sticky-booking.visible {
              transform: translateY(0);
            }
            .mobile-sticky-booking-toggle {
              position: fixed;
              bottom: 1rem;
              right: 1rem;
              z-index: 31; /* Đảm bảo nút toggle trên form */
              background: #009EE2;
              color: white;
              border-radius: 50%;
              width: 48px;
              height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .mobile-section {
              margin-bottom: 1rem;
              padding: 0.5rem;
            }
            .mobile-section-content {
              max-height: 500px;
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
            }
          }
        `}
      </style>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f0ede3] shadow-md py-4 px-4 sm:px-6 sticky top-0 z-100" // Tăng z-index lên 100
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
          {/* Left Section: Back Button, Logo, and Brand */}
          <div className="flex items-center space-x-2">
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                onClick={() => navigate(-1)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-4"
              >
                <ArrowLeftOutlined />
              </Button>
            </motion.div>
            <img
              src={logo}
              alt="Travel TADA"
              className="h-8 w-auto hidden sm:block"
            />
            <span
              className="text-xl font-bold text-gray-900 hidden sm:block"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              TADA
            </span>
          </div>

          {/* Right Section: Navigation and Account */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              {navLinks.map((link) => {
                if (link.label === 'Tour Yêu Thích' && !isAuthenticated) {
                  return null;
                }
                return (
                  <motion.button
                    key={link.label}
                    whileHover={{ scale: 1.05 }}
                    className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
                    onClick={() => navigate(link.path)}
                    aria-label={link.label}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Desktop Account Dropdown */}
            <div className="hidden sm:block relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 text-gray-900 hover:text-blue-600 transition-all duration-200"
              >
                {isAuthenticated && user ? (
                  <>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-sm font-medium truncate max-w-[140px] mr-2"
                    >
                      {user.customer?.fullName || 'User'}
                    </motion.span>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar
                        src={
                          user.customer?.avatarUrl
                            ? `${user.customer.avatarUrl}?t=${Date.now()}`
                            : defaultAvatar
                        }
                        size={27}
                        icon={<UserOutlined />}
                        className="border border-gray-200 shadow-sm"
                      />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <UserOutlined className="text-[16px]" />
                    </motion.div>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-sm font-medium"
                    >
                      Tài khoản
                    </motion.span>
                  </>
                )}
              </button>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-[#f0ede3] shadow-lg rounded-lg border border-gray-200 p-2 z-[110]" // Tăng z-index lên 110
                >
                  {isAuthenticated && user ? (
                    <>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/profile');
                          setOpen(false);
                        }}
                      >
                        Thông tin cá nhân
                      </button>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/orders');
                          setOpen(false);
                        }}
                      >
                        Đơn mua
                      </button>
                      <button
                        className="w-full text-red-600 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="w-full bg-cyan-600 text-white py-1.5 px-2 rounded-md text-sm font-medium hover:bg-cyan-700 transition"
                        onClick={() => {
                          navigate('/login');
                          setOpen(false);
                        }}
                      >
                        Đăng nhập
                      </button>
                      <p className="text-center text-gray-600 text-xs mt-2 px-2">
                        Bạn chưa có tài khoản?{' '}
                        <span
                          className="text-cyan-600 font-medium cursor-pointer hover:underline"
                          onClick={() => {
                            navigate('/register');
                            setOpen(false);
                          }}
                        >
                          Đăng ký ngay
                        </span>
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Mobile Hamburger Menu Icon */}
            <div className="sm:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <CloseOutlined className="text-[20px] text-gray-700" />
                ) : (
                  <MenuOutlined className="text-[20px] text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sm:hidden bg-[#f0ede3] shadow-lg border-t border-gray-200 p-4 absolute top-[60px] left-0 right-0 z-[110]" // Tăng z-index lên 110
          >
            <div className="flex flex-col space-y-3">
              {mobileNavLinks.map((link) => (
                <span
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                    setAccountOpen(false);
                  }}
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-2"
                >
                  {link.label}
                </span>
              ))}
              <div className="border-t border-gray-200 pt-3">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-2 flex items-center justify-between w-full"
                >
                  Tài khoản
                  {accountOpen ? (
                    <UpOutlined className="text-sm" />
                  ) : (
                    <DownOutlined className="text-sm" />
                  )}
                </button>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col pl-4 space-y-2 mt-2"
                  >
                    {isAuthenticated && user ? (
                      <>
                        <button
                          className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={() => {
                            navigate('/profile');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Thông tin cá nhân
                        </button>
                        <button
                          className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={() => {
                            navigate('/orders');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Đơn mua
                        </button>
                        <button
                          className="w-full text-red-600 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full bg-cyan-600 text-white py-1.5 px-2 rounded-md text-sm font-medium hover:bg-cyan-700 transition"
                          onClick={() => {
                            navigate('/login');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Đăng nhập
                        </button>
                        <button
                          className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={() => {
                            navigate('/register');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Đăng ký ngay
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      <div className="h-full w-screen px-4 sm:px-10 py-5 bg-[#f8f8f8]">
        <div className="flex items-start flex-col sm:flex-row px-2">
          <p className="text-[18px] sm:text-[23px] font-bold px-0 sm:px-5 mt-2 sm:mt-0">
            Tour {tour?.location}: {tour?.name}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row h-full w-full mt-3">
          <div className="w-full md:w-2/3 px-0 md:px-5 min-h-screen">
            <div className="rounded-[8px] border-1 border-gray-300 shadow">
              <Carousel autoplay arrows className="touch-pan-y">
                {listImageTour.map((tour) => (
                  <div key={tour.id}>
                    <img
                      src={tour.image}
                      alt={`Tour ${tour.id}`}
                      className="h-[200px] sm:h-[450px] w-full rounded-[5px] object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="sticky top-16 bg-white shadow z-50">
              <nav className="h-16 mt-5 font-semibold flex justify-between text-[14px] sm:text-[15px] mobile-nav md:flex-row">
                <button onClick={() => scrollToSection('tong-quan')}>
                  Tổng Quan
                </button>
                <button onClick={() => scrollToSection('lich-trinh')}>
                  Lịch Trình Tour
                </button>
                <button onClick={() => scrollToSection('luu-y')}>
                  Điều Kiện Tour
                </button>
                <button onClick={() => scrollToSection('danh-gia')}>
                  Đánh Giá
                </button>
                <button onClick={() => scrollToSection('tour-tuong-tu')}>
                  Tour Tương Tự
                </button>
              </nav>
            </motion.div>

            <motion.div
              id="tong-quan"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white mt-4 rounded-[5px] p-4 sm:p-5 shadow mobile-section">
              <div className="mobile-section-content">
                <div className="flex flex-col sm:flex-row justify-between pb-3 text-[13px] sm:text-[14px]">
                  <p className="font-medium">
                    <EnvironmentOutlined className="pr-1" />
                    Địa điểm:{' '}
                    <span className="font-bold text-[14px] sm:text-[15px]">
                      {tour?.location}
                    </span>
                  </p>
                  <p className="font-medium mt-2 sm:mt-0">
                    Mã Tour:{' '}
                    <span className="font-bold text-[14px] sm:text-[15px]">
                      TO2467
                    </span>
                  </p>
                </div>
                <div className="border-1 border-gray-100"></div>
                <div className="text-[15px] sm:text-[16px] font-bold pt-5">
                  Tour Trọn Gói Bao Gồm
                </div>
                <div className="flex flex-col sm:flex-row w-full mt-5 text-[13px] sm:text-[14px]">
                  {benefits.map((column, index) => (
                    <ul
                      key={index}
                      className="space-y-5 sm:space-y-7 w-full sm:w-2/3">
                      {column.map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckOutlined style={{ color: '#1E90FF' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white mt-4 rounded-[5px] p-4 sm:p-5 shadow mobile-section">
              <div className="mobile-section-content">
                <div className="text-[15px] sm:text-[16px] font-bold pb-2">
                  Điểm Nhấn Hành Trình
                </div>
                <p className="text-[13px] sm:text-[14px]">
                  - {tour?.highlights} Trãi nghiệm loại hình du lịch:{' '}
                  <span className="font-medium text-[13px] sm:text-[14px] italic">
                    {tour?.tourcategory?.categoryName}
                  </span>
                  . {tour?.description}
                </p>
                <div className="text-[13px] sm:text-[14px] pt-3">
                  <p className="text-[14px] sm:text-[15px] font-medium pb-2 pl-2">
                    Trải nghiệm thú vị trong tour
                  </p>
                  <div className="pl-4 sm:pl-6">
                    {tour?.experiences?.split(';').map((exp, index) => (
                      <p key={index} className="pb-3 sm:pb-4">
                        <CheckOutlined
                          style={{
                            color: '#228B22',
                            paddingRight: '5px',
                            fontSize: '13px',
                          }}
                        />
                        {exp.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              id="lich-trinh"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full bg-white my-4 rounded-[5px] p-4 sm:p-5 shadow mobile-section">
              <div className="mobile-section-content">
                <div className="text-[15px] sm:text-[16px] font-bold pb-5">
                  Lịch Trình Tour
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={['0']}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    style={{
                      background: token.colorBgContainer,
                      fontSize: '13px',
                    }}
                    items={items}
                  />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              id="luu-y"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white mt-4 rounded-[5px] p-4 sm:p-5 shadow mobile-section">
              <div className="mobile-section-content">
                <div className="text-[15px] sm:text-[16px] font-bold">
                  Thông tin cần lưu ý
                </div>
                <div>
                  <Tabs defaultActiveKey="1" items={itemss} />
                </div>
              </div>
            </motion.div>
            <motion.div
              id="danh-gia"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white mt-4 rounded-[5px] p-4 sm:p-5 shadow mobile-section">
              <div className="mobile-section-content">
                <div className="text-[15px] sm:text-[16px] font-bold pb-2">
                  Đánh Giá Tour
                </div>
                <div className="space-y-4">
                  {tour?.reviews?.length > 0 ? (
                    tour.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="flex items-center pb-2">
                            <Avatar
                              size={36}
                              src={review?.avatarUrl || undefined}
                              icon={<UserOutlined />}
                              className="mr-2"
                            />
                            <span className="font-medium text-[13px] pl-2">
                              {review?.customerFullName || 'Khách hàng'}
                            </span>
                          </div>
                          <div className="flex items-center text-yellow-400 mt-2 sm:mt-0">
                            {[...Array(5)].map((_, i) => (
                              <StarFilled
                                key={i}
                                style={{
                                  color:
                                    i < review.rating ? '#FFD700' : '#d3d3d3',
                                  fontSize: '14px',
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="pl-10">
                          <p className="text-[13px] text-gray-600">
                            {review.comment}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {review.reviewDate}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13px] text-gray-600">
                      Chưa có đánh giá cho tour này.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div
              id="tour-tuong-tu"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white mt-4 rounded-[5px] p-4 sm:p-5 shadow mobile-section">
              <div className="mobile-section-content">
                <div className="text-[15px] sm:text-[16px] font-bold pb-2">
                  Tour Tương Tự
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-5 justify-between">
                  {similarTours.length > 0 ? (
                    similarTours.map((similarTour) => (
                      <ItemTourBestForYou
                        key={similarTour.tourId}
                        tour={similarTour}
                      />
                    ))
                  ) : (
                    <p className="text-[13px] text-gray-600">
                      Chưa có tour tương tự.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.7 }}
            whileInView={{ scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`hidden md:block w-1/3 max-h-[calc(100vh-40px)] flex justify-center sticky top-20 z-50 mb-2 ${
              tour?.availableSlot === 0 ? 'pointer-events-none opacity-50' : ''
            }`}>
            <div className="bg-amber-50 w-93 h-147 rounded-xl p-6 flex flex-col justify-between mb-5 border-1 border-gray-200 shadow relative">
              {tour?.availableSlot === 0 && (
                <Tag
                  color="error"
                  style={{
                    position: 'absolute',
                    top: '13px',
                    right: '0px',
                    transform: 'rotate(15deg)',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    padding: '5px 30px',
                    textAlign: 'center',
                  }}>
                  Hết chỗ
                </Tag>
              )}
              {tour?.availableSlot === 0 && (
                <div className="absolute inset-0 bg-gray-10 opacity-1" />
              )}
              <p className="text-[21px] text-blue-800 font-bold">
                Lịch Trình và Giá Tour
              </p>
              <div className="w-full border-1 border-gray-300"></div>
              <p className="text-[14px] text-gray-500 font-medium">
                Chọn Lịch Trình và Xem Giá:
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex mr-10 h-11 items-center border-1 border-gray-300 w-48 rounded-[8px]">
                <div className="flex items-center justify-center px-3 mt-2">
                  <CalendarOutlined className="text-gray-500 text-[14px] mb-2" />
                </div>
                <div className="flex flex-col items-center">
                  <DatePicker
                    value={startDate ? dayjs(startDate) : null}
                    onChange={(date) =>
                      setStartDate(date ? date.toDate() : null)
                    }
                    placeholder="Chọn ngày"
                    format="DD.MM.YYYY"
                    className="border-none text-[13px] h-7 w-35"
                    disabledDate={disabledDate}
                    dateRender={(current) => {
                      const isDisabled = disabledDate(current);
                      const isTooClose =
                        availableDates.some((d) => d.isSame(current, 'day')) &&
                        current.diff(dayjs(), 'day') < 7;
                      const isSelectable =
                        availableDates.some((d) => d.isSame(current, 'day')) &&
                        current.diff(dayjs(), 'day') >= 7;

                      return (
                        <div
                          className={`ant-picker-cell-inner ${
                            isDisabled
                              ? 'text-gray-400'
                              : isSelectable
                              ? 'text-black'
                              : ''
                          }`}
                          style={{ position: 'relative' }}>
                          {current.date()}
                          {isTooClose && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'gray',
                                fontSize: '16px',
                                fontWeight: 'bold',
                              }}>
                              ❌
                            </span>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              </motion.div>

              <div className="bg-white h-14 rounded-xl flex justify-between p-5 items-center text-center border-1 border-gray-300">
                <div className="text-center">
                  <p className="text-center text-[14px] font-medium">
                    Người lớn <br />
                  </p>
                  <div className="text-[10px] text-gray-700">≥ 10 tuổi</div>
                </div>
                <p className="text-black text-[14px] font-medium">
                  {(tour?.price && tour?.availableSlot > 0
                    ? tour.price *
                      adults *
                      (holidays.includes(dayjs(startDate).format('MM-DD'))
                        ? holidayRate
                        : 1)
                    : 0
                  ).toLocaleString('vi-VN')}
                </p>

                <div className="flex justify-between w-16 text-[13px] font-medium">
                  <MinusOutlined
                    className={`cursor-pointer ${
                      adults === 1 || tour?.availableSlot === 0
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }`}
                    onClick={() => decrease(setAdults, 1)}
                  />
                  <p>{tour?.availableSlot === 0 ? 0 : adults}</p>
                  <PlusOutlined
                    className={`cursor-pointer ${
                      totalGuests >= (tour?.availableSlot || 999) ||
                      tour?.availableSlot === 0
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }`}
                    onClick={() =>
                      increase(
                        setAdults,
                        adults,
                        (tour?.availableSlot || 999) - children - infants
                      )
                    }
                  />
                </div>
              </div>

              <div className="bg-white border-1 border-gray-300 text-center h-14 rounded-xl flex justify-between p-5 items-center">
                <div className="text-center">
                  <p className="text-center text-[14px] font-medium">
                    Trẻ em <br />
                  </p>
                  <div className="text-[10px] text-gray-700">2 - 10 tuổi</div>
                </div>
                <p className="text-black text-[14px] font-medium">
                  {(tour?.price
                    ? tour.price *
                      0.85 *
                      children *
                      (holidays.includes(dayjs(startDate).format('MM-DD'))
                        ? holidayRate
                        : 1)
                    : 0
                  ).toLocaleString('vi-VN')}
                </p>
                <div className="flex justify-between w-16 text-[13px] font-medium">
                  <MinusOutlined
                    className={`cursor-pointer ${
                      children === 0 ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    onClick={() => decrease(setChildren, 0)}
                  />
                  <p>{children}</p>
                  <PlusOutlined
                    className={`cursor-pointer ${
                      totalGuests >= (tour?.availableSlot || 999)
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }`}
                    onClick={() =>
                      increase(
                        setChildren,
                        children,
                        (tour?.availableSlot || 999) - adults - infants
                      )
                    }
                  />
                </div>
              </div>
              <div className="bg-white border-1 border-gray-300 text-center h-14 rounded-xl flex justify-between p-5 items-center">
                <div className="text-center">
                  <p className="text-center text-[14px] font-medium">
                    Trẻ nhỏ <br />
                  </p>
                  <div className="text-[10px] text-gray-700"> 2 tuổi</div>
                </div>
                <p className="text-black text-[14px] font-medium">
                  {(tour?.price
                    ? tour.price *
                      0.3 *
                      infants *
                      (holidays.includes(dayjs(startDate).format('MM-DD'))
                        ? holidayRate
                        : 1)
                    : 0
                  ).toLocaleString('vi-VN')}
                </p>
                <div className="flex justify-between w-16 text-[13px] font-medium">
                  <MinusOutlined
                    className={`cursor-pointer ${
                      infants === 0 ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    onClick={() => decrease(setInfants, 0)}
                  />
                  <p>{infants}</p>
                  <PlusOutlined
                    className={`cursor-pointer ${
                      totalGuests >= (tour?.availableSlot || 999)
                        ? 'opacity-50 pointer-events-none'
                        : ''
                    }`}
                    onClick={() =>
                      increase(
                        setInfants,
                        infants,
                        (tour?.availableSlot || 999) - adults - children
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center text-red-500 text-[12px]">
                  <GiftOutlined className="mr-1" />
                  <span>Ưu đãi: Giảm 10% cho nhóm 5 người</span>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-[14px] font-medium">Giảm giá ưu đãi</p>
                <div className="flex flex-row items-end">
                  <p className="text-[14px] font-medium text-gray-600">
                    {discountAmount.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-[12px] pl-2 font-medium text-gray-600">
                    VND
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-[14px] font-medium">Tổng Giá Tour</p>
                <div className="flex flex-row items-end">
                  <p className="text-[14px] font-medium text-gray-600">
                    {totalPrice.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-[12px] pl-2 font-medium text-gray-600">
                    VND
                  </p>
                </div>
              </div>
              <div className="w-full border-b-gray-50 border-1"></div>
              <div className="flex justify-between">
                <p className="text-[16px] font-medium">Tổng Thanh Toán</p>
                <div className="flex flex-row items-end">
                  <p className="text-[17px] font-bold text-red-700">
                    {(tour?.availableSlot === 0
                      ? 0
                      : finalPrice
                    ).toLocaleString('vi-VN')}
                  </p>
                  <p className="text-[10px] pl-2 font-medium text-red-700">
                    VND
                  </p>
                </div>
              </div>

              <div>
                <Button
                  type="primary"
                  style={{
                    width: '100%',
                    height: 40,
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 12,
                    backgroundColor: '#009EE2',
                  }}
                  onClick={() => {
                    if (!startDate) {
                      message.warning(
                        'Vui lòng chọn ngày đi trước khi đặt tour!'
                      );
                      return;
                    }

                    if (localStorage.getItem('TOKEN')) {
                      setShowBookingModal(true);
                    } else {
                      message.warning('Bạn cần đăng nhập để đặt tour!');
                    }
                  }}>
                  Đặt Tour
                </Button>
              </div>
              {holidays.includes(dayjs(startDate).format('MM-DD')) && (
                <p className="text-red-600 text-[10px] font-medium">
                  ⚠️ Giá tour sẽ có sự thay đổi vào các ngày lễ. Vui lòng kiểm
                  tra lại tổng giá khi chọn ngày.
                </p>
              )}

              <p className="text-[11px] text-red-500 font-medium">
                Lưu ý: Vui lòng đặt tour trước ngày khởi hành ít nhất 7 ngày.
              </p>
            </div>
          </motion.div>

          {/* Mobile Booking Form */}
          <div className="md:hidden ">
            <motion.div
              className={`mobile-sticky-booking ${
                showBookingPanel ? 'visible' : ''
              }`}
              initial={{ transform: 'translateY(100%)' }}
              animate={{
                transform: showBookingPanel
                  ? 'translateY(0)'
                  : 'translateY(100%)',
              }} >
              <div
                className={`bg-amber-50 rounded-xl p-4 flex flex-col justify-between border-1 border-gray-200 shadow relative ${
                  tour?.availableSlot === 0
                    ? 'pointer-events-none opacity-50'
                    : ''
                }`}>
                {tour?.availableSlot === 0 && (
                  <Tag
                    color="error"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      padding: '3px 15px',
                    }}>
                    Hết chỗ
                  </Tag>
                )}
                <p className="text-[18px] text-blue-800 font-bold">
                  Lịch Trình và Giá Tour
                </p>
                <div className="w-full border-1 border-gray-300 my-2"></div>
                <p className="text-[13px] text-gray-500 font-medium">
                  Chọn ngày khởi hành:
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-10 items-center border-1 border-gray-300 rounded-[8px] w-full mt-2">
                  <div className="flex items-center justify-center px-2">
                    <CalendarOutlined className="text-gray-500 text-[13px]" />
                  </div>
                  histology
                  <DatePicker
                    value={startDate ? dayjs(startDate) : null}
                    onChange={(date) =>
                      setStartDate(date ? date.toDate() : null)
                    }
                    placeholder="Chọn ngày"
                    format="DD.MM.YYYY"
                    className="border-none text-[13px] h-8 w-full"
                    disabledDate={disabledDate}
                    dateRender={(current) => {
                      const isDisabled = disabledDate(current);
                      const isTooClose =
                        availableDates.some((d) => d.isSame(current, 'day')) &&
                        current.diff(dayjs(), 'day') < 7;
                      const isSelectable =
                        availableDates.some((d) => d.isSame(current, 'day')) &&
                        current.diff(dayjs(), 'day') >= 7;

                      return (
                        <div
                          className={`ant-picker-cell-inner ${
                            isDisabled
                              ? 'text-gray-400'
                              : isSelectable
                              ? 'text-black'
                              : ''
                          }`}
                          style={{ position: 'relative' }}>
                          {current.date()}
                          {isTooClose && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'gray',
                                fontSize: '14px',
                                fontWeight: 'bold',
                              }}>
                              ❌
                            </span>
                          )}
                        </div>
                      );
                    }}
                  />
                </motion.div>

                <div className="bg-white h-12 rounded-lg flex justify-between p-3 items-center text-center border-1 border-gray-300 mt-3">
                  <div className="text-center">
                    <p className="text-[13px] font-medium">Người lớn</p>
                    <div className="text-[9px] text-gray-700">≥ 10 tuổi</div>
                  </div>
                  <p className="text-black text-[13px] font-medium">
                    {(tour?.price && tour?.availableSlot > 0
                      ? tour.price *
                        adults *
                        (holidays.includes(dayjs(startDate).format('MM-DD'))
                          ? holidayRate
                          : 1)
                      : 0
                    ).toLocaleString('vi-VN')}
                  </p>
                  <div className="flex justify-between w-14 text-[12px] font-medium">
                    <MinusOutlined
                      className={`cursor-pointer ${
                        adults === 1 || tour?.availableSlot === 0
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                      onClick={() => decrease(setAdults, 1)}
                    />
                    <p>{tour?.availableSlot === 0 ? 0 : adults}</p>
                    <PlusOutlined
                      className={`cursor-pointer ${
                        totalGuests >= (tour?.availableSlot || 999) ||
                        tour?.availableSlot === 0
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                      onClick={() =>
                        increase(
                          setAdults,
                          adults,
                          (tour?.availableSlot || 999) - children - infants
                        )
                      }
                    />
                  </div>
                </div>

                <div className="bg-white border-1 border-gray-300 text-center h-12 rounded-lg flex justify-between p-3 items-center mt-2">
                  <div className="text-center">
                    <p className="text-[13px] font-medium">Trẻ em</p>
                    <div className="text-[9px] text-gray-700">2 - 10 tuổi</div>
                  </div>
                  <p className="text-black text-[13px] font-medium">
                    {(tour?.price
                      ? tour.price *
                        0.85 *
                        children *
                        (holidays.includes(dayjs(startDate).format('MM-DD'))
                          ? holidayRate
                          : 1)
                      : 0
                    ).toLocaleString('vi-VN')}
                  </p>
                  <div className="flex justify-between w-14 text-[12px] font-medium">
                    <MinusOutlined
                      className={`cursor-pointer ${
                        children === 0 ? 'opacity-50 pointer-events-none' : ''
                      }`}
                      onClick={() => decrease(setChildren, 0)}
                    />
                    <p>{children}</p>
                    <PlusOutlined
                      className={`cursor-pointer ${
                        totalGuests >= (tour?.availableSlot || 999)
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                      onClick={() =>
                        increase(
                          setChildren,
                          children,
                          (tour?.availableSlot || 999) - adults - infants
                        )
                      }
                    />
                  </div>
                </div>

                <div className="bg-white border-1 border-gray-300 text-center h-12 rounded-lg flex justify-between p-3 items-center mt-2">
                  <div className="text-center">
                    <p className="text-[13px] font-medium">Trẻ nhỏ</p>
                    <div className="text-[9px] text-gray-700"> 2 tuổi</div>
                  </div>
                  <p className="text-black text-[13px] font-medium">
                    {(tour?.price
                      ? tour.price *
                        0.3 *
                        infants *
                        (holidays.includes(dayjs(startDate).format('MM-DD'))
                          ? holidayRate
                          : 1)
                      : 0
                    ).toLocaleString('vi-VN')}
                  </p>
                  <div className="flex justify-between w-14 text-[12px] font-medium">
                    <MinusOutlined
                      className={`cursor-pointer ${
                        infants === 0 ? 'opacity-50 pointer-events-none' : ''
                      }`}
                      onClick={() => decrease(setInfants, 0)}
                    />
                    <p>{infants}</p>
                    <PlusOutlined
                      className={`cursor-pointer ${
                        totalGuests >= (tour?.availableSlot || 999)
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                      onClick={() =>
                        increase(
                          setInfants,
                          infants,
                          (tour?.availableSlot || 999) - adults - children
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center text-red-500 text-[11px] mt-2">
                  <GiftOutlined className="mr-1" />
                  <span>Ưu đãi: Giảm 10% cho nhóm 5 người</span>
                </div>

                <div className="flex justify-between mt-2">
                  <p className="text-[13px] font-medium">Giảm giá ưu đãi</p>
                  <div className="flex flex-row items-end">
                    <p className="text-[13px] font-medium text-gray-600">
                      {discountAmount.toLocaleString('vi-VN')}
                    </p>
                    <p className="text-[11px] pl-1 font-medium text-gray-600">
                      VND
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-1">
                  <p className="text-[13px] font-medium">Tổng Giá Tour</p>
                  <div className="flex flex-row items-end">
                    <p className="text-[13px] font-medium text-gray-600">
                      {totalPrice.toLocaleString('vi-VN')}
                    </p>
                    <p className="text-[11px] pl-1 font-medium text-gray-600">
                      VND
                    </p>
                  </div>
                </div>

                <div className="w-full border-b-gray-50 border-1 my-2"></div>

                <div className="flex justify-between">
                  <p className="text-[14px] font-medium">Tổng Thanh Toán</p>
                  <div className="flex flex-row items-end">
                    <p className="text-[15px] font-bold text-red-700">
                      {(tour?.availableSlot === 0
                        ? 0
                        : finalPrice
                      ).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-[10px] pl-1 font-medium text-red-700">
                      VND
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <Button
                    type="primary"
                    style={{
                      width: '100%',
                      height: 36,
                      fontSize: 14,
                      fontWeight: 500,
                      borderRadius: 8,
                      backgroundColor: '#009EE2',
                    }}
                    onClick={() => {
                      if (!startDate) {
                        message.warning(
                          'Vui lòng chọn ngày đi trước khi đặt tour!'
                        );
                        return;
                      }

                      if (localStorage.getItem('TOKEN')) {
                        setShowBookingModal(true);
                        setShowBookingPanel(false);
                      } else {
                        message.warning('Bạn cần đăng nhập để đặt tour!');
                      }
                    }}>
                    Đặt Tour
                  </Button>
                </div>

                {holidays.includes(dayjs(startDate).format('MM-DD')) && (
                  <p className="text-red-600 text-[9px] font-medium mt-2">
                    ⚠️ Giá tour sẽ có sự thay đổi vào các ngày lễ. Vui lòng kiểm
                    tra lại tổng giá khi chọn ngày.
                  </p>
                )}

                <p className="text-[10px] text-red-500 font-medium mt-1">
                  Lưu ý: Vui lòng đặt tour trước ngày khởi hành ít nhất 7 ngày.
                </p>
              </div>
            </motion.div>
            <div
              className="mobile-sticky-booking-toggle mb-20 mr-3"
              onClick={() => setShowBookingPanel(!showBookingPanel)}>
              {showBookingPanel ? <CloseOutlined /> : <CalendarOutlined />}
            </div>
          </div>

          <Modal
            open={showBookingModal}
            onCancel={handleCloseModal}
            footer={null}
            width="90%"
            closeIcon={<CloseOutlined />}
            title={
              <span className="text-lg font-bold text-cyan-600">
                Chi Tiết Đặt Tour
              </span>
            }
            destroyOnClose={true}
            style={{ top: 10 }}
            className="md:w-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}>
              <TourBookingForm
                tourId={tourId}
                adults={adults}
                children={children}
                infants={infants}
                discountAmount={discountAmount}
                startDate={
                  startDate ? dayjs(startDate).format('YYYY-MM-DD') : null
                }
                totalPrice={totalPrice}
                priceForOneAdult={priceForOneAdult}
                priceForOneChild={priceForOneChild}
                priceForOneInfant={priceForOneInfant}
                tour={tour}
              />
            </motion.div>
          </Modal>
        </motion.div>
      </div>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f0ede3] text-black text-center p-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center gap-2 mb-2">
          <img src={logo} alt="Travel TADA" className="h-6 w-auto" />
          <span
            className="text-lg"
            style={{ fontFamily: 'Dancing Script, cursive' }}>
            Travel TADA
          </span>
        </motion.div>
        <p>© 2025 Travelista Tours. All Rights Reserved.</p>
      </motion.footer>
    </div>
  );
}
