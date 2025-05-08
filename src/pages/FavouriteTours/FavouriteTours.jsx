import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Empty, message, Avatar } from 'antd';
import ItemCradComponent from '../../components/ItemTourComponent';
import { motion } from 'framer-motion';
import { SearchOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { logout } from '../../redux/userSlice';
import { fetchFavoriteTours } from '../../redux/tourSlice';
import logo from '../../images/logo.png';
import banner from '../../images/nen5.png';
import defaultAvatar from '../../images/defaultAvatar.png';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Navigation links for unauthenticated users
const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tour Gợi Ý', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/favourite-tours' },
];

const FavouriteTours = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favoriteTours, loading: toursLoading, error: toursError } = useSelector((state) => state.tours);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch favorite tours when component mounts
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
  const handleFavoriteChange = (tourId, isFavorite) => {
    if (!isFavorite) {
      dispatch(fetchFavoriteTours()).then(() => {
        message.success('Đã xóa tour khỏi danh sách yêu thích!');
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  // Normalize favorite tours data
  const normalizedFavoriteTours = favoriteTours.map((fav) => (fav.tour ? fav.tour : fav));

  return (
    <div className="min-h-screen bg-gray-100 w-screen">
      {/* Navbar */}
      <Header/>

      {/* Banner */}
      <section
        style={{
          height: '30vh sm:40vh',
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginTop: '60px', // Để không bị navbar che
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        ></div>
        <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: '24px sm:36px', fontWeight: 'bold', marginBottom: '8px' }}>
            Tour Yêu Thích
          </h1>
          <p style={{ fontSize: '14px sm:18px' }}>Những hành trình bạn yêu thích nhất</p>
        </div>
      </section>

      {/* Nội dung danh sách tour */}
      <div className="py-8 px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 text-center">Tour Yêu Thích</h2>
        {toursLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '150px sm:200px',
            }}
          >
            <Spin size="large" tip="Đang tải danh sách tour..." />
          </div>
        ) : toursError ? (
          <Empty description={toursError} />
        ) : normalizedFavoriteTours.length === 0 ? (
          <Empty description="Chưa có tour yêu thích nào!" className="mt-8 sm:mt-16">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate('/')}
            >
              Khám Phá Tour
            </button>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto justify-items-center">
            {normalizedFavoriteTours.map((tour) => (
              <motion.div
                key={tour.tourId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ItemCradComponent
                  tour={tour}
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default FavouriteTours;