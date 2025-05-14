import React, { useState, useEffect } from 'react';
import { Card, Tag, message } from 'antd';
import {
  StarFilled,
  HeartOutlined,
  HeartFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import card from '../images/card.jpg';
import { fetchFavoriteTours } from '../redux/tourSlice';

function ItemBagTourBestForYou({ tour }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const token = localStorage.getItem('TOKEN');
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra trạng thái favorite khi component mount
  useEffect(() => {
    const checkFavorite = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/tour-favourites/${tour.tourId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsFavorite(!!response.data); // Cập nhật trạng thái favorite
        } catch (error) {
          console.error('Lỗi kiểm tra favorite:', error);
        }
      }
    };
    checkFavorite();
  }, [tour.tourId, isAuthenticated, token]);

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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(false);
        message.success('Đã xóa tour khỏi yêu thích!');
      } else {
        await axios.post(
          'http://localhost:8080/api/tour-favourites',
          { tourId: tour.tourId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        message.success('Đã thêm tour vào yêu thích!');
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
      } else {
        console.error('Lỗi cập nhật yêu thích:', error);
        message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
      }
    }
  };

  const handleTourClick = async () => {
    if (!isAuthenticated || !token) {
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

  const allBookings = tour.reviews?.map((review) => review.booking) || [];
  const totalOrders = allBookings.reduce(
    (sum, booking) => sum + (booking?.numberPeople || 0),
    0
  );

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Không xác định';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${days} ngày ${days - 1} đêm`;
  };

  const averageRating = tour.reviews?.length
    ? (
        tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
        tour.reviews.length
      ).toFixed(1)
    : 'Chưa có';

  return (
    <div className="w-[1230px] flex justify-center items-center">
      <Card
        key={tour.id}
        hoverable
        className="w-[1000px] flex flex-row rounded-lg shadow-md p-4 border border-gray-200"
        onClick={handleTourClick} // Thay navigate trực tiếp bằng handleTourClick
      >
        {/* Nút yêu thích */}
        <div
          className="absolute top-2 right-2 cursor-pointer text-[20px]"
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <HeartFilled className="text-red-500" />
          ) : (
            <HeartOutlined className="text-gray-400 hover:text-red-500" />
          )}
        </div>

        <div className="flex">
          {/* Ảnh bên trái */}
          <img
            src={tour.imageURL || card}
            alt={tour.name || 'Travel'}
            className="w-[270px] h-[160px] rounded-lg object-cover"
          />

          {/* Nội dung bên phải */}
          <div className="flex flex-col justify-between ml-6">
            <span className="text-[20px] font-semibold">{tour.name}</span>

            <p className="text-gray-600 text-[16px] mt-1 line-clamp-2">
              {tour.description}
            </p>

            {/* Thông tin thêm */}
            <div className="flex flex-wrap items-center text-gray-700 text-[14px] mt-2 gap-4">
              <div className="flex items-center space-x-2">
                <CalendarOutlined className="text-gray-500 text-md" />
                <span>
                  {tour.tourDetails?.[0]?.startDate
                    ? new Date(tour.tourDetails[0]?.startDate).toLocaleDateString('vi-VN')
                    : 'Chưa có'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-gray-500 text-md" />
                <span>
                  {getDuration(
                    tour.tourDetails?.[0]?.startDate,
                    tour.tourDetails?.[0]?.endDate
                  )}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <UserOutlined className="text-gray-500 text-md" />
                <span>
                  {tour.availableSlot
                    ? `Còn ${tour.availableSlot} chỗ`
                    : 'Không xác định'}
                </span>
              </div>
            </div>

            {/* Địa điểm + số lượt đặt */}
            <div className="mt-4 text-md flex justify-between">
              <div>
                <Tag icon={<EnvironmentOutlined />} color="black">
                  <span className="text-md">{tour.location}</span>
                </Tag>
                <div className="w-30 flex justify-between pt-1">
                  <div className="flex items-center text-yellow-500">
                    <StarFilled className="text-gray-300" />
                    <span className="text-gray-600 ml-1">{averageRating}</span>
                  </div>
                  <p className="text-gray-700">{totalOrders} lượt đặt</p>
                </div>
              </div>
              <p className="text-[18px] font-bold text-red-600">
                {tour.price ? `${tour.price.toLocaleString()}đ` : 'Giá không có'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ItemBagTourBestForYou;