import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined, UserOutlined, BellOutlined, MenuOutlined, CloseOutlined, DownOutlined, UpOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Avatar, Spin, message, Button } from 'antd';
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
  const [open, setOpen] = useState(false); // For desktop user dropdown
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const [accountOpen, setAccountOpen] = useState(false); // For mobile account sub-menu
  const [searchQuery, setSearchQuery] = useState(''); // For search input
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  // Handle click outside for dropdown and mobile menu
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

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
    setOpen(false);
    setMenuOpen(false);
    setAccountOpen(false);
  };

  // Handle search input on same page
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Replace this with your actual search logic
      console.log('Searching for:', searchQuery);
      // Optionally clear the input after search
      setSearchQuery('');
    }
  };

  // Filter navLinks for mobile menu when not authenticated
  const mobileNavLinks = isAuthenticated
    ? navLinks
    : navLinks.filter(link => 
        link.label === 'Trang Chủ' || 
        link.label === 'Giới Thiệu' || 
        link.label === 'Tours'
      );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#e5e1d3] py-2">
      <div className="mx-[30px] flex justify-between items-center">
        {/* Logo, Brand, and Desktop Navigation */}
        <div className="flex items-center">
          <div className="hidden md:flex items-center">
            <img src={logo} alt="logo" className="h-8 w-auto" />
            <span
              className="text-[16px] font-bold text-black"
              style={{ fontFamily: 'Dancing Script, cursive' }}>
              Travel TADA
            </span>
          </div>
          <div className="pl-10 hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (
                (link.label === 'Dành cho bạn' || link.label === 'Tour Yêu Thích') &&
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

        {/* Right Section: Search, Notifications, User Profile (Desktop), Search & Hamburger (Mobile) */}
        <div className=" flex items-center space-x-1">
          {/* Mobile Back Button and Search Input */}
          <div className="flex items-center md:hidden w-full justify-between ">
            <Button
              onClick={() => navigate('/')}
              className=" bg-blue-500 hover:bg-blue-600 text-white font-medium rounded px-2 sm:px-2"
            >
              <ArrowLeftOutlined />
            </Button>
            <div className="relative flex items-center">
              <motion.div
                className="flex items-center w-60 rounded-[8px] h-[32px] text-sm py-1 pl-3 ml-3 pr-8 bg-white border border-gray-300"
                whileHover={{ scale: 1.02 }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Tìm kiếm..."
                  className="w-full bg-transparent text-gray-500 text-[11px] focus:outline-none"
                />
                <SearchOutlined className="absolute right-4 text-gray-500 text-[14px]" />
              </motion.div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="relative flex items-center">
            <motion.div
              className="hidden md:flex items-center w-40 md:w-60 rounded-[18px] h-[35px] text-sm py-1 pl-4 pr-10 bg-white border border-gray-300"
              whileHover={{ scale: 1.02 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Tìm kiếm tour..."
                className="w-full bg-transparent text-gray-500 text-[12px] focus:outline-none"
              />
              <SearchOutlined className="absolute right-3 text-gray-500" />
            </motion.div>
          </div>

          {/* Desktop Notifications */}
          {isAuthenticated && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="hidden md:block relative cursor-pointer text-gray-700 hover:text-cyan-600 transition-all duration-200 text-[16px] p-1 rounded-full hover:bg-cyan-50"
              onClick={() => navigate('/notifications')}>
              <BellOutlined />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[12px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </motion.div>
          )}

          {/* Desktop User Profile Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
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

          {/* Mobile Hamburger Menu Icon (Rightmost) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <CloseOutlined className="text-[20px] text-gray-700" />
              ) : (
                <MenuOutlined className="text-[20px] text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-[#e5e1d3] shadow-lg border-t border-gray-200 p-4 absolute top-[60px] left-0 right-0 z-50">
          <div className="flex flex-col space-y-3">
            {/* Navigation Links */}
            {mobileNavLinks.map((link) => (
              <span
                key={link.label}
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                  setAccountOpen(false);
                }}
                className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-2">
                {link.label}
              </span>
            ))}
            {/* Notifications Link */}
            {isAuthenticated && (
              <span
                onClick={() => {
                  navigate('/notifications');
                  setMenuOpen(false);
                  setAccountOpen(false);
                }}
                className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-2">
                Thông báo {unreadCount > 0 ? `(${unreadCount})` : ''}
              </span>
            )}
            {/* Account Section */}
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="text-gray-700 text-base font-medium hover:text-cyan-600 transition duration-150 cursor-pointer py-2 flex items-center justify-between w-full">
                Tài khoản
                {accountOpen ? <UpOutlined className="text-sm" /> : <DownOutlined className="text-sm" />}
              </button>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col pl-4 space-y-2 mt-2">
                  {isAuthenticated && user ? (
                    <>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/profile');
                          setMenuOpen(false);
                          setAccountOpen(false);
                        }}>
                        Thông tin cá nhân
                      </button>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/orders');
                          setMenuOpen(false);
                          setAccountOpen(false);
                        }}>
                        Đơn mua
                      </button>
                      <button
                        className="w-full text-red-600 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                          setAccountOpen(false);
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
                          setMenuOpen(false);
                          setAccountOpen(false);
                        }}>
                        Đăng nhập
                      </button>
                      <button
                        className="w-full text-gray-700 py-1.5 px-2 text-sm font-medium hover:bg-cyan-50 rounded transition text-left"
                        onClick={() => {
                          navigate('/register');
                          setMenuOpen(false);
                          setAccountOpen(false);
                        }}>
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
    </nav>
  );
};

export default Header;