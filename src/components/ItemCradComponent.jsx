import React, { useState, useEffect } from 'react';
import axios from 'axios';
import card from '../images/card.jpg';
import { StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { motion } from 'framer-motion';

export default function ItemCradComponent({ tour, isFavorite: initialFavorite = false, onFavoriteChange }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const token = localStorage.getItem('TOKEN');

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);
  
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!token) {
      message.error('Vui lòng đăng nhập để thêm/xóa tour yêu thích!');
      navigate('/login');
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
      } else {
        await axios.post(
          'http://localhost:8080/api/tour-favourites',
          { tourId: tour.tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        if (onFavoriteChange) onFavoriteChange(tour.tourId, true);
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

  const averageRating = tour.reviews?.length
    ? (tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length).toFixed(1)
    : 'Chưa có';

  const totalSeatsBooked = (tour.bookings || []).reduce(
    (sum, booking) => sum + (booking?.numberPeople || 0),
    0
  );

  return (
    <div
      className="bg-[#fffcfa] h-67 w-52 rounded-[8px] cursor-pointer hover:scale-101 p-4 flex flex-col relative"
      onClick={() => navigate(`/tour-detail?id=${tour.tourId}`)}
    >
      <motion.div
        animate={{ scale: isFavorite ? 1.2 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-1 right-1.5 cursor-pointer text-[20px]"
        onClick={handleToggleFavorite}
      >
        {isFavorite ? (
          <HeartFilled style={{ color: '#FF6666', fontSize: '20px' }} />
        ) : (
          <HeartOutlined style={{ color: '#CC6666', fontSize: '20px' }} />
        )}
      </motion.div>

      <div className="flex justify-center flex-col items-center">
        <img
          src={tour.imageURL || card}
          alt={tour.name || 'Travel'}
          className="h-33 w-49 rounded-[3px] m-0.5"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-between pt-1 h-1/2">
        <div className="pt-2 px-1">
          <p className="text-[14px] font-medium">{tour.name}</p>
        </div>

        <div className="flex pt-2 px-1 text-[14px] font-bold text-red-600">
          <p>{tour.price ? `${tour.price.toLocaleString()} đ/người` : 'Giá không có'}</p>
        </div>

        <div className="flex items-center justify-between px-1 pt-2 text-[12px] text-gray-600">
          <div className="flex items-center text-yellow-500">
            <StarFilled className="text-gray-300" />
            <span className="text-gray-600 ml-1">{averageRating}</span>
          </div>
          <p>{totalSeatsBooked ? `${totalSeatsBooked} lượt đặt` : 'Chưa có lượt đặt'}</p>
        </div>
      </div>
    </div>
  );
}