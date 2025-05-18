import React, { useState } from 'react';
import { Card, Tag, message } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import card from '../images/card.jpg';
import { fetchFavoriteTours } from '../redux/tourSlice';
import { motion } from 'framer-motion';

function ItemTourBestForYou({ tour, isFavorite, onFavoriteChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const token = localStorage.getItem('TOKEN');
  const [isLoading, setIsLoading] = useState(false);

  // Normalize tour data to handle both wrapped and unwrapped structures
  const normalizedTour = tour.tour || tour;
  console.log('Rendering tour:', { tour, normalizedTour }); // Debug log

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated || !token) {
      message.error('Vui lòng đăng nhập để thêm/xóa tour yêu thích!');
      navigate('/login');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await axios.delete('http://18.138.107.49:8080/api/tour-favourites', {
          data: { tourId: normalizedTour.tourId },
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Đã xóa tour khỏi yêu thích!');
        onFavoriteChange(normalizedTour.tourId, false);
      } else {
        await axios.post(
          'http://18.138.107.49:8080/api/tour-favourites',
          { tourId: normalizedTour.tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success('Đã thêm tour vào yêu thích!');
        onFavoriteChange(normalizedTour.tourId, true);
      }
      dispatch(fetchFavoriteTours());
    } catch (error) {
      console.error('Lỗi cập nhật yêu thích:', error);
      const status = error?.response?.status;
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra!';
      if (status === 401 || status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (status === 409) {
        console.warn('Tour đã trong danh sách yêu thích.');
        onFavoriteChange(normalizedTour.tourId, true);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTourClick = async () => {
    if (!isAuthenticated || !token) {
      navigate(`/tour-detail?id=${normalizedTour.tourId}`);
      return;
    }

    try {
      await axios.post(
        `http://18.138.107.49:8080/api/search-history/click/${normalizedTour.tourId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Tracked click for tour ${normalizedTour.tourId}`);
    } catch (error) {
      console.error('Lỗi khi ghi nhận click tour:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
        return;
      }
    }

    navigate(`/tour-detail?id=${normalizedTour.tourId}`);
  };

  return (
    <motion.div
      className="w-full h-[230px] max-w-[265px] sm:h-[345px] flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 my-2 sm:my-5 sm:mx-[15px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}>
      <Card
        cover={
          <div className="relative">
            <img
              src={normalizedTour.imageURL || card}
              alt={normalizedTour.name || 'Travel'}
              className="w-full h-20 sm:h-40 object-cover rounded-t-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <motion.div
              animate={{ scale: isFavorite && isAuthenticated ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-3 right-3 cursor-pointer"
              onClick={handleToggleFavorite}>
              {isAuthenticated && isFavorite ? (
                <HeartFilled style={{ color: '#FF4D4F', fontSize: '24px' }} />
              ) : (
                <HeartOutlined style={{ color: '#CCCCCC', fontSize: '24px' }} />
              )}
            </motion.div>
          </div>
        }
        className="rounded-2xl shadow-none flex flex-col h-full border-none"
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '10px',
        }}
        onClick={handleTourClick}>
        <div className="flex flex-col justify-between h-full gap-2 px-1 ">
          <div className="overflow-hidden">
            <span className="text-[10px] sm:text-[15px] font-semibold text-gray-700 line-clamp-2 leading-tight">
              {normalizedTour.name || 'Tên tour không có'}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-red-600 font-bold text-[11px] sm:text-sm">
              {normalizedTour.price
                ? `${normalizedTour.price.toLocaleString()} đ/người`
                : 'Liên hệ'}
            </p>
          </div>
          <div className="overflow-hidden">
            <p className="text-gray-600 text-[9px] sm:text-xs line-clamp-2">
              {normalizedTour.description || 'Không có mô tả'}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 text-gray-700">
              <EnvironmentOutlined className="text-[9px] sm:text-[11px]" />
              <span className="text-[8px] sm:text-[12px] w-10 sm:w-auto">
                {normalizedTour.location || 'Đà Nẵng'}
              </span>
            </div>
            <p className="text-gray-700 text-[10px] sm:text-xs truncate">
              Còn {normalizedTour.availableSlot || 0} chỗ
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default ItemTourBestForYou;
