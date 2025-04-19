import React, { useState } from 'react';
import { Button, Card, Tag } from 'antd';
import {
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import card from '../images/card.jpg';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ItemTourBestForYou({ tour }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const averageRating = tour.reviews?.length
    ? (
        tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
        tour.reviews.length
      ).toFixed(1)
    : 'Chưa có';

  const allBookings = tour.reviews?.map((review) => review.booking) || [];
  const totalSeatsBooked = allBookings.reduce(
    (sum, booking) => sum + (booking?.numberPeople || 0),
    0
  );
  const totalOrders = allBookings.length;

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleTourClick = async () => {
    // Gửi sự kiện click tới backend nếu đã đăng nhập
    if (isAuthenticated) {
      try {
        await axios.post(
          `http://localhost:8080/api/search-history/click/${tour.tourId}`, // Cập nhật URL
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
              'Content-Type': 'application/json',
            }, 
          }
        );
        console.log('✅ Đã gửi sự kiện click tour:', tour.tourId);
      } catch (error) {
        console.error('❌ Lỗi khi gửi sự kiện click tour:', error);
      }
    }

    // Điều hướng tới trang chi tiết tour
    navigate('/tour-detail', { state: { id: tour.tourId } });
  };

  return (
    <div className="w-65 h-83 flex flex-col mx-5 bg-[#fffcfa] hover:scale-101">
      <Card
        cover={
          <div className="relative">
            <img
              src={tour.imageURL || card}
              alt={tour.name || 'Travel'}
              className="w-full h-[150px] object-cover rounded-t-lg"
            />
            <div
              className="absolute top-2 right-2 cursor-pointer text-[20px]"
              onClick={handleToggleFavorite}>
              {isFavorite ? (
                <HeartFilled style={{ color: '#CC0000', fontSize: '24px' }} />
              ) : (
                <HeartOutlined style={{ color: '#CCCCCC', fontSize: '24px' }} />
              )}
            </div>
          </div>
        }
        className="rounded-lg shadow-md flex flex-col h-full bg-[#fefefe] border border-gray-200"
        bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        onClick={handleTourClick}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="text-[14px] font-semibold">{tour.name}</span>
          </div>
          <div>
            <p className="text-red-700 font-bold text-[13px]">
              {tour.price
                ? `${tour.price.toLocaleString()}đ`
                : 'Giá không có'}
              /Người
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-[12px] mt-2 line-clamp-2">
              {tour.description}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <Tag icon={<EnvironmentOutlined />} color="black">
              <span className="text-[10px]">{tour.location}</span>
            </Tag>
            <p className="text-gray-700 text-[13px]">
              Còn {tour.availableSlot} chỗ
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ItemTourBestForYou;