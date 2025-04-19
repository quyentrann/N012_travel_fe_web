import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  BellOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { Input, Button, Dropdown, Menu, Avatar, Carousel, Spin } from 'antd';
import { getTours } from '../../apis/tour';
import logo from '../../images/logo.png';
import nen1 from '../../images/nen5.png';
import nen2 from '../../images/Boat.png';
import ItemCradComponent from '../../components/ItemCradComponent';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import ItemTourComponent from '../../components/ItemTourComponent';
import { logout } from '../../redux/userSlice';
import { setFilteredTours, fetchTours } from '../../redux/tourSlice';
import { fetchLocations } from '../../redux/locationSlice';
import { fetchUnreadCount } from '../../redux/notificationSlice';
import { setSearchTerm } from '../../redux/searchSlice';
import { fetchSearchHistory } from '../../redux/searchHistorySlice';

const defaultAvatar = 'https://via.placeholder.com/40?text=User';

// Navigation links for unauthenticated users
const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour Gợi Ý', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/tours' },
];

const CustomPrevArrow = ({ onClick }) => (
  <div
    className="absolute z-10 left-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
    onClick={onClick}>
    <LeftCircleOutlined style={{ fontSize: '17px', color: 'gray' }} />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    className="absolute z-10 right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
    onClick={onClick}>
    <RightCircleOutlined style={{ fontSize: '17px', color: 'gray' }} />
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { tours, filteredTours } = useSelector((state) => state.tours);
  const {
    tours,
    filteredTours,
    loading: toursLoading,
    error: toursError,
  } = useSelector((state) => state.tours);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const locations = useSelector((state) => state.locations.locations);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [open, setOpen] = useState(false); // State for user dropdown
  const dropdownRef = useRef(null);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const userState = useSelector((state) => state.user);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const {
    history,
    loading: historyLoading,
    error: historyError,
  } = useSelector((state) => state.searchHistory);
  const [recommendations, setRecommendations] = useState([]);
  // console.log('tour', tours);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const fetchSearchHistory = async () => {
  //       try {
  //         const token = localStorage.getItem('TOKEN');
  //         if (!token) {
  //           console.error('No token found in localStorage');
  //           return;
  //         }

  //         const response = await axios.get('http://localhost:8080/api/search-history/my-history', {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         setRecommendations(response.data);
  //         console.log('Search History:', response.data);
  //       } catch (err) {
  //         console.error('Failed to fetch search history:', err.response?.data || err.message);
  //       }
  //     };

  //     fetchSearchHistory();
  //   } else {
  //     console.log('Not authenticated, skipping search history fetch');
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = [dispatch(fetchTours()), dispatch(fetchLocations())];
      if (isAuthenticated) {
        promises.push(
          dispatch(fetchSearchHistory()),
          dispatch(fetchUnreadCount())
        );
      }
      await Promise.all(promises);
    };
    fetchData();
  }, [dispatch, isAuthenticated]);

  // Fetch locations
  // useEffect(() => {
  //   dispatch(fetchLocations());
  // }, [dispatch]);

  // Fetch tours
  // useEffect(() => {
  //   dispatch(fetchTours());
  // }, [dispatch]);

  // Handle search
  // useEffect(() => {
  //   if (!searchTerm.trim()) {
  //     dispatch(setFilteredTours(tours));
  //   } else {
  //     const filtered = tours.filter((tour) =>
  //       tour.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     dispatch(setFilteredTours(filtered));
  //   }
  // }, [searchTerm, tours, dispatch]);

  // const handleSearchChange = (e) => {
  //   dispatch(setSearchTerm(e.target.value));
  // };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

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

  // Sorted tours for popular section
  const sortedTours = [...tours].sort((a, b) => {
    const totalOrdersA = a.bookings ? a.bookings.length : 0;
    const totalOrdersB = b.bookings ? b.bookings.length : 0;
    return totalOrdersB - totalOrdersA;
  });

  return (
    <div className="min-h-screen font-sans w-screen">
      {/* Navbar */}
      <nav
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
          <div className="flex items-center space-x-2 cursor-pointer">
            {/* Search Bar */}
            {isAuthenticated && (
              <div
                className="relative flex items-center cursor-pointer"
                onClick={() => navigate('/search')}>
                <motion.div
                  className="flex items-center w-40 md:w-60 rounded-[18px] h-[35px] text-sm py-1 pl-4 pr-10 bg-white border border-gray-300 text-gray-500"
                  whileHover={{ scale: 1.02 }}>
                  <span className=" text-[12px]">Tìm kiếm tour...</span>
                  <SearchOutlined className="absolute right-3 text-gray-500" />
                </motion.div>
              </div>
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
      </nav>


      {history.length > 0 && (
        <section className="py-10 bg-gray-100">
          <div className="max-w-7xl mx-auto px-5 mt-20">
            <div className="flex justify-between items-center mb-8">
              <div className="w-full">
                <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                  Dành cho bạn
                </h2>
              </div>
              <div className="text-end w-[75px]">
                <span
                  onClick={() => navigate('/bestforyou')}
                  className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                  Xem tất cả
                </span>
              </div>
            </div>

            <div className="relative">
              {historyLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spin size="large" tip="Loading recommendations..." />
                </div>
              ) : historyError ? (
                <div className="text-center text-red-600">
                  Error: {historyError}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {history
    .filter((item) => item.tour !== null)
    .map((item) => (
      <motion.div
        key={item.tour?.tourId || item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full">
        <ItemTourBestForYou tour={item.tour} />
      </motion.div>
    ))}
</div>

              )}
            </div>
          </div>
        </section>
      )}



      {/* Footer */}
      <footer className="bg-[#f0ede3] text-black py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Về Travel TADA</h4>
              <p className="text-sm">
                Nền tảng du lịch trực tuyến mang đến những hành trình đáng nhớ,
                an toàn và tiện lợi.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Chính sách</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/about" className="hover:underline">
                    Chính sách hoàn hủy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <p className="text-sm">Email: support@traveltada.vn</p>
              <p className="text-sm">Hotline: 1900 8888</p>
            </div>
          </div>
          <p className="text-sm">© 2025 Travel TADA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
