import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchOutlined,
  UserOutlined,
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
    <div className="min-h-screen font-sans w-screen">
      {/* Navbar */}
      <Header/>


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
     <Footer/>
    </div>
  );
};

export default Home;
