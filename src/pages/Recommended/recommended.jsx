import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, UserOutlined, BellOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Input, Button, Dropdown, Menu, Avatar, Carousel, Skeleton } from 'antd';
import { getTours } from '../../apis/tour';
import logo from '../../images/logo.png';
import nen1 from '../../images/nen5.png';
import nen2 from '../../images/Boat.png';
import ItemCradComponentressure from '../../components/ItemCradComponent';
import ItemTourBestForYou from '../../components/ItemTourBestForYou';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import ItemTourComponent from '../../components/ItemTourComponent';
import { logout } from '../../redux/userSlice';
import { setFilteredTours, fetchTours, fetchFavoriteTours } from '../../redux/tourSlice'; // Add fetchFavoriteTours
import { fetchLocations } from '../../redux/locationSlice';
import { fetchUnreadCount } from '../../redux/notificationSlice';
import { setSearchTerm } from '../../redux/searchSlice';
import { fetchSearchHistory } from '../../redux/searchHistorySlice';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const defaultAvatar = 'https://via.placeholder.com/40?text=User';

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour Gợi Ý', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/favourite-tours' },
];

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    tours,
    filteredTours,
    favoriteTours, // Add favoriteTours
    loading: toursLoading,
    error: toursError,
  } = useSelector((state) => state.tours);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const locations = useSelector((state) => state.locations.locations);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const {
    history,
    loading: historyLoading,
    error: historyError,
  } = useSelector((state) => state.searchHistory);

  useEffect(() => {
    const fetchData = async () => {
      const promises = [dispatch(fetchTours()), dispatch(fetchLocations())];
      if (isAuthenticated) {
        promises.push(
          dispatch(fetchSearchHistory()),
          dispatch(fetchUnreadCount()),
          dispatch(fetchFavoriteTours()) // Fetch favorite tours
        );
      }
      await Promise.all(promises);
    };
    fetchData();
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedTours = [...tours].sort((a, b) => {
    const totalOrdersA = a.bookings ? a.bookings.length : 0;
    const totalOrdersB = b.bookings ? b.bookings.length : 0;
    return totalOrdersB - totalOrdersA;
  });

  const handleTourClick = async (query) => {
    try {
      const token = localStorage.getItem('TOKEN');
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/search-history/click`,
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Tracked click for query:', query);
    } catch (error) {
      console.error('Error tracking tour click:', error);
    }
  };

  // Handle favorite change (optional, if you want to update favorite status)
  const handleFavoriteChange = (tourId, isFavorite) => {
    if (!isFavorite) {
      dispatch(fetchFavoriteTours()).then(() => {
        message.success('Đã xóa tour khỏi danh sách yêu thích!');
      });
    }
  };

  return (
    <div className="min-h-screen font-sans w-screen bg-gray-50 flex flex-col">
      <Header />

      {history.length > 0 && (
        <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-100 to-gray-200 flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-5 sm:mb-10">
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button
                               onClick={() => navigate('/')}
                               className="bg-gradient-to-r from-blue-400 to-blue-200 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-full px-4 py-2 shadow-md"
                             >
                  <ArrowLeftOutlined />
                </Button>
              </motion.div>
              <div className="text-center flex-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 tracking-tight sm:pt-10 pb-1">
                  Dành Cho Bạn
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Khám phá hành trình riêng theo sở thích của bạn.
                </p>
                <div className="mt-4 h-1 w-25 bg-blue-300 mx-auto rounded mb-3 sm:mb-4" />
              </div>
              <div className="w-10" />
            </div>

            <div className="relative">
              {historyLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton
                      key={index}
                      active
                      avatar={{ shape: 'square', size: 'large' }}
                      paragraph={{ rows: 3 }}
                      className="w-full max-w-[250px]"
                    />
                  ))}
                </div>
              ) : historyError ? (
                <div className="text-center text-red-600 bg-red-100 py-4 rounded-lg">
                  Lỗi: {historyError}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto justify-items-center">
                  {history.map((tour) => (
                    <motion.div
                      key={tour.tour?.tourId}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                    >
                      <ItemTourBestForYou
                        tour={tour}
                        isFavorite={favoriteTours.some((fav) => fav.tourId === tour.tour?.tourId)} // Pass isFavorite
                        onFavoriteChange={handleFavoriteChange} // Pass onFavoriteChange
                        onClick={() => handleTourClick(tour.tour?.name || tour.name || 'Unknown')}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {history.length >= 8 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate('/search')}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                >
                  Xem thêm tour gợi ý
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;