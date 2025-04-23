// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { Avatar, Spin, message } from 'antd';
import { motion } from 'framer-motion';
import { logout } from '../redux/userSlice';
import logo from '../images/logo.png';
import defaultAvatar from '../images/defaultAvatar.png';

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Giới Thiệu', path: '/about' },
  { label: 'Tours', path: '/search' },
  { label: 'Dành cho bạn', path: '/recommended' },
  { label: 'Tour Yêu Thích', path: '/favourite-tours' },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#e5e1d3] py-2">
      <div className="mx-[30px] flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-8 w-auto" />
          <span
            className="text-[16px] font-bold text-black"
            style={{ fontFamily: 'Dancing Script, cursive' }}>
            Travel TADA
          </span>
          <div className="pl-10 hidden md:flex items-center space-x-6">
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
                  className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer">
                  {link.label}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          {isAuthenticated && (
            <div
              className="relative flex items-center cursor-pointer"
              onClick={() => navigate('/search')}>
              <motion.div
                className="flex items-center w-40 md:w-60 rounded-[18px] h-[35px] text-sm py-1 pl-4 pr-10 bg-white border border-gray-300 text-gray-500"
                whileHover={{ scale: 1.02 }}>
                <span className="text-[12px]">Tìm kiếm tour...</span>
                <SearchOutlined className="absolute right-3 text-gray-500" />
              </motion.div>
            </div>
          )}
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-1 text-gray-900 hover:text-cyan-600 transition-all duration-200">
              {isAuthenticated && user ? (
                <>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="text-sm font-medium truncate max-w-[140px] mr-2">
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
    </nav>
  );
};

export default Header;
