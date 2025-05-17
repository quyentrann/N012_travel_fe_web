import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Empty, message, Button, Skeleton } from 'antd';
import ItemTourComponent from '../../components/ItemTourComponent';
import { motion } from 'framer-motion';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { logout } from '../../redux/userSlice';
import { fetchFavoriteTours } from '../../redux/tourSlice';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour Gợi Ý', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/favourite-tours' },
];

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const FavouriteTours = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favoriteTours: reduxFavoriteTours, loading: toursLoading, error: toursError } = useSelector((state) => state.tours);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [localFavoriteTours, setLocalFavoriteTours] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch favorite tours on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoriteTours()).catch((error) => {
        console.error('Error fetching favorite tours:', error);
        message.error('Không thể tải danh sách tour yêu thích!');
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('TOKEN');
          dispatch(logout());
          navigate('/login');
        }
      });
    }
  }, [dispatch, isAuthenticated, navigate]);

  // Sync local state with Redux state
  useEffect(() => {
    const normalized = reduxFavoriteTours.map((fav) => (fav.tour ? fav.tour : fav));
    setLocalFavoriteTours(normalized);
  }, [reduxFavoriteTours]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle favorite change (remove tour)
  const handleFavoriteChange = async (tourId, isFavorite) => {
    if (isUpdating) return;
    if (!isFavorite) {
      setIsUpdating(true);
      const previousTours = [...localFavoriteTours];
      // Optimistically remove the tour
      setLocalFavoriteTours(localFavoriteTours.filter((tour) => tour.tourId !== tourId));

      try {
        const token = localStorage.getItem('TOKEN');
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/favorites/${tourId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success('Đã xóa tour khỏi danh sách yêu thích!');
      } catch (error) {
        console.error('Error removing favorite tour:', error);
        // Check server state to confirm if the tour was actually removed
        const result = await dispatch(fetchFavoriteTours()).unwrap();
        const normalized = result.map((fav) => (fav.tour ? fav.tour : fav));
        const isTourRemoved = !normalized.some((tour) => tour.tourId === tourId);
        
        if (isTourRemoved) {
          // Tour was removed despite 403, keep optimistic update
          message.success('Đã xóa tour khỏi danh sách yêu thích!');
          setLocalFavoriteTours(normalized); // Sync with server state
        } else {
          // Tour was not removed, revert optimistic update
          message.error('Không thể xóa tour khỏi danh sách yêu thích!');
          setLocalFavoriteTours(previousTours);
        }
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans w-screen bg-gray-50 flex flex-col">
      <Header />
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-100 to-gray-200 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <motion.div variants={buttonVariants} whileHover="hover">
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-400 to-blue-200 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-full px-4 py-2 shadow-md"
              >
                <ArrowLeftOutlined />
              </Button>
            </motion.div>
            <div className="text-center flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 tracking-tight pt-10 pb-3">
                Tour Yêu Thích
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                Những hành trình bạn yêu thích nhất
              </p>
              <div className="mt-4 h-1 w-20 bg-blue-300 mx-auto rounded" />
            </div>
            <div className="w-10" />
          </div>
          <div className="relative">
            {toursLoading && localFavoriteTours.length === 0 ? (
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
            ) : toursError ? (
              <div className="text-center text-red-600 bg-red-100 py-4 rounded-lg">
                Lỗi: {toursError}
              </div>
            ) : localFavoriteTours.length === 0 ? (
              <Empty description="Chưa có tour yêu thích nào!" className="mt-8 sm:mt-16">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-full px-4 py-2 shadow-md"
                  onClick={() => navigate('/')}
                >
                  Khám Phá Tour
                </Button>
              </Empty>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto justify-items-center">
                {localFavoriteTours.map((tour) => (
                  <motion.div
                    key={tour.tourId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                  >
                    <ItemTourComponent
                      tour={tour}
                      isFavorite={true}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {localFavoriteTours.length >= 8 && (
            <div className="mt-10 text-center">
              <Button
                onClick={() => navigate('/recommended')}
                className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-medium rounded-full px-6 py-2"
              >
                Xem thêm tour gợi ý
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FavouriteTours;