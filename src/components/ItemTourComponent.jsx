import React, { useState, useEffect } from 'react';
import card from '../images/card.jpg';
import {
  EnvironmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoriteTours } from '../redux/tourSlice';

export default function ItemTourComponent({
  tour,
  isFavorite: initialFavorite = false,
  onFavoriteChange,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const { isAuthenticated } = useSelector((state) => state.user);
  const token = localStorage.getItem('TOKEN');

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Không xác định';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${days} ngày ${days - 1} đêm`;
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated || !token) {
      message.error('Vui lòng đăng nhập để thêm/xóa tour yêu thích!');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(
          `http://localhost:8080/api/tour-favourites/${tour.tourId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavorite(false);
        message.success('Đã xóa tour khỏi yêu thích!');
        if (onFavoriteChange) onFavoriteChange(tour.tourId, false);
      } else {
        await axios.post(
          'http://localhost:8080/api/tour-favourites',
          { tourId: tour.tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        message.success('Đã thêm tour vào yêu thích!');
        if (onFavoriteChange) onFavoriteChange(tour.tourId, true);
      }
      dispatch(fetchFavoriteTours());
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        message.error('Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.');
        localStorage.removeItem('TOKEN');
        navigate('/login');
      } else if (status === 409) {
        console.warn('Tour đã có trong danh sách yêu thích.');
        setIsFavorite(true);
        if (onFavoriteChange) onFavoriteChange(tour.tourId, true);
      } else {
        console.error('Lỗi cập nhật yêu thích:', error);
        message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
      }
    }
  };

  const averageRating = tour.reviews?.length
    ? (
        tour.reviews.reduce((sum, r) => sum + r.rating, 0) / tour.reviews.length
      ).toFixed(1)
    : 'Chưa có';

  const totalSeatsBooked = (tour.bookings || []).reduce(
    (sum, b) => sum + (b?.numberPeople || 0),
    0
  );

  return (
    <div
      className="bg-white shadow-md rounded-lg cursor-pointer border border-gray-200 hover:shadow-lg transition duration-300 overflow-hidden w-75 h-90 my-3 "
      role="button"
      tabIndex={0}
      onClick={() => navigate('/tour-detail', { state: { id: tour.tourId } })}
    >
      <div className="relative group">
        <img
          src={tour.imageURL || card}
          alt={tour.name || 'Travel'}
          className="h-36 w-full object-cover rounded-t-lg transition duration-300"
        />
        <span className="absolute top-1.5 left-1.5 bg-black/50 text-white px-2 py-0.5 text-[10px] rounded-md">
          Từ Hà Nội
        </span>
        <div
          className="absolute top-1 right-1 cursor-pointer text-[20px]"
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <HeartFilled style={{ color: '#CC0000', fontSize: '20px' }} />
          ) : (
            <HeartOutlined style={{ color: '#CCCCCC', fontSize: '20px' }} />
          )}
        </div>
      </div>

      <div className="pt-1.5 px-4 space-y-1.5">
        <h3 className="text-[17px] py-1 font-bold text-gray-900 leading-5">
          {tour.name || 'Tên Tour'}
        </h3>
        <p className="text-[14px] text-gray-600 line-clamp-1">
          Mô tả: {tour.description || 'Mô tả tour'}
        </p>
        <p className="text-[14px] text-gray-600 line-clamp-2 pb-1">
        Loại hình tour: {tour.tourCategory?.categoryName || 'Chưa có loại'}
        </p>
        <div className="flex justify-between text-[12px] text-gray-500">
          <span className="flex items-center gap-1">
            <ClockCircleOutlined />
            {getDuration(
              tour.tourDetails?.[0]?.startDate,
              tour.tourDetails?.[0]?.endDate
            )}
          </span>
          <span className="flex items-center gap-1">
            <CalendarOutlined />
            {tour.tourDetails?.[0]?.startDate
              ? new Date(tour.tourDetails[0].startDate).toLocaleDateString('vi-VN')
              : 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            <StarFilled />
            <span className="text-gray-600">{averageRating}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[13px] pb-1 text-gray-700">
          <UserOutlined className="text-gray-500 text-[10px]" />
          <span>
            {tour.availableSlot ? `${tour.availableSlot} chỗ còn` : 'Hết chỗ'} |{' '}
            {totalSeatsBooked ? `${totalSeatsBooked} lượt đặt` : 'Chưa có lượt đặt'}
          </span>
        </div>
        <div className="flex justify-between items-center border-t pt-2 mt-1 text-xs">
          <div className="flex items-center space-x-1 text-gray-700">
            <EnvironmentOutlined className="text-[11px]" />
            <span>{tour.location || 'Đà Nẵng'}</span>
          </div>
          <p className="text-base font-bold text-red-600">
            {tour.price ? `${tour.price.toLocaleString()} đ` : 'Giá không có'}
          </p>
        </div>
      </div>
    </div>
  );
}