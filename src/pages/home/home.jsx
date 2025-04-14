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
import { Input, Button, Dropdown, Menu, Avatar, Carousel } from 'antd';
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
import {setFilteredTours, fetchTours } from '../../redux/tourSlice'
import {fetchLocations} from '../../redux/locationSlice'
import {fetchUnreadCount} from '../../redux/notificationSlice'
import {setSearchTerm} from '../../redux/searchSlice'

const defaultAvatar = 'https://via.placeholder.com/40?text=User';

// Navigation links for unauthenticated users
const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour', path: '/tours' },
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
  // const [tours, setTours] = useState([]);
  const { tours, filteredTours } = useSelector((state) => state.tours);
  // const [filteredTours, setFilteredTours] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  const searchTerm = useSelector((state) => state.search.searchTerm);
  // const [locations, setLocations] = useState([]);
  const locations = useSelector((state) => state.locations.locations);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [open, setOpen] = useState(false); // State for user dropdown
  const dropdownRef = useRef(null);
  // const [unreadCount, setUnreadCount] = useState(0);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const userState = useSelector((state) => state.user);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  console.log('State user thay đổi nèeee', userState);
  console.log('user nèeee', user, 'isAuthenticated nèeee', isAuthenticated);
  console.log('user_info nèeee', localStorage.getItem('user_info'));

  

  // Fetch unread notifications
  // useEffect(() => {
  //   const fetchUnreadNotifications = async () => {
  //     try {
  //       const response = await axios.get('/api/notifications/unread-count');
  //       setUnreadCount(response.data.count);
  //     } catch (err) {
  //       console.error('Failed to fetch unread notifications');
  //     }
  //   };
  //   if (isAuthenticated) {
  //     fetchUnreadNotifications();
  //   }
  // }, [isAuthenticated]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
    }
  }, [isAuthenticated, dispatch]);

  

  // Fetch locations
  // useEffect(() => {
  //   axios
  //     .get('https://provinces.open-api.vn/api/')
  //     .then((response) => {
  //       const data = response.data.map((province) => ({
  //         value: province.code,
  //         label: province.name,
  //       }));
  //       setLocations(data);
  //     })
  //     .catch((error) => console.error('Error fetching locations:', error));
  // }, []);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // Fetch tours
  // useEffect(() => {
  //   const fetchTours = async () => {
  //     try {
  //       const data = await getTours();
  //       setTours(data);
  //       setFilteredTours(data);
  //     } catch (error) {
  //       console.error('Error fetching tours:', error);
  //     }
  //   };
  //   fetchTours();
  // }, []);
  useEffect(() => {
    dispatch(fetchTours());
  }, [dispatch]);

  // Handle search
  // useEffect(() => {
  //   if (!searchTerm.trim()) {
  //     setFilteredTours(tours);
  //   } else {
  //     const filtered = tours.filter((tour) =>
  //       tour.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredTours(filtered);
  //   }
  // }, [searchTerm, tours]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      dispatch(setFilteredTours(tours));
    } else {
      const filtered = tours.filter((tour) =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch(setFilteredTours(filtered));
    }
  }, [searchTerm, tours, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#e5e1d3]  py-2">
        <div className="mx-[30px] flex justify-between items-center">
          {/* Left Section: Logo and Title */}
          <div className="flex items-center ">
            <img src={logo} alt="logo" className="h-8 w-auto" />
            <span
              className="text-[16px] font-bold text-black "
              style={{ fontFamily: 'Dancing Script, cursive' }}>
              Travel TADA
            </span>
            <div className="pl-10">
              <div className="hidden md:flex items-center space-x-6">
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
          </div>

          {/* Right Section: User Actions */}
          <div className="flex items-center space-x-2">
            {/* 🔍 Tìm kiếm - Only show if user is logged in */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="cursor-pointer text-gray-700 hover:text-cyan-600 transition-all duration-200 text-[16px] p-1 rounded-full hover:bg-cyan-50"
                onClick={() => navigate('/search')}>
                <SearchOutlined />
              </motion.div>
            )}

            {/* 🔔 Thông báo - Only show if user is logged in */}
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

            {/* 👤 Dropdown tài khoản */}
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

      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${nen1})`,
          backgroundPosition: 'center bottom',
        }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your Next Adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-8">
            Explore breathtaking destinations with TADA
          </motion.p>

          {/* Search Bar */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.4 }}
  className="bg-white/90 rounded-xl p-4 max-w-3xl mx-auto shadow-lg">
  <div className="flex items-center space-x-4">
    <div className="flex-1">
      <input
        type="text"
        placeholder="Where to go?"
        value={searchTerm}
        onChange={handleSearchChange} // Sử dụng handleSearchChange
        className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-cyan-600 text-gray-900"
      />
    </div>
    <button
      onClick={() => setIsSearchOpen(!isSearchOpen)}
      className="p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
      <SearchOutlined />
    </button>
  </div>
  {/* Advanced Filters */}
  <AnimatePresence>
    {isSearchOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="p-3 rounded-lg border-none bg-gray-100 text-gray-900"
          defaultValue="">
          <option value="" disabled>
            Select Location
          </option>
          {locations.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="p-3 rounded-lg border-none bg-gray-100 text-gray-900"
        />
        <select
          className="p-3 rounded-lg border-none bg-gray-100 text-gray-900"
          defaultValue="">
          <option value="" disabled>
            Select Price Range
          </option>
          {[
            { label: 'Under 1M', value: '0-1000000' },
            { label: '1M - 3M', value: '1000000-3000000' },
            { label: '3M - 5M', value: '3000000-5000000' },
            { label: '5M - 10M', value: '5000000-10000000' },
            { label: 'Over 10M', value: '10000000-999999999' },
          ].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
        </div>
      </section>

      {/* Popular Tours */}
      <section className="py-10 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-8">
            <div className="w-full">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Most Popular Tours
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[13px]">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="relative">
            {sortedTours.length === 0 ? (
              <div className="text-center text-gray-600">
                No popular tours available.
              </div>
            ) : (
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(4, sortedTours.length)}
                slidesToScroll={1}
                infinite={sortedTours.length > 3}
                // autoplay={true}
                // autoplaySpeed={3000}
                className="w-full carousel-container">
                {sortedTours.map((tour) => (
                  <div key={tour.tourId} className="px-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center">
                      <ItemCradComponent tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
      </section>

      {/* <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-8">
            <div className="w-full ">
              <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
                Best Packages For You
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center text-gray-600">No tours available.</div>
          ) : (
            <div className="relative">
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, filteredTours.length)}
                slidesToScroll={1}
                infinite={filteredTours.length > 3}
                className="w-full">
                {filteredTours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourBestForYou tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section> */}

      {/* <section className="py-12 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full ">
            <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
              Island & Beach Escapes
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center text-gray-600">No tours available.</div>
          ) : (
            <div className="relative">
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, filteredTours.length)}
                slidesToScroll={1}
                infinite={filteredTours.length > 3}
                className="w-full">
                {filteredTours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourComponent tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section> */}

      {/* <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full ">
            <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
            Mountain & Nature Retreats
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center text-gray-600">No tours available.</div>
          ) : (
            <div className="relative">
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, filteredTours.length)}
                slidesToScroll={1}
                infinite={filteredTours.length > 3}
                className="w-full">
                {filteredTours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourComponent tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section> */}

      {/* <section className="py-12 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full ">
            <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
            City Adventures
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center text-gray-600">No tours available.</div>
          ) : (
            <div className="relative">
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, filteredTours.length)}
                slidesToScroll={1}
                infinite={filteredTours.length > 3}
                className="w-full">
                {filteredTours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourComponent tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section> */}

      {/* <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full ">
            <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
            River & Countryside Tours
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center text-gray-600">No tours available.</div>
          ) : (
            <div className="relative">
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, filteredTours.length)}
                slidesToScroll={1}
                infinite={filteredTours.length > 3}
                className="w-full">
                {filteredTours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourComponent tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section> */}

      {/* <section className="py-12 bg-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-10">
            <div className="w-full ">
            <h2 className="text-[26px] font-bold text-center text-[#0088c2]">
            Eco & Discovery Tours
              </h2>
            </div>
            <div className="text-end w-[75px]">
              <span
                onClick={() => navigate('/bestforyou')} // Navigate to /all-tours
                className="text-[#258dba] font-medium hover:underline cursor-pointer text-[14px]">
                Xem tất cả
              </span>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="text-center text-gray-600">No tours available.</div>
          ) : (
            <div className="relative">
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                slidesToShow={Math.min(3, filteredTours.length)}
                slidesToScroll={1}
                infinite={filteredTours.length > 3}
                className="w-full">
                {filteredTours.map((tour) => (
                  <div key={tour.tourId} className="px-3 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center h-full">
                      <ItemTourComponent tour={tour} />
                    </motion.div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </section> */}

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
