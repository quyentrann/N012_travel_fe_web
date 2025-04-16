import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Select, DatePicker, Button, Spin, Avatar } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { setSearchTerm } from '../../redux/searchSlice';
import { setFilteredTours } from '../../redux/tourSlice';
import { fetchUnreadCount } from '../../redux/notificationSlice';
import { logout } from '../../redux/userSlice';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import logo from '../../images/logo.png';

const { Option } = Select;
const { RangePicker } = DatePicker;

const defaultAvatar = 'https://via.placeholder.com/40?text=User';

// Navigation links
const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour', path: '/tours' },
  { label: 'Tour Yêu Thích', path: '/tours' },
];

// Hàm chuẩn hóa location để so sánh
const cleanLocation = (location) => {
    if (!location || typeof location !== 'string') return '';
    return location.replace(/^(Tỉnh|Thành phố)\s+/i, '').trim();
  };
  
  
  const simplifyLocation = (location) => {
    if (!location) return '';
    const parts = location.split('-').map((part) => part.trim());
    return parts[parts.length - 1];
  };

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tours, filteredTours, loading } = useSelector((state) => state.tours);
  const { locations } = useSelector((state) => state.locations);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [open, setOpen] = useState(false); // State for user dropdown
  const dropdownRef = useRef(null);
  const [filter, setFilter] = useState({
    location: '',
    dates: null,
    priceRange: '',
  });

  console.log("tour", tours);
  
  

  // Fetch unread notifications
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
    }
  }, [isAuthenticated, dispatch]);

  // Handle search and filtering
  useEffect(() => {
    let filtered = tours;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } 
    console.log('Raw location filter:', filter.location);

    // Filter by location
    if (filter.location) {
        const cleanedFilterLocation = cleanLocation(filter.location);
        const simplifiedFilterLocation = simplifyLocation(cleanedFilterLocation);
        filtered = filtered.filter((tour) =>
          typeof tour?.location === 'string' &&
          tour?.location.toLowerCase().includes(simplifiedFilterLocation.toLowerCase())
        );
      }

    // Filter by price range
    if (filter.priceRange) {
      const [min, max] = filter.priceRange.split('-').map(Number);
      filtered = filtered.filter(
        (tour) => tour.price >= min && tour.price <= max
      );
    }

    if (filter.dates) {
        const [start, end] = filter.dates;
        filtered = filtered.filter((tour) => {
          // Kiểm tra tour.tourDetails là mảng và không rỗng
          if (!tour.tourDetails || !Array.isArray(tour.tourDetails)) {
            return false;
          }
          // Tìm lịch trình có giao với [start, end]
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
  
      dispatch(setFilteredTours(filtered));
    }, [searchTerm, filter, tours, dispatch]);

  // Handle dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleClearFilters = () => {
    setFilter({ location: '', dates: null, priceRange: '' });
    dispatch(setSearchTerm(''));
  };
  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white font-sans w-screen">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#e5e1d3] py-2">
        <div className="mx-[30px] flex justify-between items-center">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center">
            <img src={logo} alt="logo" className="h-8 w-auto" />
            <span
              className="text-[16px] font-bold text-black"
              style={{ fontFamily: 'Dancing Script, cursive' }}>
              Travel TADA
            </span>
            <div className="pl-10 hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <span
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer">
                  {link.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right Section: User Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Bar */}
            {isAuthenticated && (
              <motion.div
                className="relative flex items-center"
                whileHover={{ scale: 1.05 }}>
                <Input
                  placeholder="Tìm kiếm tour..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-40 md:w-60 rounded-full text-sm py-1 pl-4 pr-10 border-none shadow-sm"
                  suffix={<SearchOutlined className="text-gray-500" />}
                />
              </motion.div>
            )}

            {/* Notification Icon */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="relative cursor-pointer text-gray-700 hover:text-cyan-600 transition-all duration-200 text-[16px] p-1 rounded-full hover:bg-cyan-50"
                onClick={() => navigate('/notifications')}>
                <BellOutlined />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[12px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </motion.div>
            )}

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 text-gray-900 hover:text-cyan-600 transition-all duration-200">
                {isAuthenticated && user ? (
                  <>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-sm font-medium truncate max-w-[140px]">
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
                      className="text-sm font-medium">
                      Tài khoản
                    </motion.span>
                  </>
                )}
              </button>
              {/* Dropdown Menu */}
              {open && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-[#f0ede3] shadow-lg rounded-lg border border-gray-200 p-2 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/profile');
                          setOpen(false);
                        }}>
                        Thông tin cá nhân
                      </button>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/orders');
                          setOpen(false);
                        }}>
                        Đơn mua
                      </button>
                      <button
                        className="w-full text-red-600 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}>
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
                        }}>
                        Đăng nhập
                      </button>
                      <p className="text-center text-gray-600 text-xs mt-2 px-2">
                        Bạn chưa có tài khoản?{' '}
                        <span
                          className="text-cyan-600 font-medium cursor-pointer hover:underline"
                          onClick={() => {
                            navigate('/register');
                            setOpen(false);
                          }}>
                          Đăng ký ngay
                        </span>
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sticky Filter Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="sticky top-[64px] z-40 bg-white py-4 px-5">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, scaleX: 0 }}
                animate={{ width: 'auto', opacity: 1, scaleX: 1 }}
                exit={{ width: 0, opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-100">
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
  optionFilterProp="children"  // để tìm theo label
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
                      onChange={(value) =>
                        handleFilterChange('priceRange', value)
                      }
                      className="w-full rounded-lg border-gray-300 focus:border-cyan-600 focus:ring-cyan-600"
                      allowClear>
                      <Option value="0-1000000">Dưới 1M</Option>
                      <Option value="1000000-3000000">1M - 3M</Option>
                      <Option value="3000000-5000000">3M - 5M</Option>
                      <Option value="5000000-10000000">5M - 10M</Option>
                      <Option value="10000000-999999999">Trên 10M</Option>
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
            className="flex-none">
            <Button
              type="primary"
              icon={isFilterOpen ? <CloseOutlined /> : <FilterOutlined />}
              className="rounded-lg bg-cyan-600 hover:bg-cyan-700 px-4 py-1.5 text-sm font-medium flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}>
              {isFilterOpen ? 'Ẩn bộ lọc' : 'Bộ lọc'}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto  py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-gray-800 mb-6">
          Kết quả tìm kiếm ({filteredTours.length})
        </motion.h2>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : filteredTours.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              Không tìm thấy tour nào phù hợp.
            </p>
           <Button
  type="primary"
  className="rounded-lg bg-cyan-600 hover:bg-cyan-700 px-6 py-2 text-sm font-medium"
  onClick={handleClearFilters}>
  Xóa bộ lọc và thử lại
</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour.tourId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
                <ItemTourBestForYou tour={tour} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#f0ede3] text-black py-4">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <p className="text-sm">© 2025 Travel TADA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
