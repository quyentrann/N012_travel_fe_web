import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Select, DatePicker, Button, Spin, Avatar, Skeleton, Empty, message } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  UserOutlined,
  BellOutlined,
  MenuOutlined,
  DownOutlined,
  UpOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUnreadCount } from '../../redux/notificationSlice';
import { fetchFavoriteTours } from '../../redux/tourSlice';
import { logout } from '../../redux/userSlice';
import ItemTourComponent from '../../components/ItemTourComponent';
import logo from '../../images/logo.png';
import { getTours, saveSearchQuery } from '../../apis/tour';

const { Option } = Select;
const { RangePicker } = DatePicker;

const defaultAvatar = 'https://via.placeholder.com/40?text=User';

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tours', path: '/search' },
  { label: 'Dành cho bạn', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/favourite-tours' },
];

const tourCategories = [
  'Biển đảo',
  'Núi rừng',
  'Thành phố',
  'Sông nước miệt vườn',
  'Sinh thái và khám phá',
];

const cleanLocation = (location) => {
  if (!location || typeof location !== 'string') return '';
  return location.replace(/^(Tỉnh|Thành phố)\s+/i, '').trim();
};

const cleanText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/[,.]/g, ' ').replace(/\s+/g, ' ').trim();
};

const computeSimilarity = (query, text, weight, isLocation = false) => {
  if (!query || !text) return 0.0;
  const cleanedQuery = cleanText(query).toLowerCase();
  const cleanedText = cleanText(text).toLowerCase();

  let score = 0;
  if (isLocation) {
    // Ưu tiên khớp chính xác hoặc chứa chuỗi đầy đủ cho location
    if (cleanedText === cleanedQuery) {
      score = weight * 3; // Điểm rất cao cho khớp chính xác
    } else if (cleanedText.includes(cleanedQuery)) {
      score = weight * 2; // Điểm cao cho chứa chuỗi
    }
  } else {
    // Cho name: chỉ chấp nhận chứa chuỗi đầy đủ
    if (cleanedText.includes(cleanedQuery)) {
      score = weight;
    }
  }

  return score;
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.2 } },
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { favoriteTours } = useSelector((state) => state.tours);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filter, setFilter] = useState({
    location: '',
    dates: null,
    priceRange: '',
    category: '',
  });
  const [localSearchTerm, setLocalSearchTerm] = useState(() => {
    const query = new URLSearchParams(location.search).get('query');
    return query ? decodeURIComponent(query) : '';
  });

  // Tải tours từ API
  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoading(true);
      setError(null);
      try {
        const response = await getTours();
        const tourData = response.data || response || [];
        console.log('Dữ liệu tours:', tourData.map(t => ({ id: t.tourId, location: t.location, name: t.name })));
        setTours(tourData);
        setFilteredTours(tourData);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
        message.error('Không thể tải danh sách tour!');
        setTours([]);
        setFilteredTours([]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tạo danh sách locations từ tours
  const locations = Array.from(
    new Set(tours.map((tour) => tour.location).filter(Boolean))
  ).map((loc) => ({ label: loc }));

  // Fetch unread notifications và favorite tours
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
      dispatch(fetchFavoriteTours()).catch((error) => {
        console.error('Error fetching favorite tours:', error);
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('TOKEN');
          dispatch(logout());
          navigate('/login');
        }
      });
    }
  }, [isAuthenticated, dispatch, navigate]);

  // Handle click outside
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

  const handleSearch = (currentFilter, currentSearchTerm) => {
    let filtered = tours;
    let scoredTours = [];

    if (currentSearchTerm.trim()) {
      const cleanedQuery = cleanText(currentSearchTerm.trim()).toLowerCase();
      scoredTours = filtered.map((tour) => {
        let score = 0.0;
        // Chỉ so sánh với location và name
        score += computeSimilarity(cleanedQuery, tour.location || '', 3.0, true);
        score += computeSimilarity(cleanedQuery, tour.name || '', 2.0);
        console.log(`Tour ${tour.tourId}: location=${tour.location}, name=${tour.name}, score=${score}`);
        return { tour, score };
      });
      filtered = scoredTours
        .filter((item) => item.score > 1.0) // Tăng ngưỡng
        .sort((a, b) => b.score - a.score)
        .map((item) => item.tour);
    }

    if (currentFilter.location) {
      const cleanedFilterLocation = cleanLocation(currentFilter.location).toLowerCase();
      filtered = filtered.filter(
        (tour) =>
          typeof tour?.location === 'string' &&
          cleanLocation(tour.location).toLowerCase() === cleanedFilterLocation
      );
    }

    if (currentFilter.priceRange) {
      const [min, max] = currentFilter.priceRange.split('-').map(Number);
      filtered = filtered.filter(
        (tour) => tour.price >= min && tour.price <= max
      );
    }

    if (currentFilter.dates) {
      const [start, end] = currentFilter.dates;
      filtered = filtered.filter((tour) => {
        if (!tour.tourDetails || !Array.isArray(tour.tourDetails)) {
          return false;
        }
        return tour.tourDetails.some((detail) => {
          const tourStart = new Date(detail.startDate);
          const tourEnd = new Date(detail.endDate);
          return (
            tourStart &&
            tourEnd &&
            !isNaN(tourStart) &&
            !isNaN(tourEnd) &&
            tourStart <= end &&
            tourEnd >= start
          );
        });
      });
    }

    if (currentFilter.category) {
      filtered = filtered.filter(
        (tour) =>
          tour.tourCategory?.categoryName &&
          tour.tourCategory.categoryName.toLowerCase() ===
            currentFilter.category.toLowerCase()
      );
    }

    setFilteredTours(filtered);
    return scoredTours;
  };

  const triggerSearch = async () => {
    if (isAuthenticated && localSearchTerm.trim()) {
      try {
        await saveSearchQuery(localSearchTerm.trim());
      } catch (error) {
        console.error('❌ Lỗi khi lưu lịch sử tìm kiếm:', error);
      }
    }
    handleSearch(filter, localSearchTerm);
  };

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    const clearedFilter = { location: '', dates: null, priceRange: '', category: '' };
    setFilter(clearedFilter);
    setLocalSearchTerm('');
    handleSearch(clearedFilter, '');
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => {
      const newFilter = { ...prev, [key]: value };
      handleSearch(newFilter, localSearchTerm);
      return newFilter;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
    setOpen(false);
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const handleFavoriteChange = (tourId, isFavorite) => {
    if (!isFavorite) {
      dispatch(fetchFavoriteTours()).then(() => {
        message.success('Đã xóa tour khỏi danh sách yêu thích!');
      });
    }
  };

  const mobileNavLinks = isAuthenticated
    ? navLinks
    : navLinks.filter(
        (link) =>
          link.label === 'Trang Chủ' ||
          link.label === 'Giới Thiệu' ||
          link.label === 'Tours'
      );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-white font-sans w-screen relative">
      {/* Navbar */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-[#e5e1d3] py-2">
        <div className="mx-[10px] md:mx-[30px] flex justify-between items-center">
          <div className="flex items-center">
            <motion.div variants={buttonVariants} whileHover="hover" className="md:hidden">
              <Button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-3"
              >
                <ArrowLeftOutlined />
              </Button>
            </motion.div>
            <div className="hidden md:flex items-center">
              <img src={logo} alt="logo" className="h-8 w-auto" />
              <span
                className="text-[16px] font-bold text-black ml-1 w-30"
                style={{ fontFamily: 'Dancing Script, cursive' }}
              >
                Travel TADA
              </span>
              <div className="pl-10 flex items-center space-x-6">
                {navLinks.map((link) => {
                  if (
                    (link.label === 'Dành cho bạn' ||
                      link.label === 'Tour Yêu Thích') &&
                    !isAuthenticated
                  ) {
                    return null;
                  }
                  return (
                    <span
                      key={link.label}
                      onClick={() => navigate(link.path)}
                      className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer"
                    >
                      {link.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            {isAuthenticated && (
              <motion.div className="relative flex items-center" whileHover={{ scale: 1.05 }}>
                <Input
                  placeholder="Tìm kiếm tour..."
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      triggerSearch();
                    }
                  }}
                  className="w-28 md:w-60 rounded-full text-xs md:text-sm py-1 pl-3 pr-8 border-none shadow-sm"
                  suffix={
                    <SearchOutlined className="text-gray-500 text-xs md:text-base" />
                  }
                />
              </motion.div>
            )}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="hidden md:block relative cursor-pointer text-gray-700 hover:text-cyan-600 transition-all duration-200 text-[16px] p-1 rounded-full hover:bg-cyan-50"
                onClick={() => navigate('/notifications')}
              >
                <BellOutlined />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1 py-0.5 rounded-full shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </motion.div>
            )}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 text-gray-900 hover:text-cyan-600 transition-all duration-200"
              >
                {isAuthenticated && user ? (
                  <>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-sm font-medium truncate max-w-[140px]"
                    >
                      {user.customer?.fullName || 'User'}
                    </motion.span>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar
                        src={user.customer?.avatarUrl || defaultAvatar}
                        size={28}
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
                  className="absolute right-0 mt-2 w-40 bg-[#f0ede3] shadow-lg rounded-lg border border-gray-200 p-2 z-50"
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
                        onClick={handleLogout}
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
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <CloseOutlined className="text-[18px] text-gray-700" />
                ) : (
                  <MenuOutlined className="text-[18px] text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#e5e1d3] shadow-lg border-t border-gray-200 p-3 absolute top-[56px] left-0 right-0 z-50"
          >
            <div className="flex flex-col space-y-2">
              {mobileNavLinks.map((link) => (
                <span
                  key={link.label}
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                    setAccountOpen(false);
                  }}
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-1.5"
                >
                  {link.label}
                </span>
              ))}
              {isAuthenticated && (
                <span
                  onClick={() => {
                    navigate('/notifications');
                    setMenuOpen(false);
                    setAccountOpen(false);
                  }}
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-1.5"
                >
                  Thông báo {unreadCount > 0 ? `(${unreadCount})` : ''}
                </span>
              )}
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-1.5 flex items-center justify-between w-full"
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
                    className="flex flex-col pl-3 space-y-1 mt-1"
                  >
                    {isAuthenticated && user ? (
                      <>
                        <button
                          className="w-full text-gray-700 py-1 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={() => {
                            navigate('/profile');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Thông tin cá nhân
                        </button>
                        <button
                          className="w-full text-gray-700 py-1 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={() => {
                            navigate('/orders');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Đơn mua
                        </button>
                        <button
                          className="w-full text-red-600 py-1 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full bg-cyan-600 text-white py-1 px-2 rounded-md text-sm font-medium hover:bg-cyan-700 transition"
                          onClick={() => {
                            navigate('/login');
                            setMenuOpen(false);
                            setAccountOpen(false);
                          }}
                        >
                          Đăng nhập
                        </button>
                        <button
                          className="w-full text-gray-700 py-1 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
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
      </motion.nav>

      {/* Sticky Filter Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="sticky top-[64px] z-40 bg-white py-4 px-5"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, scaleX: 0 }}
                animate={{ width: 'auto', opacity: 1, scaleX: 1 }}
                exit={{ width: 0, opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-xl shadow-md border border-gray-100">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800 mb-2">
                      Địa điểm
                    </label>
                    <Select
                      showSearch
                      placeholder="Chọn địa điểm"
                      value={filter.location}
                      onChange={(value) => handleFilterChange('location', value)}
                      className="w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {locations.map((loc) => (
                        <Option key={loc.label} value={loc.label}>
                          {loc.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800 mb-2">
                      Thời gian
                    </label>
                    <RangePicker
                      value={filter.dates}
                      onChange={(dates) => handleFilterChange('dates', dates)}
                      className="w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800 mb-2">
                      Khoảng giá
                    </label>
                    <Select
                      placeholder="Chọn khoảng giá"
                      value={filter.priceRange}
                      onChange={(value) => handleFilterChange('priceRange', value)}
                      className="w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
                      allowClear
                    >
                      <Option value="0-1000000">Dưới 1M</Option>
                      <Option value="1000000-3000000">1M - 3M</Option>
                      <Option value="3000000-5000000">3M - 5M</Option>
                      <Option value="5000000-10000000">5M - 10M</Option>
                      <Option value="10000000-999999999">Trên 10M</Option>
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-800 mb-2">
                      Loại hình
                    </label>
                    <Select
                      placeholder="Chọn loại hình"
                      value={filter.category}
                      onChange={(value) => handleFilterChange('category', value)}
                      className="w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
                      allowClear
                    >
                      {tourCategories.map((category) => (
                        <Option key={category} value={category}>
                          {category}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="flex-none"
          >
            <Button
              type="primary"
              icon={isFilterOpen ? <CloseOutlined /> : <FilterOutlined />}
              className="rounded-lg bg-cyan-600 hover:bg-cyan-700 px-4 py-1.5 text-sm font-medium flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? 'Ẩn bộ lọc' : 'Bộ lọc'}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 tracking-tight mt-10"
          >
            Khám Phá Hành Trình
          </motion.h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Tìm kiếm và lọc để tìm tour du lịch hoàn hảo cho bạn
          </p>
          <div className="mt-4 h-1 w-20 bg-blue-300 mx-auto rounded" />
        </div>

        <div className="relative">
          {isInitialLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto justify-items-center">
              {/* Skeleton loading */}
              {[...Array(6)].map((_, index) => (
                <Skeleton
                  key={index}
                  active
                  avatar={{ shape: 'square', size: 'large' }}
                  paragraph={{ rows: 3 }}
                  className="w-full max-w-[250px]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-600 bg-red-100 py-4 rounded-lg">
              Lỗi: {error}
            </div>
          ) : filteredTours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Empty description="Không tìm thấy tour nào phù hợp!" className="mt-8 sm:mt-16">
                <Button
                  type="primary"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-full px-6 py-2"
                  onClick={handleClearFilters}
                >
                  Xóa bộ lọc và thử lại
                </Button>
              </Empty>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto justify-items-center pl-10">
                {filteredTours.slice(0, visibleCount).map((tour) => (
                  <motion.div
                    key={tour.tourId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    className="w-full"
                  >
                    <ItemTourComponent
                      tour={tour}
                      isFavorite={favoriteTours.some((fav) => fav.tourId === tour.tourId)}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </motion.div>
                ))}
              </div>
              {visibleCount < filteredTours.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 bg-[#f0ede3] text-black py-4">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <p className="text-sm">© 2025 Travel TADA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;