import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, UserOutlined, BellOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const defaultAvatar = 'https://via.placeholder.com/40?text=User';

// Navigation links for unauthenticated users
const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour Gợi Ý', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/favourite-tours' },
];

// Button animation variants
const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    <div className="min-h-screen font-sans w-screen bg-gray-50">
      {/* Navbar */}
      <Header />

      {history.length > 0 && (
        <section className="py-10 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:mt-15 mt-10">
            <div className="flex justify-between items-center mb-8">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-3 sm:px-4"
                >
                  <ArrowLeftOutlined />
                </Button>
              </motion.div>
              <h2 className="text-[26px] font-bold text-[#0088c2] flex-1 text-center">
                Dành cho bạn
              </h2>
              <div className="w-10" /> {/* Spacer to balance the back button */}
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
                <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 justify-items-center">
                  {history
                    .filter((item) => item.tour !== null)
                    .map((item) => (
                      <motion.div
                        key={item.tour?.tourId || item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full w-full"
                      >
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
      <Footer />
    </div>
  );
};

export default Home;