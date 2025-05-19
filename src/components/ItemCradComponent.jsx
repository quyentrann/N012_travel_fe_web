import React, { useState, useEffect } from 'react';
import axios from 'axios';
import card from '../images/card.jpg';
import { StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { motion } from 'framer-motion';

export default function ItemCradComponent({
  tour,
  isFavorite: initialFavorite = false,
  onFavoriteChange,
}) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const token = localStorage.getItem('TOKEN');

  console.log('Tour object:', JSON.stringify(tour, null, 2));
  console.log('Tour.tour:', tour?.tour);
  console.log('Reviews:', tour?.tour?.reviews);
  console.log('Bookings:', JSON.stringify(tour?.tour?.bookings, null, 2));

  useEffect(() => {
    if (token) {
      setIsFavorite(initialFavorite);
    } else {
      setIsFavorite(false);
    }
  }, [initialFavorite, token]);

  const handleTourClick = async () => {
    if (!token) {
      navigate(`/tour-detail?id=${tour.tourId}`);
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/search-history/click/${tour.tourId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Tracked click for tour ${tour.tourId}`);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
        return;
      }
      console.error('Lỗi khi ghi nhận click tour:', error);
    }

    navigate(`/tour-detail?id=${tour.tourId}`);
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!token) {
      message.error('Vui lòng đăng nhập để thêm/xóa tour yêu thích!');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete('http://localhost:8080/api/tour-favourites', {
          data: { tourId: tour.tourId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
        if (onFavoriteChange) onFavoriteChange(tour.tourId, false);
        message.success('Đã xóa tour khỏi yêu thích!');
      } else {
        await axios.post(
          'http://localhost:8080/api/tour-favourites',
          { tourId: tour.tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        if (onFavoriteChange) onFavoriteChange(tour.tourId, true);
        message.success('Đã thêm tour vào yêu thích!');
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (status === 409) {
        console.warn('Tour đã trong danh sách yêu thích.');
        setIsFavorite(true);
      } else {
        console.error('Lỗi cập nhật yêu thích:', error);
        message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
      }
    }
  };

  const averageRating = (() => {
    const reviews = tour?.tour?.reviews;
    if (!Array.isArray(reviews) || reviews.length === 0) return 'Chưa có';
    const totalRating = reviews.reduce(
      (sum, review) => sum + (Number(review?.rating) || 0),
      0
    );
    return (totalRating / reviews.length).toFixed(1);
  })();

  const totalBookings = (tour?.tour?.bookings || []).filter(
    (booking) => booking?.status === 'COMPLETED'
  ).length;

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[220px] h-[270px] mx-auto cursor-pointer 
      hover:shadow-xl transition-all duration-200 border border-gray-100 flex flex-col my-5"
      onClick={handleTourClick}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.98 }}>
      <motion.div
        animate={{ scale: isFavorite && token ? 1.2 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 z-10"
        onClick={handleToggleFavorite}>
        {token && isFavorite ? (
          <HeartFilled
            className="text-red-500 text-base"
            style={{ color: '#EB3232' }}
          />
        ) : (
          <HeartOutlined className="text-gray-500 text-base hover:text-red-400" />
        )}
      </motion.div>

      <div className="relative flex-shrink-0">
        <img
          src={tour?.tour?.imageURL || card}
          alt={tour?.tour?.name || 'Travel'}
          className="w-full h-32 object-cover rounded-t-xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="p-3 flex flex-col justify-between flex-1 gap-1">
        <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-tight">
          {tour?.tour?.name || 'Tour Name'}
        </h3>

        <p className="text-red-600 font-bold text-[13px]">
          {tour?.tour?.price
            ? `${tour.tour.price.toLocaleString()} đ/người`
            : 'Liên hệ'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <StarFilled
              className="text-yellow-500"
              style={{ color: '#D4D10B' }}
            />
            <span>{averageRating}</span>
          </div>
          <span>
            {totalBookings ? `${totalBookings} lượt đặt` : 'Chưa có lượt đặt'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
